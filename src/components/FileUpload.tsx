import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  Video,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import api from "../api/axios";

interface FileUploadProps {
  lessonId: number;
  onUploadSuccess: () => void;
}

export default function FileUpload({
  lessonId,
  onUploadSuccess,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [contentType, setContentType] = useState<string>("video");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("content_type", contentType);

    try {
      // 🚀 FIXED URL: Added /admin before /lessons
      await api.post(`/admin/lessons/${lessonId}/content`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1),
          );
          setProgress(percentCompleted);
        },
      });

      setMessage({ type: "success", text: "File uploaded successfully!" });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => {
        onUploadSuccess();
        setMessage(null);
      }, 2000);
    } catch (error: any) {
      console.error("Upload error:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to upload file. Please check the file size and type.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] border-2 border-gray-50 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-black text-gray-800">
            Upload Lesson Material
          </h3>
          <p className="text-gray-400 text-sm font-medium mt-1">
            Add videos, PDFs, or images to this lesson.
          </p>
        </div>
      </div>

      {/* Content Type Selector */}
      <div className="flex gap-3 mb-6">
        {[
          { id: "video", label: "Video", icon: <Video size={16} /> },
          { id: "document", label: "PDF/Doc", icon: <FileText size={16} /> },
          { id: "image", label: "Image", icon: <ImageIcon size={16} /> },
        ].map((type) => (
          <button
            key={type.id}
            onClick={() => setContentType(type.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
              contentType === type.id
                ? "bg-frica-green text-white shadow-md shadow-green-100"
                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
            }`}
          >
            {type.icon} {type.label}
          </button>
        ))}
      </div>

      {/* Drag & Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-[1.5rem] p-10 text-center transition-all ${
          file
            ? "border-frica-green bg-green-50/30"
            : "border-gray-200 hover:border-frica-green hover:bg-gray-50"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />

        {!file ? (
          <div className="pointer-events-none flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
              <UploadCloud size={32} />
            </div>
            <p className="text-gray-600 font-bold">
              Click or drag file to this area to upload
            </p>
            <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest font-bold">
              Max 100MB • MP4, PDF, PPT
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-frica-green">
              <CheckCircle size={32} />
            </div>
            <p className="text-gray-800 font-black text-lg">{file.name}</p>
            <p className="text-gray-400 text-sm font-bold mt-1">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>

            {!uploading && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="mt-4 flex items-center gap-1 text-red-500 text-xs font-bold hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors z-10 relative"
              >
                <X size={14} /> Remove File
              </button>
            )}
          </div>
        )}
      </div>

      {/* Progress Bar & Status */}
      {uploading && (
        <div className="mt-6">
          <div className="flex justify-between text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-frica-green h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {message && (
        <div
          className={`mt-6 p-4 rounded-xl flex items-center gap-3 text-sm font-bold ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-100"
              : "bg-red-50 text-red-700 border border-red-100"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          {message.text}
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full mt-6 bg-[#2D5A27] text-white py-4 rounded-xl font-black shadow-lg hover:shadow-green-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Processing...
          </>
        ) : (
          <>
            <UploadCloud size={18} /> Upload to Repository
          </>
        )}
      </button>
    </div>
  );
}
