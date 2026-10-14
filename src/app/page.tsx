import React from "react";
import { SlideViewer } from "@/components/presentation/SlideViewer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BLOCKCHAIN LAB — Interactive Workshop Experience",
  description:
    "An interactive presentation and simulation platform for technical blockchain education. From SHA-256 fundamentals and network topologies to Hyperledger Fabric enterprise engineering.",
};

export default function HomePage() {
  return <SlideViewer />;
}
