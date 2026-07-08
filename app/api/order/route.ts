import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { Resend } from "resend";
import React from "react";
import { calculateOrder, calculateOtohaInvoice, PRODUCT_NAME } from "@/lib/types";
import { OtohaInvoiceDocument } from "@/lib/invoice-pdf-otoha";

export const runtime = "nodejs";

function yen(n: number): string {
  return `¥${n.toLocaleString("ja-JP")}`;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const companyName = String(body.companyName || "").trim();
    const contactName = String(body.contactName || "").trim();
    const email = String(body.email || "").trim();
    const shippingAddress = String(body.shippingAddress || "").trim();
    const quantity = Number(body.quantity);

    if (
      !companyName ||
      !contactName ||
      !email ||
      !EMAIL_PATTERN.test(email) ||
      !shippingAddress ||
      !Number.isFinite(quantity) ||
      quantity < 1
    ) {
      return NextResponse.json(
        { error: "入力内容に不備があります。会社名・氏名・メールアドレス・発送先・購入個数をご確認ください。" },
        { status: 400 }
      );
    }

    const order = calculateOrder({ companyName, contactName, email, shippingAddress, quantity });

    // 社内向け請求書（音羽経営労務コンサルティング→エイチビーソフトスタジオ）
    // 注意：このPDFはメール添付にのみ使用し、APIレスポンス・Web画面には絶対に含めないこと。
    const otohaInvoice = calculateOtohaInvoice(quantity);
    const otohaPdfBuffer = await renderToBuffer(
      React.createElement(OtohaInvoiceDocument, { invoice: otohaInvoice }) as any
    );
    const otohaPdfBase64 = otohaPdfBuffer.toString("base64");

    // 社内通知メール送信（Resend）
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      const fromAddress = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
      const notifyTo = (process.env.NOTIFY_EMAIL || "ninjin.konishi@gmail.com")
        .split(",")
        .map((addr) => addr.trim())
        .filter(Boolean);

      await resend.emails.send({
        from: `RECS注文フォーム <${fromAddress}>`,
        to: notifyTo,
        subject: `【新規注文】${order.orderNumber} ${companyName}様`,
        html: `
          <div style="font-family: sans-serif; font-size: 14px; line-height: 1.7;">
            <h2>RECS 新規注文が届きました</h2>
            <table cellpadding="6" style="border-collapse: collapse;">
              <tr><td><strong>注文番号</strong></td><td>${order.orderNumber}</td></tr>
              <tr><td><strong>注文日</strong></td><td>${order.orderDate}</td></tr>
              <tr><td><strong>会社名</strong></td><td>${companyName}</td></tr>
              <tr><td><strong>氏名</strong></td><td>${contactName}</td></tr>
              <tr><td><strong>メールアドレス</strong></td><td>${email}</td></tr>
              <tr><td><strong>発送先</strong></td><td>${shippingAddress.replace(/\n/g, "<br/>")}</td></tr>
              <tr><td><strong>品名</strong></td><td>${PRODUCT_NAME}</td></tr>
              <tr><td><strong>購入個数</strong></td><td>${order.quantity} 個</td></tr>
              <tr><td><strong>単価（税込）</strong></td><td>${yen(order.unitPrice)}</td></tr>
              <tr><td><strong>合計金額（税込）</strong></td><td>${yen(order.totalAmount)}</td></tr>
            </table>
            <p>社内資料PDFを添付しています。</p>
          </div>
        `,
        attachments: [
          {
            filename: `社内資料_${order.orderNumber}.pdf`,
            content: otohaPdfBase64
          }
        ]
      });
    }

    return NextResponse.json({
      order,
      productName: PRODUCT_NAME
    });
  } catch (err) {
    console.error("Order submission failed:", err);
    return NextResponse.json(
      { error: "送信に失敗しました。しばらくしてから再度お試しください。" },
      { status: 500 }
    );
  }
}
