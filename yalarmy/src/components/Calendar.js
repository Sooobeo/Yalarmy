import React, { useState } from "react";
import "./Calendar.css";
import DateDetail from "./DateDetail"; // ← 추가

function Calendar() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);

  const dates = [];
  for (let i = 1; i <= lastDay.getDate(); i++) dates.push(i);

  const blanks = Array(firstDay.getDay()).fill(null);
  let calendarDates = [...blanks, ...dates];

  while (calendarDates.length < 42) calendarDates.push(null);

  // 과제 데이터
  const assignments = {
    3: ["과제 1"],
    5: ["과제 2", "과제 3"],
    12: ["과제 4"],
    18: ["과제 5"],
  };

  // 날짜 클릭 → 상세창 오픈
  const openDetail = (date) => {
    setSelectedDate(date);
    setSelectedTasks(assignments[date] || []);
  };

  const closeDetail = () => {
    setSelectedDate(null);
    setSelectedTasks([]);
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  return (
    <div className="calendar-container">
      
      <div className="calendar-top-bar">
        <button className="nav-btn" onClick={goToPreviousMonth}>◀</button>
        <h2>{currentYear}년 {currentMonth + 1}월</h2>
        <button className="nav-btn" onClick={goToNextMonth}>▶</button>
      </div>

      <div className="calendar">
        <div className="calendar-header">
          {daysOfWeek.map((day) => (
            <div key={day} className="calendar-day-header">
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-grid">
          {calendarDates.map((date, idx) => (
            <div
              key={idx}
              className="calendar-cell"
              onClick={() => date && openDetail(date)}  // 🔥 날짜 클릭
            >
              {date && (
                <>
                  <div className="date-number">{date}</div>

                  {assignments[date] && (
                    <div className="assignment-blocks">
                      {assignments[date].map((task, i) => (
                        <div key={i} className="assignment-block">
                          {task}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 모달 렌더링 */}
        <DateDetail
        year={currentYear}
        month={currentMonth + 1}
        date={selectedDate}
        tasks={selectedTasks}
        close={closeDetail}
        />

    </div>
  );
}

export default Calendar;
