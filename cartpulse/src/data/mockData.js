// CartPulse — Demo Data
// Based on the Kaggle eCommerce Behavior Data from Multi-Category Store
// Oct 2019 – Apr 2020, 285M+ events

import { subDays, format, startOfWeek, addWeeks } from "date-fns";

const r = (min, max) => Math.round(min + Math.random() * (max - min));
const rf = (min, max, d = 1) => parseFloat((min + Math.random() * (max - min)).toFixed(d));

// ─── KPI SUMMARY ──────────────────────────────────────────────────────────────
export const kpiSummary = {
  revenue:        { value: "$4.21M",  change: +12.4, label: "Total Revenue" },
  totalUsers:     { value: "2.84M",   change: +8.1,  label: "Total Users" },
  totalOrders:    { value: "487K",    change: +5.7,  label: "Total Orders" },
  convRate:       { value: "3.8%",    change: -0.4,  label: "Conversion Rate" },
  cartAbandon:    { value: "68.4%",   change: -2.1,  label: "Cart Abandonment" },
  aov:            { value: "$86.20",  change: +3.2,  label: "Avg Order Value" },
  retentionW1:    { value: "18.3%",   change: +1.8,  label: "W+1 Retention" },
  sessionsPerUser:{ value: "3.2",     change: +0.3,  label: "Sessions / User" },
  dau:            { value: "94.2K",   change: +3.1,  label: "DAU" },
  wau:            { value: "412K",    change: +6.2,  label: "WAU" },
  mau:            { value: "1.41M",   change: +8.1,  label: "MAU" },
  bounceRate:     { value: "42.1%",   change: -1.3,  label: "Bounce Rate" },
  returnRate:     { value: "34.8%",   change: +2.3,  label: "Return Rate" },
  ltv:            { value: "$312",    change: +18,   label: "Avg LTV (Returning)" },
};

// ─── TIME SERIES ──────────────────────────────────────────────────────────────
export const generateDailyRevenue = (days = 90) =>
  Array.from({ length: days }, (_, i) => ({
    date: format(subDays(new Date(2020, 3, 1), days - 1 - i), "MMM d"),
    revenue: r(85000, 195000),
    orders:  r(800,  2200),
    users:   r(70000, 115000),
    cvr:     rf(2.2, 5.8),
  }));

export const dailyData = generateDailyRevenue(90);

export const monthlyRevenue = [
  { month: "Oct 19", electronics: 410000, apparel: 180000, home: 120000, beauty: 90000, sports: 70000 },
  { month: "Nov 19", electronics: 510000, apparel: 230000, home: 145000, beauty: 105000, sports: 88000 },
  { month: "Dec 19", electronics: 680000, apparel: 310000, home: 190000, beauty: 130000, sports: 110000 },
  { month: "Jan 20", electronics: 380000, apparel: 155000, home: 105000, beauty: 80000,  sports: 62000 },
  { month: "Feb 20", electronics: 420000, apparel: 175000, home: 118000, beauty: 88000,  sports: 71000 },
  { month: "Mar 20", electronics: 350000, apparel: 142000, home: 98000,  beauty: 76000,  sports: 58000 },
];

// ─── FUNNEL ───────────────────────────────────────────────────────────────────
export const funnelSteps = [
  { name: "Visit",        count: 2840000, color: "#6366f1" },
  { name: "Product View", count: 2056960, color: "#8b5cf6" },
  { name: "Add to Cart",  count: 249092,  color: "#a78bfa" },
  { name: "Checkout",     count: 114085,  color: "#06b6d4" },
  { name: "Purchase",     count: 78718,   color: "#10b981" },
];

export const funnelByDevice = {
  mobile:  [100, 68, 7.8, 3.2, 2.1],
  desktop: [100, 74, 9.8, 5.4, 3.9],
  tablet:  [100, 71, 8.6, 4.1, 3.1],
};

export const funnelBySource = {
  "Organic Search": [100, 72, 9.2, 4.8, 3.5],
  "Instagram":      [100, 78, 11.4, 6.2, 4.8],
  "Email":          [100, 66, 8.1, 3.9, 2.9],
  "Paid Search":    [100, 70, 9.6, 4.5, 3.3],
  "Direct":         [100, 69, 8.8, 4.2, 3.1],
};

// ─── COHORT RETENTION ─────────────────────────────────────────────────────────
export const cohortWeeks = [
  "Wk 44","Wk 45","Wk 46","Wk 47","Wk 48","Wk 49",
  "Wk 50","Wk 51","Wk 52","Wk 1","Wk 2","Wk 3",
];
export const cohortOffsets = ["W+0","W+1","W+2","W+3","W+4","W+5","W+6","W+7","W+8"];

