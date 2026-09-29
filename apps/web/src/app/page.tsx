import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  BarChart3,
  Recycle,
  CheckCircle2,
  ScanSearch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-slate-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left Column: Hero Text */}
            <div className="space-y-6 lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <span>Next-Gen Computer Vision Waste Classification</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-6xl sm:leading-tight">
                Turn Waste Into <span className="text-emerald-600">Better Decisions.</span>
              </h1>

              <p className="max-w-xl text-lg text-slate-600 sm:text-xl leading-relaxed">
                Upload a photo and let AI identify your waste and determine whether it can be classified as electronic waste.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/analyze">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 flex items-center gap-2">
                    <span>Analyze Your Waste</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <a href="#how-it-works">
                  <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100">
                    Learn More
                  </Button>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Real-time Bounding Boxes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>E-waste vs General Waste</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Actionable Recycling Advice</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Graphic */}
            <div className="relative lg:col-span-5">
              <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-4 shadow-2xl">
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">AI Visual Inspector</span>
                </div>

                {/* Simulated Detection Canvas */}
                <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center p-4">
                  <img
                    src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80"
                    alt="E-waste demo"
                    className="h-full w-full object-cover rounded-xl opacity-80"
                  />

                  {/* Bounding Box 1 */}
                  <div className="absolute left-[15%] top-[20%] h-[55%] w-[65%] rounded border-2 border-amber-400 bg-amber-500/20 ring-2 ring-white/50">
                    <div className="absolute -top-7 left-0 flex items-center gap-1.5 rounded bg-amber-500 px-2 py-0.5 text-[11px] font-bold text-slate-950 shadow">
                      <span>Laptop</span>
                      <span className="font-mono text-[9px]">96.4%</span>
                    </div>
                  </div>

                  {/* Detection Card Floating */}
                  <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/20 bg-slate-900/90 p-3 text-white backdrop-blur shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-xs font-semibold">Electronic Waste Detected</span>
                      </div>
                      <span className="rounded bg-amber-400/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-300">
                        YES
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-500 px-1">
                  <span>FastAPI + YOLO / Mock Core</span>
                  <span className="font-mono text-emerald-600 font-semibold">Ready for Upload</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Simple 3-Step Process
            </h2>
            <p className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              From Photo to Sustainable Action
            </p>
            <p className="text-sm text-slate-500">
              Transform ambiguous discarded electronics and mixed recyclables into structured data and safe disposal paths.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-8 space-y-4 hover:border-emerald-500/50 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold text-lg">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900">Upload Image</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Drag and drop any waste photo or capture on mobile. Multer backend rigorously validates MIME types and safe unique storage keys.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-8 space-y-4 hover:border-emerald-500/50 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold text-lg">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900">AI Vision Processing</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                FastAPI microservice runs the WasteDetector architecture to locate objects, plot pixel bounding boxes, and assign confidence scores.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-8 space-y-4 hover:border-emerald-500/50 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold text-lg">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900">E-Waste & Insights</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Determine if items are regulated e-waste, receive custom handling precautions, and review historical trends in your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Core Capabilities
            </h2>
            <p className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Engineered for Production Precision
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Cpu className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-slate-900">E-Waste Detection</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Specialized classification for laptops, phones, batteries, monitors, chargers, and circuit components.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <ScanSearch className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-slate-900">Bounding Box Overlays</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Visual bounding coordinates dynamically highlight detected objects on any screen resolution.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-slate-900">Dynamic Analytics</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Live statistics on total analyses, e-waste ratios, and top waste categories detected over time.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-slate-900">Auditable History</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                PostgreSQL persistence with Drizzle ORM ensures every user maintains an isolated, auditable record.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-slate-950 text-white relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Ready to Analyze Waste with AI?
          </h2>
          <p className="max-w-xl mx-auto text-sm text-slate-400">
            Start uploading images now. Protect our environment through informed circular waste decisions.
          </p>
          <div className="pt-2">
            <Link href="/analyze">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-8 shadow-xl">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
