
import {addDoc,collection,db} from "../../service/firebasesdk"

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

export default async function handler(req, res) {

  
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
