import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import moment from 'moment-timezone';
import Message from '../models/Message.js';
import { enviarEmailCliente, enviarEmailFinalizacao, enviarEmailNovoContato } from '../controllers/emailcontroller.jsm';

dotenv.config();

const router = express.Router();

// Objeto para manter o contexto de cada usuário (histórico, e‑mail, flags, etc.)
const userContexts = {};

// Timeout para expirar o contexto (30 minutos de inatividade)
const contextTimeout = 30 * 60 * 1000;

// Conjunto para evitar processamento duplicado (usando messageId)
const processedMessages = new Set();

// Link para agendamento (atualizado)
const calendlyLink = "https://calendly.com/bivisualizerr/apresentacao-da-bivisualizer";
// Link para site oficial
const siteLink = "https://bivisualizer.com";

// Limpeza periódica dos contextos inativos (a cada 1 minuto)
setInterval(() => {
    const now = Date.now();
    Object.keys(userContexts).forEach(userId => {
        if (now - userContexts[userId].lastInteraction > contextTimeout) {
            console.log(`🗑️ Contexto do usuário ${userId} limpo por inatividade.`);
            delete userContexts[userId];
        }
    });
}, 60 * 1000);

/**
 * Envia mensagem via API do WhatsApp usando a versão v16.0 (como anteriormente funcional)
 */
async function sendWhatsAppMessage(to, message) {
    if (!message || typeof message !== 'string') {
        console.error('❌ Erro: A mensagem está vazia ou não é uma string.');
        return null;
    }
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v16.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to,
                type: 'text',
                text: { body: message }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('✅ Mensagem enviada:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Erro ao enviar mensagem:', error.response?.data || error.message);
        return null;
    }
}

/**
 * Função para dividir a resposta em partes menores, se necessário.
 * Aqui definimos um limite máximo de caracteres por mensagem.
 */
function splitResponse(message) {
    const maxLen = 200; // ajuste conforme necessário
    if (message.length <= maxLen) return [message];

    const target = Math.floor(message.length / 2);
    let breakIndex = -1;

    // Procura retroativamente por um ponto final, exclamação ou interrogação seguido de espaço ou quebra de linha
    for (let i = target; i >= 0; i--) {
        if (/[.!?](\s|\n)/.test(message.substring(i, i + 2))) {
            breakIndex = i + 1; // quebra logo após o sinal de pontuação
            break;
        }
    }

    // Se não encontrou retroativamente, procura a partir do meio para frente
    if (breakIndex === -1) {
        for (let i = target; i < message.length - 1; i++) {
            if (/[.!?](\s|\n)/.test(message.substring(i, i + 2))) {
                breakIndex = i + 1;
                break;
            }
        }
    }

    // Se mesmo assim não encontrar, utiliza o espaço mais próximo para não cortar uma palavra
    if (breakIndex === -1) {
        breakIndex = message.lastIndexOf(" ", target);
        if (breakIndex === -1) breakIndex = target;
    }

    const part1 = message.substring(0, breakIndex).trim();
    const part2 = message.substring(breakIndex).trim();
    return [part1, part2];
}

/**
 * Envia a mensagem dividida em partes menores, se necessário.
 */
