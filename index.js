const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const ASAASTOKEN = "$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OmIzZGI5MGVlLTYyYzAtNGM0NC04MzAwLTIwY2FhNWVlODRkMzo6JGFhY2hfMTMxMWNlNWUtMTdhZi00ODBhLTg0Y2ItNDBkN2QwZWFkZjIx";

app.post("/api/criarAssinaturaMembroAsaas", async (req, res) => {
  try {
    const payload = req.body;

    const response = await axios.post(
      "https://www.asaas.com/api/v3/subscriptions",
      payload,
      {
        headers: {
          Authorization: `Bearer ${ASAASTOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      message: "Assinatura criada com sucesso",
      invoiceUrl: response.data?.invoiceUrl || null,
      response: response.data,
    });
  } catch (error) {
    console.error("Erro ao criar assinatura:", error?.response?.data || error.message);
    res.status(500).json({
      message: "Erro ao criar assinatura",
      error: error?.response?.data || error.message,
    });
  }
});

exports.asaasProxyApi = functions.https.onRequest(app);
