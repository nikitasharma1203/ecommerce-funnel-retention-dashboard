# 🛒 CartPulse — eCommerce Behavioral Analytics Dashboard

> Full-stack analytics dashboard built for the **Nikita Sharma / ecommerce-funnel-retention-dashboard** dataset.
> Firebase Auth · React 18 · Recharts · Netlify · CSV Upload · PDF Export · AI Insights

---

## ✨ Features

| Section | What it shows |
|---|---|
| **Overview** | 8 animated KPIs, revenue trend, device pie, source bar, RFM segments |
| **Revenue** | Stacked category bars, 90-day trend, rolling avg, category CVR |
| **Conversion** | Daily CVR, by-source, by-device breakdowns |
| **Retention** | KPIs + link to cohort heatmap |
| **Active Users** | DAU/WAU/MAU, hourly heatmap, day-of-week activity |
| **Returning Customers** | Return rate, LTV, New vs Returning stacked bar |
| **Funnel Analytics** | Animated visual funnel, drop-off %, device & source abandon rates |
| **AI Insights** | 8 rule-based insights with icon, impact, action — filterable by type |
| **Cohort Analysis** | 12×9 colour heatmap, retention curves, avg-by-offset bar |
| **RFM Segments** | Champion / Loyal / Promising / At Risk / Lost — counts + revenue |
| **Geographic** | Revenue, CVR, users by country (Top 10) |
| **Story & Insights** | Key findings, prioritised recommendations, growth opportunities, matrix |
| **CSV Upload** | Drag-and-drop orders/events/customers CSVs → live KPI derivation |

---

## 🚀 Quick Start (Local)

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/cartpulse.git
cd cartpulse

# 2. Install
npm install

# 3. Set up environment variables
cp .env.example .env.local
# → Edit .env.local with your Firebase credentials (see below)

# 4. Run
npm start
# Opens http://localhost:3000
```

> **No Firebase config yet?** Use the **Demo Account** button — it bypasses Firebase entirely with local state.

---

## 🔥 Firebase Setup (Free Spark Plan)

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. **Create a project** → name it `cartpulse` (or anything)
3. **Add a Web App** → copy the `firebaseConfig` object
4. Enable **Authentication** → Sign-in methods → Email/Password ✓
5. Fill in `.env.local`:

```env
REACT_APP_FIREBASE_API_KEY=AIza...
REACT_APP_FIREBASE_AUTH_DOMAIN=cartpulse-xxx.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=cartpulse-xxx
REACT_APP_FIREBASE_STORAGE_BUCKET=cartpulse-xxx.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc...
```

Firebase Authentication is **free forever** on the Spark plan (up to 10K users/month).

---

## 🌐 Netlify Deployment

### Option A — Netlify CLI (fastest)

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=build
```

### Option B — GitHub + Netlify UI

1. Push this repo to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import from Git**
3. Build settings (auto-detected from `netlify.toml`):
   - **Build command:** `npm run build`
   - **Publish directory:** `build`
4. **Environment variables** → add all `REACT_APP_FIREBASE_*` keys from your `.env.local`
5. Click **Deploy site** ✓

### Option C — Drag and Drop

```bash
npm run build
# Drag the /build folder onto app.netlify.com/drop
```

---

## 📊 CSV Upload Format

Compatible with the [Kaggle eCommerce Behavior Dataset](https://www.kaggle.com/datasets/mkechinov/ecommerce-behavior-data-from-multi-category-store):

**orders.csv / events.csv**
```
event_time, event_type, product_id, category_id, category_code, brand, price, user_id, user_session
```

**customers.csv**
```
user_id, first_purchase, last_purchase, total_orders, total_revenue
```

Uploading `orders.csv` automatically derives:
- Revenue, Orders, AOV, CVR, Cart Abandonment rate
- Daily revenue trend
- Updated funnel counts

---

## 🤖 AI Insights Upgrade (Optional)

The AI panel is currently **rule-based**. To enable live AI insights:

1. Get a [Gemini API key](https://aistudio.google.com) (free tier available)
2. Add to `.env.local`: `REACT_APP_GEMINI_API_KEY=your_key`
3. The "Generate with Gemini API" button in the AI Insights panel will activate

The prompt template is ready in `src/components/ai/AIPage.jsx` — just uncomment the API call block.

---

## 🏗 Project Structure

```
cartpulse/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── auth/        AuthPage.jsx
│   │   ├── dashboard/   Topbar, Sidebar, FiltersBar, KPICard, OverviewPage, OtherPages
│   │   ├── funnel/      FunnelPage.jsx
│   │   ├── cohort/      CohortPage.jsx
│   │   ├── ai/          AIPage.jsx
│   │   ├── upload/      UploadPage.jsx
│   │   └── story/       StoryPage.jsx
│   ├── data/
│   │   └── mockData.js  (all demo data — replace with your CSV)
│   ├── hooks/
│   │   └── useAuth.js   (Firebase Auth context)
│   ├── utils/
│   │   ├── csvParser.js (PapaParse + KPI derivation)
│   │   └── pdfExport.js (jsPDF + autoTable)
│   ├── firebase.js
│   ├── App.jsx
│   ├── index.js
│   └── index.css        (design system + all global styles)
├── .env.example
├── .gitignore
├── netlify.toml
└── package.json
```

---

## 🧪 Demo Account

Click **"⚡ Continue with Demo Account"** on the login screen.

- No Firebase setup required
- All 13 pages fully functional
- Demo credentials (if Firebase is configured): `demo@cartpulse.io` / `demo123`

---

## 📦 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, React Router v6 |
| Charts | Recharts 2 |
| Auth | Firebase Authentication (free Spark plan) |
| CSV Parsing | PapaParse |
| PDF Export | jsPDF + jspdf-autotable |
| Date Utils | date-fns |
| Icons | Lucide React |
| Hosting | Netlify (free tier) |
| Styling | Custom CSS design system (no Tailwind dependency) |

---

## 📄 Data Source

Based on **[eCommerce Behavior Data from Multi-Category Store](https://www.kaggle.com/datasets/mkechinov/ecommerce-behavior-data-from-multi-category-store)** (Kaggle).

Analysis framework by **[Nikita Sharma](https://github.com/nikitasharma1203/ecommerce-funnel-retention-dashboard)** — funnel analysis, cohort retention, KPI dashboards, RFM segmentation.

---

## 📸 Screenshots

| Login | Overview | Funnel | AI Insights |
|---|---|---|---|
| Firebase Auth | 8 KPI cards + charts | Animated bars | 8 categorised insights |

| Cohort Heatmap | RFM Segments | Story | PDF Report |
|---|---|---|---|
| 12×9 colour matrix | 6 segments + revenue | Findings + recommendations | Auto-generated PDF |

---

*CartPulse — Built for the DA-IICT eCommerce Analytics Portfolio Project*
