"use client"
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/service/firebasesdk';

const PlatformPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verifica o estado da autenticação
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Usuário logado
        setLoading(false);
      } else {
        setUser(null); // Redefine o estado
        setLoading(false);
        router.push('/'); // Redireciona para tela principal se não estiver logado
      }
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, [auth, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Carregando...</p>; // Mostra uma tela de loading
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
