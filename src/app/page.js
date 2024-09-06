"use client";
import { useState, useEffect } from "react";
import { auth } from "../service/firebasesdk";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../service/firebasesdk";
import { initMercadoPago } from "@mercadopago/sdk-react";
import { Link } from "next/link";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useRouter } from "next/navigation";

// Inicializa o MercadoPago
initMercadoPago(process.env.MERCADO_PAGO_ACCESS_TOKEN);

const PaymentScreen = () => {
  const [assinaturaPaga, setAssinaturaPaga] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user); // Define o usuário logado
        setUserId(user.uid); // Define o userId
        checkAssinatura(user.uid); // Verifica a assinatura ao iniciar
      } else {
        setUser(null); // Se não houver usuário logado
        setUserId("");
      }
    });

    // Limpa a subscrição quando o componente é desmontado
    return () => unsubscribe();
  }, []);

  // Verifica se o usuário tem assinatura
  const checkAssinatura = async (uid) => {
    try {
      const assinaturasRef = collection(db, "Assinaturas");
      const q = query(assinaturasRef, where("userId", "==", uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setAssinaturaPaga(false);
      } else {
        setAssinaturaPaga(true);
      }
    } catch (e) {
      console.error("Erro ao buscar assinaturas: ", e);
    }
  };

  const handlePayPress = async () => {
    if (!user) {
      setShowModal(true); // Abre o modal se não estiver logado
      return;
    }

    // Verifica a assinatura antes de prosseguir
    await checkAssinatura(userId);

    if (assinaturaPaga) {
      // Redireciona para a plataforma se já tiver assinatura
      window.location.href = "/plataforma";
    } else {
      // Cria preferência de pagamento se não tiver assinatura
      try {
        const response = await fetch("/api/create-preference", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: 10,
            description: "Pagamento de teste",
            payer: user.email,
            id: userId,
          }),
        });
        const { preferenceId } = await response.json();
        window.location.href = `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${preferenceId}`;
      } catch (error) {
        console.error("Erro ao criar preferência de pagamento:", error);
      }
    }
  };

  const handleAuth = async () => {
    if (isSignup) {
      if (password !== confirmPassword) {
        setError("Senhas não conferem");
        return;
      }

      try {
        await createUserWithEmailAndPassword(auth, email, password);
        setShowModal(false);

        // Após cadastro, faz login e verifica a assinatura
        await signInWithEmailAndPassword(auth, email, password);
        await checkAssinatura(auth.currentUser.uid);
        handlePayPress(); // Verifica a assinatura e cria a preferência de pagamento se necessário
      } catch (error) {
        setError(error.message);
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        setShowModal(false);

        // Após login, verifica a assinatura
        await checkAssinatura(auth.currentUser.uid);
        handlePayPress(); // Verifica a assinatura e cria a preferência de pagamento se necessário
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Conteúdo da página */}
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto flex justify-between px-10 items-center">
          <h1 className="text-3xl font-bold">Curso de Programação</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a href="#benefits" className="hover:text-blue-200">
                  Benefícios
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-blue-200">
                  Preços
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-blue-200">
                  Depoimentos
                </a>
              </li>
              {user != null && (
                <li>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 px-3 rounded text-white hover:bg-red-600"
                  >
                    Sair de {user?.email}
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <section className="bg-blue-500 text-white py-28 text-center">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-4">
            Aprimore suas habilidades em programação
          </h2>
          <p className="text-lg mb-8">
            Assine agora e tenha acesso completo ao nosso curso.
          </p>
          <button
            onClick={handlePayPress}
            className="bg-white text-blue-600 font-semibold py-2 px-6 rounded-lg shadow-lg hover:bg-gray-200 transition duration-300"
          >
            Assinar e Acessar o Curso
          </button>
        </div>
      </section>

      {/* Outras seções do seu código */}

      <section id="pricing" className="bg-white py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">
            Escolha o Seu Plano
          </h2>
          <p className="text-gray-600 mb-16">
            Oferecemos planos acessíveis e flexíveis para se adequar às suas
            necessidades de aprendizado.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plano Básico */}
            <div className="border-2 border-blue-600 rounded-lg p-8 shadow-lg hover:shadow-xl transition duration-300">
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                Plano Básico
              </h3>
              <p className="text-gray-600 mb-6">
                Ideal para iniciantes que estão começando na programação.
              </p>
              <div className="text-4xl font-bold text-gray-800 mb-4">
                R$49<span className="text-lg text-gray-500">/mês</span>
              </div>
              <ul className="text-left space-y-2 mb-8">
                <li>✔ Acesso a 10 cursos iniciais</li>
                <li>✔ Suporte via e-mail</li>
                <li>✔ Acesso a comunidade</li>
              </ul>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300">
                Escolher Plano
              </button>
            </div>

            {/* Plano Profissional */}
            <div className="border-2 border-blue-600 rounded-lg p-8 shadow-lg hover:shadow-xl transition duration-300 bg-blue-100">
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                Plano Profissional
              </h3>
              <p className="text-gray-600 mb-6">
                Perfeito para desenvolvedores que querem avançar nas
                habilidades.
              </p>
              <div className="text-4xl font-bold text-gray-800 mb-4">
                R$99<span className="text-lg text-gray-500">/mês</span>
              </div>
              <ul className="text-left space-y-2 mb-8">
                <li>✔ Acesso a todos os cursos</li>
                <li>✔ Suporte via chat e e-mail</li>
                <li>✔ Acesso a projetos práticos</li>
                <li>✔ Certificação ao final dos cursos</li>
              </ul>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300">
                Escolher Plano
              </button>
            </div>

            {/* Plano Avançado */}
            <div className="border-2 border-blue-600 rounded-lg p-8 shadow-lg hover:shadow-xl transition duration-300">
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                Plano Avançado
              </h3>
              <p className="text-gray-600 mb-6">
                Para quem deseja dominar a programação com suporte completo.
              </p>
              <div className="text-4xl font-bold text-gray-800 mb-4">
                R$199<span className="text-lg text-gray-500">/mês</span>
              </div>
              <ul className="text-left space-y-2 mb-8">
                <li>✔ Acesso a todos os cursos avançados</li>
                <li>✔ Suporte prioritário 24/7</li>
                <li>✔ Mentoria 1:1</li>
                <li>✔ Projetos exclusivos e feedback personalizado</li>
              </ul>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300">
                Escolher Plano
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="vsl" className="py-14 bg-blue-600 text-white text-center">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-8">
            Descubra Como Nossa Plataforma Funciona
          </h2>
          <div className="mb-8">
            <iframe
              className="mx-auto"
              width="560"
              height="315"
              src="https://www.youtube.com/embed/SEU_VIDEO"
              title="Video de Apresentação"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <p className="text-lg">
            Assista ao vídeo para saber como podemos te ajudar a dominar a
            programação em tempo recorde.
          </p>
        </div>
      </section>

      <section id="testimonials" className="py-16 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">
            Depoimentos de Nossos Alunos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
              <p className="text-gray-700 mb-4">
              &quot;Esse curso mudou minha vida! A didática é incrível e os
                exercícios práticos são desafiadores.&quot;
              </p>
              <h3 className="text-xl font-semibold">João Silva</h3>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
              <p className="text-gray-700 mb-4">
              &quot;Esse curso mudou minha vida! A didática é incrível e os
                exercícios práticos são desafiadores.&quot;
              </p>
              <h3 className="text-xl font-semibold">Leonardo Yuuki</h3>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
              <p className="text-gray-700 mb-4">
              &quot;Aprendi mais em 2 meses aqui do que em 2 anos Na Faculdade.
                Muito Top!&quot;
              </p>
              <h3 className="text-xl font-semibold">Maria Santos</h3>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 pt-14 pb-8 px-10 pl-24">
        <div className="container grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Sobre Nós */}
          <div>
            <h3 className="text-white text-2xl font-semibold mb-2">
              Sobre Nós
            </h3>
            <p className="text-gray-400">
              Somos uma plataforma dedicada a fornecer cursos de programação de
              alta qualidade para todos os níveis de habilidade, ajudando você a
              crescer na sua carreira de tecnologia.
            </p>
          </div>

          {/* Links Úteis */}
          <div>
            <h3 className="text-white text-2xl font-semibold mb-4">
              Links Úteis
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#benefits"
                  className="hover:text-white transition duration-300"
                >
                  Benefícios
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-white transition duration-300"
                >
                  Planos e Preços
                </a>
              </li>
              <li>
                <a
                  href="#vsl"
                  className="hover:text-white transition duration-300"
                >
                  Vídeo de Apresentação
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="hover:text-white transition duration-300"
                >
                  Depoimentos
                </a>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-white text-2xl font-semibold mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5h18M9 3v2M15 3v2M12 7v13m0-13H3v13h18V7h-9z"
                  ></path>
                </svg>
                <span>(11) 1234-5678</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 10V6a2 2 0 00-2-2h-3a2 2 0 00-2 2v4m-4 10v-4a2 2 0 012-2h6a2 2 0 012 2v4m-4-10V4m-1 16h2"
                  ></path>
                </svg>
                <span>contato@curso.com.br</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8h2a2 2 0 012 2v7a2 2 0 01-2 2h-2m-5 0H7a2 2 0 01-2-2v-7a2 2 0 012-2h5"
                  ></path>
                </svg>
                <span>Av. Exemplo, 123 - São Paulo, SP</span>
              </li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h3 className="text-white text-2xl font-semibold mb-4">Siga-nos</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5.002 3.657 9.128 8.437 9.88v-6.99h-2.54v-2.89h2.54v-2.2c0-2.508 1.493-3.89 3.777-3.89 1.096 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.774-1.63 1.565v1.87h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 17.002 22 12z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm12 5h-2V5h2v2zM7 5h5v1h2v1h-2v2h2v1H7v-1h2v-2H7V5zm0 8v1h5v1H7v2h5v1H7v-1h-2v1h-1v-1h-1v-2h1v-1h1v1h1v1h2v-1h-1v-1h1v1h-1v-1h2v1h-1v-1h1v-1h1v1h2v1h-1v1h1v-1h1v1h-1v1h-1v1H7z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.447h-3.555v-5.284c0-1.26-.025-2.877-1.756-2.877-1.756 0-2.024 1.372-2.024 2.789v5.372H9.55v-10.8h3.413v1.474h.05c.475-.9 1.637-1.847 3.368-1.847 3.6 0 4.264 2.367 4.264 5.446v6.727zM5.337 8.224c-1.144 0-1.855-.756-1.855-1.699 0-.957.726-1.699 1.89-1.699s1.854.742 1.854 1.699c0 .943-.71 1.699-1.89 1.699zM6.724 20.447H3.948V9.647h2.776v10.8zm16.43-18.447H.847c-.479 0-.847.375-.847.853v21.38c0 .479.375.847.847.847h21.38c.479 0 .853-.375.853-.847V2.853c0-.479-.375-.853-.847-.853z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-500">
            © 2024 Seu Curso de Programação. Todos os direitos reservados.
          </p>
        </div>
      </footer>

       {/* Modal para login e cadastro */}
       {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{isSignup ? "Cadastro" : "Login"}</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAuth();
              }}
            >
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="password">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              {isSignup && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
                    Confirmar Senha
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
              )}
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                {isSignup ? "Cadastrar" : "Entrar"}
              </button>
              <button
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                className="mt-4 text-blue-600 hover:underline"
              >
                {isSignup ? "Já tem uma conta? Entrar" : "Não tem uma conta? Cadastrar"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentScreen;