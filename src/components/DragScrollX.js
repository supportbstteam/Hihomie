"use client";
import { useRef } from "react";
import DragParent from "./prospects/DragParent";

export default function DragScrollX() {
  const scrollRef = useRef(null);

  // Handle dragging
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    isDown.current = true;
    scrollRef.current.classList.add("cursor-grabbing");
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    scrollRef.current?.classList.remove("cursor-grabbing");
  };

  const handleMouseUp = () => {
    isDown.current = false;
    scrollRef.current?.classList.remove("cursor-grabbing");
  };

  const handleMouseMove = (e) => {
    if (!isDown.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // multiplier = scroll speed
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div
      ref={scrollRef}
      className="flex overflow-x-scroll space-x-4 cursor-grab select-none scrollbar-hide"
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
        
      <DragParent/>
    </div>
  );
}