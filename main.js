const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

// Expressサーバーの設定
const expressApp = express();
expressApp.use(cors());
expressApp.use(express.json());

expressApp.post('/translate', async (req, res) => {
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

// Expressサーバーを起動
const server = expressApp.listen(3000, () => {
  console.log('✅ 中継サーバー起動中: http://localhost:3000');
});

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
  // win.webContents.openDevTools();
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
  server.close();
}); 