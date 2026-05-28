# CartPulse
### eCommerce Behavioral Analytics & Retention Intelligence Platform

[![Live Demo](https://img.shields.io/badge/Live-Demo-00C7B7?style=flat-square&logo=netlify)](https://cartpulseecomm.netlify.app/)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=flat-square&logo=react)](https://reactjs.org)
[![Firebase](https://img.shields.io/badge/Auth-Firebase-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Kaggle](https://img.shields.io/badge/Dataset-285M_Events-20BEFF?style=flat-square&logo=kaggle)](https://www.kaggle.com/datasets/mkechinov/ecommerce-behavior-data-from-multi-category-store)

Customer retention intelligence platform built on a 285M-event eCommerce dataset. Python analysis pipeline for cohort retention, RFM segmentation, and CLV modelling — surfaced through a full-stack React dashboard with live CSV recomputation and Firebase-backed persistence.

---

## Key Metrics (from 2019-Oct.csv analysis)

| KPI | Value |
|---|---|
| Dataset scale | 285M+ behavioral events |
| Unique users | ~1.4M |
| Overall conversion rate | 0.19% |
| View → Cart rate | 4.7% |
| Cart → Purchase rate | 31% |
| Average order value | $289 |
| W+1 cohort retention | ~18% |
| Repeat purchase rate | 8–10% |
| Peak traffic | 19:00–21:00 UTC |

---

## What This Solves

eCommerce retention analytics requires connecting three analytical layers that are typically siloed: funnel diagnostics (where users drop off), cohort analysis (whether retention is improving over time), and value segmentation (which customers are worth retaining). CartPulse integrates all three into a single platform with the addition of a live upload pipeline — any compatible event dataset can be analysed without code.

---

## Analytics Pipeline

The Python notebook processes the full 285M-event dataset through four analytical stages:

**Funnel Analysis**
Event-stage conversion tracking across view → cart → purchase. The 4.7% view-to-cart rate with 31% cart-to-purchase rate identifies cart abandonment as the primary conversion lever — 69% of users who add to cart do not complete purchase.

**Cohort Retention**
Weekly cohort matrix (12 cohorts × 9-week offsets). W+1 retention of 18% benchmarks against eCommerce industry average of 20–25%, indicating moderate churn pressure in the first return window.

**RFM Segmentation**
Quintile-based Recency, Frequency, Monetary scoring segments 1.4M users into Champion, Loyal, Promising, At-Risk, and Lost tiers. The segmentation drives retention spend prioritisation — Champions and Loyals represent the majority of LTV despite being a minority of the user base.

**CLV Modelling**
Customer lifetime value estimation with value-tier segmentation, surfacing at-risk revenue concentration and informing intervention prioritisation.

---

## Live CSV Pipeline

The React dashboard recomputes all core KPIs and charts client-side on CSV upload via PapaParse — no backend required. Compatible with the Kaggle eCommerce Behavior Dataset schema:

```
event_time, event_type, product_id, category_id,
category_code, brand, price, user_id, user_session
```

**What updates immediately on upload:**
- Revenue, Orders, AOV (from `price` + `event_type=purchase`)
- Conversion rate and cart abandonment (from event type counts)
- Daily revenue trend (from `event_time` date grouping)
- Full 5-step purchase funnel
- Hourly activity patterns (from `event_time` hour extraction)

All CSV processing is client-side. No uploaded data is sent to any server.

---

## Architecture

```
Kaggle Dataset (285M events · 5.8GB)
        ↓
Python Analysis Pipeline
(Pandas · NumPy · Matplotlib · Seaborn)
        ↓
Cohort Matrix · RFM Segments · CLV Estimates · Funnel KPIs
        ↓
React Dashboard (Netlify)
        ↓
Firebase Auth  ←→  Firestore (KPI snapshots · dataset history · session state)
        ↓
CSV Upload → PapaParse → Live KPI Recomputation → DataContext → All pages update
        ↓
Interactive Charts · Filters · Client-side PDF Export
```

---

## Dashboard Modules

| Module | Description |
|---|---|
| Overview | KPI cards, revenue trend, device breakdown, RFM summary |
| Revenue | Category revenue, 90-day trend, category conversion rates |
| Conversion | Daily CVR, by-source and by-device breakdowns |
| Active Users | DAU/WAU/MAU, hourly activity patterns, day-of-week heatmap |
| Funnel Analytics | Animated 5-step funnel with drop-off percentages |
| Cohort Analysis | 12×9 retention heatmap and cohort retention curves |
| RFM Segments | Champion/Loyal/Promising/At-Risk/Lost value breakdown |
| Returning Customers | Return rate, LTV, new vs returning customer trends |
| AI Insights | Rule-based insight engine — updates on upload |
| My Datasets | Upload history, KPI snapshots, dataset reload |

---

## Engineering Highlights

**State management:** Centralised DataContext — a single `uploadCSV()` function triggers recomputation across all 13 dashboard pages simultaneously.

**Defensive data handling:** All chart components implement `safeChartData`, `safeArray`, and `safeSlice` guards via `dataHelpers.js` — malformed or partial CSVs produce empty states rather than crashes.

**Persistence:** Firestore saves KPI snapshots, dataset metadata, and dashboard state per user. Re-login after a week and the previous analysis is still there.

**PDF export:** Client-side report generation via jsPDF + autoTable — no server round-trip required.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Recharts, Tailwind CSS |
| CSV Parsing | PapaParse |
| Authentication | Firebase Auth |
| Persistence | Firestore |
| PDF Export | jsPDF + jspdf-autotable |
| Python Analysis | Pandas, NumPy, Matplotlib, Seaborn |
| Deployment | Netlify |

---

## Repository Structure

```
frontend/
├── src/
│   ├── components/        Dashboard pages and UI components
│   ├── hooks/
│   │   ├── useAuth.js     Firebase Auth context + demo mode
│   │   └── useData.js     Global DataContext — single source of truth
│   ├── services/
│   │   └── storageService.js   Firestore CRUD layer
│   ├── utils/
│   │   ├── csvParser.js        PapaParse + KPI derivation logic
│   │   ├── dataHelpers.js      Chart safety guards
│   │   └── pdfExport.js        Report generator
│   └── App.jsx
└── package.json

ecommerce_funnel_analysis.ipynb     Full Python analysis notebook
```

---

## Quick Start

```bash
# Clone and install
git clone https://github.com/nikitasharma1203/ecommerce-funnel-retention-dashboard.git
cd ecommerce-funnel-retention-dashboard/frontend
npm install

# Run in demo mode (no Firebase config needed)
npm start
# → Click "Demo Account" for full dashboard access

# Enable persistent login (optional)
cp .env.example .env.local
# Add REACT_APP_FIREBASE_* keys
npm start
```

---

*Built as part of an M.Sc. Data Science portfolio — DA-IICT Gandhinagar*
