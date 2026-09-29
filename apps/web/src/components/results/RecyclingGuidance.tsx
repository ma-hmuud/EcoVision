import React from "react";
import { AlertTriangle, CheckCircle, Info, ShieldAlert, Sparkles, MapPin } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface RecyclingGuidanceProps {
  categories: string[];
  isEwaste: boolean;
}

const CATEGORY_TIPS: Record<
  string,
  {
    title: string;
    instructions: string[];
    hazardLevel: "high" | "medium" | "low";
    recycleType: string;
  }
> = {
  Battery: {
    title: "Battery Handling & Fire Prevention",
    instructions: [
      "NEVER dispose in household trash or standard curbside recycling bins.",
      "Lithium-ion batteries present severe fire risks if punctured or crushed in collection trucks.",
      "Tape battery terminals with clear tape or place in individual clear bags.",
      "Drop off at dedicated battery collection bins in electronics stores or local hazardous waste centers.",
    ],
    hazardLevel: "high",
    recycleType: "Special Hazardous E-Waste",
  },
  Laptop: {
    title: "Laptop & Computer Recycling",
    instructions: [
      "Factory reset or securely wipe your hard drive to safeguard personal credentials.",
      "Remove battery if modular; otherwise keep device intact for professional disassembly.",
      "Check if manufacturer offers trade-in credit or take-back programs.",
      "Certified R2 / e-Stewards recyclers recover valuable gold, silver, copper, and rare-earth magnets.",
    ],
    hazardLevel: "medium",
    recycleType: "Certified E-Waste Facility",
  },
  "Mobile phone": {
    title: "Smartphone & Tablet Stewardship",
    instructions: [
      "Back up photos and data, remove SIM card & micro-SD cards, and perform a factory reset.",
      "Functional phones can be refurbished, donated, or traded in.",
      "Drop off at network carrier stores or community electronic drop-offs.",
    ],
    hazardLevel: "medium",
    recycleType: "Certified E-Waste Facility",
  },
  Monitor: {
    title: "Display & Monitor Safe Disposal",
    instructions: [
      "LCD and CRT monitors contain heavy metals and hazardous backlight components.",
      "Handle carefully to avoid cracking the screen or releasing fluorescent phosphors.",
      "Take to authorized electronics recycling depots.",
    ],
    hazardLevel: "high",
    recycleType: "Hazardous Electronics",
  },
  Plastic: {
    title: "Plastic Recycling Guidance",
    instructions: [
      "Rinse out food residue and liquids before placing in recycle bin.",
      "Check the resin code (PET #1 and HDPE #2 are widely accepted in curbside programs).",
      "Keep caps screwed on to prevent separation during mechanical sorting.",
    ],
    hazardLevel: "low",
    recycleType: "Standard Curbside Recycling",
  },
  Cardboard: {
    title: "Cardboard & Paper Stream",
    instructions: [
      "Flatten boxes completely to maximize bin space.",
      "Ensure cardboard is dry and free of oil, grease (e.g. greasy pizza box bases belong in compost or trash).",
      "Remove excessive plastic tape or polystyrene packing peanuts.",
    ],
    hazardLevel: "low",
    recycleType: "Clean Paper / Cardboard Bin",
  },
  Metal: {
    title: "Metal & Can Recycling",
    instructions: [
      "Aluminum cans and steel tins are infinitely recyclable without degradation.",
      "Rinse quickly to deter pests; labels can remain on.",
      "Do not crush aluminum cans if your local MRF uses optical sorters.",
    ],
    hazardLevel: "low",
    recycleType: "Metal Recycling",
  },
  Glass: {
    title: "Glass Bottle & Jar Recycling",
    instructions: [
      "Rinse jars and bottles; remove metal lids and place lids in metal bin.",
      "Do not mix drinking glasses, ceramics, or mirrors with container glass.",
    ],
    hazardLevel: "low",
    recycleType: "Glass Drop-off / Curbside",
  },
};

export function RecyclingGuidance({ categories, isEwaste }: RecyclingGuidanceProps) {
  // Collect unique matched guidance tips
  const matchedTips = Array.from(new Set(categories))
    .map((cat) => ({
      category: cat,
      tip:
        CATEGORY_TIPS[cat] || {
          title: `${cat} Handling Guidelines`,
          instructions: isEwaste
            ? [
                "Classified as electronic waste. Contains circuit boards or electrical wiring.",
                "Deliver to an authorized e-waste reclamation center.",
                "Do not place in general municipal waste.",
              ]
            : [
                "Inspect item for cleanliness before sorting into appropriate recycling container.",
                "Refer to municipal waste guidelines for localized collection schedules.",
              ],
          hazardLevel: isEwaste ? "medium" : "low",
          recycleType: isEwaste ? "Electronic Waste" : "General Recyclable",
        },
    }));

  return (
    <div className="space-y-4">
      {/* Alert Header */}
      {isEwaste ? (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-amber-900">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div className="space-y-1">
            <h4 className="font-semibold text-sm">Regulated Electronic Waste Detected</h4>
            <p className="text-xs text-amber-800 leading-relaxed">
              Items in this image contain electronic components, heavy metals, or energy storage
              cells. Proper recycling prevents soil leaching and conserves critical minerals.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-emerald-900">
          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div className="space-y-1">
            <h4 className="font-semibold text-sm">Non-Electronic Waste Stream</h4>
            <p className="text-xs text-emerald-800 leading-relaxed">
              No electronic waste detected. Follow conventional sorting and recycling protocols
              for paper, plastic, glass, and compostable organic materials.
            </p>
          </div>
        </div>
      )}

      {/* Individual Category Guidance Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {matchedTips.map(({ category, tip }) => (
          <Card key={category} className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {tip.recycleType}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    tip.hazardLevel === "high"
                      ? "bg-rose-100 text-rose-700"
                      : tip.hazardLevel === "medium"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {tip.hazardLevel === "high"
                    ? "Hazardous"
                    : tip.hazardLevel === "medium"
                    ? "Special Handling"
                    : "Standard"}
                </span>
              </div>
              <CardTitle className="text-base text-slate-900">{tip.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs text-slate-600">
                {tip.instructions.map((inst, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{inst}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
