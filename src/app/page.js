 "use client"
import { useState , useEffect} from 'react';

const PaymentScreen = () => {
  const [paymentStatus, setPaymentStatus] = useState('');



  useEffect(() => {
    const pStatus = localStorage.getItem('paymentStatus');
    if (pStatus === "success") {
      setPaymentStatus(pStatus);
      localStorage.removeItem('paymentStatus');
      alert('Pagamento aprovado');
    } else if (pStatus === "error") {
      setPaymentStatus('Erro ao processar o pagamento');
      localStorage.removeItem('paymentStatus');
      alert('Erro ao processar o pagamento');
    }
  }, []);


  const handlePayPress = async () => {
    try {
      // Envia uma requisição ao seu backend para gerar a preferência de pagamento
      const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 10, description: 'Pagamento de teste' }),
      });

      const { preferenceId } = await response.json();

      // Redireciona para a página de pagamento do Mercado Pago
      window.location.href = `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${preferenceId}`;
    } catch (error) {
      setPaymentStatus(`Erro ao criar preferência: ${error.message}`);
    }
  };

  return (
    <div>
      <button onClick={handlePayPress}>
        Pagar com Mercado Pago
      </button>
      {paymentStatus && <div>{paymentStatus}</div>}
    </div>
  );
};

export default PaymentScreen;
