import "./Auth.css";
import { Link } from "react-router-dom";

function SignupPage() {
    return (
        <div className="auth-container">
            <div className="auth-card">

                <h1 className="auth-title">회원가입</h1>
                <p className="auth-sub">Yalarmy와 함께 학업 관리를 시작해보세요 ✨</p>

                <div className="auth-input-wrapper">
                    <input
                        type="email"
                        placeholder="이메일"
                        className="auth-input"
                    />
                </div>

                <div className="auth-input-wrapper">
                    <input
                        type="password"
                        placeholder="비밀번호"
                        className="auth-input"
                    />
                </div>

                <div className="auth-input-wrapper">
                    <input
                        type="password"
                        placeholder="비밀번호 확인"
                        className="auth-input"
                    />
                </div>

                <button className="auth-btn">가입하기</button>

                <p className="auth-footer">
                    이미 계정이 있으신가요?{" "}
                    <Link to="/login" className="auth-link">로그인</Link>
                </p>
            </div>
        </div>
    );
}

export default SignupPage;
