"""
╔══════════════════════════════════════════════════════════════════════════════╗
║   eCommerce Funnel & Retention Analysis — Streamlit Dashboard  v3           ║
║   Works on Streamlit Cloud and locally.                                     ║
║                                                                              ║
║   DATA LOADING — 3 options (pick any one):                                  ║
║   1. Upload CSV directly in the browser (up to 2 GB via .streamlit/config)  ║
║   2. Paste a Google Drive / direct download URL                             ║
║   3. Type a local file path (only works when running locally, not on Cloud) ║
║                                                                              ║
║   SETUP                                                                      ║
║   pip install streamlit pandas numpy plotly requests                        ║
║   mkdir -p .streamlit                                                        ║
║   echo "[server]\nmaxUploadSize = 2000" > .streamlit/config.toml           ║
║                                                                              ║
║   RUN                                                                        ║
║   streamlit run app.py                                                       ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
import gc, os, io, re, warnings, tempfile, requests
warnings.filterwarnings("ignore")

# ─────────────────────────────────────────────────────────────────────────────
# PAGE CONFIG  ← must be first Streamlit call
# ─────────────────────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="eCommerce Funnel & Retention",
    page_icon="🛒",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ─────────────────────────────────────────────────────────────────────────────
# COLORS  — bright, high-contrast, readable on dark backgrounds
# ─────────────────────────────────────────────────────────────────────────────
C = {
    "blue":   "#4FA8D5",
    "purple": "#C97BC9",
    "orange": "#FFA940",
    "red":    "#FF6B6B",
    "green":  "#52C41A",
    "teal":   "#36CFC9",
    "yellow": "#FADB14",
    "navy":   "#1A2744",
}
PALETTE = [C["blue"], C["purple"], C["orange"], C["red"], C["green"], C["teal"], C["yellow"]]

# ─────────────────────────────────────────────────────────────────────────────
# GLOBAL CSS  — forces dark theme throughout; all text/bg explicit
# ─────────────────────────────────────────────────────────────────────────────
st.markdown("""
<style>
/* ── App background & text ── */
html, body,
[data-testid="stAppViewContainer"],
section.main,
[data-testid="stMainBlockContainer"] {
    background-color: #0F1117 !important;
    color: #E6EDF3 !important;
}
[data-testid="stSidebar"],
[data-testid="stSidebarContent"] {
    background-color: #161B22 !important;
    color: #C9D1D9 !important;
}
[data-testid="stSidebar"] * { color: #C9D1D9 !important; }

/* ── Remove extra top padding ── */
.block-container { padding-top: 1rem !important; }

/* ── Headings ── */
h1, h2, h3, h4 { color: #E6EDF3 !important; }
p, li, label   { color: #C9D1D9 !important; }
a              { color: #58A6FF !important; }

/* ── Header banner ── */
.dash-header {
    background: linear-gradient(135deg, #1C2B3A 0%, #1A3A5C 100%);
    border: 1px solid #30363D;
    border-radius: 12px;
    padding: 22px 28px;
    margin-bottom: 20px;
}
.dash-header h1 { margin: 0 !important; font-size: 1.65rem !important; font-weight: 800 !important; color: #E6EDF3 !important; }
.dash-header p  { margin: 5px 0 0 !important; color: #8B949E !important; font-size: 0.87rem !important; }
.dash-badge {
    display: inline-block; margin-top: 10px;
    background: rgba(31,111,235,0.15); border: 1px solid #1F6FEB;
    color: #58A6FF; padding: 3px 10px; border-radius: 20px;
    font-size: 0.72rem; font-weight: 600;
}

/* ── KPI card ── */
.kpi-card {
    background: #161B22;
    border: 1px solid #30363D;
    border-top: 3px solid #4FA8D5;
    border-radius: 10px;
    padding: 18px 14px;
    text-align: center;
    min-height: 108px;
    display: flex; flex-direction: column; justify-content: center;
}
.kpi-val   { font-size: 1.85rem; font-weight: 800; line-height: 1.1; }
.kpi-label { font-size: 0.73rem; color: #8B949E; margin-top: 5px; font-weight: 500; }
.kpi-delta { font-size: 0.69rem; margin-top: 4px; font-weight: 600; }

/* ── Section sub-header ── */
.sec-hdr {
    font-size: 0.68rem !important; font-weight: 700 !important;
    text-transform: uppercase; letter-spacing: 1.4px;
    color: #8B949E !important; margin: 4px 0 10px !important;
}

/* ── Insight box ── */
.insight-box {
    background: #161B22;
    border-left: 4px solid #4FA8D5;
    border-radius: 0 8px 8px 0;
    padding: 12px 16px;
    margin-bottom: 10px;
    color: #C9D1D9;
}

/* ── Path entry box ── */
.path-hint {
    background: #161B22; border: 2px dashed #30363D;
    border-radius: 10px; padding: 28px 20px;
    text-align: center; color: #8B949E;
}
.path-hint code { color: #58A6FF; background: #0D1117; padding: 1px 5px; border-radius: 4px; }

/* ── Streamlit widget overrides ── */
div[data-testid="stTextInput"] input,
div[data-testid="stNumberInput"] input {
    background-color: #0D1117 !important;
    color: #E6EDF3 !important;
    border-color: #30363D !important;
}
div[data-testid="stSelectbox"] > div > div {
    background-color: #0D1117 !important;
    color: #E6EDF3 !important;
    border-color: #30363D !important;
}
div[data-testid="stMultiSelect"] > div {
    background-color: #0D1117 !important;
    color: #E6EDF3 !important;
    border-color: #30363D !important;
}
/* Tab buttons */
button[data-baseweb="tab"] { color: #8B949E !important; }
button[data-baseweb="tab"][aria-selected="true"] {
    color: #58A6FF !important;
    border-bottom: 2px solid #58A6FF !important;
}
/* Metric labels & values */
[data-testid="stMetricLabel"] p  { color: #8B949E !important; }
[data-testid="stMetricValue"] div { color: #E6EDF3 !important; }

/* st.success / info boxes */
div[data-testid="stAlert"] { background: #161B22 !important; color: #C9D1D9 !important; }

/* Scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: #0F1117; }
::-webkit-scrollbar-thumb { background: #30363D; border-radius: 3px; }

/* Dataframe */
iframe { background: #0F1117 !important; }
</style>
""", unsafe_allow_html=True)


# ─────────────────────────────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────────────────────────────
def kpi_card(value: str, label: str, color: str = C["blue"], delta: str = "") -> str:
    delta_html = f'<div class="kpi-delta" style="color:{color};">{delta}</div>' if delta else ""
    return (
        f'<div class="kpi-card" style="border-top-color:{color};">'
        f'  <div class="kpi-val" style="color:{color};">{value}</div>'
        f'  <div class="kpi-label">{label}</div>{delta_html}'
        f'</div>'
    )

def fmt(n: float, prefix: str = "", suffix: str = "") -> str:
    if n >= 1_000_000: return f"{prefix}{n/1_000_000:.2f}M{suffix}"
    if n >= 1_000:     return f"{prefix}{n/1_000:.1f}K{suffix}"
    return f"{prefix}{n:.2f}{suffix}"

def dark_layout(**kw) -> dict:
    base = dict(
        template="plotly_dark",
        paper_bgcolor="#161B22",
        plot_bgcolor="#0F1117",
        font_color="#C9D1D9",
        title_font_color="#E6EDF3",
        legend_bgcolor="#161B22",
        legend_bordercolor="#30363D",
        legend_borderwidth=1,
        margin=dict(l=40, r=20, t=50, b=40),
    )
    base.update(kw)
    return base


# ─────────────────────────────────────────────────────────────────────────────
# CONSTANTS
# ─────────────────────────────────────────────────────────────────────────────
DTYPES = {
    "event_type":    "category",
    "product_id":    "int32",
    "brand":         "category",
    "category_code": "category",
    "price":         "float32",
    "user_id":       "int32",
}
VALID_EVENTS = ["view", "cart", "remove_from_cart", "purchase"]


# ─────────────────────────────────────────────────────────────────────────────
# DATA LOADERS  — works on Streamlit Cloud and locally
# ─────────────────────────────────────────────────────────────────────────────

def _clean_df(df: pd.DataFrame) -> pd.DataFrame:
    """Shared cleaning + feature engineering applied after any load method."""
    df.drop_duplicates(inplace=True)
    df.dropna(subset=["event_time", "event_type", "user_id"], inplace=True)
    df = df[df["event_type"].isin(VALID_EVENTS)].copy()
    df = df[df["price"] > 0].copy()
    if df["event_time"].dt.tz is None:
        df["event_time"] = df["event_time"].dt.tz_localize("UTC")
    df["date"]         = pd.to_datetime(df["event_time"].dt.date)
    df["hour"]         = df["event_time"].dt.hour.astype("int8")
    df["day_of_week"]  = df["event_time"].dt.day_name().astype("category")
    df["week"]         = df["event_time"].dt.isocalendar().week.astype("int8")
    df["is_weekend"]   = df["day_of_week"].isin(["Saturday", "Sunday"])
    df["top_category"] = (
        df["category_code"].astype(str).str.split(".").str[0]
          .replace("nan", np.nan).astype("category")
    )
    return df


@st.cache_data(show_spinner=False)
def load_from_bytes(file_bytes: bytes, filename: str, sample_rows: int) -> pd.DataFrame:
    """Load from in-memory bytes (Streamlit uploader). Chunked to save RAM."""
    buf = io.BytesIO(file_bytes)
    chunks, rows = [], 0
    reader = pd.read_csv(buf, dtype=DTYPES, parse_dates=["event_time"], chunksize=500_000)
    prog = st.sidebar.progress(0, text="Reading uploaded file…")
    est = sample_rows if sample_rows else 5_000_000
    for chunk in reader:
        chunks.append(chunk)
        rows += len(chunk)
        prog.progress(min(int(rows / est * 100), 99), text=f"Read {rows:,} rows…")
        if sample_rows and rows >= sample_rows:
            break
    prog.progress(100, text="Cleaning…"); prog.empty()
    df = pd.concat(chunks, ignore_index=True); del chunks; gc.collect()
    return _clean_df(df)


@st.cache_data(show_spinner=False)
def load_from_url(url: str, sample_rows: int) -> pd.DataFrame:
    """Load from a direct-download URL (Google Drive, Dropbox, etc.)."""
    # Convert Google Drive share link → direct download link automatically
    gdrive_match = re.search(r"/d/([A-Za-z0-9_-]+)", url)
    if gdrive_match:
        file_id = gdrive_match.group(1)
        url = f"https://drive.google.com/uc?export=download&id={file_id}&confirm=t"

    prog = st.sidebar.progress(0, text="Downloading file…")
    with requests.get(url, stream=True, timeout=300) as r:
        r.raise_for_status()
        total = int(r.headers.get("content-length", 0))
        buf = io.BytesIO()
        downloaded = 0
        for chunk_bytes in r.iter_content(chunk_size=8 * 1024 * 1024):  # 8 MB chunks
            buf.write(chunk_bytes)
            downloaded += len(chunk_bytes)
            if total:
                prog.progress(min(int(downloaded / total * 100), 90),
                              text=f"Downloaded {downloaded/1e6:.0f} / {total/1e6:.0f} MB…")
    prog.progress(95, text="Parsing CSV…")
    buf.seek(0)
    chunks, rows = [], 0
    reader = pd.read_csv(buf, dtype=DTYPES, parse_dates=["event_time"], chunksize=500_000)
    for chunk in reader:
        chunks.append(chunk)
        rows += len(chunk)
        if sample_rows and rows >= sample_rows:
            break
    prog.progress(100, text="Cleaning…"); prog.empty()
    df = pd.concat(chunks, ignore_index=True); del chunks; gc.collect()
    return _clean_df(df)


@st.cache_data(show_spinner=False)
def load_from_path(csv_path: str, sample_rows: int) -> pd.DataFrame:
    """Load from a local file path. Only works when running app.py locally."""
    prog = st.sidebar.progress(0, text="Reading file…")
    est = sample_rows if sample_rows else max(os.path.getsize(csv_path) // 150, 1)
    chunks, rows = [], 0
    reader = pd.read_csv(csv_path, dtype=DTYPES, parse_dates=["event_time"], chunksize=500_000)
    for chunk in reader:
        chunks.append(chunk)
        rows += len(chunk)
        prog.progress(min(int(rows / est * 100), 99), text=f"Loaded {rows:,} rows…")
        if sample_rows and rows >= sample_rows:
            break
    prog.progress(100, text="Cleaning…"); prog.empty()
    df = pd.concat(chunks, ignore_index=True); del chunks; gc.collect()
    return _clean_df(df)


# ─────────────────────────────────────────────────────────────────────────────
# CACHED METRIC COMPUTATIONS
# ─────────────────────────────────────────────────────────────────────────────
@st.cache_data(show_spinner=False)
def compute_funnel(df):
    viewers    = int(df[df["event_type"] == "view"]["user_id"].nunique())
    carters    = int(df[df["event_type"] == "cart"]["user_id"].nunique())
    purchasers = int(df[df["event_type"] == "purchase"]["user_id"].nunique())
    v2c = carters    / viewers    * 100 if viewers > 0 else 0
    c2p = purchasers / carters    * 100 if carters > 0 else 0
    cvr = purchasers / viewers    * 100 if viewers > 0 else 0
    return dict(viewers=viewers, carters=carters, purchasers=purchasers,
                v2c=v2c, c2p=c2p, cvr=cvr, abandon=100 - c2p)

@st.cache_data(show_spinner=False)
def compute_revenue(df):
    p = df[df["event_type"] == "purchase"]
    return dict(total=float(p["price"].sum()), aov=float(p["price"].mean()),
                count=int(len(p)), per_day=float(p.groupby("date")["price"].sum().mean()))

@st.cache_data(show_spinner=False)
def compute_misc(df, purchasers):
    pc     = df[df["event_type"] == "purchase"].groupby("user_id").size()
    repeat = (pc > 1).sum() / purchasers * 100 if purchasers > 0 else 0
    eng    = set(df[df["event_type"].isin(["cart", "purchase"])]["user_id"])
    bounce = (1 - len(eng) / df["user_id"].nunique()) * 100
    return dict(repeat_rate=repeat, bounce=bounce,
                spu=df["user_session"].nunique() / df["user_id"].nunique())

@st.cache_data(show_spinner=False)
def compute_daily(df):
    return df.groupby(["date", "event_type"]).size().reset_index(name="count")

@st.cache_data(show_spinner=False)
def compute_cohort(df):
    uf = (df.groupby("user_id")["event_time"].min()
            .reset_index().rename(columns={"event_time": "first_time"}))
    uf["cohort_week"] = uf["first_time"].dt.isocalendar().week.astype(int)
    dc = df.merge(uf[["user_id", "cohort_week"]], on="user_id")
    dc["event_week"]  = dc["event_time"].dt.isocalendar().week.astype(int)
    dc["week_number"] = (dc["event_week"] - dc["cohort_week"]).clip(lower=0)
    pivot = dc.groupby(["cohort_week", "week_number"])["user_id"].nunique().unstack(fill_value=0)
    ret   = pivot.divide(pivot[0], axis=0) * 100
    ret.index   = [f"Week {w}" for w in ret.index]
    ret.columns = [f"W+{c}"   for c in ret.columns]
    return ret

@st.cache_data(show_spinner=False)
def compute_rfm(df):
    snap = df["event_time"].max()
    rfm  = (df[df["event_type"] == "purchase"]
            .groupby("user_id")
            .agg(Recency  =("event_time", lambda x: (snap - x.max()).days),
                 Frequency=("product_id", "count"),
                 Monetary =("price",      "sum"))
            .reset_index())
    for col, asc, lbl in [("Recency", False, "R"), ("Frequency", True, "F"), ("Monetary", True, "M")]:
        rfm[lbl] = pd.cut(
            rfm[col].rank(ascending=asc, method="first"), bins=5,
            labels=[5,4,3,2,1] if not asc else [1,2,3,4,5],
        ).astype(int)
    rfm["RFM"] = rfm["R"] + rfm["F"] + rfm["M"]
    rfm["Segment"] = rfm["RFM"].apply(
        lambda s: "Champions"           if s >= 13 else
                  "Loyal Customers"     if s >= 10 else
                  "Potential Loyalists" if s >=  7 else
                  "At Risk"             if s >=  5 else "Lost / Churned"
    )
    return rfm

@st.cache_data(show_spinner=False)
def compute_top_brands(df, n=12):
    return (df[(df["event_type"] == "purchase") & df["brand"].notna()]
            .groupby("brand")["price"].sum()
            .nlargest(n).reset_index().rename(columns={"price": "revenue"}))

@st.cache_data(show_spinner=False)
def compute_top_cats(df, n=10):
    return (df[(df["event_type"] == "purchase") & df["category_code"].notna()]
            .groupby("category_code").size()
            .nlargest(n).reset_index(name="purchases"))

@st.cache_data(show_spinner=False)
def compute_daily_rev(df):
    dr = (df[df["event_type"] == "purchase"]
          .groupby("date")["price"].sum().reset_index(name="revenue"))
    dr["rolling_7d"] = dr["revenue"].rolling(7, min_periods=1).mean()
    return dr


# ─────────────────────────────────────────────────────────────────────────────
# SIDEBAR
# ─────────────────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("## ⚙️ Data Source")

    # ── Choose loading method ─────────────────────────────────────────────────
    load_mode = st.radio(
        "How to load data",
        ["⬆️  Upload file", "🔗  URL (Google Drive / Dropbox)", "📁  Local path (local only)"],
        index=0,
        help="Upload works on Streamlit Cloud. URL works anywhere. Local path only works when running app.py on your own machine.",
    )

    uploaded_file = None
    gdrive_url    = ""
    local_path    = ""

    if load_mode == "⬆️  Upload file":
        st.markdown(
            '<p style="font-size:0.8rem;color:#8B949E;margin-bottom:6px;">'
            'Upload your Kaggle CSV directly.<br>'
            '<b style="color:#FFA940;">Tip:</b> compress to .gz first to upload faster:<br>'
            '<code style="font-size:0.75rem;">gzip 2019-Nov.csv</code> → uploads as 500 MB instead of 9 GB.</p>',
            unsafe_allow_html=True,
        )
        uploaded_file = st.file_uploader(
            "Choose CSV or CSV.GZ file",
            type=["csv", "gz"],
            help="Streamlit Cloud allows up to 200 MB by default. Add .streamlit/config.toml to raise the limit (see README).",
        )
        if uploaded_file:
            mb = uploaded_file.size / 1e6
            st.caption(f"📦 File size: {mb:.1f} MB")

    elif load_mode == "🔗  URL (Google Drive / Dropbox)":
        st.markdown(
            '<p style="font-size:0.8rem;color:#8B949E;margin-bottom:6px;">'
            'Paste a <b style="color:#C9D1D9;">Google Drive share link</b> or any direct download URL.<br>'
            '<b>How to get Google Drive link:</b><br>'
            '1. Upload CSV to Google Drive<br>'
            '2. Right-click → Share → "Anyone with link"<br>'
            '3. Copy link and paste below</p>',
            unsafe_allow_html=True,
        )
        gdrive_url = st.text_input(
            "Google Drive / Direct URL",
            placeholder="https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing",
        )

    else:  # Local path
        st.markdown(
            '<p style="font-size:0.8rem;color:#FF6B6B;margin-bottom:6px;">'
            '⚠️ <b>Local path only works when running app.py on your own machine.</b><br>'
            'It will NOT work on Streamlit Cloud — use Upload or URL instead.</p>',
            unsafe_allow_html=True,
        )
        local_csvs = []
        try:
            local_csvs = sorted(
                [f for f in os.listdir(".") if f.endswith(".csv") or f.endswith(".gz")],
                key=lambda x: os.path.getsize(x), reverse=True,
            )
        except Exception:
            pass
        if local_csvs:
            pick = st.selectbox("CSVs in current folder", ["— type path below —"] + local_csvs)
            local_path = pick if pick != "— type path below —" else ""
        local_path = st.text_input(
            "Full local path",
            value=local_path,
            placeholder="C:/Users/sniks/OneDrive/Desktop/ecom/2019-Nov.csv",
        )

    st.markdown("---")
    st.markdown("### 🔢 Load Settings")

    SAMPLE_MAP = {
        "500 K rows  (fast, good for EDA)": 500_000,
        "1 M rows":                          1_000_000,
        "2 M rows":                          2_000_000,
        "5 M rows":                          5_000_000,
        "All rows  (needs 16 GB+ RAM)":      0,
    }
    sample_rows = SAMPLE_MAP[st.selectbox("Rows to load", list(SAMPLE_MAP.keys()))]

    st.markdown("---")
    st.markdown("### 🔎 Event Filter")
    filter_events = st.multiselect(
        "Show event types",
        ["view", "cart", "remove_from_cart", "purchase"],
        default=["view", "cart", "purchase"],
    )

    load_btn = st.button("▶  Load / Reload Data", type="primary", use_container_width=True)

    st.markdown("---")
    st.markdown(
        '<p style="font-size:0.78rem;color:#8B949E;">'
        '<b style="color:#C9D1D9;">Dataset:</b><br>'
        '<a href="https://www.kaggle.com/mkechinov/ecommerce-behavior-data-from-multi-category-store" '
        'style="color:#58A6FF;">Kaggle — eCommerce Behavior</a><br>'
        'Files: 2019-Oct → 2020-Apr · ~9 GB/file</p>',
        unsafe_allow_html=True,
    )


# ─────────────────────────────────────────────────────────────────────────────
# HEADER
# ─────────────────────────────────────────────────────────────────────────────
st.markdown("""
<div class="dash-header">
  <h1>🛒 eCommerce Funnel &amp; Retention Analysis</h1>
  <p>Multi-Category Online Store · Kaggle Dataset · Amazon Interview-Level Dashboard</p>
  <span class="dash-badge">Upload · Google Drive URL · Local path · Dark-mode native</span>
</div>
""", unsafe_allow_html=True)


# ─────────────────────────────────────────────────────────────────────────────
# LOAD TRIGGER
# ─────────────────────────────────────────────────────────────────────────────
if "df_full" not in st.session_state:
    st.session_state["df_full"] = None

if load_btn:
    try:
        if load_mode == "⬆️  Upload file":
            if uploaded_file is None:
                st.error("⚠️  Please choose a file to upload first.")
                st.stop()
            with st.spinner(f"⏳ Reading **{uploaded_file.name}**…"):
                st.session_state["df_full"] = load_from_bytes(
                    uploaded_file.read(), uploaded_file.name, sample_rows
                )

        elif load_mode == "🔗  URL (Google Drive / Dropbox)":
            if not gdrive_url.strip():
                st.error("⚠️  Paste a Google Drive or direct download URL first.")
                st.stop()
            with st.spinner("⏳ Downloading file from URL…"):
                st.session_state["df_full"] = load_from_url(gdrive_url.strip(), sample_rows)

        else:  # local path
            if not local_path.strip():
                st.error("⚠️  Enter a local file path first.")
                st.stop()
            clean = os.path.normpath(local_path.strip().strip('"\'"'))
            if not os.path.exists(clean):
                st.error(
                    f"❌ File not found: `{clean}`\n\n"
                    "This mode only works when running **locally**. "
                    "On Streamlit Cloud, use **Upload** or **URL** instead."
                )
                st.stop()
            with st.spinner(f"⏳ Loading **{os.path.basename(clean)}**…"):
                st.session_state["df_full"] = load_from_path(clean, sample_rows)

        n = len(st.session_state["df_full"])
        st.success(f"✅ Loaded **{n:,} rows** successfully!")

    except requests.exceptions.RequestException as e:
        st.error(f"❌ Download failed: {e}\n\nMake sure the Google Drive file is set to **Anyone with the link** can view.")
        st.stop()
    except Exception as e:
        st.error(f"❌ Error loading data: {e}")
        st.stop()

# ── Not yet loaded ─────────────────────────────────────────────────────────────
if st.session_state["df_full"] is None:
    st.markdown("""
    <div class="path-hint">
      <h3 style="color:#C9D1D9;margin:0 0 14px;">📂 Load Your Kaggle Data</h3>
      <p style="margin-bottom:16px;">Choose one of the three methods in the sidebar:</p>
      <table style="width:100%;font-size:0.82rem;border-collapse:collapse;">
        <tr>
          <td style="padding:10px 12px;background:#1C2B3A;border-radius:6px 6px 0 0;color:#4FA8D5;font-weight:700;">⬆️ Upload file</td>
          <td style="padding:10px 12px;background:#1C2B3A;border-radius:6px 6px 0 0;color:#C9D1D9;">
            Best for files under 200 MB. Compress first:<br>
            <code>gzip 2019-Nov.csv</code> → becomes ~500 MB → upload the .gz file
          </td>
        </tr>
        <tr><td colspan="2" style="height:6px;"></td></tr>
        <tr>
          <td style="padding:10px 12px;background:#1C2B3A;border-radius:6px 6px 0 0;color:#52C41A;font-weight:700;">🔗 Google Drive URL</td>
          <td style="padding:10px 12px;background:#1C2B3A;border-radius:6px 6px 0 0;color:#C9D1D9;">
            <b>Best for large files (9 GB).</b><br>
            1. Upload CSV to Google Drive<br>
            2. Right-click → Share → Anyone with the link → Copy<br>
            3. Paste the link in the sidebar
          </td>
        </tr>
        <tr><td colspan="2" style="height:6px;"></td></tr>
        <tr>
          <td style="padding:10px 12px;background:#1C2B3A;border-radius:6px 6px 0 0;color:#FFA940;font-weight:700;">📁 Local path</td>
          <td style="padding:10px 12px;background:#1C2B3A;border-radius:6px 6px 0 0;color:#C9D1D9;">
            Only works when running <code>streamlit run app.py</code> on your own machine.<br>
            <b>Does NOT work on Streamlit Cloud.</b>
          </td>
        </tr>
      </table>
    </div>
    """, unsafe_allow_html=True)
    st.stop()

# ─────────────────────────────────────────────────────────────────────────────
# DATA READY
# ─────────────────────────────────────────────────────────────────────────────
df_full = st.session_state["df_full"]
df = df_full[df_full["event_type"].isin(filter_events)].copy() if filter_events else df_full.copy()

# ── Status bar ────────────────────────────────────────────────────────────────
s1, s2, s3, s4, s5 = st.columns(5)
s1.metric("Rows Loaded",     f"{len(df_full):,}")
s2.metric("Unique Users",    f"{df_full['user_id'].nunique():,}")
s3.metric("Unique Products", f"{df_full['product_id'].nunique():,}")
s4.metric("Date Start",      str(df_full["date"].min().date()))
s5.metric("Date End",        str(df_full["date"].max().date()))
st.markdown("<br>", unsafe_allow_html=True)

# ─────────────────────────────────────────────────────────────────────────────
# COMPUTE ALL METRICS
# ─────────────────────────────────────────────────────────────────────────────
with st.spinner("⚙️  Computing metrics…"):
    funnel     = compute_funnel(df_full)
    rev        = compute_revenue(df_full)
    misc       = compute_misc(df_full, funnel["purchasers"])
    daily_df   = compute_daily(df_full)
    retention  = compute_cohort(df_full)
    rfm        = compute_rfm(df_full)
    top_brands = compute_top_brands(df_full)
    top_cats   = compute_top_cats(df_full)
    daily_rev  = compute_daily_rev(df_full)


# ─────────────────────────────────────────────────────────────────────────────
# TABS
# ─────────────────────────────────────────────────────────────────────────────
tab1, tab2, tab3, tab4, tab5, tab6 = st.tabs([
    "📊 Overview", "🔺 Funnel", "📅 Retention", "👥 RFM", "🔬 Deep Dive", "💡 Insights"
])


# ══════════════════════════════════════════════════════════════════════════════
# TAB 1 — OVERVIEW
# ══════════════════════════════════════════════════════════════════════════════
with tab1:
    st.markdown('<p class="sec-hdr">Key Performance Indicators</p>', unsafe_allow_html=True)
    k1, k2, k3, k4 = st.columns(4)
    k1.markdown(kpi_card(f"{funnel['cvr']:.2f}%",       "Overall CVR",          C["blue"],   f"View → Purchase"), unsafe_allow_html=True)
    k2.markdown(kpi_card(f"{funnel['v2c']:.1f}%",       "View → Cart Rate",     C["purple"], f"{100-funnel['v2c']:.1f}% drop-off"), unsafe_allow_html=True)
    k3.markdown(kpi_card(f"{funnel['c2p']:.1f}%",       "Cart → Purchase",      C["green"],  f"{funnel['abandon']:.1f}% abandon"), unsafe_allow_html=True)
    k4.markdown(kpi_card(f"{misc['repeat_rate']:.1f}%", "Repeat Purchase Rate", C["orange"], "Buyers who return"), unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)
    k5, k6, k7, k8 = st.columns(4)
    k5.markdown(kpi_card(fmt(rev['total'], "$"),          "Total Revenue",        C["teal"],   f"${rev['per_day']:,.0f}/day avg"), unsafe_allow_html=True)
    k6.markdown(kpi_card(f"${rev['aov']:.2f}",           "Avg Order Value",      C["yellow"], f"{rev['count']:,} purchases"), unsafe_allow_html=True)
    k7.markdown(kpi_card(f"{misc['bounce']:.1f}%",       "Bounce Rate",          C["red"],    "View-only users"), unsafe_allow_html=True)
    k8.markdown(kpi_card(f"{misc['spu']:.2f}x",          "Sessions / User",      C["blue"],   "Engagement depth"), unsafe_allow_html=True)

    st.markdown("---")
    st.markdown('<p class="sec-hdr">Daily Event Volume</p>', unsafe_allow_html=True)
    ev_filt = daily_df[daily_df["event_type"].isin(["view", "cart", "purchase"])]
    fig_daily = px.line(
        ev_filt, x="date", y="count", color="event_type",
        color_discrete_map={"view": C["blue"], "cart": C["purple"], "purchase": C["green"]},
        title="Daily Events by Type",
        labels={"count": "Events", "date": "Date", "event_type": "Type"},
    )
    fig_daily.update_traces(line_width=2.2)
    fig_daily.update_layout(**dark_layout(height=370, hovermode="x unified"))
    st.plotly_chart(fig_daily, use_container_width=True)

    st.markdown('<p class="sec-hdr">Hourly Traffic Pattern</p>', unsafe_allow_html=True)
    hourly = df_full.groupby("hour").size().reset_index(name="count")
    peak_h = int(hourly.loc[hourly["count"].idxmax(), "hour"])
    fig_hr = px.bar(
        hourly, x="hour", y="count",
        color="count",
        color_continuous_scale=[[0, "#1C2B3A"], [0.5, C["blue"]], [1, C["teal"]]],
        title=f"Events by Hour of Day (UTC)  ·  Peak: {peak_h}:00",
        labels={"hour": "Hour", "count": "Events"},
    )
    fig_hr.update_layout(**dark_layout(height=320, coloraxis_showscale=False))
    st.plotly_chart(fig_hr, use_container_width=True)

    col_a, col_b = st.columns(2)
    with col_a:
        ev_c = df_full["event_type"].value_counts().reset_index()
        ev_c.columns = ["event_type", "count"]
        fig_pie = px.pie(ev_c, names="event_type", values="count",
                         title="Event Type Distribution",
                         color_discrete_sequence=PALETTE, hole=0.42)
        fig_pie.update_traces(textinfo="percent+label", textfont={"size": 11, "color": "#E6EDF3"})
        fig_pie.update_layout(**dark_layout(height=340))
        st.plotly_chart(fig_pie, use_container_width=True)
    with col_b:
        wk = df_full[df_full["event_type"] == "purchase"].copy()
        wk["period"] = wk["is_weekend"].map({True: "Weekend", False: "Weekday"})
        wk_rev = wk.groupby("period")["price"].sum().reset_index(name="revenue")
        fig_wk = px.bar(wk_rev, x="period", y="revenue", color="period",
                        color_discrete_map={"Weekday": C["blue"], "Weekend": C["orange"]},
                        title="Revenue: Weekday vs Weekend",
                        labels={"revenue": "Revenue ($)", "period": ""},
                        text_auto=".3s")
        fig_wk.update_traces(textfont={"color": "#E6EDF3"})
        fig_wk.update_layout(**dark_layout(height=340, showlegend=False))
        st.plotly_chart(fig_wk, use_container_width=True)


# ══════════════════════════════════════════════════════════════════════════════
# TAB 2 — FUNNEL
# ══════════════════════════════════════════════════════════════════════════════
with tab2:
    st.markdown('<p class="sec-hdr">User Acquisition Funnel</p>', unsafe_allow_html=True)
    col_a, col_b = st.columns([1.1, 0.9])
    with col_a:
        fig_f = go.Figure(go.Funnel(
            y=["View", "Add to Cart", "Purchase"],
            x=[funnel["viewers"], funnel["carters"], funnel["purchasers"]],
            textinfo="value+percent previous",
            textfont={"size": 13, "color": "#E6EDF3"},
            marker={"color": [C["blue"], C["purple"], C["green"]],
                    "line":  {"width": 1, "color": "#30363D"}},
            connector={"line": {"color": "#30363D", "width": 2}},
        ))
        fig_f.update_layout(**dark_layout(
            height=400, title="Funnel: Unique Users per Stage",
            margin=dict(l=80, r=30, t=50, b=20)))
        st.plotly_chart(fig_f, use_container_width=True)
    with col_b:
        st.markdown("#### Stage Metrics")
        mdf = pd.DataFrame({
            "Stage":        ["View", "Add to Cart", "Purchase"],
            "Unique Users": [f"{funnel['viewers']:,}", f"{funnel['carters']:,}", f"{funnel['purchasers']:,}"],
            "% of Viewers": ["100.00%", f"{funnel['v2c']:.2f}%", f"{funnel['cvr']:.4f}%"],
            "Drop-off":     ["—", f"{100-funnel['v2c']:.2f}%", f"{funnel['abandon']:.2f}%"],
        })
        st.dataframe(mdf, use_container_width=True, hide_index=True)
        st.markdown("<br>", unsafe_allow_html=True)
        st.metric("Total Revenue",   f"${rev['total']:,.2f}")
        st.metric("Avg Order Value", f"${rev['aov']:.2f}")
        st.metric("Total Purchases", f"{rev['count']:,}")

    st.markdown("---")
    fig_drop = go.Figure()
    fig_drop.add_trace(go.Bar(
        x=["View → Cart Drop-off", "Cart → Purchase Abandon"],
        y=[100 - funnel["v2c"], funnel["abandon"]],
        marker_color=[C["red"], C["orange"]],
        text=[f"{100-funnel['v2c']:.1f}%", f"{funnel['abandon']:.1f}%"],
        textposition="outside",
        textfont={"color": "#E6EDF3", "size": 13},
        width=0.45,
    ))
    fig_drop.update_layout(**dark_layout(height=330, title="Drop-off Rate per Stage (%)",
                                          yaxis_range=[0, 110], yaxis_title="Drop-off %"))
    st.plotly_chart(fig_drop, use_container_width=True)

    st.markdown('<p class="sec-hdr">Daily CVR Trend</p>', unsafe_allow_html=True)
    dv = df_full[df_full["event_type"]=="view"].groupby("date")["user_id"].nunique()
    dp = df_full[df_full["event_type"]=="purchase"].groupby("date")["user_id"].nunique()
    dcvr = (dp / dv * 100).dropna().reset_index()
    dcvr.columns = ["date", "cvr"]
    fig_cvr = px.area(dcvr, x="date", y="cvr",
                      title="Daily Overall CVR (View → Purchase)",
                      labels={"cvr": "CVR (%)", "date": "Date"},
                      color_discrete_sequence=[C["green"]])
    fig_cvr.add_hline(y=float(dcvr["cvr"].mean()), line_dash="dash", line_color=C["red"],
                      annotation_text=f"Avg {dcvr['cvr'].mean():.2f}%",
                      annotation_font={"color": C["red"]})
    fig_cvr.update_layout(**dark_layout(height=330))
    st.plotly_chart(fig_cvr, use_container_width=True)

    st.markdown('<p class="sec-hdr">Purchase Price Distribution</p>', unsafe_allow_html=True)
    prices = df_full[df_full["event_type"] == "purchase"]["price"]
    fig_price = px.histogram(prices, nbins=100, title="Purchase Price Distribution",
                              labels={"value": "Price (USD)", "count": "Frequency"},
                              color_discrete_sequence=[C["blue"]])
    fig_price.add_vline(x=float(prices.median()), line_dash="dash", line_color=C["orange"],
                        annotation_text=f"Median ${prices.median():.2f}",
                        annotation_font={"color": C["orange"]})
    fig_price.add_vline(x=float(prices.mean()), line_dash="dash", line_color=C["red"],
                        annotation_text=f"Mean ${prices.mean():.2f}",
                        annotation_font={"color": C["red"]})
    fig_price.update_layout(**dark_layout(height=330,
                                           xaxis_range=[0, float(prices.quantile(0.98))]))
    st.plotly_chart(fig_price, use_container_width=True)


# ══════════════════════════════════════════════════════════════════════════════
# TAB 3 — RETENTION
# ══════════════════════════════════════════════════════════════════════════════
with tab3:
    st.markdown('<p class="sec-hdr">Cohort Retention Heatmap</p>', unsafe_allow_html=True)
    fig_heat = go.Figure(go.Heatmap(
        z=retention.values,
        x=retention.columns.tolist(),
        y=retention.index.tolist(),
        colorscale=[[0,"#3D0C02"],[0.3,"#7B2D00"],[0.6,"#D4A017"],[1, C["green"]]],
        zmin=0, zmax=100,
        text=[[f"{v:.1f}%" if not np.isnan(v) else "" for v in row] for row in retention.values],
        texttemplate="%{text}",
        textfont={"size": 10, "color": "#E6EDF3"},
        hoverongaps=False,
        colorbar={"title": {"text": "Retention %", "font": {"color": "#E6EDF3"}},
                  "tickfont": {"color": "#C9D1D9"}},
    ))
    fig_heat.update_layout(**dark_layout(
        height=max(360, len(retention) * 52 + 80),
        title="Weekly Cohort Retention (% of cohort still active)",
        xaxis_title="Weeks Since First Event",
        yaxis_title="Acquisition Cohort",
    ))
    st.plotly_chart(fig_heat, use_container_width=True)

    st.markdown('<p class="sec-hdr">Retention Curves by Cohort</p>', unsafe_allow_html=True)
    fig_ret = go.Figure()
    for i, (idx, row) in enumerate(retention.iterrows()):
        valid = row.dropna()
        fig_ret.add_trace(go.Scatter(
            x=list(range(len(valid))), y=valid.values,
            mode="lines+markers", name=idx,
            line={"color": PALETTE[i % len(PALETTE)], "width": 2},
            marker={"size": 6},
        ))
    fig_ret.update_layout(**dark_layout(
        height=370, hovermode="x unified",
        title="Retention Curves — Each Line = One Cohort Week",
        xaxis_title="Weeks Since Acquisition",
        yaxis_title="Retention Rate (%)", yaxis_range=[0, 105],
    ))
    st.plotly_chart(fig_ret, use_container_width=True)

    r1, r2, r3 = st.columns(3)
    if "W+1" in retention.columns: r1.metric("Avg Week+1 Retention", f"{retention['W+1'].mean():.1f}%")
    if "W+2" in retention.columns: r2.metric("Avg Week+2 Retention", f"{retention['W+2'].mean():.1f}%")
    if "W+3" in retention.columns: r3.metric("Avg Week+3 Retention", f"{retention['W+3'].mean():.1f}%")

    st.markdown('<p class="sec-hdr" style="margin-top:16px;">Raw Retention Matrix (%)</p>', unsafe_allow_html=True)
    st.dataframe(retention.round(1).style.background_gradient(cmap="RdYlGn", axis=None, vmin=0, vmax=100),
                 use_container_width=True)


# ══════════════════════════════════════════════════════════════════════════════
# TAB 4 — RFM
# ══════════════════════════════════════════════════════════════════════════════
with tab4:
    SEG_COLORS = {
        "Champions":           C["green"],
        "Loyal Customers":     C["blue"],
        "Potential Loyalists": C["orange"],
        "At Risk":             C["red"],
        "Lost / Churned":      C["teal"],
    }
    SEG_ORDER = list(SEG_COLORS.keys())

    sc = rfm["Segment"].value_counts().reindex(SEG_ORDER).fillna(0).reset_index()
    sc.columns = ["Segment", "Users"]
    sr = rfm.groupby("Segment")["Monetary"].sum().reindex(SEG_ORDER).fillna(0).reset_index()
    sr.columns = ["Segment", "Revenue"]

    col_a, col_b = st.columns(2)
    with col_a:
        fig_pie = px.pie(sc, names="Segment", values="Users",
                         title="User Distribution by RFM Segment",
                         color="Segment", color_discrete_map=SEG_COLORS, hole=0.42)
        fig_pie.update_traces(textinfo="percent+label", textfont={"size": 11, "color": "#E6EDF3"})
        fig_pie.update_layout(**dark_layout(height=380))
        st.plotly_chart(fig_pie, use_container_width=True)
    with col_b:
        fig_rev_rfm = px.bar(sr, x="Revenue", y="Segment", orientation="h",
                              title="Revenue by RFM Segment",
                              color="Segment", color_discrete_map=SEG_COLORS,
                              labels={"Revenue": "Total Revenue ($)"})
        fig_rev_rfm.update_layout(**dark_layout(height=380, showlegend=False))
        st.plotly_chart(fig_rev_rfm, use_container_width=True)

    st.markdown('<p class="sec-hdr">RFM Scatter: Recency vs Monetary  (size = Frequency)</p>', unsafe_allow_html=True)
    samp = rfm.sample(min(10_000, len(rfm)), random_state=42)
    fig_sc = px.scatter(
        samp, x="Recency", y="Monetary",
        size=np.sqrt(samp["Frequency"].clip(1)) * 3,
        color="Segment", color_discrete_map=SEG_COLORS,
        title="RFM Scatter — each dot = one purchasing user",
        labels={"Recency": "Recency (days)", "Monetary": "Total Spend ($)"},
        opacity=0.65, hover_data=["Frequency"],
    )
    fig_sc.update_layout(**dark_layout(height=420))
    st.plotly_chart(fig_sc, use_container_width=True)

    st.markdown('<p class="sec-hdr">Segment Summary</p>', unsafe_allow_html=True)
    summ = (rfm.groupby("Segment")
            .agg(Users=("user_id","count"), Avg_Recency=("Recency","mean"),
                 Avg_Orders=("Frequency","mean"), Avg_Revenue=("Monetary","mean"),
                 Total_Revenue=("Monetary","sum"))
            .round(2).reindex(SEG_ORDER).reset_index())
    st.dataframe(summ, use_container_width=True, hide_index=True)


# ══════════════════════════════════════════════════════════════════════════════
# TAB 5 — DEEP DIVE
# ══════════════════════════════════════════════════════════════════════════════
with tab5:
    col_a, col_b = st.columns(2)
    with col_a:
        fig_brand = px.bar(
            top_brands.sort_values("revenue"),
            x="revenue", y="brand", orientation="h",
            title="Top Brands by Purchase Revenue",
            color="revenue",
            color_continuous_scale=[[0,"#1C2B3A"],[1, C["blue"]]],
            labels={"revenue": "Revenue ($)", "brand": "Brand"},
        )
        fig_brand.update_layout(**dark_layout(height=420, coloraxis_showscale=False))
        st.plotly_chart(fig_brand, use_container_width=True)
    with col_b:
        fig_cat = px.bar(
            top_cats.sort_values("purchases"),
            x="purchases", y="category_code", orientation="h",
            title="Top Categories by Purchase Volume",
            color="purchases",
            color_continuous_scale=[[0,"#1C1B3A"],[1, C["purple"]]],
            labels={"purchases": "Purchases", "category_code": "Category"},
        )
        fig_cat.update_layout(**dark_layout(height=420, coloraxis_showscale=False))
        st.plotly_chart(fig_cat, use_container_width=True)

    st.markdown('<p class="sec-hdr">Event Intensity: Day × Hour</p>', unsafe_allow_html=True)
    DAY_ORDER = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
    hmap_raw = df_full.groupby(["day_of_week","hour"]).size().reset_index(name="count")
    hmap_raw["day_of_week"] = pd.Categorical(hmap_raw["day_of_week"], categories=DAY_ORDER, ordered=True)
    pivot_h = (hmap_raw.sort_values("day_of_week")
               .pivot(index="day_of_week", columns="hour", values="count").fillna(0))
    fig_hmap = px.imshow(
        pivot_h,
        color_continuous_scale=[[0,"#0F1117"],[0.4, C["navy"]],[1, C["orange"]]],
        title="Heatmap: Day of Week × Hour of Day (UTC)",
        labels={"x":"Hour","y":"Day","color":"Events"},
        aspect="auto",
    )
    fig_hmap.update_layout(**dark_layout(height=340))
    st.plotly_chart(fig_hmap, use_container_width=True)

    st.markdown('<p class="sec-hdr">Category Conversion Rates</p>', unsafe_allow_html=True)
    top8 = top_cats.head(8)["category_code"].tolist()
    cat_rows = []
    for cat in top8:
        v = df_full[(df_full["event_type"]=="view")    &(df_full["category_code"]==cat)]["user_id"].nunique()
        c = df_full[(df_full["event_type"]=="cart")    &(df_full["category_code"]==cat)]["user_id"].nunique()
        p = df_full[(df_full["event_type"]=="purchase")&(df_full["category_code"]==cat)]["user_id"].nunique()
        cat_rows.append({"Category": cat,
                          "View→Cart %":      round(c/v*100, 2) if v > 0 else 0,
                          "Cart→Purchase %":  round(p/c*100, 2) if c > 0 else 0,
                          "Overall CVR %":    round(p/v*100, 4) if v > 0 else 0})
    cat_cvr = pd.DataFrame(cat_rows).sort_values("Overall CVR %", ascending=False)
    fig_ccvr = px.bar(
        cat_cvr.melt(id_vars="Category", value_vars=["View→Cart %","Cart→Purchase %"]),
        x="value", y="Category", color="variable", orientation="h", barmode="group",
        title="Category CVR — View→Cart vs Cart→Purchase",
        labels={"value":"Rate (%)","variable":"Stage"},
        color_discrete_map={"View→Cart %": C["blue"], "Cart→Purchase %": C["green"]},
    )
    fig_ccvr.update_layout(**dark_layout(height=380))
    st.plotly_chart(fig_ccvr, use_container_width=True)
    st.dataframe(cat_cvr, use_container_width=True, hide_index=True)

    st.markdown('<p class="sec-hdr">Revenue Trend</p>', unsafe_allow_html=True)
    fig_roll = go.Figure()
    fig_roll.add_trace(go.Bar(x=daily_rev["date"], y=daily_rev["revenue"],
                               name="Daily Revenue", marker_color="rgba(79,168,213,0.4)"))
    fig_roll.add_trace(go.Scatter(x=daily_rev["date"], y=daily_rev["rolling_7d"],
                                   name="7-Day Rolling Avg",
                                   line={"color": C["orange"], "width": 2.5}))
    fig_roll.update_layout(**dark_layout(height=360, hovermode="x unified",
                                          title="Daily Revenue + 7-Day Rolling Average",
                                          xaxis_title="Date", yaxis_title="Revenue ($)"))
    st.plotly_chart(fig_roll, use_container_width=True)


# ══════════════════════════════════════════════════════════════════════════════
# TAB 6 — INSIGHTS & RECOMMENDATIONS
# ══════════════════════════════════════════════════════════════════════════════
with tab6:
    st.markdown('<p class="sec-hdr">Automated Insights from Your Data</p>', unsafe_allow_html=True)

    hourly_for_peak = df_full.groupby("hour").size()
    peak_hour = int(hourly_for_peak.idxmax())

    insight_list = [
        (C["red"],    "🔴 Critical — Funnel Drop-off",
         f"Only <b>{funnel['v2c']:.1f}%</b> of viewers add to cart — the single largest revenue leak. "
         f"Fix: improve product page UX, add reviews, clearer pricing."),
        (C["red"],    "🔴 Critical — Cart Abandonment",
         f"<b>{funnel['abandon']:.1f}%</b> of cart-adds never convert. "
         f"Cart recovery emails within 1h can recapture 10–15% of these."),
        (C["orange"], "🟠 High — Retention Cliff",
         "Most users never return after their first session. "
         "A Day-3 / Day-7 personalised push or email can significantly lift Week+1 retention."),
        (C["orange"], "🟠 High — High Bounce Rate",
         f"<b>{misc['bounce']:.1f}%</b> of users view only and never cart or purchase. "
         f"Indicates trust/price/discovery friction at the listing level."),
        (C["green"],  "🟢 Positive — Strong Repeat Buyers",
         f"<b>{misc['repeat_rate']:.1f}%</b> of purchasers buy again this month. "
         f"A VIP loyalty program could unlock major LTV from this cohort."),
        (C["teal"],   f"🔵 Strategic — Peak Traffic at {peak_hour}:00 UTC",
         f"Hour {peak_hour} has the highest event volume. All campaigns — "
         f"email, push, flash sales — should target this window."),
    ]

    for color, title, body in insight_list:
        st.markdown(
            f'<div class="insight-box" style="border-left-color:{color};">'
            f'<b style="color:{color};">{title}</b><br>'
            f'<span style="font-size:0.87rem;">{body}</span></div>',
            unsafe_allow_html=True,
        )

    st.markdown("---")
    st.markdown('<p class="sec-hdr">Strategic Recommendations</p>', unsafe_allow_html=True)
    recs = pd.DataFrame([
        {"Priority":"🔴 P1","Initiative":"Abandoned Cart Recovery",   "Action":"Auto-email within 1h; A/B 5% vs 10% off", "Impact":"+10–15% Cart CVR","Effort":"🟢 Low"},
        {"Priority":"🔴 P1","Initiative":"Checkout UX Overhaul",      "Action":"< 5 fields; 1-click for returning users",   "Impact":"+8–12% CVR",      "Effort":"🟡 Medium"},
        {"Priority":"🟠 P2","Initiative":"Week-1 Retention Push",     "Action":"Day 3 & Day 7 personalised push",           "Impact":"+15–20% W+1",     "Effort":"🟢 Low"},
        {"Priority":"🟠 P2","Initiative":"Smart Discount Engine",     "Action":"5% coupon at cart >$150; max 2x/user/mo",   "Impact":"+7% AOV",         "Effort":"🟡 Medium"},
        {"Priority":"🟡 P3","Initiative":"Champions Loyalty Program", "Action":"VIP badge, early access, free shipping",    "Impact":"+20% Repeat",     "Effort":"🔴 High"},
        {"Priority":"🟡 P3","Initiative":"Cross-sell Engine",         "Action":"'Frequently Bought Together' on top PDPs",  "Impact":"+5% Basket",      "Effort":"🟡 Medium"},
        {"Priority":"🔵 P4","Initiative":"Real-time Personalisation", "Action":"Browsed-category homepage for returners",   "Impact":"+12% Engagement", "Effort":"🔴 High"},
    ])
    st.dataframe(recs, use_container_width=True, hide_index=True)

    st.markdown("---")
    st.markdown('<p class="sec-hdr">A/B Test Roadmap</p>', unsafe_allow_html=True)
    ab = pd.DataFrame([
        {"Test":"A","Hypothesis":"1-click checkout cuts abandonment",   "Metric":"Cart→Purchase CVR","Duration":"2 weeks"},
        {"Test":"B","Hypothesis":"Discount popup at cart boosts rev",   "Metric":"Revenue/Session",  "Duration":"2 weeks"},
        {"Test":"C","Hypothesis":"8PM push outperforms 6PM",           "Metric":"Notification CTR", "Duration":"1 week"},
        {"Test":"D","Hypothesis":"Cross-sell widget grows basket",      "Metric":"Avg Basket ($)",   "Duration":"3 weeks"},
        {"Test":"E","Hypothesis":"Loyalty program raises 30-day LTV",  "Metric":"Revenue/User",     "Duration":"4 weeks"},
    ])
    st.dataframe(ab, use_container_width=True, hide_index=True)


# ─────────────────────────────────────────────────────────────────────────────
# FOOTER
# ─────────────────────────────────────────────────────────────────────────────
st.markdown("---")
st.markdown(
    '<p style="text-align:center;color:#6B7280;font-size:0.73rem;">'
    'eCommerce Funnel &amp; Retention Dashboard v2 · '
    'Dataset: <a href="https://www.kaggle.com/mkechinov/ecommerce-behavior-data-from-multi-category-store" '
    'style="color:#4FA8D5;" target="_blank">Kaggle — Multi-Category Store</a> · '
    'Open CDP / REES46 Marketing Platform'
    '</p>',
    unsafe_allow_html=True,
)
