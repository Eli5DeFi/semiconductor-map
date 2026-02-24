"use client";

import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Gem,
  Filter,
  MapPin,
  Globe,
  AlertTriangle,
  ExternalLink,
  Factory,
  X,
  Search,
} from "lucide-react";
import "leaflet/dist/leaflet.css";

import {
  companies,
  categoryColors,
  categoryLabels,
  type CompanyCategory,
  type Company,
  type Facility,
} from "@/data/companies";
import {
  materials,
  materialCategoryColors,
  materialCategoryLabels,
  type MaterialCategory,
  type RawMaterial,
} from "@/data/materials";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ViewMode = "companies" | "materials";

// ---------------------------------------------------------------------------
// Map auto-invalidate on mount (Leaflet quirk with dynamic containers)
// ---------------------------------------------------------------------------

function MapInvalidator() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 200);
  }, [map]);
  return null;
}

// ---------------------------------------------------------------------------
// Risk badge helper
// ---------------------------------------------------------------------------

function riskBadge(level?: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW") {
  if (!level) return null;
  const cls: Record<string, string> = {
    CRITICAL: "bg-red-500/15 text-red-400 border border-red-500/30",
    HIGH: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    MEDIUM: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    LOW: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  };
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${cls[level]}`}>
      {level}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Company popup
// ---------------------------------------------------------------------------

function CompanyPopup({ company }: { company: Company }) {
  return (
    <div className="min-w-[220px] max-w-[280px]">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h3 className="text-sm font-bold text-white leading-tight">{company.name}</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {company.subcategory} &middot; {company.country}
          </p>
        </div>
        {riskBadge(company.riskLevel)}
      </div>

      <p className="text-[11px] text-slate-300 leading-relaxed mb-2 line-clamp-3">
        {company.description}
      </p>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400 mb-2">
        {company.revenue2024 && (
          <span>
            Rev: <span className="text-slate-200">{company.revenue2024}</span>
          </span>
        )}
        {company.employees && (
          <span>
            Emp: <span className="text-slate-200">{company.employees}</span>
          </span>
        )}
        {company.founded && (
          <span>
            Est: <span className="text-slate-200">{company.founded}</span>
          </span>
        )}
      </div>

      {company.keyProducts && company.keyProducts.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {company.keyProducts.slice(0, 4).map((p) => (
            <span
              key={p}
              className="text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-slate-300"
            >
              {p}
            </span>
          ))}
        </div>
      )}

      {company.marketShare && Object.keys(company.marketShare).length > 0 && (
        <div className="border-t border-white/10 pt-2 mt-1 space-y-1">
          {Object.entries(company.marketShare)
            .slice(0, 3)
            .map(([key, val]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 flex-1 truncate">{key}</span>
                <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${typeof val === "number" ? val : 0}%`,
                      backgroundColor: categoryColors[company.category],
                    }}
                  />
                </div>
                <span className="text-[10px] text-slate-300 w-8 text-right">
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
        <ExternalLink className="w-3 h-3" /> Website
      </a>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Facility popup
// ---------------------------------------------------------------------------

