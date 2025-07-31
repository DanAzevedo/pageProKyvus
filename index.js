
document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const idAsaas = params.get("idAsaas");
  const idEstabelecimento = params.get("idEstabelecimento");
  const idEmpresa = params.get("idEmpresa");

  console.log("🔍 Parâmetros da URL:");
  console.log("idAsaas:", idAsaas);
  console.log("idEstabelecimento:", idEstabelecimento);
  console.log("idEmpresa:", idEmpresa);

  const btnPagar = document.getElementById("btn-pagamento");

  if (!btnPagar) {
    console.error("❌ Botão para pagamento não encontrado!");
    return;
  }

  btnPagar.addEventListener("click", async () => {
    if (!idAsaas || !idEstabelecimento || !idEmpresa) {
      alert("Erro: parâmetros obrigatórios ausentes na URL.");
      console.error("❌ Parâmetros ausentes:", { idAsaas, idEstabelecimento, idEmpresa });
      return;
    }

    const payload = {
      idAsaas: idAsaas,
      idEstabelecimento: idEstabelecimento,
      idEmpresa: idEmpresa
    };

    console.log("📦 Enviando para API (Parceiro):", payload);

    try {
      const response = await fetch("https://asaas-proxy-api-703360123160.southamerica-east1.run.app/api/iniciarPagamentoParceiro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "access_token": "eTL6MkRCywEA5wnP8NUMQbu0vxZ1uhUJj7hPbUgEJgTVA38dwcRYt98XTUcE03cCT"
        },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();

      console.log("📥 Status da resposta:", response.status);
      console.log("📥 Texto bruto da resposta:", responseText);

      if (!response.ok) {
        console.error("❌ Erro retornado pela API:", responseText);
        alert("Erro retornado pela API:\n\n" + responseText);
        return;
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error("⚠️ Erro ao fazer parse do JSON:", e);
        alert("Erro ao interpretar a resposta da API.");
        return;
      }

      console.log("📦 Resposta da API:", result);

      if (result?.invoiceUrl) {
        console.log("🔁 Redirecionando para:", result.invoiceUrl);
        window.location.href = result.invoiceUrl;
      } else {
        alert("Erro: resposta da API não contém invoiceUrl.");
        console.log("Resposta completa da API:", result);
      }

    } catch (error) {
      console.error("❌ Erro de rede ou sistema:", error);
      alert("Erro ao processar pagamento: " + error.message);
    }
  });
});
