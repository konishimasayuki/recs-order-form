// 注意：このファイルが生成するPDFは社内向けの非公開請求書です。
// メール添付以外の用途（Web画面表示・APIレスポンスへの含有）で絶対に使用しないこと。

import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import "./pdf-fonts";
import { OtohaInvoiceCalculated, OTOHA_ISSUER, SELLER } from "./types";

const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoSansJP",
    fontSize: 10,
    padding: 40,
    color: "#1a1a1a"
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 22,
    letterSpacing: 8,
    color: "#2f6fb0"
  },
  issueDateRow: {
    alignItems: "flex-end",
    marginBottom: 18
  },
  issueDateText: {
    fontSize: 10,
    borderBottom: "1pt solid #333",
    paddingBottom: 3
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18
  },
  billToCol: {
    width: "48%"
  },
  billTo: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 20
  },
  greeting: {
    fontSize: 9.5,
    lineHeight: 1.8,
    color: "#333"
  },
  issuerCol: {
    width: "50%"
  },
  issuerName: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "right"
  },
  issuerLabel: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 2,
    textAlign: "right"
  },
  issuerAddress: {
    fontSize: 9,
    marginBottom: 2,
    textAlign: "right"
  },
  bankTable: {
    marginTop: 10,
    border: "1pt solid #999"
  },
  bankRow: {
    flexDirection: "row",
    borderBottom: "1pt solid #999"
  },
  bankRowLast: {
    flexDirection: "row"
  },
  bankLabel: {
    width: "32%",
    backgroundColor: "#eef1f5",
    fontWeight: "bold",
    fontSize: 9,
    padding: 6,
    borderRight: "1pt solid #999"
  },
  bankValue: {
    width: "68%",
    fontSize: 9,
    padding: 6
  },
  table: {
    marginTop: 24,
    border: "1pt solid #333"
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#c9d6e8",
    borderBottom: "1pt solid #333"
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1pt solid #ccc",
    minHeight: 22
  },
  colDate: { width: "34%", padding: 6, borderRight: "1pt solid #ccc", fontWeight: "bold" },
  colSubtotal: { width: "22%", padding: 6, textAlign: "right", borderRight: "1pt solid #ccc" },
  colTax: { width: "22%", padding: 6, textAlign: "right", borderRight: "1pt solid #ccc" },
  colTotal: { width: "22%", padding: 6, textAlign: "right" },
  headerCell: { fontSize: 9, fontWeight: "bold", textAlign: "center" },
  summaryBlock: {
    alignSelf: "flex-end",
    width: "44%",
    marginTop: -1
  },
  summaryRow: {
    flexDirection: "row",
    borderBottom: "1pt solid #ccc",
    borderLeft: "1pt solid #333",
    borderRight: "1pt solid #333"
  },
  summaryRowLast: {
    flexDirection: "row",
    borderBottom: "1pt solid #333",
    borderLeft: "1pt solid #333",
    borderRight: "1pt solid #333"
  },
  summaryLabel: {
    width: "50%",
    backgroundColor: "#c9d6e8",
    fontSize: 9,
    fontWeight: "bold",
    padding: 6,
    borderRight: "1pt solid #333"
  },
  summaryValue: {
    width: "50%",
    fontSize: 10,
    padding: 6,
    textAlign: "right"
  },
  noteBox: {
    marginTop: 40,
    border: "1pt solid #999",
    minHeight: 70,
    padding: 8
  },
  ijou: {
    marginTop: 8,
    textAlign: "right",
    fontSize: 10
  },
  confidential: {
    marginTop: 30,
    fontSize: 8,
    color: "#999",
    textAlign: "center"
  }
});

function yen(n: number): string {
  return n.toLocaleString("ja-JP");
}

export function OtohaInvoiceDocument({ invoice }: { invoice: OtohaInvoiceCalculated }) {
  const itemLabel = `Recsデバイス　部品代（${invoice.quantity}台）`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>請　求　書</Text>

        <View style={styles.issueDateRow}>
          <Text style={styles.issueDateText}>発行日　{invoice.issueDateWareki}</Text>
        </View>

        <View style={styles.headerRow}>
          <View style={styles.billToCol}>
            <Text style={styles.billTo}>{SELLER.name}　様</Text>
            <Text style={styles.greeting}>
              毎度ありがとうございます。{"\n"}下記の通りご請求申し上げます。
            </Text>
          </View>

          <View style={styles.issuerCol}>
            <Text style={styles.issuerName}>{OTOHA_ISSUER.name}</Text>
            <Text style={styles.issuerLabel}>【本社】</Text>
            <Text style={styles.issuerAddress}>
              {OTOHA_ISSUER.postalCode} {OTOHA_ISSUER.address}
            </Text>
            <Text style={styles.issuerAddress}>TEL：{OTOHA_ISSUER.tel}</Text>

            <View style={styles.bankTable}>
              <View style={styles.bankRow}>
                <Text style={styles.bankLabel}>取引銀行</Text>
                <Text style={styles.bankValue}>{OTOHA_ISSUER.bank.bankName}</Text>
              </View>
              <View style={styles.bankRow}>
                <Text style={styles.bankLabel}>口座番号</Text>
                <Text style={styles.bankValue}>
                  {OTOHA_ISSUER.bank.branchName}　{OTOHA_ISSUER.bank.accountType}
                  {OTOHA_ISSUER.bank.accountNumber}
                </Text>
              </View>
              <View style={styles.bankRowLast}>
                <Text style={styles.bankLabel}>口座名</Text>
                <Text style={styles.bankValue}>{OTOHA_ISSUER.bank.accountHolder}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.colDate, styles.headerCell, { borderRight: "1pt solid #333" }]}>
              伝票日付
            </Text>
            <Text style={[styles.colSubtotal, styles.headerCell, { borderRight: "1pt solid #333" }]}>
              金額（税抜）
            </Text>
            <Text style={[styles.colTax, styles.headerCell, { borderRight: "1pt solid #333" }]}>
              消費税
            </Text>
            <Text style={[styles.colTotal, styles.headerCell]}>金額（税込）</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.colDate}>{itemLabel}</Text>
            <Text style={styles.colSubtotal}>{yen(invoice.subtotalExcludingTax)}</Text>
            <Text style={styles.colTax}>{yen(invoice.taxAmount)}</Text>
            <Text style={styles.colTotal}>{yen(invoice.totalAmount)}</Text>
          </View>
        </View>

        <View style={styles.summaryBlock}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>金額（税抜）</Text>
            <Text style={styles.summaryValue}>{yen(invoice.subtotalExcludingTax)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>消費税</Text>
            <Text style={styles.summaryValue}>{yen(invoice.taxAmount)}</Text>
          </View>
          <View style={styles.summaryRowLast}>
            <Text style={styles.summaryLabel}>合計</Text>
            <Text style={styles.summaryValue}>{yen(invoice.totalAmount)}</Text>
          </View>
        </View>

        <View style={styles.noteBox} />
        <Text style={styles.ijou}>以上</Text>

        <Text style={styles.confidential}>
          ※ この請求書は社内関係者限りの資料です。第三者への転送・Webでの公開はしないでください。
        </Text>
      </Page>
    </Document>
  );
}