async function sendSplitMessage(to, messageContent) {
    const parts = splitResponse(messageContent);
    for (const part of parts) {
        await sendWhatsAppMessage(to, part);
        await saveMessage('Bivi', part, 'Bivi', null, userContexts[to]?.email, to);
        // Aguarda 500ms entre as partes para evitar sobrecarga
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}

function getGreeting() {
    const hora = moment().tz('America/Sao_Paulo').hour();
    if (hora >= 5 && hora < 12) return "Bom dia";
    if (hora >= 12 && hora < 18) return "Boa tarde";
    return "Boa noite";
}

function getFirstName(fullName) {
    return fullName ? fullName.split(" ")[0] : "Cliente";
}

const respostasAgradecimento = [
    "De nada, $! 😊 Se precisar de algo no futuro, estarei por aqui. Tenha um ótimo dia! 🚀",
    "Por nada, $! Fico feliz em ajudar. Estou à disposição para o que precisar! 😉",
    "Imagina, $! Qualquer coisa, é só chamar. Boa sorte! 🌟"
];

function getRespostaAgradecimento(primeiroNome) {
    const i = Math.floor(Math.random() * respostasAgradecimento.length);
    return respostasAgradecimento[i].replace("$", primeiroNome);
}

/**
 * Instruções para a OpenAI (role "system")
 * [Mantenha aqui as instruções originais conforme seu código]
 */
const instructions = `
A BiVisualizer é uma startup especializada em transformar dados complexos em decisões simples e inteligentes. Sua missão é ajudar os clientes com dúvidas relacionadas a dados, decisões estratégicas e serviços da BiVisualizer.

### Como responder corretamente:
- Se o usuário pedir mais detalhes, forneça informações adicionais sem repetir o que já foi dito.
- Se o usuário digitar "sim" após um esclarecimento, continue explicando sem reiniciar a conversa.
- Se houver erro de digitação, tente compreender o contexto antes de dizer que não entendeu.
- Se o usuário disser "obrigado" ou "valeu", finalize educadamente sem reiniciar.
- **Finalize todas as respostas com uma afirmação completa e conclusiva, sem utilizar perguntas genéricas.**  
  - **Nunca termine a resposta com interrogações como “Como posso te ajudar?”, “Como posso te auxiliar?” ou qualquer variação que transfira a decisão para o usuário.**
  - Se for necessário solicitar dados específicos (por exemplo, e‑mail ou agendamento), faça essa solicitação de forma direta e contextualizada, mas sempre conclua a resposta com uma afirmação.
  - Se a resposta já estiver completa e esclarecedora, finalize-a de forma assertiva, sem incluir qualquer pergunta adicional.

IMPORTANTE:
- Na primeira resposta, envie a saudação e a introdução em duas mensagens separadas.
- Depois, não repita a saudação ou o nome do cliente.
- Use linguagem natural, emojis moderadamente e mantenha as respostas breves.
- Utilize o nome do cliente em momentos estratégicos (solicitar e‑mail, finalizar, etc.).
- Quando apresentar serviços, utilize uma lista.

### Regras:
1. Não mencione o e‑mail se o cliente não demonstrar interesse.
2. Se o cliente enviar apenas "?", não responda.
3. Se solicitar valores, encaminhe: ${calendlyLink}.
4. Se quiser conhecer os trabalhos anteriores, encaminhe para agendar uma reunião com o Comercial: ${calendlyLink}.
5. Se solicitar avaliação ou depoimento dos clientes que ja fizemos trabalhos, encaminhe: ${siteLink}.
6. Se demonstrar interesse em avançar para contratar ou implementar algumas das soluções, encaminhe para agendar uma reunião: ${calendlyLink}.

### Atendimento:
- Bivi atende 24h. Se o cliente quiser agendar reunião com atendimento humano, encaminhe: ${calendlyLink}.

### Exemplos:
1. "O que a Bivisualizer faz?"  
   "A BiVisualizer transforma dados complexos em decisões simples e inteligentes. 📊"
2. "Como posso organizar meus dados?"  
   "Podemos criar painéis no Power BI para consolidar seus dados. Quer saber mais?"
3. "Vocês trabalham com IA?"  
   "Sim! Utilizamos IA para automatizar análises."
4. "Quais serviços vocês oferecem?"  
   "Oferecemos:  
    - *Dashboards Interativos* – Visualize dados de forma personalizada para decisões rápidas.
    - *Atendentes Virtuais Inteligentes* – Automatize o suporte e melhore a experiência do cliente.
    - *Soluções integradas* – Imagine obter informações da evolução da sua empresa pelo WhatsApp e visualizar em um dashboard."
5. "Como funciona a solução integrada?"
    "As Soluções integradas unem dashboards interativos e inteligência artificial. Com nossa tecnologia, você pode consultar dados da sua empresa diretamente pelo WhatsApp, e os mesmos insights são exibidos no dashboard, garantindo uma análise rápida e acessível a qualquer momento"
6. "Como acontece a integração com o meu sistema atual?"
    "Realizamos integrações via API ou outros métodos, adaptando nossas soluções à sua infraestrutura. 🔄"
7. "O sistema suporta atualizações diárias?"
    "Sim! Nosso sistema permite atualizações automáticas ou semiautomáticas, ajustadas às suas fontes de dados."
8. "Como as atendentes virtuais podem ajudar o meu negócio?"
    "Nossas atendentes virtuais oferecem suporte 24/7 com respostas rápidas e personalizadas, integrando-se ao seu CRM para otimizar o atendimento, reduzir custos operacionais e melhorar a experiência dos clientes."

### Quando solicitar e‑mail:
No final da conversa – se a resposta do usuário indicar despedida (ex.: "adeus", "tchau", "obg", "obrigado", "valeu", "até a proxima", "parabens") e nenhum e‑mail estiver registrado, pergunte:
"Antes de nos despedirmos, posso enviar mais detalhes por *e‑mail*. Qual é o seu e‑mail?"

### Setores e Soluções Específicas:
    - **Saúde:** "Consolidamos dados de pacientes e resultados clínicos para facilitar análises. 🏥"
    - **Construção civil:** "Ajudamos na gestão de projetos, cronogramas de obras, orçamento e performance das equipes. 🏗️"
    - **Advocacia:** "Oferecemos dashboards para gestão de processos e análise de performance."
    - **Esquadrias residenciais:** "Soluções para produção, estoque e eficiência operacional."

### Atenção:
- **Não crie ou invente links que não estejam explicitamente informados nas instruções.**
`;

// Função para obter resposta da IA
async function getAIResponseFromOpenAI(userInput, sender) {
    try {
        if (!userContexts[sender].history) userContexts[sender].history = [];
        // Adiciona a mensagem do usuário ao histórico
        userContexts[sender].history.push({ role: 'user', content: userInput });
        const messages = [
            { role: 'system', content: instructions.trim() },
            ...userContexts[sender].history
        ];
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            { model: 'gpt-3.5-turbo', messages, temperature: 0.7, max_tokens: 200 },
            { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' } }
        );
        const assistantReply = response.data.choices[0].message.content.trim();
        userContexts[sender].history.push({ role: 'assistant', content: assistantReply });
        return assistantReply;
    } catch (error) {
        console.error('❌ Erro ao obter resposta da IA:', error.response?.data || error.message);
        return "Desculpe, não entendi muito bem. Poderia reformular sua pergunta?";
    }
}

async function getAIResponse(userInput, sender, senderProfile = "Cliente") {
    const primeiroNome = getFirstName(senderProfile);
    const saudacao = getGreeting();

    // Se for um novo usuário ou sem interações, inicializa o contexto e envia saudação e introdução
    if (!userContexts[sender] || userContexts[sender].interactionCount === 0) {
        userContexts[sender] = {
            lastInteraction: Date.now(),
            name: senderProfile,
            profilePic: null,
            interactionCount: 0,
            emailSolicitado: false,
            awaitingEmailConfirmation: false,
            suggestedEmail: null,
            email: null,
            history: [],
            notifiedGestor: false,
            emailDeclined: false
        };
        // Notifica o gestor de novo contato (Modelo 2)
        await enviarEmailNovoContato(userContexts[sender].name || "Cliente", sender);
        userContexts[sender].notifiedGestor = true;
        // Inicializa a interação: envia saudação e introdução
        userContexts[sender].interactionCount = 1;
        const greetingMessage = `${saudacao}, ${primeiroNome}! 👋`;
        await sendWhatsAppMessage(sender, greetingMessage);
        await saveMessage('Bivi', greetingMessage, 'Bivi', null, null, sender);
        userContexts[sender].history.push({ role: 'assistant', content: greetingMessage });
        await new Promise(resolve => setTimeout(resolve, 1000));
        const introducao = "Eu sou a Bivi, assistente virtual da BiVisualizer. 🚀 Aqui, transformamos dados em soluções inteligentes para você. Como posso te ajudar hoje? 😉";
        await sendWhatsAppMessage(sender, introducao);
        await saveMessage('Bivi', introducao, 'Bivi', null, null, sender);
        userContexts[sender].history.push({ role: 'assistant', content: introducao });
        return `${greetingMessage}\n${introducao}`;
    }

    // Para usuários já existentes, atualiza o contexto
    userContexts[sender].interactionCount += 1;
    userContexts[sender].lastInteraction = Date.now();

    // Processa fluxo de confirmação de e‑mail, captura de e‑mail, etc.
    // [Fluxo de e‑mail conforme seu código original...]
    // ...

    // Fluxo normal: obtém a resposta da IA usando o histórico
    const aiReply = await getAIResponseFromOpenAI(userInput, sender);
    const farewellKeywords = ["adeus", "até logo", "tchau", "finalizar"];
    const isFarewell = farewellKeywords.some(keyword => aiReply.toLowerCase().includes(keyword));

    if (isFarewell) {
        if (userContexts[sender].email && !userContexts[sender].emailDeclined) {
            await sendSplitMessage(sender, aiReply);
            await enviarEmailFinalizacao(userContexts[sender].name || "Cliente", userContexts[sender].email, sender);
            return aiReply;
        } else if (!userContexts[sender].email && !userContexts[sender].emailDeclined) {
            await sendSplitMessage(sender, aiReply);
            await sendWhatsAppMessage(sender, `\n\nSe desejar, você também pode agendar uma reunião com nossos especialistas. Use este link: ${calendlyLink} 😉`);
            await saveMessage('Bivi', `Link de agendamento: ${calendlyLink}`, 'Bivi', null, userContexts[sender]?.email, sender);
            const promptEmail = "Antes de nos despedirmos, posso enviar mais detalhes por *e‑mail*. Qual é o seu e‑mail?";
            await sendWhatsAppMessage(sender, promptEmail);
            await saveMessage('Bivi', promptEmail, 'Bivi', null, userContexts[sender]?.email, sender);
            return "";
        }
    } else {
        if (aiReply && aiReply.trim()) {
            await sendSplitMessage(sender, aiReply);
        }
        return aiReply;
    }
}

const popularDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com"];
const temporaryDomains = ["tempmail.com", "10minutemail.com", "yopmail.com", "mailinator.com"];

function getClosestDomain(typedDomain) {
    let closestMatch = null;
    let minDistance = Infinity;
    const levenshteinDistance = (a, b) => {
        const dp = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(null));
        for (let i = 0; i <= a.length; i++) dp[i][0] = i;
        for (let j = 0; j <= b.length; j++) dp[0][j] = j;
        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
            }
        }
        return dp[a.length][b.length];
    };
    for (const domain of popularDomains) {
        const distance = levenshteinDistance(typedDomain, domain);
        if (distance < minDistance && distance <= 2) {
            minDistance = distance;
            closestMatch = domain;
        }
    }
    return closestMatch;
}

