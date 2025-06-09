// index.js
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/poem', async (req, res) => {
  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  try {
    const prompt = `Write a poem about ${topic}.`;
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 150,
    });

    const poem = response.data.choices[0].text.trim();
    res.json({ poem });
  } catch (error) {
    console.error('Error generating poem:', error);
    res.status(500).json({ error: 'Failed to generate poem' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
