"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ChevronRight,
  Layers,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { supplyChainLayers } from "@/data/supplyChain";

interface FlowNode {
  id: string;
  label: string;
  sublabel?: string;
  color: string;
  items: { name: string; detail?: string; share?: string }[];
}

const flowData: FlowNode[][] = [
  // Layer 1: Raw Materials
  [
    {
      id: "silicon_raw",
      label: "Silicon",
      sublabel: "Quartz/Sand",
      color: "#F97316",
      items: [
        { name: "Tongwei", detail: "China", share: "30%" },
        { name: "GCL Technology", detail: "China", share: "16%" },
        { name: "Daqo New Energy", detail: "China", share: "12%" },
      ],
    },
    {
      id: "rare_earth",
      label: "Rare Earths",
      sublabel: "Mining",
      color: "#9333EA",
      items: [
        { name: "China", share: "60%" },
        { name: "USA (MP Materials)", share: "12%" },
        { name: "Australia (Lynas)", share: "8%" },
      ],
    },
    {
      id: "critical_metals",
      label: "Critical Metals",
      sublabel: "Co, Ta, W, Ga",
      color: "#DC2626",
      items: [
        { name: "Cobalt (DRC)", share: "70%" },
        { name: "Gallium (China)", share: "98%" },
        { name: "Tungsten (China)", share: "80%" },
        { name: "Tantalum (DRC/Rwanda)", share: "60%" },
      ],
    },
    {
      id: "noble_gases",
      label: "Noble Gases",
      sublabel: "Ne, Ar, He, Xe",
      color: "#06B6D4",
      items: [
        { name: "Linde", detail: "UK/Germany" },
        { name: "Air Liquide", detail: "France" },
        { name: "Air Products", detail: "USA" },
      ],
    },
  ],
  // Layer 2: Refined Materials
  [
    {
      id: "wafers",
      label: "Silicon Wafers",
      sublabel: "300mm, 11N purity",
      color: "#84CC16",
      items: [
        { name: "Shin-Etsu", detail: "Japan", share: "32%" },
        { name: "SUMCO", detail: "Japan", share: "27%" },
        { name: "GlobalWafers", detail: "Taiwan", share: "14%" },
        { name: "Siltronic", detail: "Germany", share: "12%" },
      ],
    },
    {
      id: "photoresist",
      label: "Photoresists",
      sublabel: "EUV/ArF/KrF",
      color: "#22C55E",
      items: [
        { name: "JSR", detail: "Japan", share: "35%" },
        { name: "TOK", detail: "Japan", share: "25%" },
        { name: "Shin-Etsu", detail: "Japan" },
        { name: "DuPont", detail: "USA" },
      ],
    },
    {
      id: "chemicals",
      label: "Chemicals & CMP",
      sublabel: "Slurries, Acids",
      color: "#10B981",
      items: [
        { name: "Entegris", detail: "USA" },
        { name: "BASF", detail: "Germany" },
        { name: "Fujimi", detail: "Japan" },
      ],
    },
  ],
  // Layer 3: Design & IP
  [
    {
      id: "eda",
      label: "EDA & IP",
      sublabel: "Design Tools",
      color: "#EC4899",
      items: [
        { name: "Synopsys", detail: "USA", share: "50%" },
        { name: "Cadence", detail: "USA", share: "35%" },
        { name: "ARM Holdings", detail: "UK" },
      ],
    },
    {
      id: "chip_design",
      label: "Chip Designers",
      sublabel: "Fabless",
      color: "#8B5CF6",
      items: [
        { name: "NVIDIA", detail: "GPU/AI" },
        { name: "AMD", detail: "CPU/GPU" },
        { name: "Apple", detail: "Custom SoC" },
        { name: "Qualcomm", detail: "Mobile SoC" },
        { name: "Broadcom", detail: "AI XPU" },
      ],
    },
  ],
  // Layer 4: Equipment
  [
    {
      id: "litho",
      label: "Lithography",
      sublabel: "EUV/DUV",
      color: "#F59E0B",
      items: [
        { name: "ASML", detail: "Netherlands", share: "100% EUV" },
        { name: "Nikon", detail: "Japan", share: "10% DUV" },
        { name: "Zeiss (Optics)", detail: "Germany", share: "100% EUV mirrors" },
      ],
    },
    {
      id: "dep_etch",
      label: "Deposition & Etch",
      sublabel: "CVD, PVD, Etch",
      color: "#F59E0B",
      items: [
        { name: "Applied Materials", detail: "USA", share: "19% WFE" },
        { name: "Lam Research", detail: "USA", share: "#1 Etch" },
        { name: "Tokyo Electron", detail: "Japan", share: "#1 Coaters" },
        { name: "KLA", detail: "USA", share: "58% Inspection" },
      ],
    },
  ],
  // Layer 5: Fabrication
  [
    {
      id: "foundry",
      label: "Chip Fabrication",
      sublabel: "Front-End Fabs",
      color: "#EF4444",
      items: [
        { name: "TSMC", detail: "Taiwan", share: "62% / 90% adv." },
        { name: "Samsung Foundry", detail: "S. Korea", share: "12%" },
        { name: "Intel Foundry", detail: "USA" },
        { name: "GlobalFoundries", detail: "USA", share: "6%" },
        { name: "SMIC", detail: "China", share: "5%" },
      ],
    },
    {
      id: "memory_fab",
      label: "Memory Fabrication",
      sublabel: "DRAM/NAND/HBM",
      color: "#3B82F6",
      items: [
        { name: "Samsung", detail: "DRAM 35%, NAND 33%" },
        { name: "SK Hynix", detail: "DRAM 36%, HBM 62%" },
        { name: "Micron", detail: "DRAM 23%, HBM 21%" },
        { name: "Kioxia", detail: "NAND 15%" },
      ],
    },
  ],
  // Layer 6: Packaging & Testing
  [
    {
      id: "adv_pkg",
      label: "Advanced Packaging",
      sublabel: "2.5D/3D, CoWoS, HBM",
      color: "#06B6D4",
      items: [
        { name: "TSMC CoWoS", detail: "80%+ share", share: "80%" },
        { name: "Intel EMIB/Foveros", detail: "Internal" },
        { name: "Samsung I-Cube", detail: "Growing" },
      ],
    },
    {
      id: "osat",
      label: "OSAT",
      sublabel: "Assembly & Test",
      color: "#06B6D4",
      items: [
        { name: "ASE Group", detail: "Taiwan", share: "27%" },
        { name: "Amkor", detail: "USA", share: "18%" },
        { name: "JCET", detail: "China", share: "10%" },
      ],
    },
  ],
  // Layer 7: End Products
  [
    {
      id: "gpu_product",
      label: "AI / GPU",
      sublabel: "Accelerators",
      color: "#10B981",
      items: [
        { name: "NVIDIA H100/B200", share: "88%" },
        { name: "AMD Instinct MI300" },
        { name: "Google TPU" },
      ],
    },
    {
      id: "cpu_product",
      label: "CPUs",
      sublabel: "Processors",
      color: "#10B981",
      items: [
        { name: "Intel Xeon/Core", share: "65-71%" },
        { name: "AMD EPYC/Ryzen", share: "29-35%" },
        { name: "Apple M-series" },
      ],
    },
    {
      id: "memory_product",
      label: "Memory & Storage",
      sublabel: "DRAM, SSD, HDD",
      color: "#10B981",
      items: [
        { name: "DDR5 / LPDDR5X" },
        { name: "HBM3E / HBM4" },
        { name: "3D NAND SSDs" },
        { name: "HAMR HDDs" },
      ],
    },
  ],
];

