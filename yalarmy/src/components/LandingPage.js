import { useEffect } from "react";
import "./LandingPage.css";

function LandingPage() {
    const scrollToFeatures = () => {
        document.querySelector("#features")?.scrollIntoView({
            behavior: "smooth",
        });
    };

    // 네비 스크롤 효과
    useEffect(() => {
        const handleScroll = () => {
            const nav = document.querySelector(".yl-navbar");
            if (window.scrollY > 10) nav.classList.add("yl-navbar-scrolled");
            else nav.classList.remove("yl-navbar-scrolled");
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="yl-root">

            {/* NAVBAR */}
            <header className="yl-navbar">
                <div className="yl-nav-inner">
                    <div className="yl-logo">Yalarmy</div>
                    <nav>
                        <ul className="yl-nav-menu">
                            <li><a href="#intro">소개</a></li>
                            <li><a href="#features">기능</a></li>
                            <li><a href="#preview">미리보기</a></li>
                            <li><a href="#solution">문제·해결</a></li>
                            <li><a href="#architecture">아키텍처</a></li>
                            <li><a href="#team">팀</a></li>
                            <li><button className="yl-login-btn">로그인</button></li>
                        </ul>
                    </nav>
                </div>
            </header>

            {/* HERO */}
            <section className="yl-hero">
                <div className="yl-hero-content">
                    <h1 className="yl-hero-title">
                        학업 일정 관리, 더 정확하고 간편하게
                    </h1>

                    <button className="yl-hero-btn" onClick={scrollToFeatures}>
                        어떤 기능이 있나요?
                    </button>

                    <span className="yl-hero-caption">
                        Yonsei LearnUs 환경에 최적화된 학업 일정 관리 도구
                    </span>
                </div>
            </section>

            {/* INTRO */}
            <section id="intro" className="yl-section yl-intro">
                <h2 className="yl-section-title">Yalarmy란 무엇인가요?</h2>
                <p className="yl-section-desc">
                    LearnUs 강의·과제·퀴즈 정보를 수집하고, 그중 <strong>미완료 활동만</strong>{" "}
                    추려서 Supabase에 저장하는 서비스입니다.
                    <br />
                    프론트엔드는 저장된 데이터를 기반으로 학업 일정 화면을 즉시 구성할 수 있습니다.
                    <br /><br />
                    또한 Yalarmy는 크롬 확장 프로그램을 설치하면 자동으로 LearnUs 데이터를
                    수집하여 더 빠르고 편리하게 학업 일정을 관리할 수 있습니다.
                </p>

            </section>

            {/* FEATURES */}
            <section id="features" className="yl-section yl-features">
                <h2 className="yl-section-title">제공 기능</h2>
                <p className="yl-section-desc">Yalarmy의 핵심 기능을 직관적으로 확인해보세요.</p>

                <div className="yl-feature-grid">

                    <div className="yl-feature-card">
                        <div className="yl-feature-icon">🗂️</div>
                        <h3>미완료 활동 자동 수집</h3>
                        <p>LearnUs에서 강의·과제·퀴즈를 파싱하여 Supabase에 자동 저장합니다.</p>
                    </div>

                    <div className="yl-feature-card">
                        <div className="yl-feature-icon">⏰</div>
                        <h3>마감 중심 정렬</h3>
                        <p>"해야 할 일만" 보이도록 is_incomplete / has_due 기준 정렬.</p>
                    </div>

                    <div className="yl-feature-card">
                        <div className="yl-feature-icon">📚</div>
                        <h3>과목별 할 일 조회</h3>
                        <p>과목 단위로 남은 활동만 정리하여 더 쉽게 일정 관리.</p>
                    </div>

                    <div className="yl-feature-card">
                        <div className="yl-feature-icon">📊</div>
                        <h3>자료 숨기기 & 확장성</h3>
                        <p>마감 없는 자료 숨기기 지원, 통계/추천 기능으로 확장 가능.</p>
                    </div>

                </div>
            </section>

            {/* PREVIEW SECTION */}
            <section id="preview" className="yl-section yl-preview">
                <h2 className="yl-section-title">실제 화면 미리보기</h2>
                <p className="yl-section-desc">
                    Yalarmy가 LearnUs 데이터를 기반으로 생성하는 실제 미완료 항목 화면입니다.
                </p>

                <div className="yl-preview-img-wrap">
                    <img
                        src="/preview-real.png"
                        alt="Yalarmy preview screenshot"
                        className="yl-preview-img"
                    />
                </div>
            </section>

            {/* PROBLEM → SOLUTION */}
            <section id="solution" className="yl-section yl-solution">
                <h2 className="yl-section-title">왜 필요한가?</h2>
                <p className="yl-section-desc">LearnUs 환경에서 자주 겪는 문제들을 해결합니다.</p>

                <div className="yl-solution-grid">

                    <div className="yl-solution-card">
                        <h3>🤯 문제점</h3>
                        <ul>
                            <li>마감 일정이 여러 페이지에 흩어져 있음</li>
                            <li>동영상·과제를 한 번에 보는 것이 어려움</li>
                            <li>과목마다 들어가야 확인 가능</li>
                            <li>마감 임박 항목을 놓치기 쉬움</li>
                        </ul>
                    </div>

                    <div className="yl-solution-card">
                        <h3>🧠 Yalarmy의 해결 방식</h3>
                        <ul>
                            <li>크롬 확장에서 자동 수집</li>
                            <li>Supabase로 구조화된 데이터 저장</li>
                            <li>“해야 할 일만” 모아서 보여주는 최적 UI</li>
                            <li>과목·마감 중심 정렬로 효율적인 관리</li>
                        </ul>
                    </div>

                </div>
            </section>

            {/* ARCHITECTURE */}
            <section id="architecture" className="yl-section yl-architecture">
                <h2 className="yl-section-title">기술 아키텍처</h2>
                <p className="yl-section-desc">
                    Yalarmy의 전체 구조를 한눈에 볼 수 있습니다.
                </p>

                <div className="yl-arch-grid">

                    <div className="yl-arch-card">
                        <div className="yl-arch-icon">🧩</div>
                        <h3>브라우저 확장</h3>
                        <p>LearnUs DOM 파싱 → 과목/미완료 활동 추출</p>
                    </div>

                    <div className="yl-arch-card">
                        <div className="yl-arch-icon">🗄️</div>
                        <h3>Supabase Database</h3>
                        <p>courses / course_items 테이블에 저장</p>
                    </div>

                    <div className="yl-arch-card">
                        <div className="yl-arch-icon">📱</div>
                        <h3>Frontend</h3>
                        <p>Flutter / Web에서 Supabase SDK로 조회</p>
                    </div>

                </div>
            </section>

            {/* TEAM */}
            <section id="team" className="yl-section yl-team">
                <h2 className="yl-section-title">팀 소개</h2>
                <p className="yl-section-desc">Yalarmy를 만드는 사람들입니다.</p>

                <div className="yl-team-grid">

                    <div className="yl-team-card">
                        <h3>PM / Backend</h3>
                        <p>Supabase · Data Model · Chrome Extension</p>
                    </div>

                    <div className="yl-team-card">
                        <h3>Frontend</h3>
                        <p>React Web · UI 구현</p>
                    </div>

                    <div className="yl-team-card">
                        <h3>Flutter</h3>
                        <p>모바일 앱 · Supabase 연동</p>
                    </div>

                    <div className="yl-team-card">
                        <h3>Design</h3>
                        <p>UI 디자인 · 서비스 브랜딩</p>
                    </div>

                </div>
            </section>


            {/* FOOTER */}
            <footer className="yl-footer">
                <p>© 2025 Yalarmy. All rights reserved.</p>
            </footer>

        </div>
    );
}

export default LandingPage;
