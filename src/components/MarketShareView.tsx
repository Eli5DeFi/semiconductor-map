"use client";

import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Cpu,
  MemoryStick,
  HardDrive,
  Layers,
  Boxes,
  CircuitBoard,
  Factory,
  Microscope,
} from "lucide-react";
import { companies } from "@/data/companies";
import { productSupplyChains } from "@/data/supplyChain";

// ── Color palette for chart slices ──────────────────────────────────
const COLORS = [
  "#3B82F6", // blue
  "#EF4444", // red
  "#10B981", // emerald
  "#F59E0B", // amber
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#F97316", // orange
  "#84CC16", // lime
  "#6366F1", // indigo
  "#14B8A6", // teal
  "#E11D48", // rose
];

// ── Market segment data ─────────────────────────────────────────────
interface MarketSlice {
  name: string;
  value: number;
  color?: string;
}

interface MarketSegment {
  id: string;
  title: string;
  marketSize?: string;
  icon: React.ElementType;
  data: MarketSlice[];
}

const marketSegments: MarketSegment[] = [
  {
    id: "foundry",
    title: "Foundry Market",
    marketSize: "$130B",
    icon: Factory,
    data: [
      { name: "TSMC", value: 62, color: "#BE1E2D" },
      { name: "Samsung", value: 12, color: "#1428A0" },
      { name: "GlobalFoundries", value: 6, color: "#00A651" },
      { name: "SMIC", value: 5, color: "#E74C3C" },
      { name: "Others", value: 15, color: "#64748B" },
    ],
  },
  {
    id: "dram",
    title: "DRAM Market",
    marketSize: "$100B+",
    icon: MemoryStick,
    data: [
      { name: "SK Hynix", value: 36, color: "#EB0028" },
      { name: "Samsung", value: 34, color: "#1428A0" },
      { name: "Micron", value: 23, color: "#0072CE" },
      { name: "Others", value: 7, color: "#64748B" },
    ],
  },
  {
    id: "nand",
    title: "NAND Flash",
    marketSize: "$70B+",
    icon: HardDrive,
    data: [
      { name: "Samsung", value: 32.3, color: "#1428A0" },
      { name: "SK Hynix", value: 19.3, color: "#EB0028" },
      { name: "Kioxia", value: 15.3, color: "#E60012" },
      { name: "Western Digital", value: 12.4, color: "#0065BD" },
      { name: "Micron", value: 11, color: "#0072CE" },
      { name: "Others", value: 9.7, color: "#64748B" },
    ],
  },
  {
    id: "gpu",
    title: "GPU (Discrete)",
    marketSize: "$65B+",
    icon: Cpu,
    data: [
      { name: "NVIDIA", value: 88, color: "#76b900" },
      { name: "AMD", value: 10, color: "#ED1C24" },
      { name: "Intel", value: 2, color: "#0071C5" },
    ],
  },
  {
    id: "hbm",
    title: "HBM Memory",
    marketSize: "$25B+",
    icon: Layers,
    data: [
      { name: "SK Hynix", value: 62, color: "#EB0028" },
      { name: "Micron", value: 21, color: "#0072CE" },
      { name: "Samsung", value: 17, color: "#1428A0" },
    ],
  },
  {
    id: "cpu_server",
    title: "CPU (x86 Server)",
    marketSize: "$40B+",
    icon: CircuitBoard,
    data: [
      { name: "Intel", value: 71, color: "#0071C5" },
      { name: "AMD", value: 29, color: "#ED1C24" },
    ],
  },
  {
    id: "wafers",
    title: "Silicon Wafers",
    marketSize: "$14B",
    icon: Boxes,
    data: [
      { name: "Shin-Etsu", value: 32, color: "#003366" },
      { name: "SUMCO", value: 27, color: "#005BAC" },
      { name: "GlobalWafers", value: 14, color: "#00843D" },
      { name: "Siltronic", value: 12, color: "#6366F1" },
      { name: "SK Siltron", value: 8, color: "#EB0028" },
      { name: "Others", value: 7, color: "#64748B" },
    ],
  },
  {
    id: "eda",
    title: "EDA Tools",
    marketSize: "$16B",
    icon: Microscope,
    data: [
      { name: "Synopsys", value: 50, color: "#7B2D8E" },
      { name: "Cadence", value: 35, color: "#00A551" },
      { name: "Others", value: 15, color: "#64748B" },
    ],
  },
  {
    id: "osat",
    title: "OSAT",
    marketSize: "$45B",
    icon: Boxes,
    data: [
      { name: "ASE", value: 27, color: "#004B87" },
      { name: "Amkor", value: 18, color: "#0072CE" },
      { name: "JCET", value: 10, color: "#E74C3C" },
      { name: "SPIL", value: 7, color: "#F59E0B" },
      { name: "Others", value: 38, color: "#64748B" },
    ],
  },
  {
    id: "wfe",
    title: "Equipment (WFE)",
    marketSize: "$100B+",
    icon: Factory,
    data: [
      { name: "Applied Materials", value: 19, color: "#1B365D" },
      { name: "Lam Research", value: 16, color: "#00A3E0" },
      { name: "Tokyo Electron", value: 15, color: "#E60012" },
      { name: "KLA", value: 11, color: "#7B2D8E" },
      { name: "ASML", value: 10, color: "#0F238C" },
      { name: "Others", value: 29, color: "#64748B" },
    ],
  },
];

