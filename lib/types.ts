// 共通の型と定数（請求元情報・単価など）

export const UNIT_PRICE = 15371; // 税込単価（円）
export const TAX_RATE = 0.1; // 消費税率 10%
export const PRODUCT_NAME = "RECS（リモート始動阻止装置）GPS装置";

export const SELLER = {
  name: "株式会社エイチビーソフトスタジオ",
  postalCode: "〒799-3104",
  address: "愛媛県伊予市上三谷495−5",
  tel: "089-993-6262",
  fax: "089-993-6263",
  contact: "影浦 義丈",
  registrationNumber: "T1500001004709",
  bank: {
    bankName: "愛媛銀行",
    branchName: "久米支店",
    accountType: "普通",
    accountNumber: "4241637",
    accountHolder: "株式会社エイチビーソフトスタジオ 代表取締役　影浦義丈"
  }
};

export interface OrderInput {
  companyName: string;
  shippingAddress: string;
  quantity: number;
}

export interface OrderCalculated {
  orderNumber: string;
  orderDate: string; // YYYY-MM-DD
  companyName: string;
  shippingAddress: string;
  quantity: number;
  unitPrice: number;
  subtotalExcludingTax: number;
  taxAmount: number;
  totalAmount: number; // 税込合計
}

// --- 社内向け・非公開の請求書（音羽経営労務コンサルティング → 株式会社エイチビーソフトスタジオ） ---
// 注意：このデータ・PDFはメール添付以外の場所（Web画面・APIレスポンス）に絶対に出力しないこと。

export const OTOHA_UNIT_PRICE = 12871; // 税込単価（円）

export const OTOHA_ISSUER = {
  name: "音羽経営労務コンサルティング",
  postalCode: "〒841-0051",
  address: "佐賀県鳥栖市元町1237-2-408",
  tel: "080-6406-9113",
  bank: {
    bankName: "三菱UFJ銀行",
    branchName: "久留米支店",
    accountType: "普通",
    accountNumber: "0016202",
    accountHolder: "コニシ マサユキ"
  }
};

export interface OtohaInvoiceCalculated {
  quantity: number;
  unitPrice: number;
  subtotalExcludingTax: number;
  taxAmount: number;
  totalAmount: number;
  issueDateWareki: string; // 例: 令和8年7月1日
}

function toWareki(date: Date): string {
  // 令和：2019年5月1日〜
  const reiwaYear = date.getFullYear() - 2018;
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `令和${reiwaYear}年${month}月${day}日`;
}

export function calculateOtohaInvoice(quantity: number): OtohaInvoiceCalculated {
  const q = Math.max(1, Math.floor(quantity));
  const totalAmount = q * OTOHA_UNIT_PRICE;
  const taxAmount = Math.round((totalAmount * TAX_RATE) / (1 + TAX_RATE));
  const subtotalExcludingTax = totalAmount - taxAmount;

  return {
    quantity: q,
    unitPrice: OTOHA_UNIT_PRICE,
    subtotalExcludingTax,
    taxAmount,
    totalAmount,
    issueDateWareki: toWareki(new Date())
  };
}

export function calculateOrder(input: OrderInput): OrderCalculated {
  const quantity = Math.max(1, Math.floor(input.quantity));
  const totalAmount = quantity * UNIT_PRICE;
  // インボイス制度対応：税率ごとに一括で消費税額を算出（税込金額から逆算）
  const taxAmount = Math.round((totalAmount * TAX_RATE) / (1 + TAX_RATE));
  const subtotalExcludingTax = totalAmount - taxAmount;

  const now = new Date();
  const orderDate = now.toISOString().slice(0, 10);
  const orderNumber = `RECS-${now
    .toISOString()
    .replace(/[-:T.Z]/g, "")
    .slice(0, 14)}`;

  return {
    orderNumber,
    orderDate,
    companyName: input.companyName,
    shippingAddress: input.shippingAddress,
    quantity,
    unitPrice: UNIT_PRICE,
    subtotalExcludingTax,
    taxAmount,
    totalAmount
  };
}
