require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const BASE_URL = 'https://production.plaid.com';

app.post('/create_link_token', async (req, res) => {
  try {
    const response = await axios.post(`${BASE_URL}/link/token/create`, {
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
      client_name: "Payflow",
      user: { client_user_id: "user-" + Date.now() },
      products: ["auth"],
      country_codes: ["US"],
      language: "en"
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json(err.response?.data || err.message);
  }
});

app.post('/exchange_token', async (req, res) => {
  try {
    const { public_token } = req.body;
    const response = await axios.post(`${BASE_URL}/item/public_token/exchange`, {
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
      public_token
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json(err.response?.data || err.message);
  }
});

app.post('/auth', async (req, res) => {
  try {
    const { access_token } = req.body;
    const response = await axios.post(`${BASE_URL}/auth/get`, {
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
      access_token
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json(err.response?.data || err.message);
  }
});

app.listen(3000, () => console.log('Server running'));
