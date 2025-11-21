import { FaArrowLeft } from "react-icons/fa";
import { HiOutlineClipboard } from "react-icons/hi";

function Unfinished ()
{
    return (
        <div>
            {/* Appbar */}
            <div className = "w-[100%] h-[8em] py-[1em] px-[3em] bg-[#fcf7fe] flex flex-col gap-5 border-b-2 border-b-gray">
                <div className = "flex flex-row gap-9 items-center">
                    <FaArrowLeft />
                    <h2 className = "text-xl">미완료 항목</h2>
                </div>
                <div className = "flex flex-row gap-6 font-medium text-sm">
                    <div className="h-[2.7rem] w-[6rem] bg-[#e0e0e0] rounded-lg flex justify-center items-center">
                        <span className="truncate block w-[80%] text-center">전체</span>
                    </div>

                    <div className="h-[2.7rem] w-[6rem] bg-[#e0e0e0] rounded-lg flex justify-center items-center">
                        <span className="truncate block w-[80%] text-center">자연어처리</span>
                    </div>

                    <div className="h-[2.7rem] w-[6rem] bg-[#e0e0e0] rounded-lg flex justify-center items-center">
                        <span className="truncate block w-[80%] text-center">컴퓨팅연구개론</span>
                    </div>

                    <div className="h-[2.7rem] w-[6rem] bg-[#e0e0e0] rounded-lg flex justify-center items-center">
                        <span className="truncate block w-[80%] text-center">고분자화학</span>
                    </div>

                    <div className="h-[2.7rem] w-[6rem] bg-[#e0e0e0] rounded-lg flex justify-center items-center">
                        <span className="truncate block w-[80%] text-center">컴퓨터시스템</span>
                    </div>
                </div>
            </div>
            {/* Content */}
            <div className = "flex flex-col h-[100rem] py-[2em] px-[3em] gap-3 bg-[#fcf7fe]">
                <div className = "flex flex-row h-[6rem] w-[95%] bg-[#ffffff] border-2 border-gray-100 rounded-lg py-[0.5rem] gap-3 py-[1rem]">
                    <div className="relative left-0 top-[-1rem] h-[6rem] w-2 bg-gray-400 rounded-l-lg"></div>
                    <div className = "rounded-full h-[3em] w-[3em] bg-[#f5f5f5] flex justify-center items-center">
                        <HiOutlineClipboard className = "text-3xl text-[#bdbdbd]" />
                    </div>
                    <div className = "flex flex-col text-left gap-[0.1rem]">
                        <p className = "text-[15px]">논문 발표 과제</p>
                        <p className = "text-sm text-[#7d7d7d]">컴퓨팅연구개론 (CAS2103-03-00)</p>
                        <div className = "h-4 my-1 w-[4em] bg-[#f5f5f5] flex justify-center items-center rounded-lg">
                            <p className = "text-xs text-[#7d7d7d]">unknown</p>
                        </div>
                    </div>
                </div>
                <div className = "flex flex-row h-[6rem] w-[95%] bg-[#ffffff] border-2 border-gray-100 rounded-lg py-[0.5rem] gap-3 py-[1rem]">
                    <div className="relative left-0 top-[-1rem] h-[6rem] w-2 bg-gray-400 rounded-l-lg"></div>
                    <div className = "rounded-full h-[3em] w-[3em] bg-[#f5f5f5] flex justify-center items-center">
                        <HiOutlineClipboard className = "text-3xl text-[#bdbdbd]" />
                    </div>
                    <div className = "flex flex-col text-left gap-[0.1rem]">
                        <p className = "text-[15px]">논문 발표 과제</p>
                        <p className = "text-sm text-[#7d7d7d]">컴퓨팅연구개론 (CAS2103-03-00)</p>
                        <div className = "h-4 my-1 w-[4em] bg-[#f5f5f5] flex justify-center items-center rounded-lg">
                            <p className = "text-xs text-[#7d7d7d]">unknown</p>
                        </div>
                    </div>
                </div>
                <div className = "flex flex-row h-[6rem] w-[95%] bg-[#ffffff] border-2 border-gray-100 rounded-lg py-[0.5rem] gap-3 py-[1rem]">
                    <div className="relative left-0 top-[-1rem] h-[6rem] w-2 bg-gray-400 rounded-l-lg"></div>
                    <div className = "rounded-full h-[3em] w-[3em] bg-[#f5f5f5] flex justify-center items-center">
                        <HiOutlineClipboard className = "text-3xl text-[#bdbdbd]" />
                    </div>
                    <div className = "flex flex-col text-left gap-[0.1rem]">
                        <p className = "text-[15px]">논문 발표 과제</p>
                        <p className = "text-sm text-[#7d7d7d]">컴퓨팅연구개론 (CAS2103-03-00)</p>
                        <div className = "h-4 my-1 w-[4em] bg-[#f5f5f5] flex justify-center items-center rounded-lg">
                            <p className = "text-xs text-[#7d7d7d]">unknown</p>
                        </div>
                    </div>
                </div>
                <div className = "flex flex-row h-[6rem] w-[95%] bg-[#ffffff] border-2 border-gray-100 rounded-lg py-[0.5rem] gap-3 py-[1rem]">
                    <div className="relative left-0 top-[-1rem] h-[6rem] w-2 bg-gray-400 rounded-l-lg"></div>
                    <div className = "rounded-full h-[3em] w-[3em] bg-[#f5f5f5] flex justify-center items-center">
                        <HiOutlineClipboard className = "text-3xl text-[#bdbdbd]" />
                    </div>
                    <div className = "flex flex-col text-left gap-[0.1rem]">
                        <p className = "text-[15px]">논문 발표 과제</p>
                        <p className = "text-sm text-[#7d7d7d]">컴퓨팅연구개론 (CAS2103-03-00)</p>
                        <div className = "h-4 my-1 w-[4em] bg-[#f5f5f5] flex justify-center items-center rounded-lg">
                            <p className = "text-xs text-[#7d7d7d]">unknown</p>
                        </div>
                    </div>
                </div>
                <div className = "flex flex-row h-[6rem] w-[95%] bg-[#ffffff] border-2 border-gray-100 rounded-lg py-[0.5rem] gap-3 py-[1rem]">
                    <div className="relative left-0 top-[-1rem] h-[6rem] w-2 bg-gray-400 rounded-l-lg"></div>
                    <div className = "rounded-full h-[3em] w-[3em] bg-[#f5f5f5] flex justify-center items-center">
                        <HiOutlineClipboard className = "text-3xl text-[#bdbdbd]" />
                    </div>
                    <div className = "flex flex-col text-left gap-[0.1rem]">
                        <p className = "text-[15px]">논문 발표 과제</p>
                        <p className = "text-sm text-[#7d7d7d]">컴퓨팅연구개론 (CAS2103-03-00)</p>
                        <div className = "h-4 my-1 w-[4em] bg-[#f5f5f5] flex justify-center items-center rounded-lg">
                            <p className = "text-xs text-[#7d7d7d]">unknown</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}




export default Unfinished;