export const cohortMatrix = cohortWeeks.map((_, wi) => {
  const base = r(17, 23);
  return cohortOffsets.map((_, oi) => {
    if (oi === 0) return 100;
    const decay = [0, base, base * 0.56, base * 0.39, base * 0.30, base * 0.24, base * 0.20, base * 0.17, base * 0.14];
    return Math.max(2, Math.round(decay[oi] + (Math.random() - 0.5) * 2));
  });
});

export const avgRetentionByWeek = cohortOffsets.slice(1).map((offset, i) => {
  const vals = cohortMatrix.map(row => row[i + 1]);
  return parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1));
});

// ─── DEVICE & SOURCE ──────────────────────────────────────────────────────────
export const deviceBreakdown = [
  { name: "Mobile",  value: 58, color: "#6366f1" },
  { name: "Desktop", value: 33, color: "#06b6d4" },
  { name: "Tablet",  value: 9,  color: "#10b981" },
];

export const sourceBreakdown = [
  { name: "Organic Search", value: 38, cvr: 4.8, retention: 17.2 },
  { name: "Instagram",      value: 24, cvr: 6.2, retention: 22.3 },
  { name: "Email",          value: 18, cvr: 4.1, retention: 14.9 },
  { name: "Paid Search",    value: 12, cvr: 3.5, retention: 16.1 },
  { name: "Direct",         value: 5,  cvr: 3.1, retention: 19.4 },
  { name: "Referral",       value: 3,  cvr: 2.9, retention: 15.8 },
];

// ─── HOURLY HEATMAP ───────────────────────────────────────────────────────────
export const hourlyHeatmap = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => {
    const isPeakHour = hour >= 9 && hour <= 22;
    const isWeekend  = day >= 5;
    return r(
      isPeakHour ? 15000 : 3000,
      isPeakHour ? (isWeekend ? 95000 : 110000) : 18000
    );
  })
);

// ─── RFM SEGMENTS ─────────────────────────────────────────────────────────────
export const rfmSegments = [
  { icon: "🏆", name: "Champions",       desc: "Bought recently, frequently, highest spend", count: 34200,   pct: 1.2, revenue: 1800000, color: "#6366f1", r: 5, f: 5, m: 5 },
  { icon: "💚", name: "Loyal Customers", desc: "Regular buyers, responsive to promotions",   count: 89100,   pct: 3.1, revenue: 920000,  color: "#10b981", r: 4, f: 5, m: 4 },
  { icon: "⭐", name: "Promising",       desc: "Recent customers, growing engagement",        count: 241000,  pct: 8.5, revenue: 680000,  color: "#f59e0b", r: 4, f: 3, m: 3 },
  { icon: "⚠️", name: "At Risk",         desc: "Previously active, not seen recently",        count: 512000,  pct: 18.0, revenue: 440000, color: "#ef4444", r: 2, f: 3, m: 3 },
  { icon: "😴", name: "Lost",            desc: "Lowest recency, frequency, and spend",        count: 1960000, pct: 69.0, revenue: 360000, color: "#64748b", r: 1, f: 1, m: 1 },
  { icon: "🆕", name: "New Customers",   desc: "First-time buyers, high potential",           count: 167000,  pct: 5.9, revenue: 280000,  color: "#ec4899", r: 5, f: 1, m: 2 },
];

// ─── CATEGORY CVR ─────────────────────────────────────────────────────────────
export const categoryCVR = [
  { name: "Electronics",  cvr: 5.8, revenue: 1100000, items: 41200 },
  { name: "Apparel",      cvr: 4.2, revenue: 680000,  items: 87400 },
  { name: "Home & Garden",cvr: 3.9, revenue: 520000,  items: 63100 },
  { name: "Beauty",       cvr: 3.1, revenue: 390000,  items: 52800 },
  { name: "Sports",       cvr: 2.8, revenue: 310000,  items: 44900 },
  { name: "Books",        cvr: 2.1, revenue: 180000,  items: 38200 },
  { name: "Toys",         cvr: 3.4, revenue: 270000,  items: 41600 },
  { name: "Automotive",   cvr: 4.6, revenue: 410000,  items: 22100 },
];

