import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generatePDFReport(kpis, insights, userName = "Demo User") {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const now = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  // ── Header ──────────────────────────────────────────────────────────────────
  doc.setFillColor(99, 102, 241);
  doc.rect(0, 0, pageW, 28, "F");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("CartPulse", 14, 12);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("eCommerce Analytics Report", 14, 20);
  doc.text(`Generated: ${now}  |  User: ${userName}`, pageW - 14, 20, { align: "right" });

  // ── KPI Summary ─────────────────────────────────────────────────────────────
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Executive KPI Summary", 14, 40);

  autoTable(doc, {
    startY: 44,
    head: [["Metric", "Value", "Change", "Status"]],
    body: [
      ["Total Revenue",       "$4.21M",  "+12.4%", "▲ Above target"],
      ["Total Users",         "2.84M",   "+8.1%",  "▲ Growing"],
      ["Conversion Rate",     "3.8%",    "−0.4%",  "▼ Monitor"],
      ["Cart Abandonment",    "68.4%",   "−2.1%",  "▼ Improving"],
      ["Avg Order Value",     "$86.20",  "+3.2%",  "▲ Good"],
      ["W+1 Retention",       "18.3%",   "+1.8%",  "▲ Improving"],
      ["DAU",                 "94.2K",   "+3.1%",  "▲ Growing"],
      ["Return Customer Rate","34.8%",   "+2.3%",  "▲ Growing"],
    ],
    headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: "bold", fontSize: 10 },
    bodyStyles: { fontSize: 9, textColor: [15, 23, 42] },
    alternateRowStyles: { fillColor: [240, 244, 255] },
    columnStyles: { 3: { textColor: [16, 185, 129] } },
    margin: { left: 14, right: 14 },
  });

  // ── Funnel Summary ──────────────────────────────────────────────────────────
  const y1 = doc.lastAutoTable.finalY + 12;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Purchase Funnel Overview", 14, y1);

  autoTable(doc, {
    startY: y1 + 4,
    head: [["Stage", "Users", "Drop-off %", "CVR from Top"]],
    body: [
      ["Visit",        "2,840,000", "—",     "100%"],
      ["Product View", "2,056,960", "−27.6%","72.4%"],
      ["Add to Cart",  "249,092",   "−87.9%","8.8%"],
      ["Checkout",     "114,085",   "−54.2%","4.0%"],
      ["Purchase",     "78,718",    "−31.0%","2.8%"],
    ],
    headStyles: { fillColor: [139, 92, 246], textColor: 255, fontStyle: "bold", fontSize: 10 },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [245, 243, 255] },
    margin: { left: 14, right: 14 },
  });

  // ── AI Insights ─────────────────────────────────────────────────────────────
  const y2 = doc.lastAutoTable.finalY + 12;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("AI-Generated Insights", 14, y2);

  const insightRows = (insights || []).slice(0, 6).map((ins) => [
    ins.title || ins.tag,
    (ins.text || "").slice(0, 90) + "...",
    ins.impact || "—",
  ]);

  autoTable(doc, {
    startY: y2 + 4,
    head: [["Insight", "Detail", "Est. Impact"]],
    body: insightRows.length ? insightRows : [["No insights", "—", "—"]],
    headStyles: { fillColor: [6, 182, 212], textColor: 255, fontStyle: "bold", fontSize: 10 },
    bodyStyles: { fontSize: 8, cellPadding: 3 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 45 }, 2: { cellWidth: 30 } },
    alternateRowStyles: { fillColor: [240, 253, 255] },
    margin: { left: 14, right: 14 },
  });

  // ── Recommendations ─────────────────────────────────────────────────────────
  const y3 = doc.lastAutoTable.finalY + 12;
  if (y3 < 250) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Top Business Recommendations", 14, y3);

    autoTable(doc, {
      startY: y3 + 4,
      head: [["Priority", "Action", "Est. Revenue Impact"]],
      body: [
        ["1 — High",   "Mobile 1-click checkout + Apple/Google Pay",         "+$480K/year"],
        ["2 — High",   "Week-1 churn reduction email drip (3-email sequence)","+$320K/year"],
        ["3 — High",   "Increase Instagram ad spend (best LTV cohort)",       "+$210K/year"],
        ["4 — Medium", "Champion VIP loyalty program",                        "+$150K/year"],
        ["5 — Medium", "Electronics cross-sell recommendation engine",        "+$95K/year"],
      ],
      headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: "bold", fontSize: 10 },
      bodyStyles: { fontSize: 9 },
      columnStyles: { 2: { textColor: [16, 185, 129], fontStyle: "bold" } },
      alternateRowStyles: { fillColor: [240, 255, 249] },
      margin: { left: 14, right: 14 },
    });
  }

  // ── Footer ──────────────────────────────────────────────────────────────────
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `CartPulse Analytics  |  Page ${i} of ${pageCount}  |  Confidential`,
      pageW / 2, 290, { align: "center" }
    );
  }

  doc.save(`CartPulse_Report_${now.replace(/\s/g, "_")}.pdf`);
}
