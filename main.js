const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

// Expressサーバーの設定
const expressApp = express();

// CORSの設定を強化
expressApp.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Accept']
}));

expressApp.use(express.json());

// ヘルスチェックエンドポイントを追加
expressApp.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

expressApp.post('/translate', async (req, res) => {
  try {
    console.log('翻訳リクエスト受信:', req.body);
    
    // APIキーを設定（ここに取得したAPIキーを入力してください）
    const apiKey = 'YOUR_API_KEY_HERE';
    
    const response = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        ...req.body,
        api_key: apiKey
      })
    });

    console.log('LibreTranslate API レスポンスステータス:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('APIエラーレスポンス:', errorText);
      throw new Error(`APIエラー: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const data = await response.json();
    console.log('翻訳結果:', data);
    
    if (!data.translatedText) {
      throw new Error('翻訳結果が空です');
    }

    res.json(data);
  } catch (err) {
    console.error('翻訳エラー:', err);
    res.status(500).json({ 
      error: '翻訳失敗しました',
      details: err.message
    });
  }
});

// Expressサーバーを起動
const PORT = 3000;
let server;

try {
  server = expressApp.listen(PORT, () => {
    console.log(`✅ 中継サーバー起動中: http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`⚠️ ポート ${PORT} は既に使用されています。別のポートを試してください。`);
    } else {
      console.error('サーバーエラー:', err);
    }
  });
} catch (err) {
  console.error('サーバー起動エラー:', err);
}

// Electronウィンドウの設定
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'img/icon.png')
  });

  win.loadFile('index.html');
  
  // 開発者ツールを開く（開発時のみ）
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// アプリ終了時にExpressサーバーも終了
app.on('before-quit', () => {
  if (server) {
    server.close();
  }
}); 