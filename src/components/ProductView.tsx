"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Cpu,
  MemoryStick,
  HardDrive,
  Database,
  Factory,
  X,
  ExternalLink,
  MapPin,
  Building2,
} from "lucide-react";
import { productSupplyChains } from "@/data/supplyChain";
import { companies, categoryColors, categoryLabels, getCompanyLogoUrl, type Company } from "@/data/companies";
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

// Match a company name from supply chain data to a full Company object
function findCompany(name: string): Company | undefined {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  return companies.find((c) => {
    const cNorm = c.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    return cNorm.includes(normalized) || normalized.includes(cNorm) ||
      (c.ticker && normalized.includes(c.ticker.toLowerCase().split(".")[0]));
  });
}

// Extract just the company name from strings like "TSMC (90%+)" or "SK Hynix (62%)"
function extractCompanyName(str: string): string {
  return str.replace(/\s*\(.*?\)\s*/g, "").trim();
}

// Company detail popup
function CompanyPopup({ company, onClose }: { company: Company; onClose: () => void }) {
  const logoUrl = getCompanyLogoUrl(company.website);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      className="absolute z-50 w-[320px] bg-[#1E293B] border border-slate-600 rounded-xl shadow-2xl p-4"
      style={{ bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${company.color}15`, border: `1px solid ${company.color}30` }}
        >
          {logoUrl ? (
            <img src={logoUrl} alt={company.name} width={28} height={28} className="company-logo" />
          ) : (
            <span style={{ color: company.color, fontWeight: 700 }}>{company.name[0]}</span>
          )}
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">{company.name}</h4>
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] px-1.5 py-0.5 rounded"
              style={{ backgroundColor: `${categoryColors[company.category]}20`, color: categoryColors[company.category] }}
            >
              {categoryLabels[company.category]}
            </span>
            {company.ticker && (
              <span className="text-[10px] font-mono text-blue-400">{company.ticker}</span>
            )}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-300 leading-relaxed mb-3 line-clamp-2">{company.description}</p>

      <div className="grid grid-cols-2 gap-2 mb-3">
        {company.revenue2024 && (
          <div className="bg-surface rounded-lg p-2">
            <p className="text-[10px] text-slate-500">Revenue</p>
            <p className="text-xs font-bold text-white">{company.revenue2024}</p>
          </div>
        )}
        <div className="bg-surface rounded-lg p-2">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-500" />
            <p className="text-[10px] text-slate-500">HQ</p>
          </div>
          <p className="text-xs font-bold text-white">{company.country}</p>
        </div>
        {company.employees && (
          <div className="bg-surface rounded-lg p-2">
            <p className="text-[10px] text-slate-500">Employees</p>
            <p className="text-xs font-bold text-white">{company.employees}</p>
          </div>
        )}
        {company.stock && (
          <div className="bg-surface rounded-lg p-2">
            <p className="text-[10px] text-slate-500">Market Cap</p>
            <p className="text-xs font-bold text-white">{company.stock.marketCap}</p>
          </div>
        )}
      </div>

      {company.marketShare && Object.keys(company.marketShare).length > 0 && (
        <div className="border-t border-slate-700 pt-2 space-y-1.5">
          {Object.entries(company.marketShare).slice(0, 3).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 flex-1 truncate">{key}</span>
              {typeof val === "number" && (
                <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${val}%`, backgroundColor: categoryColors[company.category] }}
                  />
                </div>
              )}
              <span className="text-[10px] text-slate-300 w-10 text-right font-semibold">
                {typeof val === "number" ? `${val}%` : val}
              </span>
            </div>
          ))}
        </div>
      )}

      <a
        href={company.website}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 mt-2"
      >
        <ExternalLink className="w-3 h-3" /> Visit website
      </a>
    </motion.div>
  );
}

