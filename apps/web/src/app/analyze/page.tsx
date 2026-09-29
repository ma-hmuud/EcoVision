"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, AlertCircle, Cpu, Loader2 } from "lucide-react";
import { ImageUploader } from "@/components/upload/ImageUploader";
import { Button } from "@/components/ui/button";
import { uploadAndAnalyze } from "@/lib/api/client";

export default function AnalyzePage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysisStep, setAnalysisStep] = useState<string>("Uploading image to secure storage...");

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select or drop a waste photo first.");
      return;
    }

    setErrorMessage(null);
    setIsAnalyzing(true);
    setAnalysisStep("Uploading image to secure storage...");

    try {
      // Step feedback animation
      const stepTimer1 = setTimeout(() => {
        setAnalysisStep("AI is examining the image with computer vision...");
      }, 900);

      const stepTimer2 = setTimeout(() => {
        setAnalysisStep("Evaluating e-waste classification and bounding boxes...");
      }, 1800);

      const result = await uploadAndAnalyze(selectedFile);

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      // Navigate to results page
      router.push(`/results/${result.id}`);
    } catch (err: any) {
      console.error("Analysis failure:", err);
      setErrorMessage(
        err.message || "Failed to analyze image. Please ensure API & AI services are active."
      );
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
          <span>Real-time Object Detection</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Analyze Waste Item
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Upload an image of single or multiple discarded objects. EcoVision AI will inspect the photo,
          identify waste categories, outline bounding boxes, and confirm whether it contains hazardous e-waste.
        </p>
      </div>

      {/* Main Upload Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm space-y-6">
        <ImageUploader
          onFileSelect={(file) => {
            setSelectedFile(file);
            setErrorMessage(null);
          }}
          selectedFile={selectedFile}
          isLoading={isAnalyzing}
        />

        {/* Error Alert */}
        {errorMessage && (
          <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
            <div className="space-y-0.5">
              <p className="font-semibold">Analysis Failed</p>
              <p className="text-xs text-rose-700">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Loading Steps Indicator */}
        {isAnalyzing && (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-6 text-center space-y-3 animate-in fade-in-50">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              <span className="font-bold text-slate-900 text-base">
                Analyzing your waste...
              </span>
            </div>
            <p className="text-sm text-emerald-800 font-medium">
              {analysisStep}
            </p>
            <p className="text-xs text-slate-500">
              AI is examining the image.
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Cpu className="h-4 w-4 text-emerald-600" />
            <span>FastAPI WasteDetector Microservice</span>
          </div>

          <Button
            size="lg"
            onClick={handleAnalyze}
            disabled={!selectedFile || isAnalyzing}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 shadow-md flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Analyze Waste</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
