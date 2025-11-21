import "./Auth.css";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
    const navigate = useNavigate();

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

                {/* 🔥 카드 안에 로고 넣기 */}
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
