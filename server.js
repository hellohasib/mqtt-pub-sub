const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000; // You can change this to your desired port

app.use(express.json());

app.post('/get-clients', async (req, res) => {
  const username = 'admin'
  const password = 'public'

  try {
    const loginResponse = await axios.post('http://172.8.9.47:18083/api/v5/login', {
      username: username,
      password: password,
    });

    // Extract the token from the response
    const token = loginResponse.data.token;

    // Use the token to make a request to another API
    const apiResponse = await axios.get('http://172.8.9.47:18083/api/v5/clients?limit=200&page=1', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Serve the response from the second API
    res.json(apiResponse.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});