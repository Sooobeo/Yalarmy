// LoginPage.js
/* global chrome */
import "./Auth.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";


function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ❗ CRA, Next.js 등에서 안전하게 동작하는 방식
  const API_BASE =
    process.env.REACT_APP_BACKEND_API_BASE_URL || "http://127.0.0.1:8000";

  const handleSubmit = async (e) => {
    console.log("🔥 handleSubmit CALLED");
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("이메일/비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/yalarmy/ensure-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.detail || "로그인 실패");
      }

      const { userKey } = data;
      if (!userKey) throw new Error("userKey가 응답에 없습니다.");

      localStorage.setItem("userKey", userKey);

      if (typeof chrome !== "undefined" && chrome?.storage?.sync) {
        chrome.storage.sync.set({ userKey });
      }

      navigate("/choose");
    } catch (err) {
      console.error("[Login] error:", err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">로그인</h1>
        <p className="auth-sub">Yalarmy에 오신 것을 환영합니다 🤝</p>

        <form onSubmit={handleSubmit}>
          <div className="auth-input-wrapper">
            <input
              type="email"
              className="auth-input"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="auth-input-wrapper">
            <input
              type="password"
              className="auth-input"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {errorMsg && (
            <p style={{ color: "crimson", marginTop: 8 }}>{errorMsg}</p>
          )}

          <button className="auth-btn" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <p className="auth-footer">
          계정이 없으신가요?{" "}
          <Link to="/signup" className="auth-link">
            회원가입
          </Link>
        </p>

        <div
          className="yl-auth-footer-logo"
          onClick={() => navigate("/")}
        >
          <img src="/logo.png" alt="Yalarmy Logo" />
          <p>Yalarmy 홈으로 가기</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
