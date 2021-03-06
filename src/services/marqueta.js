import axios from 'axios';

const { MARQUETA_URL: baseURL, MARQUETA_APP_ID: username, MARQUETA_ACCESS_TOKEN: password, MARQUETA_FUNDING_SOURCE_TOKEN: funding} = process.env;
const api = axios.create({
  baseURL,
  timeout: 150000,
  headers: { Accept: 'application/json' },
  auth: { username, password }
});



const getCards = token => api.get(`/transactions/fundingsource/${token}`);

export function fund({amount, user_token, memo}){
  return api.post('/gpaorders', {
    amount,
    user_token,
    memo: memo ||  `PhoneX transfer deposit of $${amount}`,
    currency_code: "USD",
    funding_source_token: "phonex"
  });
}

export function purchase({amount, card_token}){
  return api.post('/simulate/authorization', {amount, card_token, mid: '1234567890'});
}

export async function getUser({token}){
  try {
    const batch = await Promise.all([
      api.get(`/users/${token}`),
      api.get(`/cards/user/${token}`, { start_index: 1, fields: 'token,card_product_token,last_four,pan,expiration,state' }),
      api.get(`/balances/${token}`),
      api.get(`/transactions/fundingsource/${funding}`)
    ]);

    const [user, cards, balance, transactions] = batch.map(res => res.data);
    return Object.assign({}, user, balance, {
      cards: cards.data.filter(card => card.state === 'ACTIVE'),
      history: transactions.data.filter(action => action.user_token === token)
    });
  } catch(err) {
    console.log(err);
  }
}