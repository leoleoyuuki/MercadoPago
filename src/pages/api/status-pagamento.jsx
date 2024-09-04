
import { headers } from "next/headers";
import {addDoc,collection,db} from "../../service/firebasesdk"
import axios from "axios";


export default async function handler(req, res) {

  if (req.method === "POST") {
    console.log("requisição recebida", req.body);
    const id = req.body.data.id;


    try {
      const response = await axios.get(`https://api.mercadopago.com/v1/payments/${id}`, {
        headers: {
          'Authorization': 'Bearer TEST-5451710554063836-081815-2e6df1c787b904657c2fcac56e7b3586-486596499'
        }
      });
    
      const data = response.data;
    
      const uid = data.additional_info.payer.first_name;
      console.log('Uid do usuário usando gambiarra: ', uid);
      
      if (uid) {
        await addDoc(collection(db, "Assinaturas"), {
          userId: uid,
          status: 'ativo',
          dataAssinatura: new Date(),
        });
      }

    
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error);
    }
    
    

    
    res.status(200).json({ status: "REQUISIÇAO RECEBIDA"});
  } else if (req.method === "GET") {
    res.status(200).json({ status: "GET RECEBIDO" });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
