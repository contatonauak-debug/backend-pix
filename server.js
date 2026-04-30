const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.SYNC_API_KEY;
const CLIENT_ID = process.env.SYNC_CLIENT_ID;

// CRIAR PIX
app.post("/create-pix", async (req, res) => {
  try {
    const valor = req.body.valor || 0;

    const response = await axios.post(
      "https://api.syncpay.com/pix/create",
      {
        amount: valor,
        currency: "BRL"
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "X-Client-ID": CLIENT_ID
        }
      }
    );

    res.json(response.data);

  } catch (error) {
    console.log(error.response?.data || error.message);
    res.status(500).json({ error: "Erro ao gerar PIX" });
  }
});

// VER STATUS
app.get("/check-pix/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(
      `https://api.syncpay.com/pix/status/${id}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`
        }
      }
    );

    res.json(response.data);

  } catch (error) {
    res.status(500).json({ error: "Erro ao verificar pagamento" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Backend PIX rodando na porta " + PORT);
});