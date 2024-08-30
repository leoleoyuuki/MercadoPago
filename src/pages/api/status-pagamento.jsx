
import {addDoc,collection,db} from "../../service/firebasesdk"

const addItem = async (userId) => {
  try {
    const docRef = await addDoc(collection(db, "Pessoas"), {
      Nome: "FUNCIONOU",
      userId: userId
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
    const {data} = req.body;
    const email = data.payer.email;
    const uid = data.payer.userId;

    addItem(uid);
    
    res.status(200).json({ status: "REQUISIÇAO RECEBIDA" + email + uid });
  } else if (req.method === "GET") {
    res.status(200).json({ status: "GET RECEBIDO" });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
