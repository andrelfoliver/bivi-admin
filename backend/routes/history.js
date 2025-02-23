import express from 'express';
import mongoose from 'mongoose';
import { Parser } from 'json2csv';
import { openai } from '../config/openai.js';
import Message, { messageSchema } from '../models/Message.js'; // Importa o modelo e o schema

// Cria uma conexão específica para o tenant "empresa_bivisualizer"
const tenantUri = process.env.MONGO_URI_TEMPLATE.replace('{DB_NAME}', 'empresa_bivisualizer');
const tenantConnection = mongoose.createConnection(tenantUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Cria o modelo de mensagem para o tenant usando o schema importado
const TenantMessage = tenantConnection.model('Message', messageSchema);

const router = express.Router();

// Configurações de paginação
const MENSAGENS_POR_PAGINA = 10;
const MAX_PAGINAS = 10;

// Função para gerar resumo da conversa usando IA
async function getSummaryWithAI(messages) {
    if (!messages || messages.length === 0) return "Resumo indisponível";

    const conversationText = messages.map(msg => `Usuário: ${msg.name || "Desconhecido"}\nMensagem: ${msg.message}`).join("\n");
    if (!conversationText) return "Resumo indisponível";

    const prompt = `Resuma a seguinte conversa em no máximo duas frases curtas. Insira quebras de linha a cada 60 caracteres para melhor leitura.\n\n${conversationText}`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 80,
            temperature: 0.7,
        });
        let summary = response.choices[0].message.content.trim() || "Resumo indisponível";
        summary = summary.replace(/(.{60})/g, "$1\n");
        return summary;
    } catch (error) {
        console.error("Erro ao gerar resumo com IA:", error);
        return "Resumo indisponível";
    }
}

// Função para identificar o motivo do contato usando IA
async function getContactReasonWithAI(messages) {
    if (!messages || messages.length === 0) return "Outro";

    const conversationText = messages.map(msg => `Usuário: ${msg.name || "Desconhecido"}\nMensagem: ${msg.message}\n`).join("\n");

    const prompt = `Com base na seguinte conversa, qual foi o principal motivo para o contato? Responda com uma das opções: "O usuário buscou suporte técnico", "O usuário solicitou um orçamento", "O usuário tinha dúvidas sobre funcionalidades", ou "Outro motivo não especificado".\n\n${conversationText}`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 10,
            temperature: 0.5,
        });
        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error("Erro ao identificar motivo do contato:", error);
        return "Outro";
    }
}

// Rota para buscar mensagens paginadas e filtradas
router.get('/', async (req, res) => {
    try {
        const pagina = parseInt(req.query.page) || 1;
        const nomeFiltro = req.query.name || "";
        const dataInicio = req.query.startDate ? new Date(req.query.startDate) : null;
        const dataFim = req.query.endDate ? new Date(req.query.endDate) : null;
        const userType = req.query.userType || "";

        const query = {};
        if (userType) {
            if (userType === "Usuário") {
                query.name = { $ne: "Bivi" };
            } else if (userType === "Bivi") {
                query.name = "Bivi";
            }
        }
        if (nomeFiltro) {
            query.name = { $regex: new RegExp(nomeFiltro, 'i') };
        }
        if (dataInicio || dataFim) {
            query.timestamp = {};
            if (dataInicio) {
                query.timestamp.$gte = dataInicio;
            }
            if (dataFim) {
                const dataFimAjustada = new Date(dataFim);
                dataFimAjustada.setDate(dataFimAjustada.getDate() + 1);
                query.timestamp.$lt = dataFimAjustada;
            }
        }

        const totalMensagens = await TenantMessage.countDocuments(query);
        const totalPaginas = Math.min(Math.ceil(totalMensagens / MENSAGENS_POR_PAGINA), MAX_PAGINAS);
        const paginaCorrigida = Math.min(pagina, totalPaginas || 1);

        const mensagensPaginadas = await TenantMessage.find(query)
            .sort({ timestamp: -1 })
            .skip((paginaCorrigida - 1) * MENSAGENS_POR_PAGINA)
            .limit(MENSAGENS_POR_PAGINA);

        res.status(200).json({
            mensagens: mensagensPaginadas,
            totalPages: totalPaginas,
            currentPage: paginaCorrigida
        });
    } catch (error) {
        console.error("Erro ao buscar histórico:", error.message);
        res.status(500).send("Erro ao buscar histórico de mensagens");
    }
});

// Rota para exportação de CSV (excluindo usuários cujo nome seja "Bivi")
router.get('/export-csv', async (req, res) => {
    try {
        let mensagens = await TenantMessage.find({ name: { $ne: "Bivi" } }).sort({ timestamp: -1 });

        const userConversations = {};
        mensagens.forEach(msg => {
            const userId = msg.sender || msg.email || "Desconhecido";
            if (!userConversations[userId]) {
                userConversations[userId] = {
                    name: msg.name || msg.sender,
                    phone: msg.sender || "Não informado",
                    email: msg.email || "Não informado",
                    messages: [],
                    timestamps: []
                };
            }
            userConversations[userId].messages.push(msg);
            userConversations[userId].timestamps.push(new Date(msg.timestamp));
        });

        const csvData = [];
        let recordNumber = 1;

        for (const userId in userConversations) {
            const user = userConversations[userId];
            if (user.name === "Desconhecido") continue;

            user.timestamps.sort((a, b) => a - b);
            const fusoHorario = "America/Sao_Paulo";
            const startDate = user.timestamps[0].toLocaleString("pt-BR", { timeZone: fusoHorario });
            const endDate = user.timestamps[user.timestamps.length - 1].toLocaleString("pt-BR", { timeZone: fusoHorario });
            const contactReason = await getContactReasonWithAI(user.messages);
            let summary = await getSummaryWithAI(user.messages);
            summary = `"${summary.replace(/"/g, '""')}"`;

            csvData.push({
                "Registro Nº": recordNumber++,
                "Data Inicial": startDate,
                "Data Final": endDate,
                "Nome": user.name,
                "Fone": user.phone,
                "Motivo do Contato": contactReason,
                "Resumo da Conversa": summary,
                "E-mail": user.email
            });
        }

        const json2csvParser = new Parser({ delimiter: ";" });
        const csv = json2csvParser.parse(csvData);

        res.header('Content-Type', 'text/csv');
        res.attachment('historico_mensagens.csv');
        res.send(csv);
    } catch (error) {
        console.error("Erro ao exportar CSV:", error.message);
        res.status(500).send("Erro ao exportar CSV");
    }
});

export default router;
