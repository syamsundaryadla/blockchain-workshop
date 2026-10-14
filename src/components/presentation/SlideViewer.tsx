"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Slide } from "@/types/presentation";
import { PRESENTATION_SLIDES } from "@/content/slides";
import { WORKSHOP_MODULES } from "@/content/modules";
import { Sha256HasherSim } from "@/components/simulations/Sha256HasherSim";
import { BlockchainSim } from "@/components/simulations/BlockchainSim";
import { NetworkTopologySim } from "@/components/simulations/NetworkTopologySim";
import { TransactionSim } from "@/components/simulations/TransactionSim";
import { MiningSim } from "@/components/simulations/MiningSim";
import { FabricExplorerSim } from "@/components/simulations/FabricExplorerSim";
import { DockerArchitectureSim } from "@/components/simulations/DockerArchitectureSim";
import { AssetDemoSim } from "@/components/simulations/AssetDemoSim";
import { copyToClipboard } from "@/lib/utils";
import Link from "next/link";
import {
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FileText,
  CheckCircle2,
  XCircle,
  Copy,
  Home,
  Sliders,
  Layers,
  HelpCircle,
  X,
  Keyboard,
} from "lucide-react";

export function SlideViewer() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isNotesOpen, setIsNotesOpen] = useState<boolean>(false);
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [isKeyHelpOpen, setIsKeyHelpOpen] = useState<boolean>(false);

  // Quiz state for current slide
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const currentSlide: Slide = PRESENTATION_SLIDES[currentSlideIndex];

  useEffect(() => {
    setSelectedQuizAnswer(null);
    setIsAnswerSubmitted(false);
  }, [currentSlideIndex]);

  const goToNextSlide = useCallback(() => {
    if (currentSlideIndex < PRESENTATION_SLIDES.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  }, [currentSlideIndex]);

  const goToPrevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  }, [currentSlideIndex]);

  const goToSlide = (index: number) => {
    if (index >= 0 && index < PRESENTATION_SLIDES.length) {
      setCurrentSlideIndex(index);
      setIsNavOpen(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error("Fullscreen error", err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => {
        console.error("Exit fullscreen error", err);
      });
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (
        activeTag === "input" ||
        activeTag === "textarea" ||
        activeTag === "select" ||
        document.activeElement?.getAttribute("contenteditable") === "true"
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
        case "PageDown":
        case " ":
          e.preventDefault();
          goToNextSlide();
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          goToPrevSlide();
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "n":
        case "N":
          e.preventDefault();
          setIsNotesOpen((prev) => !prev);
          break;
        case "m":
        case "M":
          e.preventDefault();
          setIsNavOpen((prev) => !prev);
          break;
        case "?":
          e.preventDefault();
          setIsKeyHelpOpen((prev) => !prev);
          break;
        case "Escape":
          if (isNotesOpen) setIsNotesOpen(false);
          if (isNavOpen) setIsNavOpen(false);
          if (isKeyHelpOpen) setIsKeyHelpOpen(false);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNextSlide, goToPrevSlide, isNotesOpen, isNavOpen, isKeyHelpOpen]);

  const handleCopyCode = async (code: string) => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const progressPercentage = ((currentSlideIndex + 1) / PRESENTATION_SLIDES.length) * 100;

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col w-full min-h-screen bg-white text-slate-800 select-text"
    >
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
            title="Return to Workshop Overview"
          >
            <Home className="w-4 h-4 text-blue-600" />
            <span className="font-display font-bold">BLOCKCHAIN LAB</span>
          </Link>

          <span className="text-slate-300 hidden sm:inline">|</span>

          <button
            onClick={() => setIsNavOpen(true)}
            className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors text-slate-800"
            title="Module Navigator (M)"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>{currentSlide.category}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsKeyHelpOpen(true)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors text-xs flex items-center gap-1"
            title="Keyboard Shortcuts (?)"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsNotesOpen(!isNotesOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              isNotesOpen
                ? "bg-blue-50 text-blue-700 border-blue-300"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200"
            }`}
            title="Toggle Presenter Speaker Notes (N)"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Speaker Notes</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors text-xs"
            title="Toggle Fullscreen (F)"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* Slide Progress Indicator Bar */}
      <div className="w-full h-1.5 bg-slate-100 overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Main Slide Content Canvas (Optimized for 16:9 Projector Screens) */}
      <main className="flex-1 flex flex-col justify-between p-6 sm:p-12 max-w-6xl w-full mx-auto space-y-8">
        {/* Slide Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-blue-700 tracking-wider uppercase bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              {currentSlide.category}
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs font-mono font-bold text-slate-500">
              Slide {currentSlide.slideNumber} of {PRESENTATION_SLIDES.length}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 font-display leading-tight">
            {currentSlide.title}
          </h1>

          {currentSlide.subtitle && (
            <p className="text-base sm:text-xl text-slate-600 font-medium leading-relaxed">
              {currentSlide.subtitle}
            </p>
          )}
        </div>

        {/* Slide Body */}
        <div className="space-y-6 flex-1">
          {/* Lead Paragraph */}
          {currentSlide.content.lead && (
            <p className="text-base sm:text-xl text-slate-700 leading-relaxed font-sans font-normal">
              {currentSlide.content.lead}
            </p>
          )}

          {/* Core Bullet Points */}
          {currentSlide.content.points && (
            <div className="space-y-3.5 pt-1">
              {currentSlide.content.points.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-2.5 flex-shrink-0" />
                  <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                    {pt}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Architectural Comparison Grid */}
          {currentSlide.content.comparison && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-base text-slate-900 border-b border-slate-200 pb-2.5">
                  {currentSlide.content.comparison.leftTitle}
                </h3>
                <ul className="space-y-2.5 text-sm sm:text-base text-slate-600">
                  {currentSlide.content.comparison.leftItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-slate-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-200 shadow-sm space-y-4">
                <h3 className="font-bold text-base text-blue-900 border-b border-blue-200 pb-2.5">
                  {currentSlide.content.comparison.rightTitle}
                </h3>
                <ul className="space-y-2.5 text-sm sm:text-base text-slate-700">
                  {currentSlide.content.comparison.rightItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Code Snippet Box (Light Theme, Projector Optimized) */}
          {currentSlide.content.codeSnippet && (
            <div className="rounded-2xl bg-white border border-slate-300 overflow-hidden shadow-sm text-slate-900">
              <div className="flex items-center justify-between px-5 py-3 bg-slate-100/90 border-b border-slate-200">
                <span className="text-xs font-mono font-bold text-blue-800">
                  {currentSlide.content.codeSnippet.filename ||
                    `${currentSlide.content.codeSnippet.language.toUpperCase()} Snippet`}
                </span>
                <button
                  onClick={() =>
                    handleCopyCode(currentSlide.content.codeSnippet!.code)
                  }
                  className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors font-mono font-semibold"
                >
                  {copiedCode === currentSlide.content.codeSnippet.code ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-500" />
                  )}
                  <span>{copiedCode === currentSlide.content.codeSnippet.code ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <pre className="p-5 text-xs sm:text-sm font-mono text-slate-800 overflow-x-auto leading-relaxed bg-slate-50/60">
                {currentSlide.content.codeSnippet.code}
              </pre>
            </div>
          )}

          {/* Key Takeaway / Inspirational Quote Box */}
          {currentSlide.content.quote && (
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border-l-4 border-blue-600 shadow-sm text-center sm:text-left">
              <p className="text-xl sm:text-2xl font-display font-bold text-slate-900 tracking-tight">
                &ldquo;{currentSlide.content.quote}&rdquo;
              </p>
            </div>
          )}

          {/* Integrated Interactive Simulation (Appears directly within presentation flow) */}
          {currentSlide.simulationType && (
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-blue-700 tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4" />
                  Live Interactive Demonstration
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Presenter controls are fully interactive
                </span>
              </div>

              {currentSlide.simulationType === "hasher" && <Sha256HasherSim />}
              {currentSlide.simulationType === "blockchain" && <BlockchainSim />}
              {currentSlide.simulationType === "network" && <NetworkTopologySim />}
              {currentSlide.simulationType === "transaction" && <TransactionSim />}
              {(currentSlide.simulationType === "mining" || currentSlide.simulationType === "consensus") && <MiningSim />}
              {currentSlide.simulationType === "fabric" && <FabricExplorerSim />}
              {currentSlide.simulationType === "docker" && <DockerArchitectureSim />}
              {currentSlide.simulationType === "asset-demo" && <AssetDemoSim />}
            </div>
          )}

          {/* Knowledge Check Quiz */}
          {currentSlide.quiz && (
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <h3 className="font-bold text-lg sm:text-xl text-slate-900 leading-snug">
                  {currentSlide.quiz.question}
                </h3>
              </div>

              <div className="space-y-3">
                {currentSlide.quiz.options.map((opt, optIdx) => {
                  const isSelected = selectedQuizAnswer === optIdx;
                  const isCorrect = optIdx === currentSlide.quiz!.correctIndex;

                  let borderClass = "border-slate-300 hover:border-blue-400";
                  let bgClass = "bg-white";

                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      borderClass = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-300";
                    } else if (isSelected && !isCorrect) {
                      borderClass = "border-red-400 bg-red-50 text-red-900";
                    }
                  } else if (isSelected) {
                    borderClass = "border-blue-600 bg-blue-50 text-slate-900 font-bold ring-2 ring-blue-300";
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => {
                        if (!isAnswerSubmitted) setSelectedQuizAnswer(optIdx);
                      }}
                      className={`w-full text-left p-4 rounded-xl border text-sm sm:text-base transition-all flex items-center justify-between shadow-sm ${borderClass} ${bgClass}`}
                    >
                      <span className="leading-relaxed">{opt}</span>
                      {isAnswerSubmitted && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 ml-3" />
                      )}
                      {isAnswerSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 ml-3" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {!isAnswerSubmitted ? (
                  <button
                    onClick={() => {
                      if (selectedQuizAnswer !== null) setIsAnswerSubmitted(true);
                    }}
                    disabled={selectedQuizAnswer === null}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 transition-colors shadow-sm"
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedQuizAnswer(null);
                      setIsAnswerSubmitted(false);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 bg-slate-100 border border-slate-300 transition-colors self-start"
                  >
                    Reset Quiz
                  </button>
                )}
              </div>

              {isAnswerSubmitted && (
                <div className="p-5 rounded-xl bg-blue-50 border border-blue-200 text-xs sm:text-sm text-slate-700 space-y-1.5 animate-fade-in leading-relaxed">
                  <span className="font-bold text-blue-900 block">
                    Technical Explanation:
                  </span>
                  <p>{currentSlide.quiz.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Slide Navigation Controls */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-5">
          <button
            onClick={goToPrevSlide}
            disabled={currentSlideIndex === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 disabled:opacity-40 transition-colors shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs sm:text-sm font-mono font-bold text-slate-500">
            Slide {currentSlideIndex + 1} of {PRESENTATION_SLIDES.length}
          </span>

          <button
            onClick={goToNextSlide}
            disabled={currentSlideIndex === PRESENTATION_SLIDES.length - 1}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 transition-colors shadow-sm"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Presenter Speaker Notes Drawer */}
      {isNotesOpen && (
        <div className="sticky bottom-0 z-40 bg-white border-t-2 border-blue-600 p-5 shadow-2xl">
          <div className="max-w-6xl mx-auto flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Speaker Notes (Projector-Hidden Guidance)
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                {currentSlide.speakerNotes}
              </p>
            </div>
            <button
              onClick={() => setIsNotesOpen(false)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Module & Slide Navigator Modal */}
      {isNavOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[85vh] rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">
                  Workshop Module Navigator ({PRESENTATION_SLIDES.length} Slides)
                </h3>
              </div>
              <button
                onClick={() => setIsNavOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {WORKSHOP_MODULES.map((module) => {
                const moduleSlides = PRESENTATION_SLIDES.filter(
                  (s) => s.moduleId === module.id
                );

                return (
                  <div key={module.id} className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold border-b border-slate-200 pb-1.5">
                      <span className="text-slate-900">
                        Module {module.id}: {module.title}
                      </span>
                      <span className="text-slate-500 font-mono">
                        ~{module.durationMinutes} mins
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {moduleSlides.map((s) => {
                        const globalIndex = PRESENTATION_SLIDES.findIndex(
                          (item) => item.id === s.id
                        );
                        const isCurrent = globalIndex === currentSlideIndex;

                        return (
                          <button
                            key={s.id}
                            onClick={() => goToSlide(globalIndex)}
                            className={`text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between gap-2 shadow-sm ${
                              isCurrent
                                ? "bg-blue-50 border-blue-600 text-blue-900 font-bold ring-1 ring-blue-500"
                                : "bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-slate-50"
                            }`}
                          >
                            <span className="truncate">
                              {s.slideNumber}. {s.title}
                            </span>
                            {s.simulationType && (
                              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 flex-shrink-0">
                                Sim
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Help Modal */}
      {isKeyHelpOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-blue-600" />
                Keyboard Shortcuts Reference
              </h3>
              <button
                onClick={() => setIsKeyHelpOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-700 font-medium">Next Slide</span>
                <kbd className="px-2.5 py-1 rounded bg-white border border-slate-300 font-mono text-xs text-slate-900 font-bold shadow-sm">
                  Right Arrow / Space
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-700 font-medium">Previous Slide</span>
                <kbd className="px-2.5 py-1 rounded bg-white border border-slate-300 font-mono text-xs text-slate-900 font-bold shadow-sm">
                  Left Arrow
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-700 font-medium">Toggle Fullscreen</span>
                <kbd className="px-2.5 py-1 rounded bg-white border border-slate-300 font-mono text-xs text-slate-900 font-bold shadow-sm">
                  F
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-700 font-medium">Toggle Speaker Notes</span>
                <kbd className="px-2.5 py-1 rounded bg-white border border-slate-300 font-mono text-xs text-slate-900 font-bold shadow-sm">
                  N
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-700 font-medium">Module Navigator</span>
                <kbd className="px-2.5 py-1 rounded bg-white border border-slate-300 font-mono text-xs text-slate-900 font-bold shadow-sm">
                  M
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-700 font-medium">Close Overlays</span>
                <kbd className="px-2.5 py-1 rounded bg-white border border-slate-300 font-mono text-xs text-slate-900 font-bold shadow-sm">
                  Escape
                </kbd>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsKeyHelpOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
