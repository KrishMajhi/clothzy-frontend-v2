import React, { useState } from "react";
import { API_BASE_URL } from "../config/api";

import { useAuth } from "../context/AuthContext";
import Home from "./Home";
import "./LoginSignup.css";
import { useShop } from "../context/ShopContext";
function getStrength(val) {
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  return score;
}

const STRENGTH_COLORS = ["#e53e3e", "#ed8936", "#48bb78", "#2d9b6f"];

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pwdStrength, setPwdStrength] = useState(0);

  const { fetchCurrentUser, user } = useAuth();
  const clearForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setPwdStrength(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreed) {
      alert("Please agree to the terms and conditions.");
      return;
    }

    try {
      if (isLogin) {
        const response = await fetch(`${API_BASE_URL}/api/v0.0.24/user/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, username, password }),
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem("access_token", data.access_token);
          await fetchCurrentUser();

          clearForm();
          alert("Login successful!");
        } else {
          alert(data.detail || "Login failed");
        }
      } else {
        const response = await fetch(
          `${API_BASE_URL}/api/v0.0.24/user/signup`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
          },
        );
        const data = await response.json();
        if (response.ok) {
          alert("Signup successful! Please login.");
          clearForm();
          setIsLogin(true);
        } else {
          alert(data.detail || "Signup failed");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  if (user) return <Home />;

  return (
    <div className="clothzy-wrap">
      {/* ── Left Brand Panel ── */}
      <div className="clothzy-left">
        <div className="clothzy-brand">
          <div className="clothzy-brand-icon">🛍</div>
          <div className="clothzy-brand-name">CLOTHZY</div>
        </div>

        <div className="clothzy-swatch clothzy-swatch-1" />
        <div className="clothzy-swatch clothzy-swatch-2" />
        <div className="clothzy-swatch clothzy-swatch-3" />

        <div className="clothzy-panel-copy">
          <h2 className="clothzy-tagline">
            Wear what
            <br />
            makes you <em>feel</em>
            <br />
            alive.
          </h2>
          <p className="clothzy-sub">
            Curated fashion for every story. Discover pieces that speak before
            you do.
          </p>
        </div>

        <div className="clothzy-dots">
          <div className="clothzy-dot active" />
          <div className="clothzy-dot" />
          <div className="clothzy-dot" />
        </div>
      </div>

      {/* ── Right Auth Panel ── */}
      <div className="clothzy-right">
        <div className="clothzy-auth">
          <div className="clothzy-tabs">
            <button
              className={`clothzy-tab${isLogin ? " active" : ""}`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>
            <button
              className={`clothzy-tab${!isLogin ? " active" : ""}`}
              onClick={() => setIsLogin(false)}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="clothzy-form-header">
              <h1 className="clothzy-form-title">
                {isLogin ? "Welcome back" : "Join Clothzy"}
              </h1>
              <p className="clothzy-form-sub">
                {isLogin
                  ? "Good to see you again. Let's get you in."
                  : "Create your account and start exploring."}
              </p>
            </div>

            <div className="clothzy-field">
              <label>Username</label>
              <input
                type="text"
                placeholder="your_username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="clothzy-field">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="clothzy-field">
              <label>Password</label>
              <input
                type="password"
                placeholder={isLogin ? "••••••••" : "Min. 8 characters"}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (!isLogin) setPwdStrength(getStrength(e.target.value));
                }}
              />
              {isLogin && (
                <div className="clothzy-field-hint">
                  <a href="#">Forgot password?</a>
                </div>
              )}
              {!isLogin && (
                <div className="clothzy-strength">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="clothzy-strength-seg"
                      style={{
                        background:
                          i < pwdStrength
                            ? STRENGTH_COLORS[pwdStrength - 1]
                            : "var(--border)",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="clothzy-check-row">
              <input
                type="checkbox"
                id="clothzy-agreed"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <label htmlFor="clothzy-agreed">
                I agree to the{" "}
                <a href="#">{isLogin ? "terms" : "Terms of Service"}</a>
                {!isLogin && (
                  <>
                    {" "}
                    &amp; <a href="#">Privacy Policy</a>
                  </>
                )}
              </label>
            </div>

            <button type="submit" className="clothzy-btn">
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="clothzy-divider">
            <span>or continue with</span>
          </div>

          <div className="clothzy-social-row">
            <button className="clothzy-social-btn">
              <GoogleIcon /> Google
            </button>
            <button className="clothzy-social-btn">
              <FacebookIcon /> Facebook
            </button>
          </div>
          {/* <div className="clothzy-tabs">
            <button
              className={`clothzy-tab${isLogin ? " active" : ""}`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>
            <button
              className={`clothzy-tab${!isLogin ? " active" : ""}`}
              onClick={() => setIsLogin(false)}
            >
              Create Account
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default LoginSignup;
