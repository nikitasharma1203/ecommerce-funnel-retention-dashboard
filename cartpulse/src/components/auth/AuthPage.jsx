import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function AuthPage() {
  const { login, signup, demoLogin } = useAuth();
  const [tab, setTab]       = useState("login");
  const [email, setEmail]   = useState("");
  const [pass, setPass]     = useState("");
  const [name, setName]     = useState("");
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setError("");
    if (!email || !pass) { setError("Please fill in all fields."); return; }
    if (pass.length < 6)  { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      if (tab === "login") await login(email, pass);
      else await signup(email, pass, name || email.split("@")[0]);
    } catch (e) {
      setError(
        e.code === "auth/user-not-found"     ? "No account found with this email." :
        e.code === "auth/wrong-password"     ? "Incorrect password." :
        e.code === "auth/email-already-in-use" ? "Email already registered." :
        e.code === "auth/invalid-email"      ? "Invalid email address." :
        e.code === "auth/network-request-failed" ? "Network error. Check your connection." :
        "Authentication failed. Check your Firebase config."
      );
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.page}>
      {/* Background glows */}
      <div style={styles.glow1} />
      <div style={styles.glow2} />

      <div style={styles.box}>
        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoIcon}>🛒</div>
          <span style={styles.logoText}>Cart<span style={styles.logoAccent}>Pulse</span></span>
        </div>
        <p style={styles.tagline}>eCommerce Behavioral Analytics</p>

        {/* Tabs */}
        <div style={styles.tabs}>
          {["login","signup"].map((t) => (
            <button key={t} style={{ ...styles.tab, ...(tab===t ? styles.tabActive : {}) }}
              onClick={() => { setTab(t); setError(""); }}>
              {t === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Fields */}
        {tab === "signup" && (
          <input style={styles.input} placeholder="Full name" value={name}
            onChange={e => setName(e.target.value)} />
        )}
        <input style={styles.input} placeholder="Email address" type="email"
          value={email} onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handle()} />
        <input style={styles.input} placeholder="Password (min 6 chars)" type="password"
          value={pass} onChange={e => setPass(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handle()} />

        <button style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
          onClick={handle} disabled={loading}>
          {loading ? "Please wait…" : tab === "login" ? "Sign In" : "Create Account"}
        </button>

        <div style={styles.divider}><span style={styles.dividerText}>or</span></div>

        <button style={styles.demoBtn} onClick={demoLogin}>
          ⚡ Continue with Demo Account
        </button>

        <p style={styles.hint}>
          Demo credentials: demo@cartpulse.io / demo123
        </p>
        <p style={styles.hint}>
          Powered by Firebase Auth · Data from{" "}
          <a href="https://github.com/nikitasharma1203/ecommerce-funnel-retention-dashboard"
            target="_blank" rel="noopener noreferrer" style={{ color: "#6366f1" }}>
            Nikita Sharma's dataset
          </a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
    background: "#09111e", position: "relative", overflow: "hidden",
  },
  glow1: {
    position: "absolute", top: "10%", left: "5%",
    width: 500, height: 500, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  glow2: {
    position: "absolute", bottom: "10%", right: "5%",
    width: 400, height: 400, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  box: {
    background: "rgba(15,26,45,0.95)", border: "1px solid rgba(99,130,180,0.2)",
    borderRadius: 20, padding: "44px 40px", width: 420,
    position: "relative", zIndex: 1, backdropFilter: "blur(12px)",
    boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
  },
  logo: { display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 6 },
  logoIcon: {
    width: 42, height: 42, background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
  },
  logoText: { fontSize: 26, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.5px" },
  logoAccent: { background: "linear-gradient(135deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  tagline: { textAlign: "center", fontSize: 13, color: "#64748b", marginBottom: 28 },
  tabs: { display: "flex", background: "#162035", borderRadius: 10, padding: 4, marginBottom: 20 },
  tab: {
    flex: 1, padding: "8px 0", borderRadius: 8, border: "none",
    background: "transparent", color: "#94a3b8", fontSize: 14, fontWeight: 500,
    cursor: "pointer", transition: "all 0.18s",
  },
  tabActive: { background: "#6366f1", color: "#fff" },
  error: {
    background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: 8, padding: "9px 14px", fontSize: 13, color: "#fca5a5", marginBottom: 12,
  },
  input: {
    width: "100%", background: "#162035", border: "1px solid rgba(99,130,180,0.2)",
    borderRadius: 10, padding: "11px 14px", color: "#f1f5f9",
    fontSize: 14, marginBottom: 10, outline: "none", display: "block",
    fontFamily: "inherit",
  },
  btn: {
    width: "100%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none",
    borderRadius: 10, padding: 14, color: "#fff", fontSize: 15, fontWeight: 600,
    cursor: "pointer", marginTop: 4, transition: "all 0.18s", fontFamily: "inherit",
  },
  divider: { textAlign: "center", position: "relative", margin: "16px 0" },
  dividerText: {
    background: "#0f1a2d", padding: "0 10px", fontSize: 13, color: "#475569",
    position: "relative", zIndex: 1,
  },
  demoBtn: {
    width: "100%", background: "transparent",
    border: "1px solid rgba(99,130,180,0.25)", borderRadius: 10, padding: 12,
    color: "#94a3b8", fontSize: 14, cursor: "pointer", transition: "all 0.18s",
    fontFamily: "inherit",
  },
  hint: { textAlign: "center", fontSize: 11, color: "#475569", marginTop: 12 },
};
