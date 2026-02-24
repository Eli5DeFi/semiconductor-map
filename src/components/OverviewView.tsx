"use client";

import { motion } from "framer-motion";
import {
  Cpu,
  Globe,
  AlertTriangle,
  TrendingUp,
  Building2,
  Layers,
  Shield,
  Zap,
  MemoryStick,
  HardDrive,
  Factory,
  Gem,
} from "lucide-react";
import { companies } from "@/data/companies";
import { materials } from "@/data/materials";
import { productSupplyChains, riskScenarios } from "@/data/supplyChain";
import type { ViewType } from "./Sidebar";

interface OverviewViewProps {
  onNavigate: (view: ViewType) => void;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4 },
  }),
};

export default function OverviewView({ onNavigate }: OverviewViewProps) {
  const criticalRisks = materials.filter((m) => m.riskLevel === "CRITICAL");
  const highRisks = materials.filter((m) => m.riskLevel === "HIGH");

  const keyStats = [
    { label: "Companies Tracked", value: companies.length.toString(), icon: Building2, color: "from-blue-500 to-blue-600" },
    { label: "Raw Materials", value: materials.length.toString(), icon: Gem, color: "from-emerald-500 to-emerald-600" },
    { label: "Product Categories", value: productSupplyChains.length.toString(), icon: Cpu, color: "from-purple-500 to-purple-600" },
    { label: "Risk Scenarios", value: riskScenarios.length.toString(), icon: AlertTriangle, color: "from-amber-500 to-amber-600" },
    { label: "Countries Covered", value: "25+", icon: Globe, color: "from-cyan-500 to-cyan-600" },
    { label: "Critical Materials", value: criticalRisks.length.toString(), icon: Shield, color: "from-red-500 to-red-600" },
  ];

  const criticalConcentrations = [
    { label: "ASML EUV Lithography", share: "100%", type: "Monopoly", region: "Netherlands", severity: "CRITICAL" as const },
    { label: "TSMC Advanced Nodes (<7nm)", share: "90%+", type: "Near-Monopoly", region: "Taiwan", severity: "CRITICAL" as const },
    { label: "China Polysilicon", share: "93.5%", type: "Dominance", region: "China", severity: "CRITICAL" as const },
    { label: "China Rare Earth Processing", share: "85%+", type: "Dominance", region: "China", severity: "CRITICAL" as const },
    { label: "South Korea DRAM", share: "95%", type: "Duopoly", region: "South Korea", severity: "CRITICAL" as const },
    { label: "SK Hynix HBM", share: "62%", type: "Leadership", region: "South Korea", severity: "HIGH" as const },
    { label: "Japan Photoresists", share: "70%+", type: "Dominance", region: "Japan", severity: "HIGH" as const },
    { label: "TSMC CoWoS Packaging", share: "80%+", type: "Near-Monopoly", region: "Taiwan", severity: "HIGH" as const },
    { label: "China Gallium Supply", share: "98%", type: "Near-Monopoly", region: "China", severity: "CRITICAL" as const },
    { label: "Japan Silicon Wafers", share: "55%", type: "Dominance", region: "Japan", severity: "HIGH" as const },
  ];

  const quickLinks = [
    { label: "Interactive World Map", desc: "Explore global supply chain geography", icon: Globe, view: "map" as ViewType, color: "bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40" },
    { label: "Supply Chain Flow", desc: "Visualize material-to-product flow", icon: Layers, view: "supply-chain" as ViewType, color: "bg-purple-500/10 border-purple-500/20 hover:border-purple-500/40" },
    { label: "Company Directory", desc: "Browse all companies and profiles", icon: Building2, view: "companies" as ViewType, color: "bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40" },
    { label: "Market Share Analysis", desc: "Charts across all segments", icon: TrendingUp, view: "market-share" as ViewType, color: "bg-cyan-500/10 border-cyan-500/20 hover:border-cyan-500/40" },
    { label: "Risk Assessment", desc: "Disruption scenarios & cascading impacts", icon: AlertTriangle, view: "risk" as ViewType, color: "bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40" },
  ];

  const productCards = [
    { id: "gpu" as ViewType, name: "GPU / AI Accelerators", icon: Cpu, market: "$65B+", leader: "NVIDIA (88%)", color: "#76b900" },
    { id: "dram" as ViewType, name: "DRAM Memory", icon: MemoryStick, market: "$100B+", leader: "SK Hynix (36%)", color: "#EB0028" },
    { id: "nand" as ViewType, name: "NAND Flash", icon: HardDrive, market: "$70B+", leader: "Samsung (32%)", color: "#1428A0" },
    { id: "cpu" as ViewType, name: "CPU Processors", icon: Zap, market: "$80B+", leader: "Intel (65%)", color: "#0071C5" },
    { id: "hdd" as ViewType, name: "Hard Disk Drives", icon: Factory, market: "$25B+", leader: "Seagate (42%)", color: "#6EBE49" },
  ];

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold text-white">
          Semiconductor Supply Chain{" "}
          <span className="gradient-text">Intelligence</span>
        </h1>
        <p className="text-slate-400 max-w-2xl">
          Comprehensive interactive mapping of every supply chain connection, material, company, and risk factor
          in the global semiconductor ecosystem. From raw material extraction to end products.
        </p>
      </motion.div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {keyStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              custom={i}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="stat-card card-glow bg-surface rounded-xl p-4 border border-border"
            >
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg`}>
                <Icon className="w-4.5 h-4.5 text-white icon-high-contrast" />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {quickLinks.map((link, i) => {
          const Icon = link.icon;
          return (
            <motion.button
              key={link.label}
              custom={i + 6}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              onClick={() => onNavigate(link.view)}
              className={`text-left p-4 rounded-xl border transition-all duration-300 card-glow ${link.color}`}
            >
              <Icon className="w-5 h-5 text-slate-200 mb-2 icon-high-contrast" />
              <p className="text-sm font-semibold text-white">{link.label}</p>
              <p className="text-xs text-slate-400 mt-1">{link.desc}</p>
            </motion.button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Concentrations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface rounded-xl border border-border p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-400 icon-high-contrast" />
            <h2 className="text-lg font-semibold text-white">Critical Supply Concentrations</h2>
          </div>
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {criticalConcentrations.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-surface-2 border border-border hover:border-slate-600 transition-colors card-glow"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="text-xs text-slate-400">{item.region} - {item.type}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-white">{item.share}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.severity === "CRITICAL" ? "risk-critical" : "risk-high"
                  }`}>
                    {item.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Product Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-surface rounded-xl border border-border p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-5 h-5 text-blue-400 icon-high-contrast" />
            <h2 className="text-lg font-semibold text-white">Product Supply Chains</h2>
          </div>
          <div className="space-y-3">
            {productCards.map((product) => {
              const Icon = product.icon;
              return (
                <button
                  key={product.id}
                  onClick={() => onNavigate(product.id)}
                  className="w-full flex items-center gap-4 p-4 rounded-lg bg-surface-2 border border-border hover:border-slate-600 transition-all group card-glow"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${product.color}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: product.color }} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      Market: {product.market} | Leader: {product.leader}
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Key Insights Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl border border-blue-500/20 p-5"
      >
        <h3 className="text-sm font-semibold text-white mb-3">Key Intelligence Highlights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-300">
          <div className="flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
            <p><strong className="text-white">ASML</strong> holds a 100% monopoly on EUV lithography. Every advanced chip requires their machines (~$200M each).</p>
          </div>
          <div className="flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
            <p><strong className="text-white">TSMC</strong> manufactures 90%+ of advanced chips. A Taiwan disruption would halt global electronics for 5-10 years.</p>
          </div>
          <div className="flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
            <p><strong className="text-white">SK Hynix</strong> supplies 62% of HBM and 90% of NVIDIA&apos;s HBM - the key bottleneck for AI GPU production.</p>
          </div>
          <div className="flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
            <p><strong className="text-white">China</strong> controls 93.5% of polysilicon, 98% of gallium, and 85% of rare earth processing. Export controls are escalating.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
