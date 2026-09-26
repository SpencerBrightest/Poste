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
    <section className="overflow-hidden rounded-md border border-border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6">
        <button aria-label="Previous month" onClick={previousMonth} className="grid h-10 w-10 place-items-center rounded-md border border-border text-muted-foreground transition hover:border-primary hover:bg-accent hover:text-primary">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">{format(currentDate, "MMMM yyyy")}</h2>
        <button aria-label="Next month" onClick={nextMonth} className="grid h-10 w-10 place-items-center rounded-md border border-border text-muted-foreground transition hover:border-primary hover:bg-accent hover:text-primary">
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-px bg-border">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="bg-background px-2 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:text-xs">
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
              className={`min-h-24 bg-card p-2 text-foreground transition hover:bg-accent/60 sm:min-h-32 sm:p-3 ${isCurrentDay ? "bg-primary/10" : ""}`}
            >
              <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-semibold ${isCurrentDay ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{format(day, "d")}</span>
              {posts.length > 0 && (
                <div className="mt-2 grid gap-1.5">
                  {posts.map((post) => (
                    <div key={post.id} className="flex min-w-0 items-center gap-1.5 rounded-sm bg-success/10 px-2 py-1.5 text-[10px] font-semibold text-success">
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
