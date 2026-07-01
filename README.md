# RECS ご注文フォーム

RECS（リモート始動阻止装置／GPS装置）の注文をWebから受け付けるフォームです。
DB・Upstash等の外部ストレージなしで動作します（1回の送信で完結）。

## できること

- 会社名・発送先・購入個数を入力 → 単価 15,371円（税込）× 個数で自動計算
- 送信すると
  1. サーバー側で請求書PDF（インボイス制度対応）を生成
  2. Resendで `ninjin.konishi@gmail.com` へ注文内容とPDFを添付して通知メール送信
  3. 画面に送信完了・購入明細を表示し、同じPDFをその場でダウンロード可能
- 完了画面に「入金確認後、製作に入ります」の注意書きと振込先を表示

## セットアップ（GitHub → Vercel）

1. このフォルダの中身をそのまま新しいGitHubリポジトリにアップロード
   （GitHubの「Add file → Upload files」からドラッグ&ドロップでOK）
2. Vercelで「Add New Project」→ 作成したリポジトリを選択してインポート
3. Vercelの Project Settings → Environment Variables に以下を追加
   - `RESEND_API_KEY`：Resendの管理画面（API Keys）で発行したキー
   - `RESEND_FROM_EMAIL`：Resendでドメイン認証済みの送信元メールアドレス
     （例：`orders@your-domain.com`。未設定の場合は `onboarding@resend.dev` から送信されますが、
     Gmail等で迷惑メール扱いされやすいため、独自ドメインでの認証を推奨）
   - `NOTIFY_EMAIL`：注文通知を受け取るアドレス（未設定なら `ninjin.konishi@gmail.com` 固定）
4. Deploy を実行すれば完了です。Upstash等の追加設定は不要です。

## 単価・請求元情報の変更

`lib/types.ts` に以下がまとまっています。金額や振込先、会社情報を変更する場合はここを編集してください。

- `UNIT_PRICE`：税込単価（現在 15,371円）
- `SELLER`：請求元（株式会社エイチビーソフトスタジオ）の住所・連絡先・登録番号・振込先

## フォント

請求書PDFと画面表示には Noto Sans JP（Google Fonts）を `public/fonts/` に同梱して使用しています。
フォントファイル（Regular/Bold）はやや容量が大きい（各約5MB）ため、Vercelの関数サイズ上限に
引っかかる場合は、文字を間引いたサブセットフォントに差し替えてください。

## ローカル動作確認

```bash
npm install
npm run dev
```

`http://localhost:3000` で確認できます（メール送信には `.env.local` に `RESEND_API_KEY` が必要です）。
