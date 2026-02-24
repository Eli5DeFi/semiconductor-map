export interface RawMaterial {
  id: string;
  name: string;
  category: MaterialCategory;
  primaryUse: string;
  topProducer: string;
  topProducerShare: number;
  riskLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  sources: MaterialSource[];
  description: string;
  purityRequired?: string;
  priceVolatility?: "HIGH" | "MEDIUM" | "LOW";
}

export type MaterialCategory =
  | "silicon"
  | "rare_earth"
  | "precious_metal"
  | "critical_metal"
  | "gas"
  | "chemical"
  | "substrate";

export interface MaterialSource {
  country: string;
  share: number;
  lat: number;
  lng: number;
  companies?: string[];
}

export const materials: RawMaterial[] = [
  {
    id: "polysilicon",
    name: "Polysilicon",
    category: "silicon",
    primaryUse: "Silicon wafer production (base material for all chips)",
    topProducer: "China",
    topProducerShare: 93.5,
    riskLevel: "CRITICAL",
    description: "The foundational raw material. Purified to 11N (99.999999999%) for semiconductor-grade wafers.",
    purityRequired: "11N (99.999999999%)",
    priceVolatility: "HIGH",
    sources: [
      { country: "China", share: 93.5, lat: 35.8617, lng: 104.1954, companies: ["Tongwei (30%)", "GCL Technology (16%)", "Daqo New Energy (12%)", "Xinte Energy (10%)"] },
      { country: "Germany", share: 3, lat: 51.1657, lng: 10.4515, companies: ["Wacker Chemie"] },
      { country: "USA", share: 2, lat: 39.8283, lng: -98.5795, companies: ["Hemlock Semiconductor", "REC Silicon"] },
      { country: "South Korea", share: 1, lat: 35.9078, lng: 127.7669, companies: ["OCI"] },
    ],
  },
  {
    id: "silicon_wafers",
    name: "Silicon Wafers (300mm)",
    category: "silicon",
    primaryUse: "Base substrate for chip fabrication",
    topProducer: "Japan",
    topProducerShare: 55,
    riskLevel: "HIGH",
    description: "Ultra-pure crystalline silicon discs. Top 5 suppliers control 82% of global supply.",
    purityRequired: "11N",
    sources: [
      { country: "Japan", share: 55, lat: 36.2048, lng: 138.2529, companies: ["Shin-Etsu (32%)", "SUMCO (27%)"] },
      { country: "Taiwan", share: 14, lat: 23.5937, lng: 120.9605, companies: ["GlobalWafers"] },
      { country: "Germany", share: 12, lat: 51.1657, lng: 10.4515, companies: ["Siltronic"] },
      { country: "South Korea", share: 8, lat: 35.9078, lng: 127.7669, companies: ["SK Siltron"] },
    ],
  },
  {
    id: "rare_earths",
    name: "Rare Earth Elements",
    category: "rare_earth",
    primaryUse: "Permanent magnets (HDDs), phosphors, lasers",
    topProducer: "China",
    topProducerShare: 60,
    riskLevel: "CRITICAL",
    description: "China controls 60% of mining and 85% of processing. Export controls on 10+ elements since 2024.",
    sources: [
      { country: "China", share: 60, lat: 40.4319, lng: 109.9810, companies: ["China Northern Rare Earth", "Shenghe Resources"] },
      { country: "USA", share: 12, lat: 35.4811, lng: -115.5321, companies: ["MP Materials (Mountain Pass)"] },
      { country: "Myanmar", share: 10, lat: 21.9162, lng: 95.9560 },
      { country: "Australia", share: 8, lat: -29.0, lng: 121.0, companies: ["Lynas Rare Earths"] },
    ],
  },
  {
    id: "gallium",
    name: "Gallium",
    category: "critical_metal",
    primaryUse: "GaN/GaAs for 5G, power electronics, LEDs",
    topProducer: "China",
    topProducerShare: 98,
    riskLevel: "CRITICAL",
    description: "98% from China as aluminum smelting byproduct. Subject to export controls. Critical for GaN power devices.",
    sources: [
      { country: "China", share: 98, lat: 35.8617, lng: 104.1954 },
      { country: "Japan", share: 1, lat: 36.2048, lng: 138.2529 },
      { country: "South Korea", share: 0.5, lat: 35.9078, lng: 127.7669 },
    ],
  },
  {
    id: "germanium",
    name: "Germanium",
    category: "critical_metal",
    primaryUse: "Fiber optics, IR optics, SiGe chips",
    topProducer: "China",
    topProducerShare: 60,
    riskLevel: "HIGH",
    description: "Zinc mining byproduct. China controls 60%+. Used in SiGe transistors for high-frequency applications.",
    sources: [
      { country: "China", share: 60, lat: 35.8617, lng: 104.1954 },
      { country: "Russia", share: 5, lat: 61.5240, lng: 105.3188 },
      { country: "Canada", share: 3, lat: 56.1304, lng: -106.3468 },
    ],
  },
  {
    id: "cobalt",
    name: "Cobalt",
    category: "critical_metal",
    primaryUse: "Interconnect liners, barriers in advanced nodes",
    topProducer: "DRC",
    topProducerShare: 70,
    riskLevel: "HIGH",
    description: "70% from Democratic Republic of Congo. Used as copper diffusion barrier in chip interconnects.",
    sources: [
      { country: "DRC", share: 70, lat: -4.0383, lng: 21.7587, companies: ["Glencore", "CMOC"] },
      { country: "Russia", share: 5, lat: 61.5240, lng: 105.3188, companies: ["Nornickel"] },
      { country: "Australia", share: 4, lat: -25.2744, lng: 133.7751 },
    ],
  },
  {
    id: "tantalum",
    name: "Tantalum",
    category: "critical_metal",
    primaryUse: "Capacitors, sputtering targets",
    topProducer: "DRC/Rwanda",
    topProducerShare: 60,
    riskLevel: "HIGH",
    description: "Concentrated in Central Africa. Essential for tantalum capacitors and PVD sputtering targets.",
    sources: [
      { country: "DRC", share: 35, lat: -4.0383, lng: 21.7587 },
      { country: "Rwanda", share: 25, lat: -1.9403, lng: 29.8739 },
      { country: "Brazil", share: 10, lat: -14.2350, lng: -51.9253 },
      { country: "Ethiopia", share: 5, lat: 9.1450, lng: 40.4897 },
    ],
  },
  {
    id: "tungsten",
    name: "Tungsten",
    category: "critical_metal",
    primaryUse: "WF6 gas for CVD, chip contacts/vias",
    topProducer: "China",
    topProducerShare: 80,
    riskLevel: "HIGH",
    description: "China controls 80%+ of supply. WF6 gas is essential for tungsten CVD in chip manufacturing.",
    sources: [
      { country: "China", share: 80, lat: 35.8617, lng: 104.1954, companies: ["China Molybdenum", "Xiamen Tungsten"] },
      { country: "Vietnam", share: 5, lat: 14.0583, lng: 108.2772 },
      { country: "Russia", share: 4, lat: 61.5240, lng: 105.3188 },
    ],
  },
  {
    id: "palladium",
    name: "Palladium",
    category: "precious_metal",
    primaryUse: "Chip connections, MLCC, plating",
    topProducer: "Russia",
    topProducerShare: 40,
    riskLevel: "HIGH",
    description: "Russia (40%) and South Africa (34%) dominate. Used in chip packaging and MLCC capacitors.",
    sources: [
      { country: "Russia", share: 40, lat: 69.3558, lng: 88.1893, companies: ["Nornickel"] },
      { country: "South Africa", share: 34, lat: -25.7461, lng: 28.1881, companies: ["Anglo American Platinum", "Impala Platinum"] },
      { country: "Canada", share: 10, lat: 46.8139, lng: -81.0022, companies: ["Vale"] },
    ],
  },
  {
    id: "platinum",
    name: "Platinum",
    category: "precious_metal",
    primaryUse: "Electrodes, contacts, catalyst",
    topProducer: "South Africa",
    topProducerShare: 70,
    riskLevel: "MEDIUM",
    description: "South Africa produces 70%. Used in semiconductor electrodes and industrial catalysts.",
    sources: [
      { country: "South Africa", share: 70, lat: -25.7461, lng: 28.1881 },
      { country: "Russia", share: 12, lat: 69.3558, lng: 88.1893 },
      { country: "Zimbabwe", share: 8, lat: -19.0154, lng: 29.1549 },
    ],
  },
  {
    id: "gold",
    name: "Gold",
    category: "precious_metal",
    primaryUse: "Wire bonding (44% of packaging market)",
    topProducer: "China",
    topProducerShare: 11,
    riskLevel: "LOW",
    description: "Well diversified globally. Used extensively for wire bonding in chip packaging.",
    sources: [
      { country: "China", share: 11, lat: 35.8617, lng: 104.1954 },
      { country: "Australia", share: 10, lat: -25.2744, lng: 133.7751 },
      { country: "Russia", share: 9, lat: 61.5240, lng: 105.3188 },
      { country: "Canada", share: 6, lat: 56.1304, lng: -106.3468 },
    ],
  },
  {
    id: "neon",
    name: "Neon Gas",
    category: "gas",
    primaryUse: "Excimer laser gas for DUV lithography",
    topProducer: "China (post-2022)",
    topProducerShare: 50,
    riskLevel: "HIGH",
    description: "Ukraine/Russia previously supplied 50%. Supply disrupted by war, now diversified. 600%+ price spike.",
    purityRequired: "5N (99.999%)",
    priceVolatility: "HIGH",
    sources: [
      { country: "China", share: 50, lat: 35.8617, lng: 104.1954 },
      { country: "USA", share: 20, lat: 39.8283, lng: -98.5795, companies: ["Air Products", "Linde"] },
      { country: "Ukraine", share: 10, lat: 48.3794, lng: 31.1656 },
    ],
  },
  {
    id: "argon",
    name: "Argon",
    category: "gas",
    primaryUse: "Sputtering, plasma etching",
    topProducer: "Diversified",
    topProducerShare: 25,
    riskLevel: "LOW",
    description: "Produced via air separation worldwide. Ultra-high purity (6N) required for semiconductor use.",
    purityRequired: "6N (99.9999%)",
    sources: [
      { country: "USA", share: 25, lat: 39.8283, lng: -98.5795, companies: ["Air Products", "Linde"] },
      { country: "France", share: 20, lat: 46.2276, lng: 2.2137, companies: ["Air Liquide"] },
      { country: "Germany", share: 15, lat: 51.1657, lng: 10.4515, companies: ["Linde"] },
    ],
  },
  {
    id: "helium",
    name: "Helium",
    category: "gas",
    primaryUse: "Cooling in EUV, carrier gas, leak testing",
    topProducer: "USA",
    topProducerShare: 30,
    riskLevel: "MEDIUM",
    description: "Extracted from natural gas. Global shortage concerns. Critical for EUV machine cooling.",
    purityRequired: "5N (99.999%)",
    sources: [
      { country: "USA", share: 30, lat: 36.7783, lng: -100.9450 },
      { country: "Qatar", share: 25, lat: 25.3548, lng: 51.1839, companies: ["Qatar Helium"] },
      { country: "Algeria", share: 10, lat: 28.0339, lng: 1.6596 },
      { country: "Russia", share: 10, lat: 52.5, lng: 120.0, companies: ["Gazprom"] },
    ],
  },
  {
    id: "copper",
    name: "Copper",
    category: "critical_metal",
    primaryUse: "Chip interconnects, wire bonding, PCB",
    topProducer: "Chile",
    topProducerShare: 27,
    riskLevel: "LOW",
    description: "Well diversified supply. Essential for chip interconnects replacing aluminum in advanced nodes.",
    sources: [
      { country: "Chile", share: 27, lat: -33.4489, lng: -70.6693, companies: ["Codelco", "BHP"] },
      { country: "Peru", share: 10, lat: -12.0464, lng: -77.0428, companies: ["Southern Copper"] },
      { country: "China", share: 8, lat: 35.8617, lng: 104.1954 },
      { country: "DRC", share: 7, lat: -4.0383, lng: 21.7587, companies: ["Glencore"] },
    ],
  },
  {
    id: "photoresist",
    name: "Photoresists (EUV/ArF/KrF)",
    category: "chemical",
    primaryUse: "Pattern transfer in lithography",
    topProducer: "Japan",
    topProducerShare: 70,
    riskLevel: "HIGH",
    description: "Japan controls 70%+ of advanced photoresist production. Critical for chip patterning at all nodes.",
    sources: [
      { country: "Japan", share: 70, lat: 36.2048, lng: 138.2529, companies: ["JSR (35%)", "TOK (25%)", "Shin-Etsu", "Fujifilm"] },
      { country: "USA", share: 20, lat: 39.8283, lng: -98.5795, companies: ["DuPont"] },
      { country: "South Korea", share: 8, lat: 35.9078, lng: 127.7669 },
    ],
  },
  {
    id: "photomasks",
    name: "Photomasks",
    category: "substrate",
    primaryUse: "Master pattern plates for lithography",
    topProducer: "Japan",
    topProducerShare: 70,
    riskLevel: "HIGH",
    description: "Japan controls ~70% of photomask production. Each advanced chip design requires dozens of unique masks.",
    sources: [
      { country: "Japan", share: 70, lat: 36.2048, lng: 138.2529, companies: ["Toppan (28%)", "DNP (26%)", "Hoya (9%)"] },
      { country: "USA", share: 26, lat: 39.8283, lng: -98.5795, companies: ["Photronics (26%)"] },
    ],
  },
];

export const materialCategoryColors: Record<MaterialCategory, string> = {
  silicon: "#64748B",
  rare_earth: "#9333EA",
  precious_metal: "#EAB308",
  critical_metal: "#DC2626",
  gas: "#06B6D4",
  chemical: "#22C55E",
  substrate: "#F97316",
};

export const materialCategoryLabels: Record<MaterialCategory, string> = {
  silicon: "Silicon & Wafers",
  rare_earth: "Rare Earth Elements",
  precious_metal: "Precious Metals",
  critical_metal: "Critical Metals",
  gas: "High-Purity Gases",
  chemical: "Chemicals",
  substrate: "Substrates",
};
