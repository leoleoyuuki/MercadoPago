// pages/payment-success.js

"use client";
import Image from 'next/image';
import Link from 'next/link';
const PaymentSuccess = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <Image 
          src="https://via.placeholder.com/150" 
          alt="Success Icon" 
          width={150} 
          height={150} 
          className="mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold mb-4">Pagamento Bem-Sucedido!</h1>
        <p className="text-lg mb-6">Seu pagamento foi processado com sucesso. Agora você tem acesso completo ao curso.</p>
        <Link
            href="/plataforma"
        >
        <button
          className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Voltar para a Página Inicial
        </button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