function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) return false;
    const domain = email.split("@")[1].toLowerCase();
    if (temporaryDomains.includes(domain)) return false;
    return true;
}

async function sendAndSaveMessage(sender, messageContent, senderName = "Bivi") {
    if (!messageContent || typeof messageContent !== 'string') {
        console.error('❌ Erro: A mensagem está vazia ou é inválida.');
        return;
    }
    await sendWhatsAppMessage(sender, messageContent);
    await saveMessage(senderName, messageContent, senderName, null, userContexts[sender]?.email, sender);
}

async function saveMessage(sender, messageContent, name, picture, email = null, destinatario = null) {
    if (!messageContent || typeof messageContent !== 'string') {
        console.error('❌ Erro: O conteúdo da mensagem está vazio ou inválido. Não foi possível salvar.');
        return;
    }
    try {
        const msgDoc = new Message({ sender, destinatario, message: messageContent, name, picture, email });
        await msgDoc.save();
        console.log('✅ Mensagem salva no DB:', msgDoc);
    } catch (error) {
        console.error('❌ Erro ao salvar mensagem no DB:', error.message);
    }
}

async function isAtendimentoHumanoAtivo(sender) {
    const atendimento = await Message.findOne({ sender, assumedBy: { $ne: null } }).sort({ timestamp: -1 });
    return !!atendimento;
}

