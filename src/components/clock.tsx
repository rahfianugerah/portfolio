// components/Clock.tsx
"use client";
import { useState, useEffect } from "react";

export default function Clock() {
  const [now, setNow] = useState(() => "");
  useEffect(() => {
    // once mounted, immediately set the real time
    const tick = () => setNow(new Date().toLocaleTimeString([], {
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <p className="font-bebas text-2xl">{now}</p>;
}
