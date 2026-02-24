"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  MapPin,
  X,
  DollarSign,
  Users,
  Calendar,
  Globe,
  BarChart3,
} from "lucide-react";
import { companies, categoryColors, categoryLabels, getCompanyLogoUrl, type CompanyCategory, type Company } from "@/data/companies";

function CompanyLogo({ company, size = 32 }: { company: Company; size?: number }) {
  const logoUrl = getCompanyLogoUrl(company.website);
  const initials = company.name.charAt(0).toUpperCase();
  return (
    <div
      className="flex-shrink-0 rounded-lg overflow-hidden flex items-center justify-center"
      style={{
        width: size,
        height: size,
        backgroundColor: `${company.color}15`,
        border: `1px solid ${company.color}30`,
      }}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={company.name}
          width={size - 8}
          height={size - 8}
          className="company-logo"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
            (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = "flex";
          }}
        />
      ) : null}
      <span
        className="company-logo-fallback"
        style={{
          display: logoUrl ? "none" : "flex",
          width: size,
          height: size,
          color: company.color,
          fontSize: size * 0.45,
        }}
      >
        {initials}
      </span>
    </div>
  );
}

export default function CompaniesView() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CompanyCategory | "all">("all");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "revenue" | "category">("category");

  const categories = useMemo(() => {
    const cats = new Set(companies.map((c) => c.category));
    return Array.from(cats);
  }, []);

  const filtered = useMemo(() => {
    let result = companies;
    if (selectedCategory !== "all") {
      result = result.filter((c) => c.category === selectedCategory);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q) ||
          c.subcategory.toLowerCase().includes(q) ||
          c.keyProducts?.some((p) => p.toLowerCase().includes(q))
      );
    }
    if (sortBy === "name") result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "category") result = [...result].sort((a, b) => a.category.localeCompare(b.category));
    return result;
  }, [search, selectedCategory, sortBy]);

  const grouped = useMemo(() => {
    if (sortBy !== "category") return { all: filtered };
    const groups: Record<string, Company[]> = {};
    filtered.forEach((c) => {
      const key = c.category;
      if (!groups[key]) groups[key] = [];
      groups[key].push(c);
    });
    return groups;
  }, [filtered, sortBy]);

  return (
    <div className="h-full flex">
      {/* Company List */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Company Directory</h2>
              <p className="text-xs text-slate-400 mt-0.5">{filtered.length} companies across the semiconductor supply chain</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="text-xs bg-surface-2 border border-border rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="category">Sort by Category</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies, products, countries..."
              className="w-full pl-10 pr-4 py-2 bg-surface-2 border border-border rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === "all" ? "bg-blue-500 text-white" : "bg-surface-2 text-slate-400 hover:text-slate-200"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  selectedCategory === cat ? "text-white" : "text-slate-400 hover:text-slate-200"
                }`}
                style={{
                  backgroundColor: selectedCategory === cat ? categoryColors[cat] : "rgb(30 41 59)",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: categoryColors[cat] }}
                />
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* Company Cards */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {Object.entries(grouped).map(([groupKey, groupCompanies]) => (
            <div key={groupKey}>
              {sortBy === "category" && groupKey !== "all" && (
                <h3
                  className="text-xs font-bold uppercase tracking-wider mb-2 px-1 flex items-center gap-2"
                  style={{ color: categoryColors[groupKey as CompanyCategory] }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: categoryColors[groupKey as CompanyCategory] }}
                  />
                  {categoryLabels[groupKey as CompanyCategory]} ({groupCompanies.length})
                </h3>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {groupCompanies.map((company) => (
                  <motion.button
                    key={company.id}
                    whileHover={{ y: -2 }}
                    onClick={() => setSelectedCompany(company)}
                    className="text-left rounded-xl border hover:border-slate-600 p-4 transition-all card-glow"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${categoryColors[company.category]} 6%, #111827)`,
                      borderColor: `${categoryColors[company.category]}20`,
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2.5 flex-1">
                        <CompanyLogo company={company} size={36} />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-white line-clamp-1">{company.name}</h4>
                        </div>
                      </div>
                        <div className="flex items-center gap-2 mt-1">
                          {company.ticker && (
                            <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded">
                              {company.ticker}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500">{company.subcategory}</span>
                        </div>
                      </div>
                    {company.stock && (
                      <div className="flex items-center gap-2 mb-2 py-1.5 px-2 rounded-lg bg-surface-2 border border-border">
                        <span className="text-sm font-bold text-white font-mono">
                          {company.stock.currency === "USD" ? "$" : company.stock.currency === "KRW" ? "₩" : company.stock.currency === "JPY" ? "¥" : company.stock.currency === "EUR" ? "€" : ""}
                          {company.stock.price.toLocaleString()}
                        </span>
                        <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${company.stock.changePercent >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {company.stock.changePercent >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {company.stock.changePercent >= 0 ? "+" : ""}{company.stock.changePercent.toFixed(2)}%
                        </span>
                        <span className="text-[10px] text-slate-500 ml-auto">{company.stock.marketCap}</span>
                      </div>
                    )}
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">{company.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="w-3 h-3" />
                        {company.country}
                      </div>
                      {company.revenue2024 && (
                        <span className="text-xs font-semibold text-emerald-400">{company.revenue2024}</span>
                      )}
                    </div>
                    {company.marketShare && Object.keys(company.marketShare).length > 0 && (
                      <div className="mt-2 pt-2 border-t border-border">
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(company.marketShare).slice(0, 2).map(([key, val]) => (
                            <span key={key} className="text-[10px] bg-surface-2 text-slate-300 px-2 py-0.5 rounded-full">
                              {key}: {typeof val === "number" ? `${val}%` : val}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Company Detail Panel */}
      <AnimatePresence>
        {selectedCompany && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="w-[420px] border-l border-border bg-surface overflow-y-auto flex-shrink-0"
          >
            <div className="p-5">
              {/* Close Button */}
              <button
                onClick={() => setSelectedCompany(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-surface-2 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: categoryColors[selectedCompany.category] }}
                  />
                  <span className="text-xs font-medium" style={{ color: categoryColors[selectedCompany.category] }}>
                    {categoryLabels[selectedCompany.category]}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CompanyLogo company={selectedCompany} size={48} />
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedCompany.name}</h2>
                    <p className="text-sm text-slate-400 mt-0.5">{selectedCompany.subcategory}</p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {selectedCompany.ticker && (
                  <div className="bg-surface-2 rounded-lg p-3">
                    <DollarSign className="w-4 h-4 text-blue-400 mb-1 icon-high-contrast" />
                    <p className="text-xs text-slate-400">Stock Ticker</p>
                    <p className="text-sm font-bold text-white">{selectedCompany.ticker}</p>
                    {selectedCompany.exchange && (
                      <p className="text-[10px] text-slate-500">{selectedCompany.exchange}</p>
                    )}
                  </div>
                )}
                {selectedCompany.revenue2024 && (
                  <div className="bg-surface-2 rounded-lg p-3">
                    <TrendingUp className="w-4 h-4 text-emerald-400 mb-1 icon-high-contrast" />
                    <p className="text-xs text-slate-400">Revenue (2024)</p>
                    <p className="text-sm font-bold text-white">{selectedCompany.revenue2024}</p>
                    {selectedCompany.revenueGrowth && (
                      <p className={`text-[10px] ${selectedCompany.revenueGrowth.startsWith("+") ? "text-emerald-400" : "text-red-400"}`}>
                        {selectedCompany.revenueGrowth} YoY
                      </p>
                    )}
                  </div>
                )}
                <div className="bg-surface-2 rounded-lg p-3">
                  <MapPin className="w-4 h-4 text-amber-400 mb-1 icon-high-contrast" />
                  <p className="text-xs text-slate-400">Headquarters</p>
                  <p className="text-sm font-bold text-white">{selectedCompany.hq}</p>
                </div>
                {selectedCompany.employees && (
                  <div className="bg-surface-2 rounded-lg p-3">
                    <Users className="w-4 h-4 text-purple-400 mb-1 icon-high-contrast" />
                    <p className="text-xs text-slate-400">Employees</p>
                    <p className="text-sm font-bold text-white">{selectedCompany.employees}</p>
                  </div>
                )}
                {selectedCompany.founded && (
                  <div className="bg-surface-2 rounded-lg p-3">
                    <Calendar className="w-4 h-4 text-cyan-400 mb-1 icon-high-contrast" />
                    <p className="text-xs text-slate-400">Founded</p>
                    <p className="text-sm font-bold text-white">{selectedCompany.founded}</p>
                  </div>
                )}
                <div className="bg-surface-2 rounded-lg p-3">
                  <Globe className="w-4 h-4 text-pink-400 mb-1 icon-high-contrast" />
                  <p className="text-xs text-slate-400">Website</p>
                  <a
                    href={selectedCompany.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    Visit <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Stock Price */}
              {selectedCompany.stock && (
                <div className="mb-5 bg-surface-2 rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="w-4 h-4 text-blue-400 icon-high-contrast" />
                    <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Stock Price</h3>
                    <span className="text-[10px] text-slate-500 ml-auto">{selectedCompany.exchange}</span>
                  </div>
                  <div className="flex items-end gap-3 mb-3">
                    <span className="text-2xl font-bold text-white font-mono">
                      {selectedCompany.stock.currency === "USD" ? "$" : selectedCompany.stock.currency === "KRW" ? "₩" : selectedCompany.stock.currency === "JPY" ? "¥" : selectedCompany.stock.currency === "EUR" ? "€" : selectedCompany.stock.currency === "TWD" ? "NT$" : ""}
                      {selectedCompany.stock.price.toLocaleString()}
                    </span>
                    <div className={`flex items-center gap-1 text-sm font-semibold pb-0.5 ${selectedCompany.stock.changePercent >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {selectedCompany.stock.changePercent >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {selectedCompany.stock.changePercent >= 0 ? "+" : ""}{selectedCompany.stock.change.toLocaleString()} ({selectedCompany.stock.changePercent >= 0 ? "+" : ""}{selectedCompany.stock.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <p className="text-[10px] text-slate-500">Market Cap</p>
                      <p className="text-xs font-semibold text-white">{selectedCompany.stock.marketCap}</p>
                    </div>
                    {selectedCompany.stock.peRatio && (
                      <div>
                        <p className="text-[10px] text-slate-500">P/E Ratio</p>
                        <p className="text-xs font-semibold text-white">{selectedCompany.stock.peRatio > 0 ? selectedCompany.stock.peRatio.toFixed(1) : "N/A"}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] text-slate-500">52W Range</p>
                      <p className="text-[10px] font-semibold text-white">
                        {selectedCompany.stock.week52Low.toLocaleString()} - {selectedCompany.stock.week52High.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {/* 52-week price position bar */}
                  <div className="mt-2">
                    <div className="h-1.5 bg-slate-700 rounded-full relative overflow-visible">
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full border border-white/50"
                        style={{
                          left: `${Math.min(100, Math.max(0, ((selectedCompany.stock.price - selectedCompany.stock.week52Low) / (selectedCompany.stock.week52High - selectedCompany.stock.week52Low)) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mb-5">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">About</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{selectedCompany.description}</p>
              </div>

              {/* Market Share */}
              {selectedCompany.marketShare && Object.keys(selectedCompany.marketShare).length > 0 && (
                <div className="mb-5">
                  <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Market Share</h3>
                  <div className="space-y-2">
                    {Object.entries(selectedCompany.marketShare).map(([key, val]) => (
                      <div key={key}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">{key}</span>
                          <span className="text-white font-semibold">{typeof val === "number" ? `${val}%` : val}</span>
                        </div>
                        {typeof val === "number" && (
                          <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(val, 100)}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: categoryColors[selectedCompany.category] }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Products */}
              {selectedCompany.keyProducts && selectedCompany.keyProducts.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Key Products</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCompany.keyProducts.map((p) => (
                      <span key={p} className="text-xs bg-surface-2 text-slate-300 px-2.5 py-1 rounded-full border border-border">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Facilities */}
              {selectedCompany.facilities && selectedCompany.facilities.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Facilities ({selectedCompany.facilities.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedCompany.facilities.map((f, i) => (
                      <div key={i} className="bg-surface-2 rounded-lg p-3 border border-border">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-white">{f.name}</p>
                          {f.status && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                              f.status === "Under Construction"
                                ? "bg-amber-500/15 text-amber-400"
                                : f.status === "Planned"
                                ? "bg-blue-500/15 text-blue-400"
                                : "bg-emerald-500/15 text-emerald-400"
                            }`}>
                              {f.status}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{f.location}, {f.country}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{f.type}{f.products ? ` - ${f.products}` : ""}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Risk Level */}
              {selectedCompany.riskLevel && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Supply Chain Risk</h3>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full risk-${selectedCompany.riskLevel.toLowerCase()}`}>
                    {selectedCompany.riskLevel}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