// ─── GEO DATA ─────────────────────────────────────────────────────────────────
export const geoData = [
  { country: "Russia",      code: "RU", users: 989120, revenue: 1310000, cvr: 3.4 },
  { country: "Ukraine",     code: "UA", users: 312400, revenue: 385000,  cvr: 3.1 },
  { country: "Poland",      code: "PL", users: 198200, revenue: 275000,  cvr: 3.9 },
  { country: "Germany",     code: "DE", users: 124500, revenue: 218000,  cvr: 4.8 },
  { country: "UK",          code: "GB", users: 108700, revenue: 196000,  cvr: 5.1 },
  { country: "France",      code: "FR", users: 96400,  revenue: 172000,  cvr: 4.6 },
  { country: "Turkey",      code: "TR", users: 87300,  revenue: 142000,  cvr: 3.2 },
  { country: "Kazakhstan",  code: "KZ", users: 76100,  revenue: 118000,  cvr: 3.5 },
  { country: "Belarus",     code: "BY", users: 62400,  revenue: 98000,   cvr: 3.3 },
  { country: "USA",         code: "US", users: 54200,  revenue: 142000,  cvr: 6.2 },
];

// ─── AI INSIGHTS ──────────────────────────────────────────────────────────────
export const aiInsights = [
  {
    type: "bad", icon: "📱",
    title: "Mobile Cart Abandonment Crisis",
    text: "Cart abandonment increased by 14% on mobile devices (75.2% vs 61.1% desktop) over the last 30 days. This is the top optimization priority given mobile represents 58% of traffic.",
    tag: "Mobile · High Impact", tagType: "bad",
    impact: "+$480K potential",
    action: "Implement 1-click checkout on mobile",
  },
  {
    type: "good", icon: "📸",
    title: "Instagram Cohort Outperforms",
    text: "Customers acquired through Instagram show 22% better Week-1 retention than channel average (22.3% vs 17.2%). Higher intent audience justifies increased ad spend.",
    tag: "Acquisition · Positive", tagType: "good",
    impact: "+$210K potential",
    action: "Increase Instagram ad budget",
  },
  {
    type: "warn", icon: "🔥",
    title: "Electronics CVR Declining",
    text: "Electronics category conversion rate dropped 1.8pp over the last 2 weeks despite being the top revenue driver. Possible price sensitivity or competitor activity.",
    tag: "Category · Alert", tagType: "warn",
    impact: "−$88K at risk",
    action: "Review pricing and inventory",
  },
  {
    type: "good", icon: "💎",
    title: "Champions Segment Undertapped",
    text: "Top 1.2% of users (Champions) generate 42% of revenue but receive no differentiated treatment. A loyalty tier could improve LTV by an estimated 18–22%.",
    tag: "RFM · Insight", tagType: "good",
    impact: "+$150K potential",
    action: "Launch VIP loyalty program",
  },
  {
    type: "bad", icon: "⏰",
    title: "Late-Night Checkout Friction",
    text: "Peak cart abandonment occurs between 11PM–2AM UTC. Checkout completion is 12pp below average during these hours, suggesting server latency or payment gateway issues.",
    tag: "Temporal · Anomaly", tagType: "bad",
    impact: "−$34K/month",
    action: "Audit infrastructure at off-peak hours",
  },
  {
    type: "warn", icon: "📧",
    title: "Email Channel Mixed Signal",
    text: "Email-acquired users show 18% lower W+1 retention but 31% higher AOV ($113 vs $86). Consider LTV-based optimization rather than retention-only metrics for this channel.",
    tag: "Channel · Mixed Signal", tagType: "warn",
    impact: "Strategy review needed",
    action: "Segment email targeting by LTV",
  },
  {
    type: "good", icon: "🛒",
    title: "Deep Browsers Convert Best",
    text: "Users who view 3+ products before adding to cart have a 67% higher purchase completion rate. Current recommendation engine shows only 1.2 products per session on average.",
    tag: "Behavior · Pattern", tagType: "good",
    impact: "+$95K potential",
    action: "Improve product recommendations",
  },
  {
    type: "bad", icon: "🌍",
    title: "EU Checkout Friction",
    text: "EU traffic grew 28% but checkout completion is 12pp below global average, likely due to GDPR consent flow adding friction. A simplified consent UI could recover significant revenue.",
    tag: "Geo · Friction", tagType: "bad",
    impact: "−$62K/month",
    action: "Streamline GDPR consent UI",
  },
];

