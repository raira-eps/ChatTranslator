const input = document.getElementById('inputText');
const output = document.getElementById('outputText');
const history = document.getElementById('history');
const translateBtn = document.getElementById('translateBtn');

// 翻訳履歴を保存する配列
let translationHistory = [];

// 翻訳関数
async function translateText(text) {
  if (!text.trim()) return;

  try {
    const response = await fetch("http://localhost:3000/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        q: text,
        source: "auto",
        target: "ja",
        format: "text"
      })
    });

    const data = await response.json();
    if (data.translatedText) {
      const translated = data.translatedText;
      output.textContent = translated;
      
      // 履歴に追加
      translationHistory.unshift({
        original: text,
        translated: translated,
        timestamp: new Date()
      });
      
      // 履歴表示を更新
      updateHistoryDisplay();
      input.value = '';
    } else {
      output.textContent = "⚠️ 翻訳結果が取得できませんでした。";
    }
  } catch (err) {
    output.textContent = "⚠️ 翻訳に失敗しました";
    console.error(err);
  }
}

// 履歴表示を更新する関数
function updateHistoryDisplay() {
  history.innerHTML = translationHistory
    .map(item => `
      <div class="history-item">
        <div class="original">🗨️ ${item.original}</div>
        <div class="translated">→ ${item.translated}</div>
        <div class="timestamp">${item.timestamp.toLocaleTimeString()}</div>
      </div>
    `)
    .join('');
}

// ボタンクリック時の翻訳
translateBtn.addEventListener('click', () => {
  translateText(input.value);
});

// 入力時の自動翻訳（Enterキーまたは一定時間の入力停止後）
let debounceTimer;
input.addEventListener('input', (e) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    translateText(e.target.value);
  }, 1000); // 1秒後に自動翻訳
});

// Enterキーでの即時翻訳
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    translateText(input.value);
  }
});
