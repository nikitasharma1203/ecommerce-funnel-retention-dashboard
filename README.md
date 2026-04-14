# eCommerce Funnel & Retention Analysis
---

## Summary of the Full Pipeline

```
Raw CSV (9 GB)
    │
    ▼
[Chunked Loading] ──► Pandas DataFrame (500K–2M rows in memory)
    │
    ▼
[Data Cleaning] ──► Dedup, null removal, type validation, timezone normalization
    │
    ▼
[Feature Engineering] ──► date, hour, day_of_week, week, is_weekend, top_category
    │
    ├──► [EDA] ──────────────► Daily/hourly patterns, price distribution, top brands/categories
    │
    ├──► [Funnel Analysis] ──► View→Cart→Purchase CVRs, drop-off rates, daily CVR trend
    │
    ├──► [Cohort Retention] ──► Retention matrix, heatmap, retention curves, avg W+1/W+2
    │
    ├──► [KPI Computation] ──► 13 business metrics, KPI card visualizations
    │
    ├──► [RFM Segmentation] ──► 5 customer segments, revenue by segment, RFM scatter
    │
    ├──► [Advanced Analysis] ──► Category CVR, brand revenue, day×hour heatmap, rolling revenue
    │
    └──► [Insights + Recs] ──► 7 insights, 7 recommendations, 5 A/B tests
```
---

## Project Overview
![Dashboard Screenshot](result/dashboard.png)
![Dashboard Screenshot](result/dash.png)


This project performs a full-stack behavioral analytics pipeline on a real-world eCommerce dataset containing **285 million user events** from a large multi-category online store. It covers funnel analysis, cohort retention, RFM segmentation, KPI dashboards, and strategic recommendations.

**Potential answers to:**
- Where are users dropping off in the purchase funnel?
- Which user cohorts retain the best after acquisition?
- Who are the most valuable customers (RFM)?
- What A/B tests should the business run next?
- What is the estimated revenue impact of each recommendation?

---

## Dataset

