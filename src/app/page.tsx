import React from "react";
import { SlideViewer } from "@/components/presentation/SlideViewer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blockchain Lab — Hyperledger Fabric Workshop",
  description:
    "Understand blockchain visually, follow Hyperledger Fabric, and build real Campus Credits transfers during a 9:30–4:30 workshop.",
};

export default function HomePage() {
  return <SlideViewer />;
}
