"use client";

import { useEffect, useState } from "react";

export function TodayLine() {
  const [today, setToday] = useState<string>("");

  useEffect(() => {
    setToday(
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    );
  }, []);

  return (
    <span className="text-sm text-muted" suppressHydrationWarning>
      {today || "\u00a0"}
    </span>
  );
}
