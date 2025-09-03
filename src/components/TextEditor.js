"use client";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

export default function TextEditor({ value, onChange }) {
  return (
    <div className="p-4">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder="Write something amazing..."
        style={{ height: "100px" }}
      />
    </div>
  );
}
