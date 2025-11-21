import Calendar from "../components/Calendar.js";
import Topbar from "../components/Topbar.js";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./Calendarr.css";


function Calendarr()
{
    return (
        <div>
        <Topbar />

            <div className="calendar-wrapper">
                <Calendar />
            </div>
        </div>
    )
};

export default Calendarr;


