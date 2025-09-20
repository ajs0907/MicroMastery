const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

require('dotenv').config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;


app.post('/get_video', async (req, res) => {
  const { topic } = req.body;

  const prompt = `Suggest a YouTube video that teaches '${topic}' in an engaging and beginner-friendly way. Return the title and embed URL.`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    const [title, url] = content.split('||');

    res.json({
      title: title.trim(),
      url: url.trim()
    });
  } catch (error) {
    console.error('Error calling OpenAI:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch video suggestion' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});