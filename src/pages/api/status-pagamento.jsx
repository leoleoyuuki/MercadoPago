
import mercadopago from "mercadopago";
import {addDoc,collection,db} from "../../service/firebasesdk"


const addItem = async () => {
  try {
    const docRef = await addDoc(collection(db, "Pessoas"), {
      Nome: "FUNCIONOU"
    });
    
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};


export default async function handler(req, res) {
  
  if (req.method === "POST") {
    const hello = req.hello;
    const topic = req.body.topic;
    const data = req.body.data;
    console.log("requisição recebida", req.body);
    if (topic === "payment.updated") {
      const paymentId = data.id;

      try {
        // Verifica o status do pagamento
        const payment = await mercadopago.payment.get(paymentId);

        if (payment.body.status === "approved") {
          // Pagamento aprovado, execute as ações desejadas
          console.log("Pagamento aprovado:", payment.body);
          addItem()

          // Exemplo: Enviar e-mail de confirmação
        //   sendEmail(payment.body.payer.email, "Pagamento confirmado");

          // Exemplo: Atualizar o status do pedido no banco de dados
        //   updateOrderStatus(paymentId, "pago");
        } else {
          addItem()
          console.log("Pagamento não aprovado:", payment.body);
        }
      } catch (error) {
        addItem()
        console.error("Erro ao processar a notificação:", error);
      }
    }
    addItem()
    res.status(200).json({ status: "REQUISIÇAO RECEBIDA" });
  } else if (req.method === "GET") {
    res.status(200).json({ status: "GET RECEBIDO" });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
