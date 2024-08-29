
import {addDoc,collection,db} from "../../service/firebasesdk"
import Cors from 'cors';


export default async function handler(req, res) {
  const addItem = async () => {
    try {
      const docRef = await addDoc(collection(db, "Pessoas"), {
        Nome: "FUNCIONOU"
      });
      console.log("Document written with ID: ", docRef.id);
  
    } catch (e) {
      console.error("Error adding document: ", e);
      console.log("Error adding document: ", e);
    }
  };

  // Inicializa o middleware CORS
const cors = Cors({
  methods: ['GET', 'HEAD', 'POST'], // Métodos permitidos
  origin: '*', // Origem permitida (use '*' para permitir todas)
});

// Função auxiliar para executar middlewares
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}


  await runMiddleware(req, res, cors);

  
  if (req.method === "POST") {
    console.log("requisição recebida", req.body);
    addItem()
    
    res.status(200).json({ status: "REQUISIÇAO RECEBIDA" });
  } else if (req.method === "GET") {
    res.status(200).json({ status: "GET RECEBIDO" });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
