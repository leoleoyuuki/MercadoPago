"use client"
import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, db, auth } from "../service/firebasesdk";
import Image from 'next/image';
import { initMercadoPago } from '@mercadopago/sdk-react'
initMercadoPago('APP_USR-bce5ab03-835f-4b05-8c39-c7117d1ca75b');



const PaymentScreen = () => {
  const [paymentStatus, setPaymentStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Novo campo para confirmar a senha
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState(''); // Novo estado para exibir erros
  const [userId, setUserId] = useState(''); // Novo estado para armazenar o ID do usuário


  useEffect(() => {
    const status = localStorage.getItem('paymentStatus');
    setPaymentStatus(status);

    setUserId(auth.currentUser?.uid); // Obtém o ID do usuário atual

  }, []);

  const handleAuth = async () => {
    if (isSignup && password !== confirmPassword) {
      setError('As senhas não coincidem.'); // Exibe erro se as senhas não coincidirem
      return;
    }

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setShowModal(false);
      handlePayPress(); // Inicia o pagamento após o login/signup
    } catch (error) {
      setPaymentStatus(`Erro ao autenticar: ${error.message}`);
      setError(error.message); // Exibe o erro ao usuário
    }
  };

  const handlePayPress = async () => {
    try {
      const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 10, description: 'Pagamento de teste', payer: email, id: userId }),
      });

      const { preferenceId } = await response.json();
      window.location.href = `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${preferenceId}`;
      
      // Após o pagamento, registra a assinatura no Firestore
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, "Assinaturas"), {
          userId: user.uid,
          status: 'ativo',
          dataAssinatura: new Date(),
        });
      }

    } catch (error) {
      setPaymentStatus(`Erro ao criar preferência: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto flex justify-between px-10 items-center">
          <h1 className="text-3xl font-bold">Curso de Programação</h1>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="#benefits" className="hover:text-blue-200">Benefícios</a></li>
              <li><a href="#pricing" className="hover:text-blue-200">Preços</a></li>
              <li><a href="#testimonials" className="hover:text-blue-200">Depoimentos</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-500 text-white py-28 text-center">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-4">Aprimore suas habilidades em programação</h2>
          <p className="text-lg mb-8">Assine agora e tenha acesso completo ao nosso curso. Comece a aprender hoje mesmo!</p>
          <button
            onClick={() => setShowModal(true)} // Abre o modal ao invés de iniciar o pagamento direto
            className="bg-white text-blue-600 font-semibold py-2 px-6 rounded-lg shadow-lg hover:bg-gray-200 transition duration-300"
          >
            Assinar e Acessar o Curso
          </button>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-semibold mb-8">Por que escolher nosso curso?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-100 rounded-lg shadow-md">
              <Image width={100} height={100} alt={""} src="https://via.placeholder.com/100"  className="mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-2">Conteúdo Atualizado</h4>
              <p>Aprenda com as tecnologias mais recentes do mercado.</p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow-md">
              <Image width={100} height={100} alt={""} src="https://via.placeholder.com/100"  className="mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-2">Aulas Interativas</h4>
              <p>Experimente uma aprendizagem prática com exemplos do mundo real.</p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow-md">
              <Image width={100} height={100} alt={""} src="https://via.placeholder.com/100"  className="mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-2">Suporte 24/7</h4>
              <p>Obtenha ajuda quando precisar com nosso suporte dedicado.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-gray-50 py-16 px-4">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-semibold mb-8">Escolha o plano ideal para você</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-md border-2 border-blue-500">
              <h4 className="text-2xl font-bold mb-4">Plano Básico</h4>
              <p className="text-lg mb-4">R$29,90/mês</p>
              <ul className="mb-8">
                <li>Acesso a todos os módulos</li>
                <li>Suporte via email</li>
                <li>Certificado de conclusão</li>
              </ul>
              <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300">Assinar</button>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h4 className="text-2xl font-bold mb-4">Plano Premium</h4>
              <p className="text-lg mb-4">R$49,90/mês</p>
              <ul className="mb-8">
                <li>Acesso a todos os módulos</li>
                <li>Suporte prioritário</li>
                <li>Certificado de conclusão</li>
              </ul>
              <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300">Assinar</button>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h4 className="text-2xl font-bold mb-4">Plano Master</h4>
              <p className="text-lg mb-4">R$99,90/mês</p>
              <ul className="mb-8">
                <li>Acesso vitalício</li>
                <li>Mentoria individual</li>
                <li>Certificado de conclusão</li>
              </ul>
              <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300">Assinar</button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-semibold mb-8">O que nossos alunos dizem</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-100 rounded-lg shadow-md">
              <Image width={100} height={100} alt={""} src="https://via.placeholder.com/100"  className="rounded-full mx-auto mb-4" />
              <p>"Este curso mudou minha vida! Aprendi muito e consegui um emprego na área."</p>
              <h4 className="text-xl font-bold mt-4">Maria Silva</h4>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow-md">
              <Image width={100} height={100} alt={""} src="https://via.placeholder.com/100"  className="rounded-full mx-auto mb-4" />
              <p>"A melhor decisão que tomei foi assinar este curso. O suporte é excelente!"</p>
              <h4 className="text-xl font-bold mt-4">João Souza</h4>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow-md">
              <Image width={100} height={100} alt={""} src="https://via.placeholder.com/100"  className="rounded-full mx-auto mb-4" />
              <p>"Conteúdo de altíssima qualidade e atualizado com as últimas tecnologias."</p>
              <h4 className="text-xl font-bold mt-4">Carla Pereira</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Curso de Programação. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Modal de Login/Signup */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
          <button 
            onClick={() => setShowModal(false)}
            className='float-right text-xl rounded-full mb-4'
            >
              <h1 className=' 
              text-red-500
              hover:bg-red-500
              hover:text-white
              transition duration-300
              p-1
              px-3
              rounded-full
              ' >X</h1>
             </button>
            <h3 className="text-xl font-semibold mb-4">{isSignup ? 'Cadastro' : 'Login'}</h3>
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-4 p-2 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Senha"
              className="w-full mb-4 p-2 border rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {isSignup && (
              <input
                type="password"
                placeholder="Confirme sua Senha"
                className="w-full mb-4 p-2 border rounded-lg"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            )}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              onClick={handleAuth}
              className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 w-full"
            >
              {isSignup ? 'Cadastrar' : 'Entrar'}
            </button>
            <p className="mt-4 text-center">
              {isSignup ? 'Já tem uma conta?' : 'Não tem uma conta?'}{' '}
              <button
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError(''); // Limpa os erros ao trocar entre login e cadastro
                }}
                className="text-blue-600 hover:underline"
              >
                {isSignup ? 'Faça login' : 'Cadastre-se'}
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentScreen;
