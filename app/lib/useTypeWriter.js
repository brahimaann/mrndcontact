"use client";
import { useEffect, useState } from "react";

export default function useTypewriter(text, speed = 24){
  const [out, setOut] = useState("");
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setOut((prev) => (i < text.length ? text.slice(0, ++i) : prev));
      if(i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return out;
}
