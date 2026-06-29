const axios = require('axios');
require('dotenv').config();

async function testOpenRouter() {
  console.log("Testing OpenRouter with openrouter/free...");
  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: "openrouter/free",
      messages: [{ role: "user", content: "Say hello world" }]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    console.log("SUCCESS:", response.data.choices[0].message.content);
  } catch (err) {
    console.error("FAIL:", err.response ? err.response.data : err.message);
  }
}

testOpenRouter();
