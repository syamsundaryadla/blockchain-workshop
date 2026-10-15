"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Presentation, Home, Sliders } from "lucide-react";

interface SimulationPageLayoutProps {
  title: string;
  subtitle: string;
  slideNumber: number;
  moduleName: string;
  children: React.ReactNode;
}

export function SimulationPageLayout({
  title,
  subtitle,
  slideNumber,
  moduleName,
  children,
}: SimulationPageLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href={`/?slide=${slideNumber}`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
              <span>Back to Slide {slideNumber}</span>
            </Link>

            <span className="text-slate-300">|</span>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {moduleName}
                </span>
                <span className="text-xs font-bold text-slate-900">{title}</span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Presentation className="w-4 h-4 text-blue-600" />
              <span>Full Presentation</span>
            </Link>

            <Link
              href="/simulations"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Sliders className="w-4 h-4 text-teal-600" />
              <span>All Labs</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Full-Page Workbench Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
