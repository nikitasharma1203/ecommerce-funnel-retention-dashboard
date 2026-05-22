<div align="center">

# 🛒 CartPulse
### eCommerce Behavioral Analytics Dashboard

Behavioral analytics platform built using the Kaggle Multi-Category eCommerce Dataset.

### Features
- Funnel analysis
- Cohort retention
- RFM segmentation
- KPI dashboards
- Dynamic CSV upload pipeline
- Firebase authentication
- PDF export
- Interactive analytics visualizations

### Tech Stack
React · Python · Pandas · Firebase · Recharts · Netlify

<br/>

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://reactjs.org)
[![Firebase](https://img.shields.io/badge/Firebase-Authentication-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
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

# 📌 Project Overview

CartPulse is an eCommerce behavioral analytics dashboard built using Kaggle’s Multi-Category Store dataset containing over **285M+ user interaction events**.

The project combines:
- Large-scale behavioral data analysis in Python
- Interactive dashboard engineering in React
- KPI computation and visualization
- Funnel and retention analytics
- Customer segmentation techniques
- Dynamic CSV-based dashboard recomputation

The goal was to bridge the gap between raw behavioral event analysis and an accessible BI-style analytics dashboard for non-technical stakeholders.

---

# ✅ Fully Implemented Features

- Python analysis pipeline on real Kaggle eCommerce data
- Funnel analysis and conversion tracking
- Cohort retention analysis
- RFM customer segmentation
- Interactive React dashboard
- Dynamic CSV upload pipeline with live dashboard recomputation
- Firebase Authentication
- Client-side PDF export
- Responsive analytics visualizations
- Real-time KPI recalculation after upload

---

# ⚠️ Demo / Precomputed Components

Several dashboard modules recompute dynamically after CSV upload, including:

- KPI cards
- Revenue metrics
- Funnel analytics
- Conversion metrics
- Activity trends
- Revenue charts
- Cart abandonment metrics

Some advanced visualizations currently use precomputed demo datasets for frontend demonstration purposes:

- Geographic analytics
- Selected cohort views
- Some RFM widgets
- AI insight examples

The underlying analytical logic exists in the Python notebook, while selected frontend sections use lightweight precomputed outputs to keep deployment performant on Netlify.

---

# 🏗 System Architecture

```text
Kaggle Dataset
      ↓
Python Analysis Pipeline
(Pandas + NumPy + Matplotlib)
      ↓
Derived KPIs & Aggregates
      ↓
React Dashboard
      ↓
Interactive Charts + Filters
      ↓
CSV Upload Engine
      ↓
Live KPI Recalculation
```

---

# 📊 Dataset

Dataset used:

### eCommerce Behavior Data from Multi-Category Store

https://www.kaggle.com/datasets/mkechinov/ecommerce-behavior-data-from-multi-category-store

| Property | Value |
|---|---|
| Dataset Size | ~285M behavioral events |
| Users | ~1.4M unique users |
| Time Period | Oct 2019 – Apr 2020 |
| File Used | `2019-Oct.csv` |
| File Size | ~5.8GB |
| Event Types | view, cart, remove_from_cart, purchase |

---

# 📐 Analytical Methods

| Analysis | Method |
|---|---|
| Funnel Analysis | Event-stage conversion tracking |
| Cohort Retention | Weekly cohort matrix |
| RFM Segmentation | Quintile-based scoring |
| Revenue Trends | Rolling window aggregation |
| Conversion Analysis | Session-level CVR computation |
| User Engagement | DAU / WAU / MAU metrics |
| Time Pattern Analysis | Hourly + weekday behavior analysis |
| Category Performance | Category-level conversion comparison |

---

# 🎯 Key Metrics From Analysis

Computed from the `2019-Oct.csv` dataset.

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

# 📈 Core Analysis Performed

## Funnel Analysis

Behavioral funnel tracking across:

```text
View → Cart → Purchase
```

Metrics computed:
- Conversion rate
- Drop-off percentage
- Cart abandonment
- Daily CVR trends

---

## Cohort Retention Analysis

Users grouped into weekly cohorts based on first activity.

Measured:
- Week-over-week retention
- Retention decay curves
- Churn patterns

Average Week+1 retention:

```text
~18%
```

---

## RFM Customer Segmentation

Customers segmented using:
- Recency
- Frequency
- Monetary value

Segments include:
- Champions
- Loyal Customers
- Potential Loyalists
- At Risk
- Lost Customers

---

## Revenue & Behavioral Analytics

Additional analyses:
- Revenue trends
- Hourly activity patterns
- Category performance
- Brand revenue concentration
- Price distribution analysis
- Weekend vs weekday revenue

---

# 🖥 Dashboard Modules

| Module | Description |
|---|---|
| Overview | KPI cards, revenue trends, engagement metrics |
| Funnel Analytics | Conversion funnel + abandonment tracking |
| Cohort Analysis | Retention heatmaps and retention curves |
| Revenue Dashboard | Revenue trends + category breakdown |
| Active Users | DAU / WAU / MAU analytics |
| Returning Customers | Repeat purchase analysis |
| RFM Segmentation | Customer value segmentation |
| AI Insights | Rule-based analytical insights |
| CSV Upload | Upload dataset samples for live KPI recomputation |
| Story Mode | Business recommendations and findings |

---

# 🔄 Data Flow

## Real Data Processing
- Python notebook performs large-scale analysis on the Kaggle dataset
- KPIs and analytical outputs are computed from real behavioral data

## Dashboard Layer
The React dashboard visualizes:
- Real computed aggregates
- Uploaded CSV-derived metrics
- Dynamically recomputed KPI values
- Selected precomputed demo datasets

## Why?
Processing the entire 5.8GB dataset directly in-browser is impractical, so heavy analytical computation is performed offline in Python while the dashboard focuses on interactive analytics and visualization.

---

# ⚙️ Engineering Highlights

- Built reusable React chart components using Recharts
- Implemented centralized state management using Context API
- Added dynamic CSV parsing using PapaParse
- Structured dashboard into modular analytics pages
- Implemented Firebase Authentication
- Added client-side PDF export functionality
- Designed responsive layouts with reusable design tokens
- Built live KPI recomputation pipeline for uploaded CSVs
- Added reusable filtering and chart rendering utilities

---

# 📁 Repository Structure

```text
cartpulse/
│
├── ecommerce_funnel_analysis.ipynb
│
├── src/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   ├── data/
│   ├── App.jsx
│   └── firebase.js
│
├── public/
├── netlify.toml
├── package.json
└── README.md
```

---

# 📂 CSV Upload Support

The dashboard accepts CSV files using the schema:

```text
event_time,event_type,product_id,category_id,
category_code,brand,price,user_id,user_session
```

Supported live recomputations:
- Revenue KPIs
- Conversion metrics
- Cart abandonment
- Revenue trends
- Hourly activity
- Funnel analytics
- Category-level metrics
- Session analytics

All uploaded data is processed directly inside the browser.

No uploaded data is sent to external servers.

---

# 🤖 AI Insights

The dashboard includes a rule-based insight engine derived from KPI thresholds and behavioral patterns.

Example insights:
- Mobile cart abandonment higher than desktop
- High-value customer segments driving majority revenue
- Time windows with peak abandonment
- Declining category conversion trends

Optional Gemini API integration can be enabled through environment variables for natural-language insight generation.

---

# 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 |
| Charts | Recharts |
| Authentication | Firebase Auth |
| CSV Parsing | PapaParse |
| PDF Export | jsPDF |
| Hosting | Netlify |
| Analysis | Pandas, NumPy, Matplotlib, Seaborn |
| Date Utilities | date-fns |

---

# ⚡ Quick Start

## 1. Clone Repository

```bash
git clone https://github.com/nikitasharma1203/ecommerce-funnel-retention-dashboard.git
cd ecommerce-funnel-retention-dashboard
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Firebase

Create:

```bash
.env.local
```

Add:

```env
REACT_APP_FIREBASE_API_KEY=YOUR_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_ID
REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID
```

---

## 4. Start Development Server

```bash
npm start
```

Open:

```text
http://localhost:3000
```

---

# 🌐 Live Deployment

### Netlify Deployment

https://cartpulseecomm.netlify.app/

---

# ⚠️ Current Limitations

- Full 5.8GB dataset cannot be processed entirely in-browser
- Some advanced dashboard modules currently use precomputed demo data
- No backend persistence layer yet
- Geographic analytics currently uses mock aggregation
- Very large CSV uploads may impact browser performance

---

# 🚀 Future Improvements

Planned enhancements:
- FastAPI backend for scalable processing
- DuckDB / ClickHouse analytical engine
- Real-time event streaming
- Dynamic cohort recomputation
- LLM-generated analytical summaries
- Role-based dashboard access
- Scheduled report exports
- Advanced recommendation engine

---

# 👩‍💻 Author

## Nikita Sharma

M.Sc. Data Science  
DA-IICT (Dhirubhai Ambani Institute of Information and Communication Technology)

### GitHub
https://github.com/nikitasharma1203

### Project Repository
https://github.com/nikitasharma1203/ecommerce-funnel-retention-dashboard

---

# 📄 License

This project is intended for academic and portfolio purposes.

Dataset usage is subject to Kaggle’s terms and conditions.

---

<div align="center">

CartPulse · Behavioral Analytics Portfolio Project

</div>