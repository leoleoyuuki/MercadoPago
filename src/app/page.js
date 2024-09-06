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
        setUser(user);
        setUserId(user.uid);
        checkAssinatura(user.uid);
      } else {
        setUser(null);
        setUserId("");
      }
    });

    return () => unsubscribe();
  }, []);

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
      setShowModal(true);
      return;
    }

    await checkAssinatura(userId);

    if (assinaturaPaga) {
      window.location.href = "/plataforma";
    } else {
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
        await signInWithEmailAndPassword(auth, email, password); // Faz login após o cadastro
        setShowModal(false);
      } catch (error) {
        setError(error.message);
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        setUserId(auth.currentUser.uid);
        setShowModal(false);
      } catch (error) {
        setError(error.message);
      }
    }

    // Após o login ou cadastro, verificar a assinatura e prosseguir com o pagamento
    if (auth.currentUser) {
      setUser(auth.currentUser);
      setUserId(auth.currentUser.uid);
      await checkAssinatura(auth.currentUser.uid);
      handlePayPress(); // Mover aqui para garantir que o modal não abra duas vezes
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
                <li>✔ Certificação ao final</li>
              </ul>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300">
                Escolher Plano
              </button>
            </div>

            {/* Plano Premium */}
            <div className="border-2 border-blue-600 rounded-lg p-8 shadow-lg hover:shadow-xl transition duration-300">
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                Plano Premium
              </h3>
              <p className="text-gray-600 mb-6">
                O melhor plano para quem quer o máximo em aprendizado e suporte.
              </p>
              <div className="text-4xl font-bold text-gray-800 mb-4">
                R$199<span className="text-lg text-gray-500">/mês</span>
              </div>
              <ul className="text-left space-y-2 mb-8">
                <li>✔ Acesso completo a todos os recursos</li>
                <li>✔ Suporte personalizado 24/7</li>
                <li>✔ Sessões de mentoria individual</li>
                <li>✔ Certificação avançada</li>
              </ul>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300">
                Escolher Plano
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">
              {isSignup ? "Criar Conta" : "Login"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAuth();
              }}
            >
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              {isSignup && (
                <div className="mb-4">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-gray-700 mb-2"
                  >
                    Confirmar Senha
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  />
                </div>
              )}
              <div className="text-red-500 mb-4">{error}</div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {isSignup ? "Criar Conta" : "Entrar"}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button
                className="text-blue-600"
                onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup
                  ? "Já tem uma conta? Entre aqui"
                  : "Não tem uma conta? Crie aqui"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentScreen;
