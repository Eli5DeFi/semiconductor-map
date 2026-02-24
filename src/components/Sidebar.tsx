"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  BarChart3,
  Network,
  Building2,
  AlertTriangle,
  Cpu,
  MemoryStick,
  HardDrive,
  Database,
  Layers,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";

export type ViewType =
  | "overview"
  | "map"
  | "supply-chain"
  | "companies"
  | "market-share"
  | "risk"
  | "gpu"
  | "dram"
  | "nand"
  | "cpu"
  | "hdd";

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const mainNav = [
  { id: "overview" as ViewType, label: "Overview", icon: Layers, group: "main" },
  { id: "map" as ViewType, label: "World Map", icon: Globe, group: "main" },
  { id: "supply-chain" as ViewType, label: "Supply Chain", icon: Network, group: "main" },
  { id: "companies" as ViewType, label: "Companies", icon: Building2, group: "main" },
  { id: "market-share" as ViewType, label: "Market Share", icon: BarChart3, group: "main" },
  { id: "risk" as ViewType, label: "Risk Analysis", icon: AlertTriangle, group: "main" },
];

const productNav = [
  { id: "gpu" as ViewType, label: "GPU / AI", icon: Cpu, group: "products" },
  { id: "dram" as ViewType, label: "DRAM", icon: MemoryStick, group: "products" },
  { id: "nand" as ViewType, label: "NAND Flash", icon: HardDrive, group: "products" },
  { id: "cpu" as ViewType, label: "CPU", icon: Zap, group: "products" },
  { id: "hdd" as ViewType, label: "HDD", icon: Database, group: "products" },
];

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-full bg-surface border-r border-border flex flex-col relative z-20"
    >
      {/* Logo */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Cpu className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="overflow-hidden"
            >
              <h1 className="text-sm font-bold text-white whitespace-nowrap">Semiconductor</h1>
              <p className="text-[10px] text-slate-400 whitespace-nowrap">Supply Chain Map</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {/* Main Section */}
        <AnimatePresence>
          {!collapsed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] uppercase tracking-wider text-slate-500 px-2 mb-2 font-semibold"
            >
              Dashboard
            </motion.p>
          )}
        </AnimatePresence>
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-all duration-200 group relative ${
                isActive
                  ? "bg-blue-500/10 text-blue-400"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-500 rounded-r-full"
                />
              )}
              <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? "text-blue-400" : ""}`} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    className="text-[13px] font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}

        {/* Products Section */}
        <div className="mt-4 pt-3 border-t border-border">
          <AnimatePresence>
            {!collapsed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[10px] uppercase tracking-wider text-slate-500 px-2 mb-2 font-semibold"
              >
                Products
              </motion.p>
            )}
          </AnimatePresence>
          {productNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-all duration-200 relative ${
                  isActive
                    ? "bg-blue-500/10 text-blue-400"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
                title={collapsed ? item.label : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-500 rounded-r-full"
                  />
                )}
                <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? "text-blue-400" : ""}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="text-[13px] font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Built by eli5defi */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-3 py-2 border-t border-border"
          >
            <a
              href="https://x.com/Eli5defi"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-500 hover:text-blue-400 transition-all group"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 flex-shrink-0 fill-current"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="text-[11px] font-medium whitespace-nowrap">
                Built by <span className="text-slate-300 group-hover:text-blue-300 font-semibold">eli5defi</span>
              </span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-3 border-t border-border text-slate-500 hover:text-slate-300 transition-colors flex items-center justify-center"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </motion.aside>
  );
}
