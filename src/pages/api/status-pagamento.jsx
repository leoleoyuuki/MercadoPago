import { headers } from "next/headers";
import { addDoc, collection, db } from "../../service/firebasesdk";
import axios from "axios";


export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log("requisição recebida", req.body);
    const id = req.body.data.id;

    try {
      const response = await axios.get(
        `https://api.mercadopago.com/v1/payments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
          },
        }
      );

      const data = response.data;

      console.log("Dados do pagamento:", data);
      console.log("Status do pagamento:", data.status);
      const uid = data.external_reference;
      console.log("Uid do usuário : ", uid);

      if (data.status === "approved") {
        console.log("Pagamento aprovado!");
        if (uid) {
          await addDoc(collection(db, "Assinaturas"), {
            userId: uid,
            status: "ativo",
            dataAssinatura: new Date(),
          });
          console.log("Assinatura criada com sucesso!");
        } else {
          console.log("Usuário não encontrado");
        }
      } else {
        console.log("Pagamento rejeitado.");
      }
    } catch (error) {
      console.error("Erro ao fazer a requisição:", error);
    }

    res.status(200).json({ status: "REQUISIÇAO RECEBIDA" });
  } else if (req.method === "GET") {
    res.status(200).json({ status: "GET RECEBIDO" });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
