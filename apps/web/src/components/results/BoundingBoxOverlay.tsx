"use client";

import React, { useState, useRef, useEffect } from "react";
import { Detection } from "@/types";

interface BoundingBoxOverlayProps {
  imageUrl: string;
  detections: Detection[];
  activeDetectionId?: string | null;
  onSelectDetection?: (id: string | null) => void;
}

export function BoundingBoxOverlay({
  imageUrl,
  detections,
  activeDetectionId,
  onSelectDetection,
}: BoundingBoxOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [naturalDimensions, setNaturalDimensions] = useState<{ width: number; height: number } | null>(null);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setNaturalDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl bg-slate-950 flex items-center justify-center select-none"
    >
      {/* Underlying Image */}
      <img
        ref={imageRef}
        src={imageUrl}
        alt="Analyzed waste"
        onLoad={handleImageLoad}
        className="max-h-[600px] w-auto max-w-full object-contain"
      />

      {/* Bounding Boxes Layer */}
      {naturalDimensions && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div
            className="relative"
            style={{
              width: `${imageRef.current?.clientWidth || 0}px`,
              height: `${imageRef.current?.clientHeight || 0}px`,
            }}
          >
            {detections.map((detection) => {
              if (!detection.boundingBox) return null;

              const { x, y, width, height } = detection.boundingBox;
              const scaleX = (imageRef.current?.clientWidth || 1) / naturalDimensions.width;
              const scaleY = (imageRef.current?.clientHeight || 1) / naturalDimensions.height;

              const scaledX = x * scaleX;
              const scaledY = y * scaleY;
              const scaledW = width * scaleX;
              const scaledH = height * scaleY;

              const isEwaste = detection.isEwaste;
              const isActive = activeDetectionId === detection.id;

              return (
                <div
                  key={detection.id}
                  onMouseEnter={() => onSelectDetection?.(detection.id)}
                  onMouseLeave={() => onSelectDetection?.(null)}
                  className={`absolute pointer-events-auto cursor-pointer rounded transition-all duration-200 ${
                    isEwaste
                      ? "border-2 border-amber-400 bg-amber-500/15"
                      : "border-2 border-emerald-400 bg-emerald-500/15"
                  } ${
                    isActive
                      ? "ring-4 ring-white shadow-xl scale-[1.01] z-20"
                      : "hover:scale-[1.005] z-10"
                  }`}
                  style={{
                    left: `${scaledX}px`,
                    top: `${scaledY}px`,
                    width: `${scaledW}px`,
                    height: `${scaledH}px`,
                  }}
                >
                  {/* Category Pill Tag */}
                  <div
                    className={`absolute -top-7 left-0 flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] font-bold shadow-md ${
                      isEwaste
                        ? "bg-amber-500 text-slate-950"
                        : "bg-emerald-500 text-white"
                    }`}
                  >
                    <span>{detection.category}</span>
                    <span className="opacity-90 font-mono text-[10px]">
                      {(detection.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
