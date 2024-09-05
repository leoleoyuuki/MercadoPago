// pages/api/create-preference.js
import axios from 'axios';

// Substitua pela sua chave secreta do Mercado Pago
const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { amount, description, payer, id } = req.body;

    try {
      console.log('Iniciando criação da preferência de pagamento...');

      const response = await axios.post(
        'https://api.mercadopago.com/checkout/preferences',
        {
          items: [
            {
              title: description,
              unit_price: parseFloat(amount), // Certifique-se de que amount é um número
              quantity: 1,
            },
          ],
          payment_method_id: "Pix",
          auto_return: 'approved',
          back_urls: {
            success: `${process.env.WEBSITE_URL}/success`,
          },
          payer: {
            email: payer,
          },
          external_reference: id,

        },
        {
          headers: {
            Authorization: `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Preferência criada com sucesso:', response.data);

      res.status(200).json({ preferenceId: response.data.id });
    } catch (error) {
      // Log completo da resposta de erro
      if (error.response) {
        console.error('Erro na resposta da API:', error.response.data);
        console.error('Status Code:', error.response.status);
      } else {
        console.error('Erro sem resposta:', error.message);
      }
      
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed dd');
  }
}
