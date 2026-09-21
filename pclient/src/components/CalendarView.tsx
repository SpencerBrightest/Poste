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
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-800 sm:px-6">
        <button aria-label="Previous month" onClick={previousMonth} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-blue-700 dark:hover:bg-blue-950/40 dark:hover:text-blue-400">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">{format(currentDate, "MMMM yyyy")}</h2>
        <button aria-label="Next month" onClick={nextMonth} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-blue-700 dark:hover:bg-blue-950/40 dark:hover:text-blue-400">
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-800">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="bg-slate-50 px-2 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-950 dark:text-slate-500 sm:text-xs">
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
              className={`min-h-24 bg-white p-2 transition hover:bg-blue-50/60 dark:bg-slate-900 dark:hover:bg-slate-800/70 sm:min-h-32 sm:p-3 ${isCurrentDay ? "bg-blue-50/70 dark:bg-blue-950/30" : ""}`}
            >
              <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-semibold ${isCurrentDay ? "bg-blue-600 text-white dark:bg-blue-500" : "text-slate-600 dark:text-slate-400"}`}>{format(day, "d")}</span>
              {posts.length > 0 && (
                <div className="mt-2 grid gap-1.5">
                  {posts.map((post) => (
                    <div key={post.id} className="flex min-w-0 items-center gap-1.5 rounded-lg bg-emerald-50 px-2 py-1.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                      <CalendarIcon className="h-3 w-3 shrink-0" />
                      <span className="truncate">
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
    </section>
  );
}
