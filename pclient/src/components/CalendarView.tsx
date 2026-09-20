"use client";

import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

interface CalendarViewProps {
  postsByDate: Record<string, any[]>;
}

export default function CalendarView({ postsByDate }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <button onClick={previousMonth} className="calendar-nav">
          <ChevronLeft size={20} />
        </button>
        <h2>{format(currentDate, "MMMM yyyy")}</h2>
        <button onClick={nextMonth} className="calendar-nav">
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}
        {days.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const posts = postsByDate[dateKey] || [];
          const isCurrentDay = isToday(day);

          return (
            <div
              key={dateKey}
              className={`calendar-day ${isCurrentDay ? "is-today" : ""}`}
            >
              <span className="calendar-day-number">{format(day, "d")}</span>
              {posts.length > 0 && (
                <div className="calendar-posts">
                  {posts.map((post) => (
                    <div key={post.id} className="calendar-post">
                      <CalendarIcon size={12} />
                      <span className="calendar-post-platform">
                        {post.socialAccount.platform}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
