const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

console.log("🔥 SERVER INICIANDO...");

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.json({ status: "Backend PIX online 🚀" });
});

/* =========================
   CREATE PIX (SYNC PAYMENTS)
========================= */
app.post("/create-pix", async (req, res) => {
  try {
    const valor = Number(req.body.valor || 0);

    if (!valor || valor <= 0) {
      return res.status(400).json({ error: "Valor inválido" });
    }

    if (!process.env.SYNC_API_KEY) {
      return res.status(500).json({ error: "SYNC_API_KEY não configurada" });
    }

    const response = await axios.post(
      "https://api.syncpayments.com.br/api/partner/v1/cash-in",
      {
        amount: valor,
        description: "Pagamento VIP",
        webhook_url: "https://webhook.site/test",
        client: {
          name: "Cliente VIP",
          cpf: "12345678909",
          email: "teste@email.com",
          phone: "51999999999"
        }
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SYNC_API_KEY}`
        },
        timeout: 15000
      }
    );

    return res.json(response.data);

  } catch (error) {
    console.log("❌ ERRO CREATE PIX:");
    console.log(error.response?.data || error.message);

    return res.status(500).json({
      error: "Erro ao gerar PIX",
      detail: error.response?.data || error.message
    });
  }
});

/* =========================
   CHECK PIX STATUS (opcional)
========================= */
app.get("/check-pix/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(
      `https://api.syncpayments.com.br/api/partner/v1/cash-in/${id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SYNC_API_KEY}`,
          Accept: "application/json"
        }
      }
    );

    return res.json(response.data);

  } catch (error) {
    console.log("❌ ERRO CHECK PIX:", error.response?.data || error.message);

    return res.status(500).json({
      error: "Erro ao verificar pagamento",
      detail: error.response?.data || error.message
    });
  }
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("🚀 Backend rodando na porta " + PORT);
});