// Clickable company chip that shows popup
function CompanyChip({ name }: { name: string }) {
  const [showPopup, setShowPopup] = useState(false);
  const companyName = extractCompanyName(name);
  const matchedCompany = findCompany(companyName);

  return (
    <div className="relative inline-block">
      <span
        className={`text-[11px] px-2 py-0.5 rounded-full border transition-all ${
          matchedCompany
            ? "bg-surface text-slate-200 border-border hover:border-blue-500/50 hover:bg-blue-500/10 cursor-pointer"
            : "bg-surface text-slate-300 border-border"
        }`}
        onClick={(e) => {
          if (matchedCompany) {
            e.stopPropagation();
            setShowPopup(!showPopup);
          }
        }}
      >
        {matchedCompany && (
          <Building2 className="w-3 h-3 inline mr-1 opacity-50" />
        )}
        {name}
      </span>
      <AnimatePresence>
        {showPopup && matchedCompany && (
          <CompanyPopup company={matchedCompany} onClose={() => setShowPopup(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// Animated connector between supply chain layers
function ProductLayerConnector({ color, index }: { color: string; index: number }) {
  return (
    <div className="flex justify-center py-1">
      <svg width="120" height="28" className="overflow-visible">
        {/* Central flow line */}
        <line
          x1="60"
          y1="0"
          x2="60"
          y2="28"
          className="supply-grid-line"
          stroke={color}
          strokeWidth="2"
          strokeOpacity="0.5"
        />
        {/* Left branch */}
        <line
          x1="30"
          y1="4"
          x2="60"
          y2="14"
          className="supply-grid-line"
          stroke={color}
          strokeWidth="1"
          strokeOpacity="0.3"
          style={{ animationDelay: "0.3s" }}
        />
        {/* Right branch */}
        <line
          x1="90"
          y1="4"
          x2="60"
          y2="14"
          className="supply-grid-line"
          stroke={color}
          strokeWidth="1"
          strokeOpacity="0.3"
          style={{ animationDelay: "0.6s" }}
        />
        {/* Center node */}
        <circle cx="60" cy="14" r="2.5" fill={color} opacity="0.6">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" begin={`${index * 0.2}s`} />
          <animate attributeName="r" values="2;3.5;2" dur="2s" repeatCount="indefinite" begin={`${index * 0.2}s`} />
        </circle>
      </svg>
    </div>
  );
}

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
                  label={({ cx, cy, midAngle, innerRadius: ir, outerRadius: or, value }) => {
                    if (value < 15) return null;
                    const RADIAN = Math.PI / 180;
                    const mid = ((ir as number) + (or as number)) / 2;
                    const x = (cx as number) + mid * Math.cos(-(midAngle as number) * RADIAN);
                    const y = (cy as number) + mid * Math.sin(-(midAngle as number) * RADIAN);
                    return (
                      <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontWeight="700" fontSize="13" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
                        {value}%
                      </text>
                    );
                  }}
                  labelLine={false}
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
            {chartData.map((item) => {
              const matched = findCompany(item.name);
              return (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-slate-300">{item.name}</span>
                    {matched && (
                      <span className="text-[9px] text-slate-500 font-mono">{matched.ticker}</span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-white">{item.value}%</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Supply Chain Layers with animated connections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-surface rounded-xl border border-border p-5 card-glow"
        >
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Factory className="w-4 h-4 text-blue-400 icon-high-contrast" />
            Supply Chain Layers
            <span className="text-[10px] text-slate-500 ml-auto">Click company names for details</span>
          </h3>
          <div className="space-y-0">
            {product.layers.map((layer, idx) => (
              <div key={idx}>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.08 }}
                  className="flex items-start gap-3 p-3 rounded-lg border supply-node-active"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${COLORS[idx % COLORS.length]} 4%, #1e293b)`,
                    borderColor: `${COLORS[idx % COLORS.length]}15`,
                  }}
                >
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
                        <CompanyChip key={i} name={c} />
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
                </motion.div>
                {idx < product.layers.length - 1 && (
                  <ProductLayerConnector
                    color={COLORS[idx % COLORS.length]}
                    index={idx}
                  />
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
