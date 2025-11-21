import "./Auth.css";
import { Link } from "react-router-dom";

function LoginPage() {
    return (
        <div className="auth-container">
            <div className="auth-card">

                <h1 className="auth-title">로그인</h1>
                <p className="auth-sub">
                    Yalarmy에 오신 것을 환영합니다 🤝
                </p>

                <div className="auth-input-wrapper">
                    <input
                        type="email"
                        className="auth-input"
                        placeholder="이메일"
                    />
                </div>

                <div className="auth-input-wrapper">
                    <input
                        type="password"
                        className="auth-input"
                        placeholder="비밀번호"
                    />
                </div>

                <button className="auth-btn">로그인</button>

                <p className="auth-footer">
                    계정이 없으신가요?{" "}
                    <Link to="/signup" className="auth-link">회원가입</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
