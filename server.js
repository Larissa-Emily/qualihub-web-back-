import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: { 
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.post("/contact", async (req, res) => {
  const { name, email, phone, messageText } = req.body;

  if (!name || !email || !phone || !messageText) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes" });
  }

  try {
    await transporter.sendMail({
      from: `"Site QualiHub" <${process.env.SMTP_USER}>`,
      to: "rh@qualihub.online",
      subject: "Novo contato pelo site",
      html: `
        <h3>Novo contato recebido</h3>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${phone}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${messageText}</p>
      `,
    });

    res.status(200).json({ success: true });
  }catch (error) {
  console.error("ERRO AO ENVIAR EMAIL:", error);
  res.status(500).json({
    error: "Erro ao enviar email",
    details: error.message,
  });
}
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});
