"use client";

import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import { UploadCloud, Image as ImageIcon, X, RefreshCw, AlertCircle, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  isLoading?: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export function ImageUploader({
  onFileSelect,
  selectedFile,
  isLoading = false,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (file: File) => {
    setErrorMessage(null);

    if (!ACCEPTED_TYPES.includes(file.type.toLowerCase())) {
      setErrorMessage("Please upload a valid image file (JPG, JPEG, PNG, or WEBP).");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage("Image exceeds the maximum allowed file size of 10 MB.");
      return;
    }

    // Generate local preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onFileSelect(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isLoading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setErrorMessage(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReplace = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={handleFileInputChange}
        disabled={isLoading}
      />

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-sm text-rose-700 animate-in fade-in-50">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {!selectedFile || !previewUrl ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isLoading && fileInputRef.current?.click()}
          className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer ${
            isDragging
              ? "border-emerald-500 bg-emerald-50/70 scale-[1.01]"
              : "border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/20 bg-slate-50/50"
          }`}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-200 group-hover:scale-110 transition-transform">
            <UploadCloud className="h-8 w-8 text-emerald-600" />
          </div>

          <h3 className="mt-4 text-base font-semibold text-slate-800">
            Drag and drop your waste photo here
          </h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm">
            or <span className="font-semibold text-emerald-600 underline">browse files</span> from your computer or mobile camera
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="rounded-md bg-white px-2 py-1 border border-slate-200">JPG</span>
            <span className="rounded-md bg-white px-2 py-1 border border-slate-200">JPEG</span>
            <span className="rounded-md bg-white px-2 py-1 border border-slate-200">PNG</span>
            <span className="rounded-md bg-white px-2 py-1 border border-slate-200">WEBP</span>
            <span>•</span>
            <span>Max 10 MB</span>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Preview Container */}
          <div className="relative aspect-video max-h-[460px] w-full overflow-hidden bg-slate-950 flex items-center justify-center">
            <img
              src={previewUrl}
              alt="Waste preview"
              className="h-full w-full object-contain"
            />
            {isLoading && (
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
                <p className="mt-3 text-sm font-medium">Scanning waste with computer vision...</p>
              </div>
            )}
          </div>

          {/* Controls Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 p-4 bg-slate-50">
            <div className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-slate-900 truncate max-w-[200px] sm:max-w-xs">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReplace}
                disabled={isLoading}
                className="flex items-center gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Replace
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                disabled={isLoading}
                className="flex items-center gap-1.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              >
                <X className="h-3.5 w-3.5" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
