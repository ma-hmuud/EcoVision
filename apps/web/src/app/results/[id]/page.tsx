"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Trash2,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  Layers,
  Cpu,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BoundingBoxOverlay } from "@/components/results/BoundingBoxOverlay";
import { RecyclingGuidance } from "@/components/results/RecyclingGuidance";
import { getAnalysisById, deleteAnalysis } from "@/lib/api/client";
import { formatDate, formatPercent } from "@/lib/utils";

export default function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const resolvedParams = use(params);
  const analysisId = resolvedParams.id;

  const [activeDetectionId, setActiveDetectionId] = useState<string | null>(null);

  const {
    data: analysis,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["analysis", analysisId],
    queryFn: () => getAnalysisById(analysisId),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteAnalysis(analysisId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analyses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      router.push("/history");
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center px-4 py-32 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
        <h3 className="mt-4 text-lg font-semibold text-slate-800">
          Loading Analysis Results...
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Retrieving image and AI bounding box telemetry
        </p>
      </div>
    );
  }

  if (isError || !analysis) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Analysis Not Found</h2>
        <p className="text-sm text-slate-500">
          {(error as Error)?.message ||
            "The requested analysis could not be located or you may need to sign in."}
        </p>
        <div className="pt-2">
          <Link href="/analyze">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Perform New Analysis
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate highest confidence score among detections
  const maxConfidence =
    analysis.detections.length > 0
      ? Math.max(...analysis.detections.map((d) => d.confidence))
      : 0.95;

  const detectedCategories = analysis.detections.map((d) => d.category);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Top Bar Navigation & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <Link
          href="/history"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to History</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/analyze">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>Analyze Another</span>
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm("Are you sure you want to delete this analysis?")) {
                deleteMutation.mutate();
              }
            }}
            disabled={deleteMutation.isPending}
            className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 flex items-center gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      {/* Main Status Header Card */}
      <div
        className={`rounded-3xl border p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
          analysis.isEwaste
            ? "border-amber-200 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-white"
            : "border-emerald-200 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-white"
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-md ${
              analysis.isEwaste
                ? "bg-amber-500 text-slate-950"
                : "bg-emerald-600 text-white"
            }`}
          >
            {analysis.isEwaste ? (
              <ShieldAlert className="h-8 w-8" />
            ) : (
              <CheckCircle2 className="h-8 w-8" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                E-Waste Classification
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(analysis.createdAt)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                {analysis.isEwaste ? "Electronic Waste Detected" : "Non-Electronic Waste"}
              </h1>
              <Badge
                className={`text-sm px-3 py-0.5 font-extrabold ${
                  analysis.isEwaste
                    ? "bg-amber-500 text-slate-950"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {analysis.isEwaste ? "YES" : "NO"}
              </Badge>
            </div>

            <p className="text-sm text-slate-600">
              Confidence Score:{" "}
              <span className="font-bold text-slate-900 font-mono">
                {formatPercent(maxConfidence)}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 shadow-sm text-xs text-slate-500">
          <Layers className="h-4 w-4 text-emerald-600" />
          <span>{analysis.detections.length} Object(s) Identified</span>
        </div>
      </div>

      {/* Grid: Left = Visual Overlay, Right = Detections List */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Visual Bounding Box Overlay */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-slate-900 text-sm">Visual Object Detection</h3>
            <span className="text-xs text-slate-400">Hover bounding box to isolate</span>
          </div>

          <BoundingBoxOverlay
            imageUrl={analysis.imageUrl}
            detections={analysis.detections}
            activeDetectionId={activeDetectionId}
            onSelectDetection={setActiveDetectionId}
          />
        </div>

        {/* Detections Breakdown List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-slate-900 text-sm">Detected Objects</h3>
            <span className="text-xs text-slate-400">Total {analysis.detections.length}</span>
          </div>

          <div className="space-y-3">
            {analysis.detections.map((item) => {
              const isHovered = activeDetectionId === item.id;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setActiveDetectionId(item.id)}
                  onMouseLeave={() => setActiveDetectionId(null)}
                  className={`rounded-2xl border p-4 transition-all duration-200 cursor-pointer ${
                    isHovered
                      ? "border-emerald-500 bg-emerald-50/40 shadow-md scale-[1.01]"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-base">
                      {item.category}
                    </span>
                    <Badge
                      className={
                        item.isEwaste
                          ? "bg-amber-100 text-amber-800 border-amber-300"
                          : "bg-emerald-100 text-emerald-800 border-emerald-300"
                      }
                    >
                      {item.isEwaste ? "E-waste" : "Non E-waste"}
                    </Badge>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>Confidence</span>
                    <span className="font-mono font-bold text-slate-800">
                      {formatPercent(item.confidence)}
                    </span>
                  </div>

                  {item.boundingBox && (
                    <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                      <span>Coords</span>
                      <span>
                        [{item.boundingBox.x}, {item.boundingBox.y}, {item.boundingBox.width}x{item.boundingBox.height}]
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recycling & Safe Disposal Guidance */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h3 className="text-lg font-bold text-slate-900">
          Recycling & Safe Disposal Advice
        </h3>
        <RecyclingGuidance
          categories={detectedCategories}
          isEwaste={analysis.isEwaste}
        />
      </div>
    </div>
  );
}
