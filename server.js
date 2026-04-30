app.post("/create-pix", async (req, res) => {
  try {
    const valor = Number(req.body.valor || 0);

    if (!valor || valor <= 0) {
      return res.status(400).json({ error: "Valor inválido" });
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
    console.log("❌ ERRO CREATE PIX:", error.response?.data || error.message);

    return res.status(500).json({
      error: "Erro ao gerar PIX",
      detail: error.response?.data || error.message
    });
  }
});