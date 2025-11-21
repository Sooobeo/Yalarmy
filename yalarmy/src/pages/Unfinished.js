import { FaArrowLeft } from "react-icons/fa";
import { HiOutlineClipboard } from "react-icons/hi";
import { useState } from "react";
import { Link } from "react-router-dom";

function Unfinished ()
{
    const [selected, setSelected] = useState("전체");


    return (
        <div>
            {/* Appbar */}
            <div className = "w-[100%] h-[8em] py-[1em] px-[3em] bg-[#fcf7fe] flex flex-col gap-5 border-b-2 border-b-gray">
                <div className = "flex flex-row gap-9 items-center">
                    <Link to = "/">
                        <FaArrowLeft />
                    </Link>
                    <h2 className = "text-xl">미완료 과제</h2>
                </div>
                <div className="flex flex-row gap-6 font-medium text-sm">
                    {["전체", "자연어처리", "컴퓨팅연구개론", "고분자화학", "컴퓨터시스템"].map((label) => (
                        <button
                        key={label}
                        onClick={() => setSelected(label)}
                        className={`h-[2.7rem] w-[6rem] rounded-lg flex justify-center items-center 
                        ${selected === label ? "bg-[#4456ad] text-white" : "bg-[#e0e0e0]"}`}
                        >
                        <span className="truncate block w-[80%] text-center">{label}</span>
                        </button>
                    ))}
                </div>
            </div>
            {/* Content */}
            <div className = "flex flex-col h-[100rem] py-[2em] px-[3em] gap-3 bg-[#fcf7fe]">
                <div className="flex flex-col h-[10rem] py-[2em] px-[3em] gap-3 bg-[#fcf7fe]">
                    {selected === "전체" && <div>전체 Content Here</div>}
                    {selected === "자연어처리" && <div>자연어처리 Content Here</div>}
                    {selected === "컴퓨팅연구개론" && <div>컴퓨팅연구개론 Content Here</div>}
                    {selected === "고분자화학" && <div>고분자화학 Content Here</div>}
                    {selected === "컴퓨터시스템" && <div>컴퓨터시스템 Content Here</div>}
                </div>
                <div className = "flex flex-row h-[6rem] w-[98%] bg-[#ffffff] border-2 border-gray-100 rounded-lg py-[0.5rem] gap-3 py-[1rem]">
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
                <div className = "flex flex-row h-[6rem] w-[98%] bg-[#ffffff] border-2 border-gray-100 rounded-lg py-[0.5rem] gap-3 py-[1rem]">
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
                <div className = "flex flex-row h-[6rem] w-[98%] bg-[#ffffff] border-2 border-gray-100 rounded-lg py-[0.5rem] gap-3 py-[1rem]">
                    <div className="relative left-0 top-[-1rem] h-[6rem] w-2 bg-[#67a6ed] rounded-l-lg"></div>
                    <div className = "rounded-full h-[3em] w-[3em] bg-[#e7f2fd] flex justify-center items-center">
                        <HiOutlineClipboard className = "text-3xl text-[#67a6ed]" />
                    </div>
                    <div className = "flex flex-col text-left gap-[0.1rem]">
                        <p className = "text-[15px]">Week 8: Vessl.ai</p>
                        <p className = "text-sm text-[#7d7d7d]">컴퓨팅연구개론 (CAS2103-03-00)</p>
                        <div className = "h-4 my-1 w-[4em] bg-[#ebf4fd] flex justify-center items-center rounded-lg">
                            <p className = "text-xs text-[#67a6ed]">강의</p>
                        </div>
                    </div>
                </div>
                <div className = "flex flex-row h-[6rem] w-[98%] bg-[#ffffff] border-2 border-gray-100 rounded-lg py-[0.5rem] gap-3 py-[1rem]">
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
                <div className = "flex flex-row h-[6rem] w-[98%] bg-[#ffffff] border-2 border-gray-100 rounded-lg py-[0.5rem] gap-3 py-[1rem]">
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


