import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Modelo 1 - Email de agradecimento para o cliente
export const enviarEmailCliente = async (nome, email, numero) => {
    const mailToClient = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Obrigado pelo contato!",
        html: `
      <div style="font-family: Arial, sans-serif; text-align: center; color: #333; padding: 20px; background-color: #f9f9f9;">
        <h1 style="color: #5de5d9;">Obrigado pelo contato, ${nome}!</h1>
        <p>Ficamos felizes em saber do seu interesse na BiVisualizer. Nossa equipe esta analisando sua solicitacao e entrara em contato em breve com mais informacoes.</p>
        <p style="margin-top: 20px; font-size: 14px; color: #666;">Enquanto isso, sinta-se a vontade para visitar nosso site:</p>
        <a href="https://bivisualizer.com" style="color: #5de5d9; text-decoration: none; font-weight: bold;">bivisualizer.com</a>
        <p style="margin-top: 20px; font-size: 12px; color: #aaa;">Este email e automatico. Por favor, nao responda.</p>
      </div>
    `,
    };

    await transporter.sendMail(mailToClient);
    console.log("Email de agradecimento enviado para o cliente!");
};

// Modelo 3 - Email para o gestor quando o cliente finaliza o atendimento e informa o email
export const enviarEmailFinalizacao = async (nome, email, numero) => {
    const mailToGestorFinal = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_GESTOR,
        subject: `${nome} finalizou o atendimento`,
        html: `
      <div style="font-family: Arial, sans-serif; text-align: left; color: #333; padding: 20px; background-color: #f9f9f9;">
        <h1 style="color: #5de5d9;">Atendimento Finalizado</h1>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Número:</strong> ${numero}</p>
        <p>O cliente finalizou o atendimento e forneceu seu email. Por favor, acompanhe o historico de mensagens para mais detalhes.</p>
        <a href="https://app.bivisualizer.com/index.html" style="color: #5de5d9; text-decoration: none; font-weight: bold;">Acessar o Historico de Mensagens</a>
        <p style="margin-top: 20px; font-size: 12px; color: #aaa;">Este email e automatico. Por favor, nao responda.</p>
      </div>
    `,
    };

    await transporter.sendMail(mailToGestorFinal);
    console.log("Email de finalizacao enviado para o gestor!");
};

// Modelo 2 - Novo contato: Notifica o gestor assim que um cliente inicia o atendimento
export const enviarEmailNovoContato = async (nome, numero) => {
    const mailToGestorNovo = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_GESTOR,
        subject: `Novo contato iniciado - ${nome}`,
        html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f9f9f9;">
        <h1 style="color: #5de5d9;">Novo Contato Iniciado</h1>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Número:</strong> ${numero}</p>
        <p>Um novo cliente iniciou o atendimento com a Bivi. Voce pode acompanhar e interagir com a conversa acessando a pagina abaixo:</p>
        <p><a href="https://app.bivisualizer.com/bizap.html" style="color: #5de5d9; text-decoration: none; font-weight: bold;">Acessar Bizap</a></p>
        <p style="margin-top: 20px; font-size: 12px; color: #aaa;">Este email e automatico. Por favor, nao responda.</p>
      </div>
    `,
    };

    await transporter.sendMail(mailToGestorNovo);
    console.log("Novo contato notificado para o gestor!");
};
