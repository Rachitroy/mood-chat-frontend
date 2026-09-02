import { useState, useEffect, useRef } from "react";
import { api } from "../lib/api.js";

export default function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const snowflakesRef = useRef([]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fn = mode === "login" ? api.login : api.register;
      const data = await fn(username.trim(), password);
      onAuthenticated(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Track mouse position for snowflake attraction
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      // Apply attraction to nearby snowflakes
      snowflakesRef.current.forEach((flake) => {
        if (!flake) return;

        const rect = flake.getBoundingClientRect();
        const flakeX = rect.left + rect.width / 2;
        const flakeY = rect.top + rect.height / 2;

        const dx = e.clientX - flakeX;
        const dy = e.clientY - flakeY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const attractionRadius = 200; // Radius of attraction

        if (distance < attractionRadius) {
          // Follow cursor directly
          const moveX = dx * 0.4; // Smooth follow with damping
          const moveY = dy * 0.4;

          flake.style.transform = `translate(${moveX}px, ${moveY}px)`;
          flake.style.transition = "transform 0.1s ease-out";
        } else {
          flake.style.transform = "translate(0, 0)";
          flake.style.transition = "transform 0.3s ease-out";
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Generate 40 snowflakes for high density
  const snowflakes = Array.from({ length: 40 }, (_, i) => (
    <div
      key={`snow-${i}`}
      ref={(el) => (snowflakesRef.current[i] = el)}
      className={`snowflake snowflake-${(i % 20) + 1}`}
    >
      ❄
    </div>
  ));

  return (
    <div className="auth-screen">
      {/* High density snowflake particles */}
      {snowflakes}

      <div className="auth-card">
        <div className="auth-card-inner">
          <p className="auth-eyebrow">💬 Mood Chat</p>
          <h1 className="auth-title">{mode === "login" ? "Welcome back" : "Create an account"}</h1>
          <p className="auth-subtitle">
            {mode === "login"
              ? "Sign in to keep the conversation going."
              : "Pick a username — this is how others will find you."}
          </p>

          {error && <div className="error-banner">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                minLength={3}
                maxLength={32}
                required
                autoComplete="username"
                placeholder="Enter your username"
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                placeholder="Enter your password"
              />
            </div>
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Sign up"}
            </button>
          </form>

          <div className="auth-switch">
            {mode === "login" ? (
              <>
                New here?{" "}
                <button type="button" onClick={() => { setMode("register"); setError(""); }}>
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button type="button" onClick={() => { setMode("login"); setError(""); }}>
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
