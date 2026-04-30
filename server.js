console.log("🔥 NOVA VERSÃO RODANDO");

app.post("/create-pix", async (req, res) => {
  try {
    const valor = Number(req.body.valor || 0);

    if (!valor || valor <= 0) {
      return res.status(400).json({ error: "Valor inválido" });
    }

    if (!process.env.SYNC_API_KEY) {
      return res.status(500).json({ error: "API KEY não configurada" });
    }

    const response = await axios.post(
      "https://api.syncpayments.com.br/api/partner/v1/cash-in",
      {
        amount: valor,
        description: "Pagamento VIP",
        webhook_url: "https://seusite.com/webhook",
        client: {
          name: "Cliente VIP",
          cpf: "12345678900",
          email: "teste@email.com",
          phone: "51999999999"
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SYNC_API_KEY}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        timeout: 15000
      }
    );

    return res.json(response.data);

  } catch (error) {
    console.log("❌ ERRO CREATE PIX:", error.response?.data || error.message);

    return res.status(500).json({
      error: "Erro ao gerar PIX",
      detail: error.response?.data || error.message
    });
  }
});