function FacilityPopup({ facility, company }: { facility: Facility; company: Company }) {
  return (
    <div className="min-w-[180px]">
      <p className="text-[10px] text-slate-400 mb-0.5">{company.name}</p>
      <h3 className="text-sm font-bold text-white leading-tight">{facility.name}</h3>
      <p className="text-[11px] text-slate-400 mt-0.5">
        {facility.location}, {facility.country}
      </p>
      <div className="flex items-center gap-2 mt-1.5">
        <span className="text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-slate-300">
          {facility.type}
        </span>
        {facility.status && (
          <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded">
            {facility.status}
          </span>
        )}
      </div>
      {facility.products && (
        <p className="text-[10px] text-slate-400 mt-1.5">
          Products: <span className="text-slate-300">{facility.products}</span>
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Material popup
// ---------------------------------------------------------------------------

function MaterialSourcePopup({
  material,
  source,
}: {
  material: RawMaterial;
  source: { country: string; share: number; companies?: string[] };
}) {
  return (
    <div className="min-w-[200px] max-w-[260px]">
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h3 className="text-sm font-bold text-white leading-tight">{material.name}</h3>
        {riskBadge(material.riskLevel)}
      </div>
      <p className="text-[11px] text-slate-400 mb-1">
        Source: <span className="text-slate-200">{source.country}</span> &mdash;{" "}
        <span className="text-slate-200">{source.share}%</span> global share
      </p>
      <p className="text-[11px] text-slate-300 leading-relaxed mb-2 line-clamp-3">
        {material.description}
      </p>
      <p className="text-[10px] text-slate-400 mb-1">
        Use: <span className="text-slate-300">{material.primaryUse}</span>
      </p>
      {material.purityRequired && (
        <p className="text-[10px] text-slate-400 mb-1">
          Purity: <span className="text-slate-300">{material.purityRequired}</span>
        </p>
      )}
      {source.companies && source.companies.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {source.companies.map((c) => (
            <span
              key={c}
              className="text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-slate-300"
            >
              {c}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Fly to a company/material on search
// ---------------------------------------------------------------------------

function FlyToLocation({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], zoom, { duration: 1.5 });
  }, [map, lat, lng, zoom]);
  return null;
}

export default function WorldMap() {
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("companies");
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set());
  const [showFacilities, setShowFacilities] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [flyTarget, setFlyTarget] = useState<{ lat: number; lng: number; zoom: number } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // -- Category filter helpers -----------------------------------------------

  const companyCategories = useMemo(
    () => Array.from(new Set(companies.map((c) => c.category))) as CompanyCategory[],
    [],
  );

  const materialCategories = useMemo(
    () => Array.from(new Set(materials.map((m) => m.category))) as MaterialCategory[],
    [],
  );

  const toggleCategory = (cat: string) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const clearFilters = () => setActiveCategories(new Set());

  // -- Filtered data ---------------------------------------------------------

  const filteredCompanies = useMemo(() => {
    if (activeCategories.size === 0) return companies;
    return companies.filter((c) => activeCategories.has(c.category));
  }, [activeCategories]);

  const filteredMaterials = useMemo(() => {
    if (activeCategories.size === 0) return materials;
    return materials.filter((m) => activeCategories.has(m.category));
  }, [activeCategories]);

  // -- Search results -------------------------------------------------------

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    if (viewMode === "companies") {
      return companies
        .filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.country.toLowerCase().includes(q) ||
            c.subcategory.toLowerCase().includes(q),
        )
        .slice(0, 8);
    } else {
      return materials
        .filter(
          (m) =>
            m.name.toLowerCase().includes(q) ||
            m.primaryUse.toLowerCase().includes(q),
        )
        .slice(0, 8);
    }
  }, [searchQuery, viewMode]);

  const handleSearchSelect = (item: Company | RawMaterial) => {
    if ("lat" in item && "lng" in item) {
      setFlyTarget({ lat: item.lat, lng: item.lng, zoom: 6 });
    } else if ("sources" in item) {
      const mat = item as RawMaterial;
      if (mat.sources.length > 0) {
        setFlyTarget({ lat: mat.sources[0].lat, lng: mat.sources[0].lng, zoom: 5 });
      }
    }
    setSearchQuery("");
  };

  // -- Reset category filters when switching views ---------------------------

  useEffect(() => {
    setActiveCategories(new Set());
    setSearchQuery("");
  }, [viewMode]);

  // -- Loading skeleton ------------------------------------------------------

  if (!mounted) {
    return (
      <div className="w-full h-full bg-surface rounded-xl flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading map...</p>
        </div>
      </div>
    );
  }

  // -- Render ----------------------------------------------------------------

  return (
    <div className="w-full h-full flex flex-col bg-surface rounded-xl overflow-hidden border border-border">
      {/* ---- Top controls bar ---- */}
      <div className="flex-shrink-0 flex items-center gap-2 px-3 py-2 border-b border-border bg-surface-2/50 overflow-x-auto">
        {/* Search bar */}
        <div className="relative flex-shrink-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={viewMode === "companies" ? "Search companies..." : "Search materials..."}
            className="w-[180px] pl-8 pr-3 py-1.5 bg-surface border border-border rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          {/* Search dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 mt-1 w-[260px] bg-surface-2 border border-border rounded-lg shadow-xl z-50 overflow-hidden">
              {searchResults.map((item) => {
                const isCompany = "ticker" in item;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSearchSelect(item)}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 text-left transition-colors"
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: isCompany
                          ? categoryColors[(item as Company).category]
                          : materialCategoryColors[(item as RawMaterial).category],
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {isCompany ? (item as Company).country : (item as RawMaterial).primaryUse}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="w-px h-5 bg-border flex-shrink-0" />

        {/* View mode toggle */}
        <div className="flex items-center bg-surface rounded-lg p-0.5 border border-border flex-shrink-0">
          <button
            onClick={() => setViewMode("companies")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === "companies"
                ? "bg-blue-500/15 text-blue-400 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Companies
          </button>
          <button
            onClick={() => setViewMode("materials")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === "materials"
                ? "bg-purple-500/15 text-purple-400 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Gem className="w-3.5 h-3.5" />
            Materials
          </button>
        </div>

        {/* Separator */}
        <div className="w-px h-5 bg-border flex-shrink-0" />

        {/* Category filters */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Filter className="w-3.5 h-3.5 text-slate-500 mr-0.5" />
          {viewMode === "companies"
            ? companyCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-all border ${
                    activeCategories.has(cat)
                      ? "border-white/20 text-white"
                      : activeCategories.size > 0
                        ? "border-transparent text-slate-500 hover:text-slate-300"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                  style={
                    activeCategories.has(cat)
                      ? { backgroundColor: `${categoryColors[cat]}25` }
                      : undefined
                  }
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: categoryColors[cat] }}
                  />
                  {categoryLabels[cat]}
                </button>
              ))
            : materialCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-all border ${
                    activeCategories.has(cat)
                      ? "border-white/20 text-white"
                      : activeCategories.size > 0
                        ? "border-transparent text-slate-500 hover:text-slate-300"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                  style={
                    activeCategories.has(cat)
                      ? { backgroundColor: `${materialCategoryColors[cat]}25` }
                      : undefined
                  }
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: materialCategoryColors[cat] }}
                  />
                  {materialCategoryLabels[cat]}
                </button>
              ))}

          {activeCategories.size > 0 && (
            <button
              onClick={clearFilters}
              className="ml-1 flex items-center gap-0.5 px-1.5 py-1 rounded text-[11px] text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Facilities toggle (companies only) */}
        {viewMode === "companies" && (
          <button
            onClick={() => setShowFacilities((p) => !p)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all border flex-shrink-0 ${
              showFacilities
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-border text-slate-400 hover:text-slate-200"
            }`}
          >
            <Factory className="w-3.5 h-3.5" />
            Facilities
          </button>
        )}

        {/* Stats */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 flex-shrink-0">
          <MapPin className="w-3.5 h-3.5" />
          {viewMode === "companies" ? (
            <span>
              {filteredCompanies.length} companies
              {showFacilities && (
                <>
                  {" "}&middot;{" "}
                  {filteredCompanies.reduce(
                    (acc, c) => acc + (c.facilities?.length || 0),
                    0,
                  )}{" "}
                  facilities
                </>
              )}
            </span>
          ) : (
            <span>
              {filteredMaterials.length} materials &middot;{" "}
              {filteredMaterials.reduce((acc, m) => acc + m.sources.length, 0)} sources
            </span>
          )}
        </div>
      </div>

      {/* ---- Map ---- */}
      <div className="flex-1 relative">
        <MapContainer
          center={[20, 10]}
          zoom={2}
          minZoom={2}
          maxZoom={12}
          zoomControl={true}
          className="w-full h-full"
          style={{ width: "100%", height: "100%" }}
          worldCopyJump={true}
        >
          <MapInvalidator />
          {flyTarget && (
            <FlyToLocation lat={flyTarget.lat} lng={flyTarget.lng} zoom={flyTarget.zoom} />
          )}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
          />

          {/* ========== COMPANIES VIEW ========== */}
          {viewMode === "companies" && (
            <>
              {/* HQ markers */}
              {filteredCompanies.map((company) => (
                <CircleMarker
                  key={`hq-${company.id}`}
                  center={[company.lat, company.lng]}
                  radius={7}
                  pathOptions={{
                    fillColor: categoryColors[company.category],
                    fillOpacity: 0.85,
                    color: categoryColors[company.category],
                    weight: 2,
                    opacity: 0.4,
                  }}
                >
                  <Popup>
                    <CompanyPopup company={company} />
                  </Popup>
                </CircleMarker>
              ))}

              {/* Facility markers */}
              {showFacilities &&
                filteredCompanies
                  .filter((c) => c.facilities && c.facilities.length > 0)
                  .flatMap((company) =>
                    company.facilities!.map((facility, idx) => (
                      <CircleMarker
                        key={`fac-${company.id}-${idx}`}
                        center={[facility.lat, facility.lng]}
                        radius={4}
                        pathOptions={{
                          fillColor: categoryColors[company.category],
                          fillOpacity: 0.5,
                          color: categoryColors[company.category],
                          weight: 1,
                          opacity: 0.3,
                        }}
                      >
                        <Popup>
                          <FacilityPopup facility={facility} company={company} />
                        </Popup>
                      </CircleMarker>
                    )),
                  )}
            </>
          )}

          {/* ========== MATERIALS VIEW ========== */}
          {viewMode === "materials" &&
            filteredMaterials.flatMap((material) =>
              material.sources.map((source, idx) => {
                // Size proportional to market share, min 4 max 18
                const radius = Math.max(4, Math.min(18, 4 + (source.share / 100) * 14));
                return (
                  <CircleMarker
                    key={`mat-${material.id}-${idx}`}
                    center={[source.lat, source.lng]}
                    radius={radius}
                    pathOptions={{
                      fillColor: materialCategoryColors[material.category],
                      fillOpacity: 0.7,
                      color: materialCategoryColors[material.category],
                      weight: 2,
                      opacity: 0.4,
                    }}
                  >
                    <Popup>
                      <MaterialSourcePopup material={material} source={source} />
                    </Popup>
                  </CircleMarker>
                );
              }),
            )}
        </MapContainer>

        {/* ---- Floating legend ---- */}
        <Legend viewMode={viewMode} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Legend overlay
// ---------------------------------------------------------------------------

function Legend({ viewMode }: { viewMode: ViewMode }) {
  const [open, setOpen] = useState(true);

  return (
    <motion.div
      className="absolute bottom-4 left-4 z-[1000]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <button
        onClick={() => setOpen((p) => !p)}
        className="glass rounded-lg px-2.5 py-1.5 text-[11px] text-slate-300 flex items-center gap-1.5 hover:text-white transition-colors mb-1"
      >
        <Globe className="w-3 h-3" />
        Legend
        <span className="text-slate-500 ml-1">{open ? "−" : "+"}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass rounded-lg p-3 overflow-hidden"
          >
            {viewMode === "companies" ? (
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
                  Company Types
                </p>
                {(Object.entries(categoryColors) as [CompanyCategory, string][]).map(
                  ([cat, color]) => (
                    <div key={cat} className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-[11px] text-slate-300">
                        {categoryLabels[cat]}
                      </span>
                    </div>
                  ),
                )}
                <div className="border-t border-white/5 pt-1.5 mt-1.5 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full border-2 border-slate-400 bg-transparent flex-shrink-0" />
                    <span className="text-[11px] text-slate-400">= HQ (larger)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full border border-slate-500 bg-transparent flex-shrink-0 ml-0.5" />
                    <span className="text-[11px] text-slate-400">= Facility (smaller)</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
                  Material Types
                </p>
                {(
                  Object.entries(materialCategoryColors) as [MaterialCategory, string][]
                ).map(([cat, color]) => (
                  <div key={cat} className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-[11px] text-slate-300">
                      {materialCategoryLabels[cat]}
                    </span>
                  </div>
                ))}
                <div className="border-t border-white/5 pt-1.5 mt-1.5 flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 text-slate-500" />
                  <span className="text-[11px] text-slate-400">
                    Size = market share %
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
