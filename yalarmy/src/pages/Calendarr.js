import Calendar from "../components/Calendar.js";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";


function Calendarr()
{
    return (
        <div>
            <div className = "w-[100%] h-[4em] py-[1em] mb-[3em] px-[3em] bg-[#fcf7fe] flex flex-col gap-5 border-b-2 border-b-gray">
                <div className = "flex flex-row gap-9 items-center">
                    <Link to = "/">
                        <FaArrowLeft />
                    </Link>
                    <h2 className = "text-xl">과제 캘린더</h2>
                </div>
            </div>
            <Calendar></Calendar>
        </div>
    )
};

export default Calendarr;


