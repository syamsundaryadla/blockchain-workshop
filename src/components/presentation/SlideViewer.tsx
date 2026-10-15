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
import { HelloBlockchainSim } from "@/components/simulations/HelloBlockchainSim";
import { SlideInfographic } from "./SlideInfographics";
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
  ExternalLink,
  Grid,
} from "lucide-react";

const SIMULATION_ROUTE_MAP: Record<string, string> = {
  hasher: "/simulations/hasher",
  blockchain: "/simulations/blockchain",
  network: "/simulations/networks",
  transaction: "/simulations/transactions",
  mining: "/simulations/mining",
  consensus: "/simulations/mining",
  docker: "/simulations/docker",
  fabric: "/simulations/fabric",
  "hello-blockchain": "/mini-project",
  "asset-demo": "/mini-project",
};

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

  // Read URL query parameter on initial mount (e.g. ?slide=11)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const slideParam = params.get("slide");
      if (slideParam) {
        const num = parseInt(slideParam, 10);
        const targetIndex = PRESENTATION_SLIDES.findIndex((s) => s.slideNumber === num);
        if (targetIndex !== -1) {
          setCurrentSlideIndex(targetIndex);
        }
      }
    }
  }, []);

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
        case "g":
        case "G":
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
  const standaloneRoute = currentSlide.simulationType
    ? SIMULATION_ROUTE_MAP[currentSlide.simulationType] || "/simulations"
    : null;

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col w-full min-h-screen bg-slate-200/80 font-sans text-slate-800 select-text ${
        isFullscreen ? "h-screen bg-slate-950 p-0" : ""
      }`}
    >
      {/* Top Application Bar */}
      {!isFullscreen && (
        <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-2.5 bg-white border-b border-slate-200 shadow-sm">
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
              title="Slide Navigator (M or G)"
            >
              <Grid className="w-3.5 h-3.5 text-blue-600" />
              <span>{currentSlide.category}</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                {currentSlide.slideNumber}/{PRESENTATION_SLIDES.length}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/simulations"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-teal-600" />
              <span>All Labs</span>
            </Link>

            <button
              onClick={() => setIsKeyHelpOpen(true)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors text-xs"
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
      )}

      {/* Slide Progress Indicator Bar */}
      <div className="w-full h-1 bg-slate-200 overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Main Presentation Stage: Consistent 16:9 Canvas Across All Slides */}
      <div
        className={`w-full flex-1 flex items-center justify-center ${
          isFullscreen ? "p-0 bg-slate-950" : "p-3 sm:p-6 lg:p-8"
        }`}
      >
        <div
          className={`w-full max-w-[1380px] bg-white border border-slate-200/90 shadow-2xl flex flex-col justify-between overflow-hidden relative transition-all duration-150 ${
            isFullscreen
              ? "h-full max-w-[177.78vh] aspect-[16/9] mx-auto rounded-none"
              : "aspect-[16/9] max-h-[calc(100vh-125px)] min-h-[580px] rounded-2xl"
          }`}
        >
          {/* Slide Header (Fixed Height across all slides) */}
          <div className="px-8 sm:px-12 pt-6 sm:pt-8 pb-3 border-b border-slate-100 flex-shrink-0">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                  {currentSlide.category}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[11px] font-mono font-bold text-slate-500">
                  Slide {currentSlide.slideNumber} of {PRESENTATION_SLIDES.length}
                </span>
              </div>

              {standaloneRoute && (
                <Link
                  href={standaloneRoute}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-blue-700 hover:text-white bg-blue-50 hover:bg-blue-600 border border-blue-200 transition-colors shadow-sm"
                  title="Open this lab in a separate browser tab"
                >
                  <span>Open in Dedicated Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight text-slate-900 font-display mt-2 leading-tight">
              {currentSlide.title}
            </h1>

            {currentSlide.subtitle && (
              <p className="text-sm sm:text-base lg:text-[17px] text-slate-600 font-medium mt-1 leading-snug line-clamp-1">
                {currentSlide.subtitle}
              </p>
            )}
          </div>

          {/* Slide Body Stage (Flex-1 scrollable area with fixed boundaries) */}
          <div className="flex-1 min-h-0 overflow-y-auto px-8 sm:px-12 py-4 sm:py-6">
            {/* Slide 1: Workshop Cover Keynote Layout */}
            {currentSlide.slideNumber === 1 ? (
              <div className="h-full flex flex-col justify-between py-2 space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-mono font-bold">
                    Engineering Workshop • 6 Modules • Hands-on Lab
                  </div>
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 font-display leading-[1.05]">
                    BLOCKCHAIN LAB
                  </h2>
                  <p className="text-lg sm:text-xl text-slate-600 font-medium max-w-3xl leading-relaxed">
                    Interactive technical workshop for engineers: Cryptographic primitives, distributed P2P consensus, and enterprise Hyperledger Fabric.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-mono font-bold text-blue-600 block">01 / Fundamentals</span>
                    <span className="text-sm font-bold text-slate-900 mt-1 block">SHA-256 &amp; Chain Linking</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-mono font-bold text-blue-600 block">02 / Architecture</span>
                    <span className="text-sm font-bold text-slate-900 mt-1 block">P2P Mesh &amp; Consensus</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-mono font-bold text-teal-600 block">03 / Fabric &amp; Docker</span>
                    <span className="text-sm font-bold text-slate-900 mt-1 block">Execute-Order-Validate</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-mono font-bold text-teal-600 block">04 / Mini Project</span>
                    <span className="text-sm font-bold text-slate-900 mt-1 block">Hello Blockchain Store</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono">
                    Press Space or Right Arrow to begin presentation
                  </span>
                  <button
                    onClick={goToNextSlide}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
                  >
                    <span>Start Workshop</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : currentSlide.simulationType ? (
              /* Dedicated Interactive Simulation Lab View */
              <div className="h-full flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between bg-blue-50/70 border border-blue-200 px-4 py-2 rounded-xl text-xs">
                  <div className="flex items-center gap-2 text-blue-900 font-bold">
                    <Sliders className="w-4 h-4 text-blue-600" />
                    <span>Interactive Classroom Demonstration Workbench</span>
                  </div>
                  <span className="text-slate-500 text-[11px] hidden sm:inline">
                    Instructor controls are fully interactive within this stage
                  </span>
                </div>

                <div className="flex-1 min-h-[360px] overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/40 p-4">
                  {currentSlide.simulationType === "hasher" && <Sha256HasherSim />}
                  {currentSlide.simulationType === "blockchain" && <BlockchainSim />}
                  {currentSlide.simulationType === "network" && <NetworkTopologySim />}
                  {currentSlide.simulationType === "transaction" && <TransactionSim />}
                  {(currentSlide.simulationType === "mining" || currentSlide.simulationType === "consensus") && <MiningSim />}
                  {currentSlide.simulationType === "fabric" && <FabricExplorerSim />}
                  {currentSlide.simulationType === "docker" && <DockerArchitectureSim />}
                  {(currentSlide.simulationType === "asset-demo" || currentSlide.simulationType === "hello-blockchain") && <HelloBlockchainSim />}
                </div>
              </div>
            ) : currentSlide.quiz ? (
              /* Knowledge Check Quiz View */
              <div className="h-full flex flex-col justify-between space-y-4 max-w-4xl mx-auto py-2">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                  <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <h3 className="font-bold text-lg sm:text-xl text-slate-900 leading-snug">
                    {currentSlide.quiz.question}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
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
                        className={`text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between shadow-sm ${borderClass} ${bgClass}`}
                      >
                        <span className="leading-relaxed">{opt}</span>
                        {isAnswerSubmitted && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 ml-2" />
                        )}
                        {isAnswerSubmitted && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 flex items-center justify-between">
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
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 bg-slate-100 border border-slate-300 transition-colors"
                    >
                      Reset Quiz
                    </button>
                  )}

                  {isAnswerSubmitted && (
                    <span className="text-xs font-bold text-slate-600">
                      {selectedQuizAnswer === currentSlide.quiz.correctIndex ? "Correct!" : "Incorrect."}
                    </span>
                  )}
                </div>

                {isAnswerSubmitted && (
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-slate-700 space-y-1 animate-fade-in leading-relaxed">
                    <span className="font-bold text-blue-900 block">
                      Technical Explanation:
                    </span>
                    <p>{currentSlide.quiz.explanation}</p>
                  </div>
                )}
              </div>
            ) : currentSlide.content.comparison ? (
              /* ================= TEMPLATE: FULL-WIDTH ARCHITECTURAL COMPARISON ================= */
              <div className="h-full flex flex-col justify-between space-y-6">
                {currentSlide.content.lead && (
                  <p className="text-base sm:text-lg lg:text-[20px] text-slate-700 leading-relaxed font-sans font-normal">
                    {currentSlide.content.lead}
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 items-stretch">
                  {/* Left Column Card */}
                  <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-300 shadow-sm flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                        <h3 className="font-extrabold text-base sm:text-lg lg:text-xl text-slate-900 font-display">
                          {currentSlide.content.comparison.leftTitle}
                        </h3>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                          Traditional Model
                        </span>
                      </div>

                      <ul className="space-y-3.5">
                        {currentSlide.content.comparison.leftItems.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="w-2 h-2 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                            <span className="text-sm sm:text-base lg:text-[17px] text-slate-700 leading-relaxed">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Column Card */}
                  <div className="p-6 sm:p-8 rounded-2xl bg-blue-50/70 border border-blue-300 shadow-sm flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between border-b border-blue-200 pb-3 mb-4">
                        <h3 className="font-extrabold text-base sm:text-lg lg:text-xl text-blue-950 font-display">
                          {currentSlide.content.comparison.rightTitle}
                        </h3>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2.5 py-1 rounded border border-blue-200">
                          Distributed Model
                        </span>
                      </div>

                      <ul className="space-y-3.5">
                        {currentSlide.content.comparison.rightItems.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                            <span className="text-sm sm:text-base lg:text-[17px] text-slate-800 leading-relaxed font-medium">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Architectural Takeaway Bar */}
                <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between text-xs sm:text-sm text-slate-700">
                  <span className="font-bold text-slate-900">Key Architectural Tradeoff:</span>
                  <span className="text-slate-600 font-medium">
                    Centralized databases optimize for raw write throughput; Distributed ledgers guarantee tamper-proof multi-party trust without a central administrator.
                  </span>
                </div>
              </div>
            ) : currentSlide.infographicType ? (
              /* ================= TEMPLATE: SPLIT-SCREEN INFOGRAPHIC ================= */
              <div className="h-full flex flex-col justify-between space-y-5">
                {currentSlide.content.lead && (
                  <p className="text-base sm:text-lg lg:text-[19px] text-slate-700 leading-relaxed font-sans font-normal">
                    {currentSlide.content.lead}
                  </p>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center flex-1">
                  {/* Left Column (5 cols): Bullet Points */}
                  <div className="lg:col-span-5 space-y-3.5">
                    {currentSlide.content.points &&
                      currentSlide.content.points.map((pt, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                          <p className="text-sm sm:text-base lg:text-[17px] text-slate-700 leading-relaxed font-normal">
                            {pt}
                          </p>
                        </div>
                      ))}

                    {currentSlide.content.quote && (
                      <div className="mt-4 p-4 rounded-xl bg-slate-50 border-l-4 border-blue-600 shadow-sm">
                        <p className="text-sm sm:text-base font-display font-bold text-slate-900 italic">
                          &ldquo;{currentSlide.content.quote}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Column (7 cols): Infographic Diagram */}
                  <div className="lg:col-span-7 w-full h-full flex items-center">
                    <SlideInfographic type={currentSlide.infographicType} />
                  </div>
                </div>
              </div>
            ) : currentSlide.content.codeSnippet ? (
              /* ================= TEMPLATE: CODE SNIPPET ================= */
              <div className="h-full flex flex-col justify-between space-y-5">
                {currentSlide.content.lead && (
                  <p className="text-base sm:text-lg lg:text-[19px] text-slate-700 leading-relaxed font-sans font-normal">
                    {currentSlide.content.lead}
                  </p>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
                  <div className="lg:col-span-5 space-y-3.5">
                    {currentSlide.content.points &&
                      currentSlide.content.points.map((pt, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                          <p className="text-sm sm:text-base lg:text-[17px] text-slate-700 leading-relaxed font-normal">
                            {pt}
                          </p>
                        </div>
                      ))}
                  </div>

                  <div className="lg:col-span-7 w-full rounded-xl bg-white border border-slate-300 overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 border-b border-slate-200">
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
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                        )}
                        <span>{copiedCode === currentSlide.content.codeSnippet.code ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                    <pre className="p-4 text-xs sm:text-sm font-mono text-slate-800 overflow-x-auto leading-relaxed bg-slate-50/60 max-h-[320px]">
                      {currentSlide.content.codeSnippet.code}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              /* ================= TEMPLATE: CONCEPT / TAKEAWAY SLIDE ================= */
              <div className="h-full flex flex-col justify-between space-y-6">
                {currentSlide.content.lead && (
                  <p className="text-base sm:text-lg lg:text-[20px] text-slate-700 leading-relaxed font-sans font-normal">
                    {currentSlide.content.lead}
                  </p>
                )}

                {/* Structured points grid filling the slide evenly */}
                {currentSlide.content.points && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                    {currentSlide.content.points.map((pt, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3.5 shadow-sm"
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                        <p className="text-sm sm:text-base lg:text-[17px] text-slate-800 leading-relaxed font-normal">
                          {pt}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {currentSlide.content.quote && (
                  <div className="p-5 rounded-2xl bg-blue-50/70 border-l-4 border-blue-600 shadow-sm flex items-center justify-between">
                    <p className="text-lg sm:text-xl font-display font-bold text-blue-950 italic">
                      &ldquo;{currentSlide.content.quote}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Slide Footer Navigation (Fixed Height & Position across all slides) */}
          <div className="px-8 sm:px-12 py-3.5 border-t border-slate-100 flex items-center justify-between flex-shrink-0 bg-white">
            <div className="flex items-center gap-2">
              <button
                onClick={goToPrevSlide}
                disabled={currentSlideIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 disabled:opacity-40 transition-colors shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={() => setIsNavOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
                title="View all slides (M)"
              >
                <Grid className="w-3.5 h-3.5 text-blue-600" />
                <span>Jump to Slide</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-slate-500">
                {currentSlideIndex + 1} / {PRESENTATION_SLIDES.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={goToNextSlide}
                disabled={currentSlideIndex === PRESENTATION_SLIDES.length - 1}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 transition-colors shadow-sm"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Presenter Speaker Notes Drawer */}
      {isNotesOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-blue-600 p-5 shadow-2xl animate-fade-in">
          <div className="max-w-5xl mx-auto flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Speaker Notes (Instructor Teleprompter)
                </span>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  Slide {currentSlide.slideNumber}: {currentSlide.title}
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                {currentSlide.speakerNotes}
              </p>
            </div>
            <button
              onClick={() => setIsNotesOpen(false)}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Slide Navigator Modal Drawer */}
      {isNavOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <Grid className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900 font-display">
                  Workshop Slide Navigator ({PRESENTATION_SLIDES.length} Slides)
                </h3>
              </div>
              <button
                onClick={() => setIsNavOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {WORKSHOP_MODULES.map((mod) => {
                const moduleSlides = PRESENTATION_SLIDES.filter(
                  (s) => s.moduleId === mod.id
                );
                return (
                  <div key={mod.id} className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700">
                        {mod.title}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        Slides {mod.slideRange[0]} - {mod.slideRange[1]}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {moduleSlides.map((slide) => {
                        const isCurrent = slide.slideNumber === currentSlide.slideNumber;
                        return (
                          <button
                            key={slide.id}
                            onClick={() => goToSlide(slide.slideNumber - 1)}
                            className={`p-3 rounded-xl text-left border transition-all text-xs flex flex-col justify-between h-20 ${
                              isCurrent
                                ? "bg-blue-50 border-blue-600 ring-2 ring-blue-300 font-bold"
                                : "bg-white border-slate-200 hover:border-blue-400 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[10px] text-slate-500">
                                #{slide.slideNumber}
                              </span>
                              {slide.simulationType && (
                                <span className="text-[9px] font-mono font-bold bg-blue-100 text-blue-800 px-1 py-0.2 rounded">
                                  LAB
                                </span>
                              )}
                              {slide.quiz && (
                                <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-800 px-1 py-0.2 rounded">
                                  QUIZ
                                </span>
                              )}
                              {slide.infographicType && (
                                <span className="text-[9px] font-mono font-bold bg-teal-100 text-teal-800 px-1 py-0.2 rounded">
                                  INFO
                                </span>
                              )}
                            </div>
                            <span className="line-clamp-2 text-slate-800 leading-snug">
                              {slide.title}
                            </span>
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">
                  Keyboard Shortcuts
                </h3>
              </div>
              <button
                onClick={() => setIsKeyHelpOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>Next Slide</span>
                <span className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded border">
                  → / Space / PageDown
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>Previous Slide</span>
                <span className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded border">
                  ← / PageUp
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>Toggle Fullscreen</span>
                <span className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded border">
                  F
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>Speaker Notes Drawer</span>
                <span className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded border">
                  N
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>Slide Navigator Grid</span>
                <span className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded border">
                  M or G
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>Close Modals / Drawers</span>
                <span className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded border">
                  Esc
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsKeyHelpOpen(false)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
