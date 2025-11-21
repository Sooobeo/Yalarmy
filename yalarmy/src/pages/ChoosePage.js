import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";



function ChoosePage()
{
    useEffect(() => {
    AOS.init({ 
        duration: 1200,       // animation duration
        easing: "ease-out",  // easing style
        once: true,          // animate only once
    });
    AOS.refresh();
    }, []);

    return (
        <div>
            <div className="w-[100%] h-[5em] py-[1em] px-[3em] bg-[#fcf7fe] flex items-center justify-between border-b-2 border-b-gray">
      <img src="/Logo.png" alt="" className="w-[7rem]" />

      {/* 로그아웃 버튼 */}
      <button
        style={{
          color: "#003672",
          fontWeight: 600,
          backgroundColor: "white",
          padding: "0.5rem 1rem",
          borderRadius: "0.5rem",
          border: "1px solid #003672",
          cursor: "pointer",
          transition: "background-color 0.3s ease, color 0.3s ease",
        }}
        onClick={() => {
          // 로그아웃 로직
          localStorage.clear();
          window.location.href = "/";
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#003672";
          e.target.style.color = "white";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "white";
          e.target.style.color = "#003672";
        }}
      >
        로그아웃
      </button>
    </div>

            <div className = "flex flex-col pt-[20em] pb-[9em] px-[3em] gap-[20rem] bg-[#fcf7fe] items-center">
                <div className = "flex flex-col gap-6">
                    <div data-aos="fade-up" className = "opacity-0 text-2xl font-semibold">
                        👋 안녕하세요, 오늘도 학업 일정 시작해볼까요?
                    </div>
                    <div className = "flex flex-col gap-2">
                        <p data-aos="fade-up" className = "opacity-0">📌 이번 주 마감 일정: 4개</p>
                        <p data-aos="fade-up" className = "opacity-0 text-red-400">⏳ 오늘 마감되는 항목: 1개</p>
                    </div>
                </div>


                <div className = "flex flex-row justify-evenly w-full">
                    <Link to = "/calendar" data-aos="fade-up" className = "opacity-0 flex flex-col gap-2">
                        <h2 className = "text-xl font-semibold">[📅 캘린더]</h2>
                        일정을 한 번에 보고 관리하세요.
                    </Link>

                    <Link to = "/tasks" data-aos="fade-up" className = "opacity-0 flex flex-col gap-2">
                        <h2 className = "text-xl font-semibold">[📝 미완료 항목]</h2>
                        마감 기한이 임박한 과제/영상만 모아봤어요.
                    </Link>
                </div>


                
            </div>





        </div>
    );
}


export default ChoosePage;