router.post('/', async (req, res) => {
    try {
        const event = req.body;
        console.log("🔍 Recebendo evento do Webhook:", JSON.stringify(event, null, 2));

        // Valida se o objeto é do WhatsApp Business Account
        if (event.object !== 'whatsapp_business_account') {
            console.log("❌ Evento inválido recebido:", JSON.stringify(event, null, 2));
            return res.status(400).send('Evento inválido (não é whatsapp_business_account)');
        }

        // Obtém o valor contido na entrada
        const changes = event.entry?.[0]?.changes?.[0]?.value;

        // Se o evento for de status, ignora e retorna 200 OK
        if (changes?.statuses) {
            console.log("📩 Evento de status recebido. Ignorando...");
            return res.status(200).send('Evento de status ignorado');
        }

        // Processa somente se existir mensagem
        const messageData = changes?.messages?.[0];
        if (!messageData?.text?.body?.trim()) {
            return res.status(400).json({ error: "O corpo da mensagem (text.body) é obrigatório." });
        }
        const messageId = messageData.id;
        if (!messageId) {
            return res.status(200).send("Mensagem sem ID ignorada");
        }
        if (processedMessages.has(messageId)) {
            console.log(`🔄 Mensagem duplicada ignorada (ID: ${messageId})`);
            return res.status(200).send('Mensagem já processada');
        }
        processedMessages.add(messageId);
        setTimeout(() => processedMessages.delete(messageId), 5 * 60 * 1000);

        const mensagemTexto = messageData.text?.body || "";
        const sender = messageData.from;
        const senderProfile = changes?.contacts?.[0]?.profile?.name || "Cliente";
        const profilePic = changes?.contacts?.[0]?.profile?.picture || null;

        await saveMessage(sender, mensagemTexto, senderProfile, profilePic, userContexts[sender]?.email);
        console.log(`👤 Usuário: ${sender} | Mensagem: ${mensagemTexto}`);

        // ===================== NOVO CÓDIGO =====================
        // Verifica se o atendimento humano está ativo para o usuário
        if (await isAtendimentoHumanoAtivo(sender)) {
            console.log(`⚠ Atendimento humano ativo para ${sender}, ignorando resposta da IA.`);
            return res.status(200).send("Atendimento humano ativo, IA não responderá.");
        }
        // ========================================================

        // Se for novo usuário ou primeira interação: inicializa o contexto e envia saudação e introdução
        if (!userContexts[sender] || userContexts[sender].interactionCount === 0) {
            userContexts[sender] = {
                lastInteraction: Date.now(),
                name: senderProfile,
                profilePic,
                interactionCount: 0,
                emailSolicitado: false,
                awaitingEmailConfirmation: false,
                suggestedEmail: null,
                email: null,
                history: [],
                notifiedGestor: false,
                emailDeclined: false
            };
            await enviarEmailNovoContato(userContexts[sender].name || "Cliente", sender);
            userContexts[sender].notifiedGestor = true;
            userContexts[sender].interactionCount = 1;
            const greetingMessage = `${getGreeting()}, ${getFirstName(senderProfile)}! 👋`;
            await sendWhatsAppMessage(sender, greetingMessage);
            await saveMessage('Bivi', greetingMessage, 'Bivi', null, null, sender);
            userContexts[sender].history.push({ role: 'assistant', content: greetingMessage });
            await new Promise(resolve => setTimeout(resolve, 1000));
            const introducao = "Eu sou a Bivi, assistente virtual da BiVisualizer. 🚀 Aqui, transformamos dados em soluções inteligentes para você. Como posso te ajudar hoje? 😉";
            await sendWhatsAppMessage(sender, introducao);
            await saveMessage('Bivi', introducao, 'Bivi', null, null, sender);
            userContexts[sender].history.push({ role: 'assistant', content: introducao });
            return res.status(200).send("Mensagem processada");
        } else {
            userContexts[sender].lastInteraction = Date.now();
            userContexts[sender].interactionCount += 1;
        }

        if (mensagemTexto.toLowerCase().includes("agendar reunião")) {
            await agendarReuniao(sender, "01/02/2025", "15:00");
        }
        if (mensagemTexto.toLowerCase().includes("link")) {
            await enviarLink(sender, "https://bivisualizer.com");
        }
        if (["obrigado", "valeu", "obg", "agradeço"].includes(mensagemTexto.toLowerCase())) {
            const resposta = getRespostaAgradecimento(getFirstName(senderProfile));
            await sendWhatsAppMessage(sender, resposta);
            await saveMessage('Bivi', resposta, 'Bivi', null, userContexts[sender]?.email, sender);
            return res.status(200).send("Agradecimento processado");
        }

        // Fluxo de e‑mail: se estiver aguardando confirmação
        if (userContexts[sender].awaitingEmailConfirmation) {
            if (["sim", "ok", "certo"].includes(mensagemTexto.trim().toLowerCase())) {
                const confirmedEmail = userContexts[sender].suggestedEmail;
                if (!isValidEmail(confirmedEmail)) {
                    await sendWhatsAppMessage(sender, "O e‑mail sugerido parece inválido. Por favor, envie um e‑mail válido.");
                    return res.status(400).send("E‑mail inválido.");
                }
                userContexts[sender].email = confirmedEmail;
                userContexts[sender].awaitingEmailConfirmation = false;
                await Message.updateMany({ sender }, { $set: { email: confirmedEmail } });
                // Envia e‑mail de agradecimento para o cliente (Modelo 1)
                await enviarEmailCliente(userContexts[sender].name || "Cliente", confirmedEmail, sender);
                // Envia e‑mail de finalização para o gestor (Modelo 3)
                await enviarEmailFinalizacao(userContexts[sender].name || "Cliente", confirmedEmail, sender);
                await sendWhatsAppMessage(sender, `Ótimo, ${getFirstName(userContexts[sender].name || "Cliente")}! Seu e‑mail foi confirmado e vamos te enviar mais detalhes por e‑mail. 😊`);
                await sendWhatsAppMessage(sender, `\n\nSe precisar de algo mais é só chamar! 😉`);
                userContexts[sender].emailSolicitado = true;
                userContexts[sender].history.push({ role: 'assistant', content: `E‑mail confirmado: ${confirmedEmail}` });
                return res.status(200).send("E‑mail capturado");
            } else {
                await sendWhatsAppMessage(sender, "Por favor, informe seu e‑mail para que eu possa te enviar os detalhes.");
                return res.status(200).send("Aguardando e‑mail");
            }
        }

        // Se a mensagem contém um e‑mail, processa a captura e validação
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
        if (emailRegex.test(mensagemTexto)) {
            let emailExtracted = mensagemTexto.match(emailRegex)[0];
            const parts = emailExtracted.split("@");
            const domain = parts[1].toLowerCase();
            const closest = getClosestDomain(domain);
            if (closest && closest !== domain && !userContexts[sender].awaitingEmailConfirmation) {
                const suggestedEmail = `${parts[0]}@${closest}`;
                userContexts[sender].awaitingEmailConfirmation = true;
                userContexts[sender].suggestedEmail = suggestedEmail;
                await sendWhatsAppMessage(sender, `Você quis dizer *${suggestedEmail}*? Responda "sim" para confirmar ou envie o e‑mail correto.`);
                return res.status(200).send("Erro de digitação detectado no e‑mail.");
            }
            if (!isValidEmail(emailExtracted)) {
                await sendWhatsAppMessage(sender, "O e‑mail fornecido parece inválido. Por favor, envie um e‑mail válido.");
                return res.status(400).send("E‑mail inválido.");
            }
            userContexts[sender].email = emailExtracted;
            await Message.updateMany({ sender }, { $set: { email: emailExtracted } });
            // Envia e‑mail de agradecimento para o cliente (Modelo 1)
            await enviarEmailCliente(userContexts[sender].name || "Cliente", emailExtracted, sender);
            // Envia e‑mail de finalização para o gestor (Modelo 3)
            await enviarEmailFinalizacao(userContexts[sender].name || "Cliente", emailExtracted, sender);
            await sendWhatsAppMessage(sender, `Ótimo, ${getFirstName(userContexts[sender].name || "Cliente")}! Seu e‑mail foi confirmado e vamos te enviar mais detalhes por e‑mail. 😊`);
            await sendWhatsAppMessage(sender, `\n\nSe precisar de algo mais é só chamar! 😉`);
            userContexts[sender].emailSolicitado = true;
            userContexts[sender].history.push({ role: 'assistant', content: `E‑mail confirmado: ${emailExtracted}` });
            return res.status(200).send("E‑mail capturado");
        } else if (userContexts[sender].emailSolicitado && !userContexts[sender].email) {
            if (["sim", "ok", "certo"].includes(mensagemTexto.trim().toLowerCase())) {
                await sendWhatsAppMessage(sender, "Por favor, informe seu e‑mail para que eu possa te enviar os detalhes.");
                return res.status(200).send("Aguardando e‑mail");
            }
        }

        // Fluxo normal: obtém a resposta da IA usando o histórico
        const aiReply = await getAIResponseFromOpenAI(mensagemTexto, sender);
        const farewellKeywords = ["adeus", "até logo", "tchau", "finalizar"];
        const isFarewell = farewellKeywords.some(keyword => aiReply.toLowerCase().includes(keyword));

        if (isFarewell) {
            if (userContexts[sender].email && !userContexts[sender].emailDeclined) {
                await sendSplitMessage(sender, aiReply);
                await enviarEmailFinalizacao(userContexts[sender].name || "Cliente", userContexts[sender].email, sender);
                return res.status(200).send("Mensagem processada (despedida com finalização de e‑mail)");
            } else if (!userContexts[sender].email && !userContexts[sender].emailDeclined) {
                await sendSplitMessage(sender, aiReply);
                await sendWhatsAppMessage(sender, `\n\nSe desejar, você também pode agendar uma reunião com nossos especialistas. Use este link: ${calendlyLink} 😉`);
                await saveMessage('Bivi', `Link de agendamento: ${calendlyLink}`, 'Bivi', null, userContexts[sender]?.email, sender);
                const promptEmail = "Antes de nos despedirmos, posso enviar mais detalhes por *e‑mail*. Qual é o seu e‑mail?";
                await sendWhatsAppMessage(sender, promptEmail);
                await saveMessage('Bivi', promptEmail, 'Bivi', null, userContexts[sender]?.email, sender);
                return res.status(200).send("Mensagem processada (despedida com solicitação de e‑mail)");
            }
        } else {
            if (aiReply && aiReply.trim()) {
                await sendSplitMessage(sender, aiReply);
            }
            return res.status(200).send("Mensagem processada");
        }

    } catch (error) {
        console.error('❌ Erro no webhook:', error.message);
        return res.status(500).send("Erro interno no servidor");
    }
});

async function agendarReuniao(sender, data, horario) {
    try {
        await sendWhatsAppMessage(sender, `Reunião agendada para ${data} às ${horario}. Confirma?`);
    } catch (error) {
        console.error('❌ Erro ao agendar reunião:', error.message);
    }
}

async function enviarLink(sender, link) {
    try {
        await sendWhatsAppMessage(sender, `Aqui está o link que você pediu: ${link}`);
    } catch (error) {
        console.error('❌ Erro ao enviar link:', error.message);
    }
}

export default router;