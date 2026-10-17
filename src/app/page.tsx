import React from "react";
import { SlideViewer } from "@/components/presentation/SlideViewer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blockchain Lab — Hyperledger Fabric Workshop",
  description:
    "Understand blockchain visually. Follow Hyperledger Fabric. Build and test Campus Credits Transfer in the final hour.",
};

export default function HomePage() {
  return <SlideViewer />;
}
