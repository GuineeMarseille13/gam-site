import path from "node:path"

import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer"

import type { InvoiceDocument } from "@/app/(admin)/bureau/factures/_schemas/invoice.schema"

/** Même visuel que le site (`/images/gam-logo.png`) — chemin absolu pour @react-pdf en Node. */
const GAM_LOGO_ABSOLUTE_PATH = path.join(process.cwd(), "public", "images", "gam-logo.png")

/** A4 hauteur pt (@react-pdf) — zone utile = hauteur − padding × 2 (une seule page). */
const PAGE_PADDING_PT = 28
const A4_HEIGHT_PT = 841.89
const CONTENT_HEIGHT_PT = A4_HEIGHT_PT - PAGE_PADDING_PT * 2

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    padding: PAGE_PADDING_PT,
    color: "#18181b",
    flexDirection: "column",
    height: "100%",
  },
  /** Conteneur unique pour filigrane + colonne (superposition). */
  pageFrame: {
    position: "relative",
    width: "100%",
    height: CONTENT_HEIGHT_PT,
  },
  /** Filigrane centré, façon `BackgroundLogo` (gros logo, faible opacité). */
  logoWatermark: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  logoWatermarkImage: {
    width: "95%",
    opacity: 0.04,
    objectFit: "contain",
  },
  /** Hauteur fixe = une page : évite qu’un flex « pousse » le bas sur une 2ᵉ page. */
  pageColumn: {
    flexDirection: "column",
    position: "relative",
    height: CONTENT_HEIGHT_PT,
    maxHeight: CONTENT_HEIGHT_PT,
    width: "100%",
  },
  blockTop: {
    flexShrink: 0,
  },
  fillVertical: {
    flexGrow: 1,
    flexShrink: 1,
    minHeight: 0,
  },
  blockBottom: {
    flexShrink: 0,
  },
  brand: {
    fontSize: 8,
    letterSpacing: 1.5,
    color: "#b45309",
    marginBottom: 3,
    textTransform: "uppercase",
  },
  title: { fontSize: 15, marginBottom: 4, fontFamily: "Helvetica-Bold" },
  subtle: { fontSize: 8, color: "#71717a", marginBottom: 1 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 14 },
  box: {
    borderWidth: 1,
    borderColor: "#e4e4e7",
    padding: 8,
    width: 200,
  },
  boxTitle: {
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
    fontFamily: "Helvetica-Bold",
  },
  mono: { fontFamily: "Courier", fontSize: 8 },
  sectionTitle: { fontSize: 9, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#a1a1aa",
    paddingBottom: 4,
    marginTop: 8,
  },
  th: { fontSize: 8, color: "#52525b", fontFamily: "Helvetica-Bold", textTransform: "uppercase" },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
    paddingVertical: 5,
  },
  col1: { width: "46%" },
  colQ: { width: "12%", textAlign: "right" },
  colP: { width: "21%", textAlign: "right" },
  colT: { width: "21%", textAlign: "right", fontFamily: "Helvetica-Bold" },
  totals: { alignItems: "flex-end" },
  totalBand: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 200,
    backgroundColor: "#f4f4f5",
    padding: 8,
    marginTop: 4,
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },
  footer: { marginTop: 8, fontSize: 7.5, color: "#71717a", lineHeight: 1.35 },
})

function formatEur(n: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n)
}

function formatDateFr(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso))
}

interface InvoicePdfDocumentProps {
  readonly data: InvoiceDocument
}

/**
 * Document PDF (@react-pdf/renderer) — miroir fonctionnel de l’aperçu HTML.
 */
export function InvoicePdfDocument({ data }: InvoicePdfDocumentProps) {
  const issuedLabel = formatDateFr(data.issuedAtIso)

  return (
    <Document title={`Facture ${data.invoiceNumber}`} language="fr">
      <Page size="A4" style={styles.page}>
        <View style={styles.pageFrame}>
          <View style={styles.logoWatermark}>
            <Image src={GAM_LOGO_ABSOLUTE_PATH} style={styles.logoWatermarkImage} />
          </View>
          <View style={styles.pageColumn}>
            <View style={styles.blockTop}>
            <View style={styles.row}>
              <View style={{ maxWidth: 280 }}>
                <Text style={styles.title}>{data.issuer.legalName}</Text>
                {data.issuer.tagline ? (
                  <Text style={styles.subtle}>{data.issuer.tagline}</Text>
                ) : null}
                {data.issuer.addressLines.map((line) => (
                  <Text key={line} style={styles.subtle}>
                    {line}
                  </Text>
                ))}
                {data.issuer.email ? <Text style={styles.subtle}>{data.issuer.email}</Text> : null}
                {data.issuer.phone ? <Text style={styles.subtle}>{data.issuer.phone}</Text> : null}
              </View>
              <View style={styles.box}>
                <Text style={styles.boxTitle}>Facture</Text>
                <Text style={{ fontFamily: "Courier", fontSize: 11, marginBottom: 3 }}>
                  {data.invoiceNumber}
                </Text>
                <Text style={styles.subtle}>Émise le {issuedLabel}</Text>
                <Text style={styles.subtle}>Type : {data.paymentTypeLabel}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={{ maxWidth: 240 }}>
                <Text style={styles.sectionTitle}>Client</Text>
                <Text style={{ marginBottom: 4 }}>{data.customer.fullName}</Text>
                {data.customer.addressLines.map((line) => (
                  <Text key={line} style={styles.subtle}>
                    {line}
                  </Text>
                ))}
                {data.customer.email ? (
                  <Text style={styles.subtle}>{data.customer.email}</Text>
                ) : null}
                {data.customer.phone ? (
                  <Text style={styles.subtle}>{data.customer.phone}</Text>
                ) : null}
              </View>
              <View style={{ maxWidth: 220 }}>
                <Text style={styles.sectionTitle}>Paiement</Text>
                <Text style={styles.subtle}>Référence</Text>
                <Text style={[styles.mono, { marginBottom: 6 }]}>{data.paymentReference}</Text>
                <Text style={styles.subtle}>Mode : {data.paymentMethodLabel}</Text>
              </View>
            </View>

            <View style={styles.tableHeader}>
              <Text style={[styles.th, styles.col1]}>Désignation</Text>
              <Text style={[styles.th, styles.colQ]}>Qté</Text>
              <Text style={[styles.th, styles.colP]}>P.U.</Text>
              <Text style={[styles.th, styles.colT]}>Montant</Text>
            </View>
            {data.lines.map((line, index) => (
              <View key={`${line.label}-${String(index)}`} style={styles.tableRow}>
                <View style={styles.col1}>
                  <Text>{line.label}</Text>
                </View>
                <Text style={styles.colQ}>{line.quantity}</Text>
                <Text style={styles.colP}>{formatEur(line.unitAmountEur)}</Text>
                <Text style={styles.colT}>{formatEur(line.totalAmountEur)}</Text>
              </View>
            ))}
            </View>

            <View style={styles.fillVertical} />

            <View style={styles.blockBottom}>
              <View style={styles.totals}>
                <View style={styles.totalBand}>
                  <Text>Total</Text>
                  <Text>{formatEur(data.totalEur)}</Text>
                </View>
              </View>

              <View style={styles.footer}>
                {data.legalFooterLines.map((line) => (
                  <Text key={line} style={{ marginBottom: 2 }}>
                    {line}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
