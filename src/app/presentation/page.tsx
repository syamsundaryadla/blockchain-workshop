import React from "react";
import { SlideViewer } from "@/components/presentation/SlideViewer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Presentation Mode — BLOCKCHAIN LAB",
  description: "Fullscreen interactive instructor presentation for the Blockchain Workshop.",
};

export default function PresentationPage() {
  return <SlideViewer />;
}
