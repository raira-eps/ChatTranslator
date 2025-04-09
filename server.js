const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = 3000; 

app.use(cors());
app.use(express.json());

app.post('/translate', async (req, res) => {
  try {
    const response = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '翻訳失敗しました' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ 中継サーバー起動中: http://localhost:${PORT}`);
});
