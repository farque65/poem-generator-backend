import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/poem', async (req, res) => {
  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  try {
    const prompt = `Write a poem about ${topic}.`;

    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('OpenAI API error:', err);
      return res.status(500).json({ error: 'OpenAI API failed', details: err });
    }

    const data = await response.json();
    const poem = data.choices?.[0]?.text?.trim() || 'No poem generated.';

    res.json({ poem });
  } catch (error) {
    console.error('Error generating poem:', error);
    res.status(500).json({ error: 'Failed to generate poem' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
