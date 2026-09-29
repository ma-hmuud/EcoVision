"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Trash2,
  ExternalLink,
  Filter,
  Calendar,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getAnalyses, deleteAnalysis } from "@/lib/api/client";
import { formatDate } from "@/lib/utils";

export default function HistoryPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "ewaste" | "non-ewaste">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["analyses", searchTerm, filterType, sortOrder],
    queryFn: () =>
      getAnalyses({
        search: searchTerm || undefined,
        filter: filterType,
        sort: sortOrder,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAnalysis(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analyses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this analysis?")) {
      deleteMutation.mutate(id);
    }
  };

  const analyses = data?.analyses || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Analysis History
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Search, filter, and audit past waste inspections and classification records.
          </p>
        </div>

        <Link href="/analyze">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>New Analysis</span>
          </Button>
        </Link>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by category (e.g. Laptop, Plastic)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-xl border-slate-200 bg-slate-50/50"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={filterType === "all" ? "default" : "outline"}
            onClick={() => setFilterType("all")}
            className="text-xs rounded-xl"
          >
            All Waste
          </Button>
          <Button
            size="sm"
            variant={filterType === "ewaste" ? "default" : "outline"}
            onClick={() => setFilterType("ewaste")}
            className="text-xs rounded-xl"
          >
            E-Waste Only
          </Button>
          <Button
            size="sm"
            variant={filterType === "non-ewaste" ? "default" : "outline"}
            onClick={() => setFilterType("non-ewaste")}
            className="text-xs rounded-xl"
          >
            Non E-Waste
          </Button>
        </div>

        {/* Sort Order Toggle */}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
            className="text-xs text-slate-600 flex items-center gap-1.5"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span>{sortOrder === "newest" ? "Newest First" : "Oldest First"}</span>
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="mt-3 text-sm text-slate-500">Loading your history records...</p>
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center space-y-2">
          <AlertCircle className="mx-auto h-8 w-8 text-rose-600" />
          <h3 className="font-bold text-slate-900">Failed to load history</h3>
          <p className="text-xs text-slate-600">
            {(error as Error)?.message || "Please verify your session and network."}
          </p>
        </div>
      ) : analyses.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
          <p className="font-semibold text-slate-700">No matching analyses found</p>
          <p className="text-xs text-slate-400">
            {searchTerm || filterType !== "all"
              ? "Try adjusting your search criteria or resetting filters."
              : "Upload your first image from the Analyze page."}
          </p>
          {(searchTerm || filterType !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setFilterType("all");
              }}
              className="mt-2 text-xs"
            >
              Reset Filters
            </Button>
          )}
        </div>
      ) : (
        /* History Grid */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {analyses.map((item) => (
            <Link
              key={item.id}
              href={`/results/${item.id}`}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all flex flex-col"
            >
              {/* Image Preview Thumbnail */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                <img
                  src={item.imageUrl}
                  alt="Waste Thumbnail"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Status Badge Over Image */}
                <div className="absolute top-3 left-3">
                  <Badge
                    className={
                      item.isEwaste
                        ? "bg-amber-500 text-slate-950 font-bold border-amber-400"
                        : "bg-emerald-600 text-white font-bold border-emerald-500"
                    }
                  >
                    {item.isEwaste ? "E-waste" : "Non E-waste"}
                  </Badge>
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={(e) => handleDelete(item.id, e)}
                  title="Delete analysis"
                  className="absolute top-3 right-3 rounded-lg bg-slate-900/70 p-2 text-white hover:bg-rose-600 transition-colors backdrop-blur-sm"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-emerald-600 transition-colors">
                    {item.detections.length > 0
                      ? item.detections.map((d) => d.category).join(", ")
                      : "General Waste"}
                  </h3>

                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    {item.detections.length} item{item.detections.length > 1 ? "s" : ""} detected
                  </span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>View details</span>
                    <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
