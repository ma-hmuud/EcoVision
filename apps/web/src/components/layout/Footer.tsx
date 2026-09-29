import Link from "next/link";
import { Recycle, Shield, Cpu, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50/70 text-slate-600">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <Recycle className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-slate-900">
                Eco<span className="text-emerald-600">Vision</span>
              </span>
            </div>
            <p className="max-w-md text-sm text-slate-500 leading-relaxed">
              Empowering consumers and recycling operators with intelligent AI computer vision
              to accurately classify waste, identify hazardous electronic waste, and promote
              sustainable circular economy decisions.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Cpu className="h-3.5 w-3.5 text-emerald-600" /> YOLO / Vision AI
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Shield className="h-3.5 w-3.5 text-emerald-600" /> Better Auth
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Drizzle ORM
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Platform
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/analyze" className="hover:text-emerald-600 transition-colors">
                  Analyze Waste
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-600 transition-colors">
                  Analytics Dashboard
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-emerald-600 transition-colors">
                  Audit History
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              E-waste Awareness
            </h3>
            <p className="mt-4 text-xs text-slate-500 leading-normal">
              Over 50 million metric tons of e-waste are generated globally each year.
              Only 20% is formally recycled. Proper detection prevents toxic heavy metals
              from contaminating local ecosystems.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200/80 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} EcoVision. Production-grade Full-Stack AI Platform.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Next.js 16 • Express • FastAPI • Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
