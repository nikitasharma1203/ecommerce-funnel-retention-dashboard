# 🛒 CartPulse

### Customer Funnel, Retention & Revenue Analytics Platform

[![Live Demo](https://img.shields.io/badge/Live-Demo-00C7B7?style=flat-square&logo=netlify)](https://cartpulseecomm.netlify.app/)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=flat-square&logo=react)](https://reactjs.org)
[![Firebase](https://img.shields.io/badge/Auth-Firebase-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Dataset](https://img.shields.io/badge/Dataset-42.3M_Events-20BEFF?style=flat-square)]()

AI-assisted full-stack analytics platform built on **42M+ customer behavioral events** to identify customer drop-offs, measure retention, segment customers by value, and generate actionable business recommendations.

CartPulse combines:

- Funnel Analytics
- Cohort Retention Analysis
- RFM Customer Segmentation
- Revenue & Category Intelligence
- Interactive React Dashboard
- Live CSV Analytics
- AI-assisted Business Insights

---

## 🌐 Live Demo

### Interactive Dashboard

https://cartpulseecomm.netlify.app/

AI was used as a development accelerator for the web app.

---

# 📌 Executive Summary

Modern eCommerce companies invest heavily in customer acquisition, but sustainable growth depends on answering three questions:

### 1. Where are customers dropping out of the purchase journey?

### 2. Which customers are most valuable and which are at risk of churning?

### 3. What interventions will maximise retention and revenue?

CartPulse answers these questions by integrating:

- Customer Funnel Analysis
- Cohort Retention Analysis
- Revenue Intelligence
- RFM Customer Segmentation
- AI-assisted Business Recommendations

The result is a business intelligence platform that converts customer behavioral data into growth opportunities.

---

# 🎯 Business Problem

eCommerce businesses often struggle with:

- Low conversion from product views to purchases
- High customer churn after acquisition
- Difficulty identifying high-value customers
- Limited visibility into revenue drivers
- Fragmented analytics across marketing, product, and retention teams

Without an integrated analytics framework, teams cannot prioritise initiatives with the highest business impact.

**CartPulse addresses these challenges by combining customer journey analytics, retention analysis, and customer segmentation into a unified platform.**

---

# 📦 Dataset

The analysis uses the **October 2019 eCommerce Behavior Dataset**.

## Data Quality

| Metric | Value |
|------|------:|
| Raw Dataset Size | 42,448,764 rows |
| Duplicate Rows | 30,220 |
| Clean Dataset Size | 42,349,874 rows |
| Date Range | 2019-10-01 → 2019-10-31 |
| Unique Users | 3,021,435 |
| Unique Products | 165,647 |
| Unique Brands | 3,444 |
| Total Sessions | 9,239,402 |

---

## Event Distribution

| Event Type | Count |
|------|------:|
| View | 40,779,399 |
| Cart | 926,516 |
| Purchase | 742,849 |

---

# 📊 Key Performance Indicators

| KPI | Value |
|------|------:|
| Total Events | 42.3M |
| Unique Users | 3.02M |
| Total Sessions | 9.24M |
| Sessions / User | 3.06 |
| Overall Conversion Rate | 11.49% |
| View → Cart Rate | 11.16% |
| Total Revenue | $229.93M |
| Average Order Value | $309.56 |
| Revenue / User | $76.10 |
| Repeat Purchase Rate | 37.86% |
| Bounce Rate | 84.07% |
| Avg Week+1 Retention | 24.4% |
| Avg Week+2 Retention | 21.9% |
| Peak Traffic Hour | 16:00 UTC |

---

# 🖥 Interactive Dashboard

CartPulse provides an interactive React dashboard for exploring customer behavior, retention, and revenue metrics.

| Module | Features |
|-------|---------|
| 📊 Overview | Revenue KPIs, user growth, conversion trends, device & traffic source analysis |
| 💰 Revenue | Daily revenue trends, category analysis, AOV, brand-wise revenue |
| 🎯 Conversion | Funnel metrics, cart abandonment, CVR by device & source |
| 🔄 Retention | Cohort heatmaps, retention curves, returning customers |
| 👥 Active Users | DAU/WAU/MAU, sessions per user, hourly activity |
| 🏆 Customer Value | RFM segmentation with revenue contribution |
| 🤖 AI Insights | Funnel bottlenecks, retention risks, business recommendations |
| 📁 CSV Upload | Upload datasets and recompute KPIs & charts instantly |

### Live CSV Analytics

Upload any compatible event dataset:

```csv
event_time,
event_type,
product_id,
category_id,
category_code,
brand,
price,
user_id,
user_session
```

The dashboard automatically recomputes:

- Revenue & Orders
- Conversion Rate
- Funnel Metrics
- Cohort Retention
- RFM Segments
- Revenue Trends
- AI-generated Insights

**All processing is client-side. No uploaded data leaves the browser.**
### 📁 Live CSV Analytics

Upload any compatible event dataset:

```csv
event_time,
event_type,
product_id,
category_id,
category_code,
brand,
price,
user_id,
user_session
```

The dashboard recomputes:

- Revenue
- Conversion Rate
- Funnel Metrics
- Cohort Analysis
- RFM Segments
- Revenue Trends
- AI Insights

**All processing is client-side. No uploaded data leaves the browser.**

---

# 🔽 Funnel Analysis

Customer behaviour is analysed across:

```text
View → Cart → Purchase
```

### Unique Users by Stage

| Stage | Users | % of View Users |
|------|------:|------:|
| View | 3,021,273 | 100% |
| Add to Cart | 337,082 | 11.16% |
| Purchase | 347,118 | 11.49% |

### Important Note

Purchase users exceed cart users because the dataset contains:

- Direct purchases without cart events
- Cross-session purchases
- Non-sequential event histories

Therefore, stage counts are interpreted as **participation rates** rather than a strict deterministic funnel.

### Business Insights

- Only **11.16%** of viewers add products to cart.
- The biggest opportunity lies in improving product discovery and purchase intent.
- Product detail page optimisation and checkout simplification are likely to have the highest conversion impact.

---

# 🗓 Cohort Retention Analysis

Weekly cohorts are created using each user's first active week.

Retention measures:

> Percentage of users from an acquisition cohort who remain active in future weeks.

### Cohort Retention Matrix

| Cohort | W+1 | W+2 | W+3 | W+4 |
|------|----:|----:|----:|----:|
| Week 40 | 35.6% | 32.1% | 27.8% | 17.4% |
| Week 41 | 27.2% | 22.1% | 12.7% | — |
| Week 42 | 22.4% | 11.4% | — | — |
| Week 43 | 12.5% | — | — | — |

### Business Insights

- Significant churn occurs immediately after acquisition.
- Average Week+1 retention is **24.4%**.
- Early re-engagement campaigns provide the largest retention opportunity.

---

# 🏆 Customer Value Analysis

RFM (Recency, Frequency, Monetary) analysis was performed on:

```text
347,118 purchasing users
```

### Segment Summary

| Segment | Users | Avg Orders | Avg Revenue | Total Revenue |
|------|------:|------:|------:|------:|
| Champions | 29,754 | 4.13 | $1,733 | $51.6M |
| Loyal Customers | 119,696 | 3.26 | $1,174 | $140.5M |
| Potential Loyalists | 137,822 | 1.22 | $231 | $31.9M |
| At Risk | 47,804 | 1.02 | $108 | $5.2M |
| Lost / Churned | 12,042 | 1.00 | $59 | $0.7M |

### Business Insights

- Loyal Customers generate the majority of revenue.
- Champions contribute more than **$50M** despite representing a small fraction of customers.
- Potential Loyalists represent the largest growth opportunity.
- Lost customers contribute minimal revenue and require targeted reactivation campaigns.

---

# 💡 Business Recommendations

## 🔴 Improve Purchase Funnel

### Problem

Most users browse products but never add them to cart.

### Recommended Actions

- Improve product detail pages
- Add reviews and social proof
- Simplify checkout flow
- Introduce guest checkout
- Recover abandoned carts through email reminders

**Expected Impact**

+8–15% improvement in conversion rate

---

## 🟠 Increase Customer Retention

### Problem

Retention drops significantly after acquisition.

### Recommended Actions

- Personalised offers during Week+1
- Day 3 and Day 7 re-engagement campaigns
- Category-specific recommendations
- Behaviour-based push notifications

**Expected Impact**

+15–20% improvement in Week+1 retention

---

## 🟡 Maximise Customer Value

### Problem

Revenue is concentrated among a small group of customers.

### Recommended Actions

- Loyalty programs for Champions
- Early-access promotions
- Cross-selling complementary products
- Dynamic discounts for high-value customers

**Expected Impact**

+5–10% increase in AOV and repeat purchases

---

# ⚙️ Engineering Highlights

### State Management

Centralised `DataContext` architecture where a single `uploadCSV()` function triggers recomputation across all dashboard modules simultaneously.

### Defensive Data Handling

Chart components implement:

- `safeChartData`
- `safeArray`
- `safeSlice`

Malformed or incomplete CSVs produce empty states rather than crashes.

### Persistence

Firestore stores:

- KPI snapshots
- Dataset metadata
- User dashboard state

allowing users to resume previous analyses.

### PDF Export

Client-side report generation using:

- jsPDF
- jspdf-autotable

No server round-trip required.

---

# 🏗 Architecture

```text
42M+ Event Dataset

        │

        ▼

Python Analytics Pipeline

(Pandas · NumPy · Matplotlib)

        │

        ├── Funnel Analysis
        ├── Cohort Retention
        ├── Revenue Analytics
        ├── RFM Segmentation
        └── Business Insights

        ▼

React Dashboard

        │

 ┌──────┴──────┐

 ▼             ▼

Firebase      Firestore

(Auth)       (Persistence)

        │

        ▼

CSV Upload

        │

PapaParse

        │

Live KPI Recalculation

        │

Interactive Visualisations

        │

AI-assisted Insight Generation
```


---

# 🛠 Tech Stack

| Layer | Technology |
|------|------|
| Frontend | React 18 |
| Charts | Recharts |
| Styling | Tailwind CSS |
| CSV Processing | PapaParse |
| Authentication | Firebase Auth |
| Persistence | Firestore |
| PDF Export | jsPDF |
| Python Analysis | Pandas, NumPy, Matplotlib, Seaborn |
| Deployment | Netlify |
| Development Workflow | AI-assisted Engineering |

---