// ── Custom tooltip ──────────────────────────────────────────────────
function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: MarketSlice }>;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0].payload;
  return (
    <div className="bg-[#1E293B] border border-slate-600 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-white text-sm font-semibold">{item.name}</p>
      <p className="text-blue-400 text-sm">{item.value}% market share</p>
    </div>
  );
}

// ── Pie chart label renderer ────────────────────────────────────────
const RADIAN = Math.PI / 180;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderLabel(props: any) {
  const { cx, cy, midAngle, outerRadius, name, value } = props as {
    cx: number;
    cy: number;
    midAngle: number;
    outerRadius: number;
    name: string;
    value: number;
  };
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Only show labels for segments >= 8%
  if (value < 8) return null;

  return (
    <text
      x={x}
      y={y}
      fill="#CBD5E1"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-[11px]"
    >
      {name} {value}%
    </text>
  );
}

// ── Single chart card ───────────────────────────────────────────────
function MarketCard({
  segment,
  index,
}: {
  segment: MarketSegment;
  index: number;
}) {
  const Icon = segment.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="bg-[#111827] border border-slate-700/50 rounded-xl p-5 hover:border-slate-600 transition-colors card-glow"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shadow-md">
            <Icon className="w-4 h-4 text-blue-400 icon-high-contrast" />
          </div>
          <h3 className="text-white font-semibold text-sm">{segment.title}</h3>
        </div>
        {segment.marketSize && (
          <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded-md">
            TAM: {segment.marketSize}
          </span>
        )}
      </div>

      {/* Chart */}
      <div className="w-full h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={segment.data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={renderLabel}
              labelLine={false}
              animationBegin={index * 100}
              animationDuration={1200}
              animationEasing="ease-out"
            >
              {segment.data.map((entry, i) => (
                <Cell
                  key={`cell-${i}`}
                  fill={entry.color || COLORS[i % COLORS.length]}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-2 space-y-1.5">
        {segment.data.map((entry, i) => (
          <div key={entry.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor:
                    entry.color || COLORS[i % COLORS.length],
                }}
              />
              <span className="text-xs text-slate-300">{entry.name}</span>
            </div>
            <span className="text-xs font-medium text-white">
              {entry.value}%
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Summary Stats ───────────────────────────────────────────────────
function SummaryHeader() {
  const totalTAM = "$600B+";
  const segments = marketSegments.length;
  const trackedInData = companies.length;
  const supplyChains = productSupplyChains.length;
  const totalCompanies = new Set(
    marketSegments.flatMap((s) =>
      s.data.filter((d) => d.name !== "Others").map((d) => d.name)
    )
  ).size;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">
            Semiconductor Market Share
          </h2>
          <p className="text-sm text-slate-400">
            Interactive breakdown across all major segments
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#111827] border border-slate-700/50 rounded-lg p-4 flex items-center gap-3 card-glow">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shadow-md">
            <DollarSign className="w-4 h-4 text-emerald-400 icon-high-contrast" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Addressable Market</p>
            <p className="text-lg font-bold text-white">{totalTAM}</p>
          </div>
        </div>
        <div className="bg-[#111827] border border-slate-700/50 rounded-lg p-4 flex items-center gap-3 card-glow">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shadow-md">
            <Layers className="w-4 h-4 text-blue-400 icon-high-contrast" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Market Segments</p>
            <p className="text-lg font-bold text-white">{segments}</p>
          </div>
        </div>
        <div className="bg-[#111827] border border-slate-700/50 rounded-lg p-4 flex items-center gap-3 card-glow">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center shadow-md">
            <TrendingUp className="w-4 h-4 text-purple-400 icon-high-contrast" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Key Players Tracked</p>
            <p className="text-lg font-bold text-white">{trackedInData} ({supplyChains} chains)</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main component ──────────────────────────────────────────────────
export default function MarketShareView() {
  return (
    <div className="h-full overflow-y-auto p-6 bg-[#0B1120]">
      <SummaryHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {marketSegments.map((segment, i) => (
          <MarketCard key={segment.id} segment={segment} index={i} />
        ))}
      </div>
    </div>
  );
}
