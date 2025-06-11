import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/poem', async (req, res) => {
  console.log('Received request to generate poem');
  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  try {
    const prompt = `Write a poem about ${topic}.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a poet. You will write a poem about a given topic.' },
          { role: 'user', content: `Write a poem about ${topic}. Return the response as valid JSON` }
        ],
        response_format: { "type": "json_object" },
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('OpenAI API error:', err);
      return res.status(500).json({ error: 'OpenAI API failed', details: err });
    }

    const data = await response.json();
    // console.log('OpenAI API response data', JSON.parse(data.choices?.[0]?.message?.content));
    const poem = JSON.stringify(data.choices?.[0]?.message?.content) || 'No poem generated.';

    console.log('Generated poem:', poem);

    res.json({ poem });
  } catch (error) {
    console.error('Error generating poem:', error);
    res.status(500).json({ error: 'Failed to generate poem' });
  }
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
