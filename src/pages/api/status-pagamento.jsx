// import mercadopago from "mercadopago";

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     const topic = req.body.topic;
//     const data = req.body.data;

//     if (topic === "payment.updated") {
//       const paymentId = data.id;

//       try {
//         // Verifica o status do pagamento
//         const payment = await mercadopago.payment.get(paymentId);

//         if (payment.body.status === "approved") {
//           // Pagamento aprovado, execute as ações desejadas
//           console.log("Pagamento aprovado:", payment.body);

//           // Exemplo: Enviar e-mail de confirmação
//           sendEmail(payment.body.payer.email, "Pagamento confirmado");

//           // Exemplo: Atualizar o status do pedido no banco de dados
//           updateOrderStatus(paymentId, "pago");
//         } else {
//           console.log("Pagamento não aprovado:", payment.body);
//         }
//       } catch (error) {
//         console.error("Erro ao processar a notificação:", error);
//       }
//     }

//     res.sendStatus(200);
//   } else {
//     res.setHeader("Allow", "POST");
//     res.status(405).end("Method Not Allowed");
//   }
// }


import mercadopago from "mercadopago";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const hello = req.hello;
    const topic = req.body.topic;
    const data = req.body.data;

    if (topic === "payment.updated") {
      const paymentId = data.id;

      try {
        // Verifica o status do pagamento
        const payment = await mercadopago.payment.get(paymentId);

        if (payment.body.status === "approved") {
          // Pagamento aprovado, execute as ações desejadas
          console.log("Pagamento aprovado:", payment.body);

          // Exemplo: Enviar e-mail de confirmação
        //   sendEmail(payment.body.payer.email, "Pagamento confirmado");

          // Exemplo: Atualizar o status do pedido no banco de dados
        //   updateOrderStatus(paymentId, "pago");
        } else {
          console.log("Pagamento não aprovado:", payment.body);
        }
      } catch (error) {
        console.error("Erro ao processar a notificação:", error);
      }
    }

    res.sendStatus(200);
    res.status(200).json({ status: "REQUISIÇAO RECEBIDA" });
  } 
 else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
