"use client";

import { useMemo, useState } from "react";
import { OrderCalculated, PRODUCT_NAME, SELLER, UNIT_PRICE } from "@/lib/types";

type OrderResponse = {
  order: OrderCalculated;
};

function yen(n: number): string {
  return `¥${n.toLocaleString("ja-JP")}`;
}

export default function Page() {
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OrderResponse | null>(null);

  const total = useMemo(() => quantity * UNIT_PRICE, [quantity]);

  const canSubmit =
    companyName.trim().length > 0 &&
    contactName.trim().length > 0 &&
    email.trim().length > 0 &&
    shippingAddress.trim().length > 0 &&
    quantity >= 1 &&
    !submitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, contactName, email, shippingAddress, quantity })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "送信に失敗しました。");
      }
      setResult(data);
    } catch (err: any) {
      setError(err?.message || "送信に失敗しました。しばらくしてから再度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setResult(null);
    setError(null);
    setCompanyName("");
    setContactName("");
    setEmail("");
    setShippingAddress("");
    setQuantity(1);
  }

  return (
    <div className="page-shell">
      <div className="brand-bar">
        <div className="brand-bar-inner">
          <p className="brand-eyebrow">ORDER FORM</p>
          <h1 className="brand-title">RECS ご注文フォーム</h1>
          <p className="brand-sub">{PRODUCT_NAME}</p>
        </div>
      </div>

      {!result && (
        <form className="card" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="companyName">会社名</label>
            <input
              id="companyName"
              type="text"
              placeholder="株式会社〇〇"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="contactName">氏名</label>
            <input
              id="contactName"
              type="text"
              placeholder="山田 太郎"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="email">メールアドレス</label>
            <input
              id="email"
              type="email"
              placeholder="example@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="field-hint">こちらのメールアドレス宛に請求書を発行します。</p>
          </div>

          <div className="field">
            <label htmlFor="shippingAddress">発送先</label>
            <textarea
              id="shippingAddress"
              placeholder="〒000-0000&#10;都道府県市区町村番地・建物名"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              required
            />
            <p className="field-hint">請求書の請求先住所としても使用されます。</p>
          </div>

          <div className="field">
            <label htmlFor="quantity">購入個数</label>
            <div className="qty-row">
              <button
                type="button"
                className="qty-btn"
                aria-label="個数を1減らす"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <input
                id="quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  setQuantity(Number.isFinite(v) && v > 0 ? v : 1);
                }}
                required
              />
              <button
                type="button"
                className="qty-btn"
                aria-label="個数を1増やす"
                onClick={() => setQuantity((q) => q + 1)}
              >
                ＋
              </button>
              <span className="field-hint" style={{ marginTop: 0 }}>
                単価 {yen(UNIT_PRICE)}（税込）
              </span>
            </div>
          </div>

          <div className="total-panel">
            <span className="total-panel-label">ご請求予定額</span>
            <span className="total-panel-value">
              {yen(total)}
              <small>税込</small>
            </span>
          </div>

          {error && <div className="error-box">{error}</div>}

          <button type="submit" className="submit-btn" disabled={!canSubmit}>
            {submitting ? "送信中…" : "この内容で注文する"}
          </button>
        </form>
      )}

      {result && (
        <div className="card">
          <span className="confirm-badge">✓ 送信完了</span>
          <h2 className="confirm-title">ご注文ありがとうございます</h2>
          <p className="confirm-order-no">注文番号：{result.order.orderNumber}</p>

          <table className="detail-table">
            <tbody>
              <tr>
                <th>会社名</th>
                <td>{result.order.companyName}</td>
              </tr>
              <tr>
                <th>氏名</th>
                <td>{result.order.contactName}</td>
              </tr>
              <tr>
                <th>メールアドレス</th>
                <td>{result.order.email}</td>
              </tr>
              <tr>
                <th>発送先</th>
                <td style={{ whiteSpace: "pre-wrap" }}>{result.order.shippingAddress}</td>
              </tr>
              <tr>
                <th>品名</th>
                <td>{PRODUCT_NAME}</td>
              </tr>
              <tr>
                <th>購入個数</th>
                <td className="amount">{result.order.quantity} 個</td>
              </tr>
              <tr>
                <th>単価（税込）</th>
                <td className="amount">{yen(result.order.unitPrice)}</td>
              </tr>
              <tr>
                <th>小計（税抜）</th>
                <td className="amount">{yen(result.order.subtotalExcludingTax)}</td>
              </tr>
              <tr>
                <th>消費税（10%）</th>
                <td className="amount">{yen(result.order.taxAmount)}</td>
              </tr>
              <tr className="grand-total">
                <th>合計（税込）</th>
                <td className="amount">{yen(result.order.totalAmount)}</td>
              </tr>
            </tbody>
          </table>

          <div className="notice-box">
            <strong>ご注意</strong>
            <p>
              入力いただいたメールアドレスに請求書を発行いたします。
              代金のご入金確認後、即部品発注に入ります。部品の取得に2〜3週間かかる見込みです。あらかじめご了承ください。
              ご不明な点がございましたら下記までお問い合わせください。
            </p>
          </div>

          <div className="bank-box">
            <h4>お振込先</h4>
            {SELLER.bank.bankName} {SELLER.bank.branchName}　{SELLER.bank.accountType}　
            {SELLER.bank.accountNumber}
            <br />
            {SELLER.bank.accountHolder}
          </div>

          <div className="action-row">
            <button type="button" className="submit-btn" onClick={handleReset}>
              新しい注文を作成する
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
