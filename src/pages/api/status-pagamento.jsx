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



var express = require('express');
import mercadopago from 'mercadopago';

const app = express();
const port = 3000;

// Configura as credenciais do Mercado Pago
mercadopago.configure({
  access_token: 'APP_USR-5451710554063836-081815-7828d7b3758fec037016cf253d6dcc62-486596499'
});

// Rota para receber as notificações
app.post('/status-pagamento', async (req, res) => {
  const topic = req.body.topic;
  const data = req.body.data;

  if (topic === 'payment.updated') {
    const paymentId = data.id;

    try {
      // Verifica o status do pagamento
      const payment = await mercadopago.payment.get(paymentId);

      if (payment.body.status === 'approved') {
        // Pagamento aprovado, execute as ações desejadas
        console.log('Pagamento aprovado:', payment.body);

        // Exemplo: Enviar e-mail de confirmação
        sendEmail(payment.body.payer.email, 'Pagamento confirmado');

        // Exemplo: Atualizar o status do pedido no banco de dados
        updateOrderStatus(paymentId, 'pago');
      } else {
        console.log('Pagamento não aprovado:', payment.body);
      }
    } catch (error) {
      console.error('Erro ao processar a notificação:', error);
    }
  }

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`);
});