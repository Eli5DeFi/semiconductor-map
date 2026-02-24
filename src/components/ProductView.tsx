"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Cpu,
  MemoryStick,
  HardDrive,
  Database,
  Zap,
  ChevronRight,
  ExternalLink,
  ArrowDown,
  Factory,
} from "lucide-react";
import { productSupplyChains } from "@/data/supplyChain";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#06B6D4", "#EC4899", "#84CC16"];

interface ProductViewProps {
  productId: string;
}

const iconMap: Record<string, React.ElementType> = {
  Cpu: Cpu,
  MemoryStick: MemoryStick,
  HardDrive: HardDrive,
  Database: Database,
  Microchip: Cpu,
};

export default function ProductView({ productId }: ProductViewProps) {
  const product = productSupplyChains.find((p) => p.id === productId);
  if (!product) return <div className="p-8 text-slate-400">Product not found</div>;

  const Icon = iconMap[product.icon] || Cpu;
  const chartData = product.keyPlayers.map((p) => ({
    name: p.company,
    value: p.share,
    color: p.color,
  }));

  return (
    <div className="h-full overflow-y-auto p-5 space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3"
      >
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/20">
          <Icon className="w-6 h-6 text-blue-400 icon-high-contrast" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">{product.name}</h1>
          <p className="text-xs text-slate-400 mt-0.5">{product.description}</p>
          <span className="text-xs font-semibold text-emerald-400">Market Size: {product.marketSize}</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Market Share Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface rounded-xl border border-border p-4 card-glow"
        >
          <h3 className="text-sm font-semibold text-white mb-2">Market Share</h3>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                  animationDuration={1200}
                  animationEasing="ease-out"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#e2e8f0",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [`${value}%`, "Share"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-300">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Supply Chain Layers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-surface rounded-xl border border-border p-5 card-glow"
        >
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Factory className="w-4 h-4 text-blue-400 icon-high-contrast" />
            Supply Chain Layers
          </h3>
          <div className="space-y-1">
            {product.layers.map((layer, idx) => (
              <div key={idx}>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-2 border border-border">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{
                      backgroundColor: COLORS[idx % COLORS.length] + "30",
                      color: COLORS[idx % COLORS.length],
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{layer.layer}</p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {layer.companies.map((c, i) => (
                        <span key={i} className="text-[11px] bg-surface text-slate-300 px-2 py-0.5 rounded-full border border-border">
                          {c}
                        </span>
                      ))}
                    </div>
                    {layer.materials && layer.materials.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {layer.materials.map((m, i) => (
                          <span key={i} className="text-[10px] bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded-full">
                            {m}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {idx < product.layers.length - 1 && (
                  <div className="flex justify-center py-1">
                    <div className="supply-arrow">
                      <div className="supply-arrow-line" style={{ height: 16 }} />
                      <ArrowDown className="w-4 h-4 text-blue-400 supply-arrow-head" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottlenecks */}
      {product.bottlenecks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-red-500/5 border border-red-500/20 rounded-xl p-5"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400 icon-high-contrast" />
            Critical Bottlenecks & Constraints
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.bottlenecks.map((bn, i) => {
              const severityColor = bn.severity === "CRITICAL" ? "#EF4444" : bn.severity === "HIGH" ? "#F59E0B" : "#3B82F6";
              return (
                <div key={i} className="bg-surface rounded-lg p-4 border border-border card-glow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-white">{bn.name}</h4>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${severityColor}20`, color: severityColor, border: `1px solid ${severityColor}40` }}
                    >
                      {bn.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{bn.description}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