// ─── STORY DATA ───────────────────────────────────────────────────────────────
export const keyFindings = [
  {
    n: 1, color: "#6366f1",
    title: "Cart abandonment crisis on mobile",
    body: "Mobile cart abandonment is 14% higher than desktop (75.2% vs 61.1%). With mobile traffic representing 58% of total visits, this is the single highest-impact optimization opportunity in the entire funnel."
  },
  {
    n: 2, color: "#8b5cf6",
    title: "Instagram cohort dramatically outperforms",
    body: "Customers acquired through Instagram show 22% better Week-1 retention than the average, suggesting a higher-intent acquisition channel worth scaling aggressively."
  },
  {
    n: 3, color: "#06b6d4",
    title: "W+1 retention bottleneck",
    body: "81.7% of customers churn within the first week. Early retention programs — onboarding email sequences, push notifications, personalized follow-ups — could unlock substantial compounding revenue."
  },
  {
    n: 4, color: "#10b981",
    title: "Electronics drives disproportionate revenue",
    body: "Electronics represents 26% of items viewed but 41% of total revenue, with the highest revenue-per-view ratio across all categories. Cross-sell and upsell opportunities are significant."
  },
  {
    n: 5, color: "#f59e0b",
    title: "Champion customers are undertapped",
    body: "The top 1.2% of users (Champions segment) generate 42% of revenue but receive no differentiated treatment or loyalty program. This is a quick win with measurable LTV impact."
  },
];

export const recommendations = [
  { n: 1, color: "#10b981", impact: "+$480K/year", title: "Mobile checkout optimization", body: "Implement 1-click checkout, Apple/Google Pay, and reduce form fields on mobile. A 5pp improvement in mobile cart-to-purchase rate would generate substantial incremental revenue." },
  { n: 2, color: "#10b981", impact: "+$320K/year", title: "Week-1 churn reduction email drip", body: "A 3-email welcome sequence within the first 7 days targeting new users who haven't repurchased. Even 2pp improvement in W+1 retention compounds significantly over 12 months." },
  { n: 3, color: "#10b981", impact: "+$210K/year", title: "Instagram channel investment", body: "Double Instagram ad spend. This cohort's 22% better retention means every dollar spent acquires higher-LTV customers, improving blended CAC/LTV ratio." },
  { n: 4, color: "#f59e0b", impact: "+$150K/year", title: "Champion loyalty program", body: "Launch a VIP tier for Champions with exclusive early access, free shipping, and personalized recommendations. Expected to improve their already-high LTV by 18–22%." },
];

export const growthOpportunities = [
  { n: 1, color: "#f59e0b", title: "Electronics cross-sell engine", body: "Build a recommendation engine for electronics accessories. The category's high AOV ($142 avg) makes even 3-5% cross-sell rates highly valuable." },
  { n: 2, color: "#f59e0b", title: "At-risk customer win-back campaign", body: "512K At-Risk customers represent dormant revenue. A win-back campaign with personalized offers based on last purchase category could reactivate 8–12% of this segment." },
  { n: 3, color: "#f59e0b", title: "EU market localization", body: "UK and Germany show higher AOV than average. Localizing checkout, currency, and GDPR consent for EU markets could improve revenue-per-user significantly in a fast-growing region." },
];

// ─── DAU / WAU / MAU ─────────────────────────────────────────────────────────
export const dauSeries = dailyData.map(d => ({ date: d.date, dau: r(75000, 115000) }));

export const hourlyActivity = Array.from({ length: 24 }, (_, h) => ({
  hour: `${h}:00`,
  events: r(h >= 8 && h <= 22 ? 150000 : 20000, h >= 8 && h <= 22 ? 850000 : 90000),
}));

export const dowActivity = [
  { day: "Mon", users: r(380000, 420000) },
  { day: "Tue", users: r(390000, 430000) },
  { day: "Wed", users: r(400000, 450000) },
  { day: "Thu", users: r(385000, 435000) },
  { day: "Fri", users: r(410000, 460000) },
  { day: "Sat", users: r(490000, 560000) },
  { day: "Sun", users: r(460000, 520000) },
];

export const newVsReturning = [
  { month: "Oct 19", new: r(90000, 130000), returning: r(25000, 55000) },
  { month: "Nov 19", new: r(110000, 155000), returning: r(32000, 65000) },
  { month: "Dec 19", new: r(130000, 185000), returning: r(42000, 80000) },
  { month: "Jan 20", new: r(70000, 110000),  returning: r(22000, 48000) },
  { month: "Feb 20", new: r(80000, 120000),  returning: r(26000, 52000) },
  { month: "Mar 20", new: r(68000, 102000),  returning: r(20000, 44000) },
];
