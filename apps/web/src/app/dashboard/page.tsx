"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Sparkles,
  BarChart3,
  ShieldAlert,
  CheckCircle2,
  Layers,
  ArrowRight,
  TrendingUp,
  Cpu,
  Loader2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getDashboardStats } from "@/lib/api/client";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const {
    data: stats,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center px-4 py-32 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
        <h3 className="mt-4 text-lg font-semibold text-slate-800">
          Loading Dashboard Analytics...
        </h3>
      </div>
    );
  }

  const hasData = stats && stats.totalAnalyses > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Top Greeting & Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Waste Analysis Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time monitoring of inspected waste streams and e-waste classification metrics.
          </p>
        </div>

        <Link href="/analyze">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Analyze New Item</span>
          </Button>
        </Link>
      </div>

      {!hasData ? (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Sparkles className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Analyses Recorded Yet</h3>
          <p className="max-w-md mx-auto text-sm text-slate-500 leading-relaxed">
            Upload your first photo of recyclable waste or electronics to initiate computer vision detection and build your environmental tracking history.
          </p>
          <div className="pt-2">
            <Link href="/analyze">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                Start First Analysis
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Analyses */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Total Analyses
                </CardTitle>
                <Layers className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-slate-900">
                  {stats.totalAnalyses}
                </div>
                <p className="mt-1 text-xs text-slate-500">Recorded audit events</p>
              </CardContent>
            </Card>

            {/* E-Waste Detected */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  E-waste Detected
                </CardTitle>
                <ShieldAlert className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-amber-600">
                  {stats.ewasteCount}
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {stats.ewastePercentage}% of total waste
                </p>
              </CardContent>
            </Card>

            {/* Non E-waste */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Non E-waste
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-emerald-600">
                  {stats.nonEwasteCount}
                </div>
                <p className="mt-1 text-xs text-slate-500">Standard recyclables</p>
              </CardContent>
            </Card>

            {/* Top Detected Category */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Top Category
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold text-slate-900 truncate">
                  {stats.mostFrequentCategory || "N/A"}
                </div>
                <p className="mt-1 text-xs text-slate-500">Most frequent detection</p>
              </CardContent>
            </Card>
          </div>

          {/* Visual Distribution Chart & Category Breakdown */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Visual Ratio Card */}
            <div className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">E-Waste Proportion</h3>
                <span className="text-xs font-mono text-slate-400">Ratio Analysis</span>
              </div>

              {/* Progress Bar Representation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-amber-700 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    Electronic Waste ({stats.ewasteCount})
                  </span>
                  <span className="text-emerald-700 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    General Recyclables ({stats.nonEwasteCount})
                  </span>
                </div>

                <div className="h-4 w-full overflow-hidden rounded-full bg-emerald-500/20 flex">
                  <div
                    className="h-full bg-amber-500 transition-all duration-500"
                    style={{ width: `${stats.ewastePercentage}%` }}
                  />
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${100 - stats.ewastePercentage}%` }}
                  />
                </div>
              </div>

              {/* Category Breakdown Bars */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Categories Breakdown
                </h4>
                <div className="space-y-2.5">
                  {stats.categoryBreakdown.slice(0, 6).map((cat) => {
                    const percent =
                      stats.totalAnalyses > 0
                        ? Math.round((cat.count / stats.totalAnalyses) * 100)
                        : 0;
                    return (
                      <div key={cat.category} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-800 flex items-center gap-1.5">
                            <span
                              className={`h-2 w-2 rounded-full ${
                                cat.isEwaste ? "bg-amber-500" : "bg-emerald-500"
                              }`}
                            />
                            {cat.category}
                          </span>
                          <span className="font-mono text-slate-400">
                            {cat.count} item{cat.count > 1 ? "s" : ""} ({percent}%)
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${
                              cat.isEwaste ? "bg-amber-500" : "bg-emerald-500"
                            }`}
                            style={{
                              width: `${Math.min(100, Math.max(8, percent))}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Analyses List */}
            <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">Recent Analyses</h3>
                <Link
                  href="/history"
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  <span>View All History</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {stats.recentAnalyses.map((item) => (
                  <Link
                    key={item.id}
                    href={`/results/${item.id}`}
                    className="flex items-center justify-between py-3.5 hover:bg-slate-50/70 px-2 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt="Thumbnail"
                        className="h-12 w-12 rounded-lg object-cover border border-slate-200 bg-slate-100 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                            {item.detections.length > 0
                              ? item.detections.map((d) => d.category).join(", ")
                              : "Unclassified Item"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          {formatDate(item.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        className={
                          item.isEwaste
                            ? "bg-amber-100 text-amber-800 border-amber-300"
                            : "bg-emerald-100 text-emerald-800 border-emerald-300"
                        }
                      >
                        {item.isEwaste ? "E-waste" : "Non E-waste"}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
