import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font
} from "@react-pdf/renderer";
import path from "path";
import { OrderCalculated, PRODUCT_NAME, SELLER } from "./types";

Font.register({
  family: "NotoSansJP",
  fonts: [
    { src: path.join(process.cwd(), "public/fonts/NotoSansJP-Regular.ttf"), fontWeight: "normal" },
    { src: path.join(process.cwd(), "public/fonts/NotoSansJP-Bold.ttf"), fontWeight: "bold" }
  ]
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoSansJP",
    fontSize: 10,
    padding: 40,
    color: "#1a1a1a"
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    letterSpacing: 4
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },
  metaBox: {
    fontSize: 9,
    textAlign: "right"
  },
  billTo: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 4,
    borderBottom: "1.5pt solid #1a1a1a",
    paddingBottom: 4
  },
  billToAddress: {
    fontSize: 10,
    marginBottom: 16
  },
  sellerBox: {
    width: 230,
    fontSize: 9,
    lineHeight: 1.5
  },
  totalBanner: {
    backgroundColor: "#f2f4f7",
    padding: 10,
    marginTop: 10,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  totalLabel: {
    fontSize: 11
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold"
  },
  table: {
    marginTop: 8,
    borderTop: "1pt solid #333",
    borderBottom: "1pt solid #333"
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#eef1f5",
    paddingVertical: 6,
    fontWeight: "bold"
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottom: "0.5pt solid #ddd"
  },
  colItem: { width: "42%", paddingHorizontal: 6 },
  colQty: { width: "14%", paddingHorizontal: 6, textAlign: "right" },
  colUnit: { width: "22%", paddingHorizontal: 6, textAlign: "right" },
  colAmount: { width: "22%", paddingHorizontal: 6, textAlign: "right" },
  summaryTable: {
    marginTop: 10,
    alignSelf: "flex-end",
    width: "45%"
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3
  },
  summaryRowFinal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 6,
    marginTop: 4,
    borderTop: "1pt solid #333"
  },
  section: {
    marginTop: 22
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 6
  },
  bankBox: {
    fontSize: 10,
    lineHeight: 1.6,
    backgroundColor: "#f8f8f8",
    padding: 10
  },
  noticeBox: {
    marginTop: 16,
    padding: 10,
    border: "1pt solid #c0392b",
    backgroundColor: "#fdf1f0"
  },
  noticeText: {
    fontSize: 10.5,
    fontWeight: "bold",
    color: "#c0392b"
  },
  footerNote: {
    marginTop: 30,
    fontSize: 8,
    color: "#888",
    textAlign: "center"
  }
});

function yen(n: number): string {
  return `¥${n.toLocaleString("ja-JP")}`;
}

export function InvoiceDocument({ order }: { order: OrderCalculated }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>請求書</Text>

        <View style={styles.headerRow}>
          <View>
            <Text style={styles.billTo}>{order.companyName} 御中</Text>
            <Text style={styles.billToAddress}>{order.shippingAddress}</Text>
          </View>
          <View style={styles.metaBox}>
            <Text>請求書番号：{order.orderNumber}</Text>
            <Text>発行日：{order.orderDate}</Text>
          </View>
        </View>

        <View style={styles.totalBanner}>
          <Text style={styles.totalLabel}>ご請求金額（税込）</Text>
          <Text style={styles.totalValue}>{yen(order.totalAmount)}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.colItem}>品名</Text>
            <Text style={styles.colQty}>数量</Text>
            <Text style={styles.colUnit}>単価（税込）</Text>
            <Text style={styles.colAmount}>金額（税込）</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.colItem}>{PRODUCT_NAME}</Text>
            <Text style={styles.colQty}>{order.quantity}</Text>
            <Text style={styles.colUnit}>{yen(order.unitPrice)}</Text>
            <Text style={styles.colAmount}>{yen(order.quantity * order.unitPrice)}</Text>
          </View>
        </View>

        <View style={styles.summaryTable}>
          <View style={styles.summaryRow}>
            <Text>小計（税抜）</Text>
            <Text>{yen(order.subtotalExcludingTax)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>消費税（10%）</Text>
            <Text>{yen(order.taxAmount)}</Text>
          </View>
          <View style={styles.summaryRowFinal}>
            <Text style={{ fontWeight: "bold" }}>合計（税込）</Text>
            <Text style={{ fontWeight: "bold" }}>{yen(order.totalAmount)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>お振込先</Text>
          <View style={styles.bankBox}>
            <Text>
              {SELLER.bank.bankName} {SELLER.bank.branchName}　{SELLER.bank.accountType}　
              {SELLER.bank.accountNumber}
            </Text>
            <Text>{SELLER.bank.accountHolder}</Text>
          </View>
        </View>

        <View style={styles.noticeBox}>
          <Text style={styles.noticeText}>
            ※ お振込み確認後、製作に入ります。あらかじめご了承ください。
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>発行元</Text>
          <View style={styles.sellerBox}>
            <Text>{SELLER.name}</Text>
            <Text>
              {SELLER.postalCode} {SELLER.address}
            </Text>
            <Text>
              TEL：{SELLER.tel}　FAX：{SELLER.fax}
            </Text>
            <Text>担当：{SELLER.contact}</Text>
            <Text>登録番号：{SELLER.registrationNumber}</Text>
          </View>
        </View>

        <Text style={styles.footerNote}>
          この請求書は適格請求書等保存方式（インボイス制度）に対応しています。
        </Text>
      </Page>
    </Document>
  );
}