const layerLabels = [
  "Raw Materials",
  "Refined Materials",
  "Design & IP",
  "Equipment",
  "Fabrication",
  "Packaging & Testing",
  "End Products",
];

export default function SupplyChainView() {
  const [expandedNode, setExpandedNode] = useState<string | null>(null);

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-5 h-5 text-blue-400 icon-high-contrast" />
          <h2 className="text-xl font-bold text-white">Supply Chain Flow</h2>
        </div>
        <p className="text-sm text-slate-400">
          Interactive visualization of the complete semiconductor supply chain from raw material extraction to end products.
        </p>
      </div>

      {/* Flow Diagram */}
      <div className="space-y-2">
        {flowData.map((layer, layerIdx) => (
          <div key={layerIdx}>
            {/* Layer Label */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: supplyChainLayers[layerIdx]?.color || "#6366F1" }}
              >
                {layerIdx + 1}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{layerLabels[layerIdx]}</h3>
                <p className="text-[10px] text-slate-500">{supplyChainLayers[layerIdx]?.description}</p>
              </div>
            </div>

            {/* Layer Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 ml-11">
              {layer.map((node) => {
                const isExpanded = expandedNode === node.id;
                return (
                  <motion.div
                    key={node.id}
                    layout
                    onClick={() => setExpandedNode(isExpanded ? null : node.id)}
                    className="bg-surface rounded-xl border border-border hover:border-slate-600 cursor-pointer transition-all overflow-hidden card-glow"
                  >
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: node.color }}
                          />
                          <div>
                            <p className="text-sm font-semibold text-white">{node.label}</p>
                            {node.sublabel && (
                              <p className="text-[10px] text-slate-500">{node.sublabel}</p>
                            )}
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                        >
                          <ChevronRight className="w-4 h-4 text-slate-500" />
                        </motion.div>
                      </div>

                      {/* Compact view - just show count */}
                      {!isExpanded && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {node.items.slice(0, 3).map((item, i) => (
                            <span key={i} className="text-[10px] bg-surface-2 text-slate-400 px-2 py-0.5 rounded-full">
                              {item.name}
                              {item.share && <span className="text-blue-400 ml-1">{item.share}</span>}
                            </span>
                          ))}
                          {node.items.length > 3 && (
                            <span className="text-[10px] text-slate-500 px-1">+{node.items.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Expanded view */}
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="border-t border-border px-3 pb-3"
                      >
                        <div className="space-y-1.5 mt-2">
                          {node.items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between py-1 px-2 rounded bg-surface-2">
                              <div>
                                <p className="text-xs font-medium text-white">{item.name}</p>
                                {item.detail && (
                                  <p className="text-[10px] text-slate-500">{item.detail}</p>
                                )}
                              </div>
                              {item.share && (
                                <span className="text-xs font-semibold text-blue-400">{item.share}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Animated arrow between layers */}
            {layerIdx < flowData.length - 1 && (
              <div className="flex justify-center my-3">
                <div className="supply-arrow">
                  <div className="supply-arrow-line" />
                  <ArrowDown className="w-5 h-5 text-blue-400 supply-arrow-head" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Critical Dependencies */}
      <div className="mt-8 bg-red-500/5 border border-red-500/20 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-400 icon-high-contrast" />
          <h3 className="text-lg font-semibold text-white">Single Points of Failure</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { name: "ASML EUV", detail: "100% monopoly on EUV lithography", risk: "EXTREME", color: "#EF4444" },
            { name: "TSMC Advanced Nodes", detail: "90%+ of <7nm chip production", risk: "EXTREME", color: "#EF4444" },
            { name: "Zeiss EUV Optics", detail: "100% sole supplier of EUV mirrors", risk: "EXTREME", color: "#EF4444" },
            { name: "SK Hynix HBM", detail: "62% of HBM, 90% of NVIDIA HBM", risk: "HIGH", color: "#F59E0B" },
            { name: "China Gallium", detail: "98% of global gallium supply", risk: "HIGH", color: "#F59E0B" },
            { name: "Nidec Motors", detail: "85% of HDD spindle motors", risk: "MEDIUM", color: "#3B82F6" },
            { name: "Japan Photoresists", detail: "70%+ of global supply", risk: "HIGH", color: "#F59E0B" },
            { name: "DRC Cobalt", detail: "70% of global cobalt mining", risk: "HIGH", color: "#F59E0B" },
          ].map((item, i) => (
            <div key={i} className="bg-surface rounded-lg p-3 border border-border card-glow">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-white">{item.name}</p>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${item.color}20`, color: item.color, border: `1px solid ${item.color}40` }}
                >
                  {item.risk}
                </span>
              </div>
              <p className="text-xs text-slate-400">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