| Property | Value |
|----------|-------|
| **Source** | [Kaggle — eCommerce Behavior Data from Multi-Category Store](https://www.kaggle.com/mkechinov/ecommerce-behavior-data-from-multi-category-store) |
| **Provider** | Open CDP Project / REES46 Marketing Platform |
| **Time Span** | October 2019 – April 2020 (7 months) |
| **Total Events** | 285,000,000+ rows |
| **File Size** | ~9 GB per monthly CSV |
| **License** | Free to use with attribution |


### Schema

| Column | Type | Description |
|--------|------|-------------|
| `event_time` | datetime (UTC) | When the event occurred |
| `event_type` | string | One of: `view`, `cart`, `remove_from_cart`, `purchase` |
| `product_id` | int | Unique product identifier |
| `category_id` | int | Numeric category identifier |
| `category_code` | string | Hierarchical category name (e.g. `electronics.smartphone`) |
| `brand` | string | Lowercase brand name (nullable) |
| `price` | float | Product price in USD |
| `user_id` | int | Permanent user identifier |
| `user_session` | string | Temporary session ID (resets on long inactivity) |

---

## Project Structure

```
ecom/                        
├── ecommerce_funnel_analysis.ipynb 
├── results (png files)       
├── README.md                       
└── presentation.html                    
```

---

## Analysis Pipeline

The project follows a 10 step analytical pipeline:

### Step 1: Data Loading
- Reads CSV in 500K-row chunks using pandas `chunksize`
- Supports multiple files (e.g. Oct + Nov together)
- Optimizes memory with explicit `dtype` declarations (`int32`, `float32`, `category`)

### Step 2: Data Cleaning
- Removes exact duplicate rows
- Drops rows with null `event_time`, `event_type`, or `user_id`
- Filters to valid event types only (`view`, `cart`, `remove_from_cart`, `purchase`)
- Removes records with `price <= 0`
- Localizes timestamps to UTC

### Step 3: Feature Engineering
New columns derived from the raw data:
- `date` — date only (for daily aggregations)
- `hour` — hour of day (0–23)
- `day_of_week` — Monday through Sunday
- `week` — ISO calendar week number
- `is_weekend` — boolean flag
- `top_category` — first segment of `category_code` 

### Step 4: Exploratory Data Analysis (EDA)
- Daily event volume by type
- Hourly traffic pattern (peak hour detection)
- Event type distribution pie chart
- Purchase price distribution with median/mean markers
- Top 10 categories by purchase volume
- Top 10 brands by revenue

### Step 5: Funnel Analysis
Measures the **unique user count** at each stage:

```
View  →  Add to Cart  →  Purchase
```

Computes:
- **View-to-Cart Rate**: % of viewers who add to cart
- **Cart-to-Purchase Rate**: % of cart-adders who buy
- **Cart Abandonment Rate**: 100% − Cart-to-Purchase Rate
- **Overall CVR**: % of viewers who eventually purchase
- Daily CVR trend line

### Step 6: Cohort Retention Analysis
- Groups users by their **first-event week**
- Tracks how many users from each cohort return in subsequent weeks
- Produces a **retention matrix**: rows = cohorts, columns = W+0, W+1, W+2, ...
- Values = % of original cohort still active in that week
- Visualized as a color-coded heatmap and line curves

### Step 7: KPI 
- Overall CVR, View→Cart %, Cart→Purchase %, Cart Abandonment %
- Total Revenue, Average Order Value, Revenue per User
- Repeat Purchase Rate, Bounce Rate, Sessions per User
- Weekend vs. Weekday revenue split

### Step 8: RFM Segmentation
Scores every purchasing user on three dimensions:
- **R (Recency)**: Days since last purchase — lower = better
- **F (Frequency)**: Number of purchases — higher = better
- **M (Monetary)**: Total spend — higher = better

Each scored 1–5 using rank-based quintiles (robust to skewed distributions). RFM score = R + F + M (3–15). Users classified into 5 segments:

| Segment | Score | Meaning |
|---------|-------|---------|
| Champions | 13–15 | Bought recently, often, spent most |
| Loyal Customers | 10–12 | Buy regularly, good value |
| Potential Loyalists | 7–9 | Recent buyers, low frequency |
| At Risk | 5–6 | Used to buy, haven't recently |
| Lost / Churned | 3–4 | Haven't bought in a long time |

### Step 9: Category Level Analysis
- Category-level conversion rates (View→Cart and Cart→Purchase per category)
- Brand revenue ranking
- Event intensity heatmap (day-of-week × hour-of-day)
- 7-day rolling average revenue trend

### Step 10: Insights & Recommendations
- 7 automated insights generated from live data
- Prioritized recommendation table (P1 → P4)
---

## Definitions & Concepts

### Funnel Analysis
A method to measure how users progress through sequential steps of a user journey. Each stage shows fewer users than the previous because some drop off. Drop-off rate = 100% − conversion rate to next stage.

### Cohort Analysis
Grouping users by a shared characteristic at a point in time and tracking their behavior over time. Reveals patterns invisible in aggregate: e.g., a campaign that acquires many users who all churn quickly will look bad in cohort view but fine in aggregate.

### Retention Rate
The percentage of users from a cohort who are still active (performing any event) in a given subsequent time period. Formula: `(Active users in week W+n) / (Users acquired in week W) × 100`.

### Churn Rate
The inverse of retention: `100% − Retention Rate`. A high churn rate at W+1 means most users never return after their first session.

### Conversion Rate (CVR)
The percentage of users who complete a desired action. In this context: the % of product viewers who eventually purchase. `CVR = Purchasers / Viewers × 100`.

### Cart Abandonment Rate
`(Users who added to cart but did NOT purchase) / (Users who added to cart) × 100`. Global e-commerce average is ~70%. Lower is better.

### Average Order Value (AOV)
`Total Revenue / Number of Purchases`. A key metric for measuring revenue efficiency, can be improved through cross-selling, upselling or bundle discounts.

### Bounce Rate 
Users who only performed `view` events and never added to cart or purchased. Measures behavioral non-engagement.

### RFM (Recency, Frequency, Monetary)
- **Recency**: How recently did the user last purchase? Recent buyers are more likely to respond to campaigns.
- **Frequency**: How often do they purchase? High frequency buyers are loyalists.
- **Monetary**: How much do they spend in total? High monetary users drive disproportionate revenue.

### Cohort Heatmap
A grid where each row is an acquisition cohort (e.g. Week 44), each column is a week offset (W+0, W+1, ...), and each cell shows retention % for that cohort at that week. Green = high retention, red = low.

### Sessions per User
`Total unique sessions / Total unique users`. Measures engagement depth: a user who visits multiple times per month has higher sessions/user.

---
