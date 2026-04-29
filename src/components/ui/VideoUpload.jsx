import { useState } from "react";
import { Video, X, film } from "lucide-react";

const VideoUpload = ({ video, setVideo }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(video ? video[0].preview : null);
  
  const handleFiles = (files) => {
    const file = files[0];
    if (!file || !file.type.startsWith("video/")) return;
    
    // Create a local preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    
    // Pass the file back to the parent state
    setVideo({
      file,
      preview: previewUrl,
    });
  };

  const removeVideo = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setVideo(null);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="w-full mt-8">
      <label className="mb-2 block text-md font-medium text-gray-700">
        Property Video
      </label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`relative min-h-[300px] rounded-xl border-2 border-dashed transition-all ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50 hover:bg-gray-100"
        } p-4`}
      >
        {/* Hidden Input Layer */}
        {!preview && (
          <input
            type="file"
            accept="video/*"
            onChange={(e) => handleFiles(e.target.files)}
            className="absolute inset-0 z-10 cursor-pointer opacity-0"
          />
        )}

        {!preview ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center">
            <Video className="mb-3 h-10 w-10 text-gray-400" />
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-blue-600">Click to upload video</span> or drag and drop
            </p>
            <p className="text-xs text-gray-400 mt-1">MP4, WebM (Max 50MB suggested)</p>
          </div>
        ) : (
          <div className="relative w-full h-full flex flex-col items-center">
            <div className="relative w-full max-w-2xl rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-black">
              <video 
                src={preview} 
                controls 
                className="w-full max-h-[400px]"
              />
              <button
                type="button"
                onClick={removeVideo}
                className="absolute right-2 top-2 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-600 shadow-md border hover:text-red-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">Video ready for upload</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoUpload;