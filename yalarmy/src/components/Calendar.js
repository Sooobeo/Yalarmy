import React from "react";
import "./Calendar.css";

function Calendar() {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const dates = [];
  for (let i = 1; i <= lastDay.getDate(); i++) {
    dates.push(i);
  }

  const blanks = Array(firstDay.getDay()).fill(null);
  const calendarDates = [...blanks, ...dates];

  // 과제 데이터 예시 (날짜 기준)
  const assignments = {
    3: ["과제 1"],
    5: ["과제 2", "과제 3"],
    12: ["과제 4"],
    18: ["과제 5"],
  };

  return (
    <div className="calendar">
      {/* 요일 헤더 */}
      <div className="calendar-header">
        {daysOfWeek.map((day) => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="calendar-grid">
        {calendarDates.map((date, idx) => (
          <div key={idx} className="calendar-cell">
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
  );
}

export default Calendar;
