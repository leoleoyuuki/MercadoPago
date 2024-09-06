"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { where,  query} from "firebase/firestore";
import { Spinner } from "react-bootstrap"; // Importa o spinner do react-bootstrap


import {
  auth,
  collection,
  db,
  getDocs,
} from "@/service/firebasesdk";

const PlatformPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assinaturaPaga, setAssinaturaPaga] = useState(false);
  const router = useRouter();

  const checkUserAndSubscription = async (uid) => {
    setLoading(true);
    try {
      const assinaturasRef = collection(db, "Assinaturas");
      const q = query(assinaturasRef, where("userId", "==", uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setAssinaturaPaga(false);
        router.push("/");
      } else {
        setAssinaturaPaga(true);
      }
    } catch (e) {
      console.error("Erro ao buscar assinaturas: ", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleFocus = () => {
      const userM = auth.currentUser;
      if (userM) {
        setUser(userM);
        checkUserAndSubscription(userM.uid);
      } else {
        setUser(null);
        setAssinaturaPaga(false);
        router.push("/");
      }
    };

    // Adiciona o listener para focus
    window.addEventListener("focus", handleFocus);

    // Verifica o estado inicial do usuário
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        checkUserAndSubscription(user.uid);
      } else {
        setUser(null);
        setAssinaturaPaga(false);
        router.push("/");
      }
    });

    // Cleanup: remove o listener e unsubscribe quando o componente é desmontado
    return () => {
      window.removeEventListener("focus", handleFocus);
      unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <Spinner animation="border" />
        <h1 className="text-xl font-bold mt-4">Carregando...</h1>
        <p className="mt-2">Estamos processando suas informações. Por favor, aguarde.</p>
      </div>
    );
  }

  if (!assinaturaPaga) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <Spinner animation="border" />
        <h1 className="text-xl font-bold mt-4">Verificando Assinatura...</h1>
        <p className="mt-2">Estamos verificando sua assinatura. Por favor, aguarde.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-500 text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Plataforma de Aulas</h1>
          <div>
            <span className="mr-4">Bem-vindo, {user?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Aulas Disponíveis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Aulas fictícias */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold">Curso de JavaScript</h3>
            <p className="mt-2">Aprenda JavaScript do básico ao avançado.</p>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Acessar Aula
            </button>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold">Curso de CSS</h3>
            <p className="mt-2">Domine o CSS e crie layouts incríveis.</p>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Acessar Aula
            </button>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold">Curso de React</h3>
            <p className="mt-2">Construa aplicações modernas com React.</p>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Acessar Aula
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlatformPage;
