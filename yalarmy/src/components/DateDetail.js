import React from "react";
import "./DateDetail.css";

function DateDetail({ year, month, date, tasks, close }) {
  if (!date) return null;

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        <h3>{year}년 {month}월 {date}일</h3>
        <div className="close-btn" onClick={close}>×</div>

        {/* 과제 없을 때 */}
        {(!tasks || tasks.length === 0) ? (
          <p className="no-tasks">등록된 과제가 없습니다.</p>
        ) : (
          <div className="task-list">
            {tasks.map((task, i) => (
              <div key={i} className="task-card">
                {task}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default DateDetail;
