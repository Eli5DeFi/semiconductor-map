"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Shield,
  Globe,
  ChevronDown,
  ChevronRight,
  Zap,
  Clock,
  TrendingDown,
  DollarSign,
} from "lucide-react";
import { riskScenarios, governmentPrograms } from "@/data/supplyChain";
import { materials } from "@/data/materials";

export default function RiskView() {
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null);

  const countryRisks = [
    { country: "Taiwan", geopolitical: 85, natural: 90, concentration: 95, trade: 80, overall: "CRITICAL" as const, flag: "🇹🇼", role: "65% leading-edge logic, 90%+ advanced packaging" },
    { country: "China", geopolitical: 90, natural: 70, concentration: 75, trade: 85, overall: "CRITICAL" as const, flag: "🇨🇳", role: "93.5% polysilicon, 85% rare earth processing, 98% gallium" },
    { country: "South Korea", geopolitical: 60, natural: 60, concentration: 80, trade: 50, overall: "HIGH" as const, flag: "🇰🇷", role: "95% DRAM, 70% NAND, 80% HBM" },
    { country: "Netherlands", geopolitical: 20, natural: 30, concentration: 90, trade: 25, overall: "MEDIUM" as const, flag: "🇳🇱", role: "100% EUV lithography (ASML)" },
    { country: "Japan", geopolitical: 40, natural: 80, concentration: 60, trade: 30, overall: "MEDIUM" as const, flag: "🇯🇵", role: "55% silicon wafers, 70%+ photoresists, 70% photomasks" },
    { country: "USA", geopolitical: 30, natural: 40, concentration: 50, trade: 35, overall: "LOW" as const, flag: "🇺🇸", role: "EDA duopoly, equipment leaders, CHIPS Act expansion" },
    { country: "Germany", geopolitical: 15, natural: 20, concentration: 40, trade: 15, overall: "LOW" as const, flag: "🇩🇪", role: "Zeiss EUV optics, Siltronic wafers, ASML optics" },
  ];

  const materialRisks = materials.filter(m => m.riskLevel === "CRITICAL" || m.riskLevel === "HIGH");

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-red-400 icon-high-contrast" />
          <h2 className="text-xl font-bold text-white">Supply Chain Risk Assessment</h2>
        </div>
        <p className="text-sm text-slate-400">
          Analysis of geographic concentrations, disruption scenarios, and cascading impact assessments.
        </p>
      </div>

      {/* Risk Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 card-glow">
          <AlertTriangle className="w-5 h-5 text-red-400 mb-2 icon-high-contrast" />
          <p className="text-2xl font-bold text-red-400">{materials.filter(m => m.riskLevel === "CRITICAL").length}</p>
          <p className="text-xs text-red-300">Critical Risk Materials</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 card-glow">
          <Zap className="w-5 h-5 text-amber-400 mb-2 icon-high-contrast" />
          <p className="text-2xl font-bold text-amber-400">{materials.filter(m => m.riskLevel === "HIGH").length}</p>
          <p className="text-xs text-amber-300">High Risk Materials</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 card-glow">
          <Globe className="w-5 h-5 text-blue-400 mb-2 icon-high-contrast" />
          <p className="text-2xl font-bold text-blue-400">{countryRisks.filter(c => c.overall === "CRITICAL").length}</p>
          <p className="text-xs text-blue-300">Critical Risk Regions</p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 card-glow">
          <TrendingDown className="w-5 h-5 text-purple-400 mb-2 icon-high-contrast" />
          <p className="text-2xl font-bold text-purple-400">{riskScenarios.length}</p>
          <p className="text-xs text-purple-300">Disruption Scenarios</p>
        </div>
      </div>

      {/* Disruption Scenarios */}
      <div className="bg-surface rounded-xl border border-border p-5">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          Disruption Scenarios & Cascade Analysis
        </h3>
        <div className="space-y-3">
          {riskScenarios.map((scenario) => {
            const isExpanded = expandedScenario === scenario.id;
            const impactColor = scenario.impact === "Catastrophic" ? "#EF4444" : scenario.impact === "High" ? "#F59E0B" : "#3B82F6";
            return (
              <div key={scenario.id} className="bg-surface-2 rounded-lg border border-border overflow-hidden card-glow">
                <button
                  onClick={() => setExpandedScenario(isExpanded ? null : scenario.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="w-2 h-10 rounded-full flex-shrink-0"
                      style={{ backgroundColor: impactColor }}
                    />
                    <div>
                      <p className="text-sm font-semibold text-white">{scenario.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{scenario.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right hidden md:block">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500">Probability:</span>
                        <span className={`text-xs font-semibold ${
                          scenario.probability === "High (current)" ? "text-red-400" :
                          scenario.probability === "Medium" ? "text-amber-400" : "text-green-400"
                        }`}>{scenario.probability}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500">Impact:</span>
                        <span className="text-xs font-semibold" style={{ color: impactColor }}>{scenario.impact}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-surface rounded-full px-2 py-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span className="text-[10px] text-slate-400">{scenario.recoveryTime}</span>
                    </div>
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    </motion.div>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border"
                    >
                      <div className="p-4">
                        <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Cascade Impact Timeline</p>
                        <div className="space-y-2">
                          {scenario.cascade.map((step, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-full bg-surface flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-[10px] font-bold text-slate-400">{i + 1}</span>
                              </div>
                              <p className="text-sm text-slate-300">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Geographic Risk Matrix */}
      <div className="bg-surface rounded-xl border border-border p-5">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-400" />
          Geographic Risk Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Country</th>
                <th className="text-center py-3 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Geopolitical</th>
                <th className="text-center py-3 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Natural Disaster</th>
                <th className="text-center py-3 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Concentration</th>
                <th className="text-center py-3 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Trade Risk</th>
                <th className="text-center py-3 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Key Role</th>
              </tr>
            </thead>
            <tbody>
              {countryRisks.map((row) => (
                <tr key={row.country} className="border-b border-border/50 hover:bg-white/[0.02]">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{row.flag}</span>
                      <span className="text-white font-medium">{row.country}</span>
                    </div>
                  </td>
                  {[row.geopolitical, row.natural, row.concentration, row.trade].map((val, i) => (
                    <td key={i} className="py-3 px-3 text-center">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-12 h-2 bg-surface-2 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${val}%`,
                              backgroundColor: val >= 80 ? "#EF4444" : val >= 60 ? "#F59E0B" : val >= 40 ? "#3B82F6" : "#10B981",
                            }}
                          />
                        </div>
                        <span className="text-xs text-slate-400 w-6">{val}</span>
                      </div>
                    </td>
                  ))}
                  <td className="py-3 px-3 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full risk-${row.overall.toLowerCase()}`}>
                      {row.overall}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-xs text-slate-400 max-w-[200px]">{row.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Material Risk */}
      <div className="bg-surface rounded-xl border border-border p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Critical & High-Risk Materials</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {materialRisks.map((mat) => (
            <div key={mat.id} className="bg-surface-2 rounded-lg p-4 border border-border card-glow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-white">{mat.name}</h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full risk-${mat.riskLevel.toLowerCase()}`}>
                  {mat.riskLevel}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">{mat.primaryUse}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Top Producer: {mat.topProducer}</span>
                <span className="text-sm font-bold text-white">{mat.topProducerShare}%</span>
              </div>
              <div className="mt-2 h-1.5 bg-surface rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${mat.topProducerShare}%`,
                    backgroundColor: mat.riskLevel === "CRITICAL" ? "#EF4444" : "#F59E0B",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Government Programs */}
      <div className="bg-surface rounded-xl border border-border p-5">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-400 icon-high-contrast" />
          Government Investment Programs (Mitigation)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {governmentPrograms.map((prog) => (
            <div key={prog.name} className="bg-surface-2 rounded-xl p-4 border border-border card-glow">
              <p className="text-lg font-bold text-white">{prog.amount}</p>
              <p className="text-sm font-semibold text-blue-400 mt-1">{prog.name}</p>
              <p className="text-xs text-slate-400 mt-1">{prog.focus}</p>
              <div className="mt-3 space-y-1">
                {prog.recipients.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                    <ChevronRight className="w-3 h-3 text-slate-500" />
                    {r}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
