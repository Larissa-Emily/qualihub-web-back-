import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/contact", async (req, res) => {
  const { name, email, phone, messageText } = req.body;

  if (!name || !email || !phone || !messageText) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes" });
  }

  try {
    await resend.emails.send({
      from: "QualiHub <onboarding@resend.dev>",
      to: ["rh@qualihub.online"],
      reply_to: email,
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
  } catch (error) {
    console.error("Erro Resend:", error);
    res.status(500).json({ error: "Erro ao enviar email" });
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Servidor rodando");
});
