"use client";
import React from "react";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { where, query } from "firebase/firestore";
import { Spinner } from "react-bootstrap";
import { auth, collection, db, getDocs } from "@/service/firebasesdk";

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

    window.addEventListener("focus", handleFocus);

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
        <Spinner animation="border" className="text-white" />
        <h1 className="text-xl font-bold text-white mt-4">Carregando...</h1>
        <p className="mt-2 text-white">
          Estamos processando suas informações. Por favor, aguarde.
        </p>
      </div>
    );
  }

  if (!assinaturaPaga) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
        <Spinner animation="border" className="text-white" />
        <h1 className="text-xl font-bold text-white mt-4">
          Verificando Assinatura...
        </h1>
        <p className="mt-2 text-white">
          Estamos verificando sua assinatura. Por favor, aguarde.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-white">
            <a href="/">BrandLogo</a>
          </div>
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

      {/* Imagem única com título e descrição */}
      <div className="relative w-full h-96 bg-gray-800">
        <img
          src="https://images.pexels.com/photos/1231234/pexels-photo-1231234.jpeg"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Banner"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
          <h2 className="text-3xl font-semibold">Curso Node.js</h2>
          <p className="mt-2 text-lg">Aprenda na prática as possibilidades de trabalhar com Node.</p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-10">
        {/* Módulo 1 */}
        <div className="mb-8">
          <h3 className="text-3xl font-semibold mb-4">Introdução NodeJs</h3>
          <div className="flex overflow-x-auto p-3 space-x-4">
            {/* Aula 1 */}
            <div className="bg-gray-800 rounded-lg w-72 flex-shrink-0 transition-transform duration-300 hover:scale-105">
              <img
                src="https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg"
                alt="Para que serve Node.js"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h4 className="font-semibold text-lg">
                  Para que serve Node.js
                </h4>
                <p className="mt-1 text-gray-400">
                  Uma visão geral sobre o Node.js.
                </p>
              </div>
            </div>
            {/* Aula 2 */}
            <div className="bg-gray-800 rounded-lg w-72 flex-shrink-0 transition-transform duration-300 hover:scale-105">
              <img
                src="https://images.pexels.com/photos/3861957/pexels-photo-3861957.jpeg"
                alt="Primeiro projeto com Node.js"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h4 className="font-semibold text-lg">
                  Primeiro projeto com Node.js
                </h4>
                <p className="mt-1 text-gray-400">
                  Criando seu primeiro projeto.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Módulo 2 */}
        <div className="mb-8">
          <h3 className="text-3xl font-semibold mb-4">Framework Next.js</h3>
          <div className="flex overflow-x-auto p-3 space-x-4">
            {/* Aula 1 */}
            <div className="bg-gray-800 rounded-lg w-72 flex-shrink-0 transition-transform duration-300 hover:scale-105">
              <img
                src="https://images.pexels.com/photos/3861956/pexels-photo-3861956.jpeg"
                alt="Introdução ao Next.js"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h4 className="font-semibold text-lg">Introdução ao Next.js</h4>
                <p className="mt-1 text-gray-400">
                  Um overview sobre Next.js e suas funcionalidades.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlatformPage;
