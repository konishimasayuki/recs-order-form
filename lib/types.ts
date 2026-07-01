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
