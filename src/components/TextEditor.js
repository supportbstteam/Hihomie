"use client";
import dynamic from "next/dynamic";
import { useState } from "react";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

export default function TextEditor() {
  const [value, setValue] = useState("");

  return (
    <div className="p-4">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        placeholder="Write something amazing..."
         style={{ height: "100px" }}
      />
    </div>
  );
}
