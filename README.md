<div align="center">

# 🛒 CartPulse
### eCommerce Behavioral Analytics Dashboard

Behavioral analytics platform built using the Kaggle Multi-Category eCommerce Dataset (285M+ events).  
Python analysis pipeline · React dashboard · Firebase Auth + Firestore · Live CSV recomputation.

<br/>

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://reactjs.org)
[![Firebase](https://img.shields.io/badge/Firebase-Auth+Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Netlify](https://img.shields.io/badge/Live-Demo-00C7B7?style=flat-square&logo=netlify&logoColor=white)](https://cartpulseecomm.netlify.app/)
[![Recharts](https://img.shields.io/badge/Charts-Recharts-8884d8)](https://recharts.org/)
[![Kaggle](https://img.shields.io/badge/Dataset-Kaggle-20BEFF?logo=kaggle&logoColor=white)](https://www.kaggle.com/datasets/mkechinov/ecommerce-behavior-data-from-multi-category-store)

<br/>

<p align="center">
<a href="https://cartpulseecomm.netlify.app/">
  <img src="https://img.shields.io/badge/🌐_Live_Demo-Open_App-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" />
</a>
<a href="https://github.com/nikitasharma1203/ecommerce-funnel-retention-dashboard">
  <img src="https://img.shields.io/badge/📂_GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white" />
</a>
</p>

</div>

---

## 📌 Project Overview

CartPulse is a full-stack eCommerce behavioral analytics dashboard built on Kaggle's Multi-Category Store dataset containing over **285M+ user interaction events**.

The project combines large-scale Python data analysis with an interactive React dashboard, bridging the gap between raw behavioral event analysis and an accessible BI-style analytics platform for non-technical stakeholders.

Users can sign in, upload their own CSV files, and watch every KPI card, chart, and funnel update instantly — with results saved to their account so they persist across sessions.

---

## ✅ Fully Implemented Features

- Python analysis pipeline on real Kaggle eCommerce data (285M+ events)
- Funnel analysis, cohort retention, RFM segmentation in Python notebook
- Interactive React dashboard with 13 analytics pages
- **Live CSV upload pipeline** — dashboard recomputes instantly on upload
- **Firebase Authentication** — email/password login and signup
- **Firestore persistence** — KPI snapshots, dataset history, and dashboard state saved per user and restored on next login
- Composite Firestore indexes configured for performant multi-field queries
- Client-side PDF export of full analytics report
- Responsive design with dark/light theme toggle
- Demo account — full dashboard access without any setup
- Defensive data handling — charts show empty states instead of crashing on partial CSV data

---

## ⚠️ Demo / Precomputed Components

Several dashboard modules recompute dynamically after CSV upload, including:

- KPI cards (Revenue, Orders, AOV, CVR, Cart Abandonment)
- Revenue trend chart
- Funnel analytics (all 5 stages)
- Conversion metrics
- Hourly activity patterns
- Device breakdown
- Cart abandonment by source/device

Some advanced sections use precomputed demo datasets for frontend display:

- Geographic analytics
- Cohort heatmap
- RFM segment revenue breakdown
- AI insight examples

The underlying analytical logic exists in the Python notebook. Selected frontend sections use lightweight precomputed outputs to keep deployment performant on Netlify's free tier without a backend server.

---

## 🏗 Architecture

```text
Kaggle Dataset (5.8GB CSV)
        ↓
Python Analysis Pipeline
(Pandas · NumPy · Matplotlib · Seaborn)
        ↓
Derived KPIs, Cohort Matrix, RFM Segments
        ↓
React Dashboard (Netlify)
        ↓
Firebase Auth  ←→  Firestore (KPI snapshots · dataset records · dashboard state)
        ↓
CSV Upload → PapaParse → Live KPI Recomputation → Context API → All pages update
        ↓
Interactive Charts · Filters · PDF Export
```

### What happens when you upload a CSV

```text
1. PapaParse reads the file in-browser (~instant)
2. KPIs computed: Revenue, Orders, AOV, CVR, Cart Abandonment
3. Daily series, funnel steps, hourly activity rebuilt from event_time
4. All dashboard pages update immediately via DataContext
5. If logged in (not demo):
   → Dataset metadata saved to Firestore (datasets collection)
   → KPI snapshot saved to Firestore (kpi_results collection)
   → Dashboard state saved (dashboard_states collection)
   → Reload the app next week — your data is still there
```

All CSV processing is **client-side only**. No uploaded data is ever sent to an external server.

---

## 📊 Dataset

**[eCommerce Behavior Data from Multi-Category Store](https://www.kaggle.com/datasets/mkechinov/ecommerce-behavior-data-from-multi-category-store)**

| Property | Value |
|---|---|
| Dataset Size | ~285M behavioral events |
| Unique Users | ~1.4M |
| Time Period | Oct 2019 – Apr 2020 |
| File Used | `2019-Oct.csv` |
| File Size | ~5.8GB |
| Event Types | view, cart, remove_from_cart, purchase |

---

## 📐 Analytical Methods

| Analysis | Method |
|---|---|
| Funnel Analysis | Event-stage conversion tracking |
| Cohort Retention | Weekly cohort matrix (12 cohorts × 9 week offsets) |
| RFM Segmentation | Quintile-based R/F/M scoring |
| Revenue Trends | Rolling window aggregation |
| Conversion Analysis | Session-level CVR computation |
| User Engagement | DAU / WAU / MAU metrics |
| Time Pattern Analysis | Hourly + weekday behavior heatmaps |
| Category Performance | Category-level conversion comparison |

---

## 🎯 Key Metrics From Analysis

Computed from `2019-Oct.csv`:

| KPI | Value |
|---|---|
| Total Events | 285M+ |
| Unique Users | ~1.4M |
| Overall Conversion Rate | ~0.19% |
| View → Cart Rate | ~4.7% |
| Cart → Purchase Rate | ~31% |
| Average Order Value | ~$289 |
| Repeat Purchase Rate | ~8–10% |
| Bounce Rate | ~72% |
| Peak Traffic Hours | 19:00–21:00 UTC |
| W+1 Cohort Retention | ~18% |

---

## 🖥 Dashboard Modules

| Module | Live CSV Data | Description |
|---|---|---|
| Overview | ✅ | KPI cards, revenue trend, device pie, source bar, RFM tiles |
| Revenue | ✅ | Stacked category bars, 90-day trend, category CVR |
| Conversion | ✅ | Daily CVR, by-source, by-device breakdowns |
| Retention | — | KPI cards + cohort heatmap link |
| Active Users | ✅ | DAU/WAU/MAU, hourly pattern, day-of-week activity |
| Returning Customers | ✅ | Return rate, LTV, New vs Returning stacked bar |
| Funnel Analytics | ✅ | Animated 5-step funnel, drop-off %, device/source abandonment |
| Cohort Analysis | — | 12×9 retention heatmap + cohort curves |
| RFM Segments | — | Champion/Loyal/Promising/At-Risk/Lost breakdown |
| Geographic | — | Revenue, CVR, users by country (precomputed) |
| AI Insights | ✅ | Rule-based insights updated with real cart abandonment % |
| Story & Insights | — | Findings, recommendations, priority matrix |
| My Datasets | ✅ | All past uploads, reload any previous analysis, KPI history table |
| CSV Upload | ✅ | Drag-drop upload, live preview, instant dashboard recomputation |

---

## 🔥 Firebase Setup

The project uses **Firebase Authentication** and **Firestore** (no Storage — not required).

### Services used (both on free Spark plan)
- **Authentication** — Email/Password sign-in
- **Firestore** — KPI snapshots, dataset records, dashboard state

### Firestore collections

| Collection | What's stored |
|---|---|
| `datasets` | Upload metadata: fileName, fileType, rowCount, status, uploadedAt |
| `kpi_results` | Computed KPIs + funnel steps per dataset |
| `dashboard_states` | Last active dataset + KPI state per user |
| `saved_reports` | User-saved PDF report metadata |

### Composite indexes (required — already configured)

Firestore requires composite indexes for queries that filter and sort on multiple fields. These are configured in the Firebase Console for this project:

| Collection | Field 1 | Field 2 | Purpose |
|---|---|---|---|
| `datasets` | `userId` (Asc) | `uploadedAt` (Desc) | List user's datasets newest-first |
| `kpi_results` | `userId` (Asc) | `computedAt` (Desc) | KPI history newest-first |
| `saved_reports` | `userId` (Asc) | `createdAt` (Desc) | Reports newest-first |

> **If you fork and set up your own Firebase project:** Firestore will show an error on first upload with a direct link to auto-create these indexes. Click the link, wait ~2 minutes for each index to build, then re-upload. Alternatively create them manually under Firestore → Indexes → Composite.

### Firestore security rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{collection}/{doc} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.userId;
    }
    match /dashboard_states/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

---

## ⚙️ Engineering Highlights

- Centralized state management via DataContext — single `uploadCSV()` function updates all 13 pages simultaneously
- Defensive data guards on all chart components — `Number()` coercion, `Array.isArray()` checks, empty-state messages instead of blank screens
- Firestore persistence layer — KPI snapshots survive browser refresh and re-login
- Composite Firestore indexes for performant multi-field queries at scale
- PapaParse streaming for client-side CSV parsing without blocking the UI
- ProcessingBanner component — floating progress indicator shown across all pages during upload
- `dataHelpers.js` utility — `safeChartData`, `safeSlice`, `safeArray` guards prevent Recharts crashes on malformed data
- Firebase Auth context with demo mode — full dashboard without any Firebase config
- jsPDF + autoTable for client-side PDF report generation

---

## 📁 Repository Structure

```text
frontend/
├── src/
│   ├── components/
│   │   ├── auth/          AuthPage
│   │   ├── dashboard/     Topbar · Sidebar · FiltersBar · KPICard
│   │   │                  OverviewPage · OtherPages · ProcessingBanner
│   │   ├── funnel/        FunnelPage
│   │   ├── cohort/        CohortPage
│   │   ├── ai/            AIPage
│   │   ├── upload/        UploadPage
│   │   ├── datasets/      DatasetsPage
│   │   └── story/         StoryPage
│   ├── hooks/
│   │   ├── useAuth.js     Firebase Auth context + demo login
│   │   └── useData.js     Global DataContext — single source of truth
│   ├── services/
│   │   ├── storageService.js   Firestore CRUD (datasets, KPIs, state)
│   │   └── apiService.js       FastAPI client (optional backend)
│   ├── utils/
│   │   ├── csvParser.js        PapaParse + KPI derivation
│   │   ├── dataHelpers.js      Chart safety guards
│   │   └── pdfExport.js        jsPDF report generator
│   ├── data/
│   │   └── mockData.js         Demo data for unauthenticated users
│   ├── App.jsx
│   ├── firebase.js
│   └── index.css
├── public/
├── netlify.toml
├── .env.example
└── package.json

ecommerce_funnel_analysis.ipynb     ← Full Python analysis notebook
```

---

## 📂 CSV Upload Format

Compatible with the Kaggle eCommerce Behavior Dataset schema:

```text
event_time, event_type, product_id, category_id,
category_code, brand, price, user_id, user_session
```

What updates live after upload:

| Updates | Source field |
|---|---|
| Revenue, Orders, AOV | price + event_type=purchase |
| CVR, Cart Abandonment | event_type counts |
| Daily Revenue Chart | event_time (date grouping) |
| Purchase Funnel | event_type stage counts |
| Hourly Activity | event_time (hour extraction) |
| Device Breakdown | device column (if present) |
| Category CVR | category_code column (if present) |

---

## ⚡ Quick Start

### 1. Clone and install

```bash
git clone https://github.com/nikitasharma1203/ecommerce-funnel-retention-dashboard.git
cd ecommerce-funnel-retention-dashboard/frontend
npm install
```

### 2. Run without Firebase (demo mode)

```bash
npm start
# → http://localhost:3000
# Click "⚡ Demo Account" — no setup needed
```

### 3. Enable Firebase (for real login + data persistence)

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

> Note: `STORAGE_BUCKET` is not required — this project uses Firestore only, not Firebase Storage.

Then restart `npm start`. Sign up with any email to get persistent data saving.

### 4. Deploy to Netlify

```bash
npm run build
# Drag the /build folder to app.netlify.com/drop
```

Or connect a GitHub repo on Netlify with:
- Build command: `npm run build`
- Publish directory: `build`
- Add all `REACT_APP_FIREBASE_*` environment variables in Netlify dashboard

---

## ⚠️ Current Limitations

- Full 5.8GB Kaggle dataset cannot be processed entirely in-browser — use a sample CSV (first 100K rows work well)
- Geographic analytics, cohort heatmap, and RFM widgets use precomputed demo data
- Very large CSV uploads (>50MB) may slow down browser parsing
- Firestore composite indexes must be created manually if setting up a new Firebase project (error message provides the direct creation link)

---

## 🚀 Future Improvements

- FastAPI backend for server-side Pandas processing of large files
- DuckDB / ClickHouse analytical engine for sub-second queries on full dataset
- Real-time event streaming pipeline
- Dynamic cohort and RFM recomputation from uploaded data
- Gemini / OpenAI integration for natural-language insight generation
- Role-based dashboard access control
- Scheduled PDF report exports
- Advanced product recommendation engine

---

## 🤖 AI Insights

The dashboard includes a rule-based insight engine derived from computed KPI thresholds and behavioral patterns. When a CSV is uploaded, the cart abandonment percentage updates the relevant insight automatically.

Example insights generated:
- Mobile cart abandonment higher than desktop average
- High-value customer segments driving majority of revenue
- Time windows with peak abandonment rates
- Declining category conversion trend detection

Optional Gemini API integration can be enabled via `REACT_APP_GEMINI_API_KEY` in environment variables.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 |
| Charts | Recharts 2 |
| Authentication | Firebase Auth (Spark — free) |
| Database | Firestore (Spark — free) |
| CSV Parsing | PapaParse |
| PDF Export | jsPDF + jspdf-autotable |
| Hosting | Netlify (free tier) |
| Python Analysis | Pandas · NumPy · Matplotlib · Seaborn |
| Date Utilities | date-fns |

---

## 👩‍💻 Author

**Nikita Sharma**  

GitHub: [nikitasharma1203](https://github.com/nikitasharma1203)  
Repository: [ecommerce-funnel-retention-dashboard](https://github.com/nikitasharma1203/ecommerce-funnel-retention-dashboard)

---

## 📄 License

This project is for academic and portfolio purposes. Dataset usage is subject to [Kaggle's terms of use](https://www.kaggle.com/datasets/mkechinov/ecommerce-behavior-data-from-multi-category-store).

---

<div align="center">
CartPulse · DA-IICT · eCommerce Behavioral Analytics Portfolio
</div>