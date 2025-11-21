import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import Topbar from "../components/Topbar.js";
import "./ChoosePage.css";


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
            <Topbar />

            <div className="flex flex-col pt-[20em] pb-[9em] px-[3em] gap-[20rem] bg-white items-center">
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
