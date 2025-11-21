
function ChoosePage()
{
    return (
        <div>
            <div className = "w-[100%] h-[6em] py-[1em] px-[3em] bg-[#fcf7fe] flex flex-col gap-5 border-b-2 border-b-gray">
                <img src="" alt="" />
            </div>

            <div className = "flex flex-col py-[20em] px-[3em] gap-[20rem] bg-[#fcf7fe] items-center">
                <div className = "text-2xl font-semibold">
                    👋 안녕하세요, 오늘도 학업 일정 시작해볼까요?
                </div>

                <div className = "flex flex-row justify-evenly w-full">
                    <div className = "flex flex-col gap-2">
                        <h2 className = "text-xl font-semibold">[📅 캘린더]</h2>
                        일정을 한 번에 보고 관리하세요.
                    </div>

                    <div className = "flex flex-col gap-2">
                        <h2 className = "text-xl font-semibold">[📝 미완료 항목]</h2>
                        마감 기한이 임박한 과제/영상만 모아봤어요.
                    </div>
                </div>

                <div className = "flex flex-col gap-2">
                    <p>📌 이번 주 마감 일정: 4개</p>
                    <p className = "text-red-400">⏳ 오늘 마감되는 항목: 1개</p>
                </div>
                
            </div>





        </div>
    );
}


export default ChoosePage;
