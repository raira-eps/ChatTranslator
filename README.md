# チャット翻訳ビューアー

配信者向けのリアルタイムチャット翻訳ツール。海外視聴者のチャットコメントを日本語に翻訳し、配信者が理解できるようにすることを目的としています。

## 現状（2024年4月10日時点）

- 基本的なUI/UXの実装完了
  - テキストエリアへのコメント入力
  - 翻訳履歴の表示
  - 自動翻訳機能（1秒間の入力停止後）
  - Enterキーでの即時翻訳

- Electronアプリとしての基本設定完了
  - ローカルサーバー（Express）の統合
  - ウィンドウサイズの設定（800x600）

## 開発凍結の理由

現在、翻訳APIとして使用していたLibreTranslateの公開APIがAPIキーを要求するようになり、無料での利用が困難になりました。

## 今後の計画

1. Dockerを使用してローカルでLibreTranslateを立ち上げる
   - これにより、APIキーなしで翻訳機能を利用可能に
   - オフライン環境でも使用可能に

2. 機能追加（LibreTranslateのローカル環境構築後）
   - 設定の保存機能
   - ウィンドウの位置とサイズの記憶
   - エラーハンドリングの強化
   - 音声文字起こし機能の追加

## 技術スタック

- フロントエンド
  - HTML/CSS/JavaScript
  - Electron

- バックエンド
  - Node.js
  - Express
  - LibreTranslate（予定）

## 開発環境のセットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm start
```

## 注意事項

- 現在のバージョンは翻訳APIの問題により機能しません
- LibreTranslateのローカル環境構築が完了するまで開発は凍結されています 