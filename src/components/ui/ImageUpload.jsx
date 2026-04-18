// ImageUpload.jsx
import { useState } from "react";
import { Upload, X, Plus } from "lucide-react";

// Accept props from the parent
const ImageUpload = ({ images, setImages }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files) => {
    const currentCount = images.length;
    const newFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );
    const remainingSlots = 10 - currentCount;

    if (remainingSlots <= 0) return;

    const allowedFiles = newFiles.slice(0, remainingSlots);
    const newImages = allowedFiles.map((file) => ({
      file, // This is the actual File object for the server
      preview: URL.createObjectURL(file),
    }));

    setImages([...images, ...newImages]);
  };

  const removeImage = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    URL.revokeObjectURL(images[index].preview);
    const filtered = images.filter((_, i) => i !== index);
    setImages(filtered);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="w-full">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Property Photos
      </label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`relative min-h-[400px] rounded-xl border-2 border-dashed transition-all ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50 hover:bg-gray-100"
        } p-4`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
          className="absolute inset-0 z-10 cursor-pointer opacity-0"
          disabled={images.length >= 10}
        />

        {images.length === 0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center">
            <Upload className="mb-3 h-10 w-10 text-gray-400" />
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-400 mt-1">Up to 10 images</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {images.map((img, index) => (
              <div key={index} className="group relative h-[170px] z-20">
                <img
                  src={img.preview}
                  alt="preview"
                  className="h-full w-full rounded-lg object-cover shadow-sm border border-gray-200"
                />
                <button
                  type="button" // Important: stop form submission
                  onClick={(e) => removeImage(e, index)}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-gray-600 shadow-md border hover:text-red-600 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {images.length < 10 && (
              <div className="flex min-h-[170px] items-center justify-center rounded-lg border-2 border-dotted border-gray-300 bg-white">
                <Plus className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>
        )}
      </div>
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <span>{images.length} / 10 images</span>
        {images.length === 10 && (
          <span className="text-amber-600 font-medium">Limit reached</span>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
