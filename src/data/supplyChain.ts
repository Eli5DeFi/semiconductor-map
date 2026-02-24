export interface SupplyChainLayer {
  id: string;
  name: string;
  order: number;
  color: string;
  description: string;
}

export interface SupplyChainLink {
  from: string;
  to: string;
  material?: string;
  description: string;
  criticality: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
}

export interface ProductSupplyChain {
  id: string;
  name: string;
  icon: string;
  description: string;
  marketSize: string;
  keyPlayers: { company: string; share: number; color: string }[];
  layers: { layer: string; companies: string[]; materials?: string[] }[];
  bottlenecks: { name: string; severity: string; description: string }[];
}

export const supplyChainLayers: SupplyChainLayer[] = [
  { id: "raw", name: "Raw Materials", order: 1, color: "#F97316", description: "Mining & extraction of base materials" },
  { id: "refined", name: "Refined Materials", order: 2, color: "#EAB308", description: "Processing and purification" },
  { id: "wafer", name: "Wafer Manufacturing", order: 3, color: "#84CC16", description: "Silicon wafer production" },
  { id: "design", name: "Chip Design & IP", order: 4, color: "#8B5CF6", description: "EDA tools, IP cores, chip architecture" },
  { id: "equipment", name: "Equipment", order: 5, color: "#F59E0B", description: "Lithography, deposition, etch, inspection" },
  { id: "fabrication", name: "Chip Fabrication", order: 6, color: "#EF4444", description: "Front-end wafer processing" },
  { id: "packaging", name: "Advanced Packaging", order: 7, color: "#06B6D4", description: "2.5D/3D packaging, HBM integration" },
  { id: "testing", name: "Assembly & Testing", order: 8, color: "#3B82F6", description: "OSAT back-end processing" },
  { id: "product", name: "End Products", order: 9, color: "#10B981", description: "GPUs, CPUs, Memory, Storage" },
];

export const productSupplyChains: ProductSupplyChain[] = [
  {
    id: "gpu",
    name: "GPU (AI Accelerators)",
    icon: "Cpu",
    description: "Graphics Processing Units for AI training, inference, and gaming",
    marketSize: "$65B+ (2025)",
    keyPlayers: [
      { company: "NVIDIA", share: 88, color: "#76b900" },
      { company: "AMD", share: 10, color: "#ED1C24" },
      { company: "Intel", share: 2, color: "#0071C5" },
    ],
    layers: [
      { layer: "Design", companies: ["NVIDIA", "AMD"], materials: ["EDA (Synopsys, Cadence)", "ARM IP"] },
      { layer: "Foundry", companies: ["TSMC (90%+)", "Samsung (<10%)"], materials: ["EUV Lithography (ASML)"] },
      { layer: "Silicon Wafers", companies: ["Shin-Etsu", "SUMCO", "Siltronic"] },
      { layer: "HBM Memory", companies: ["SK Hynix (62%)", "Micron (21%)", "Samsung (17%)"] },
      { layer: "Advanced Packaging", companies: ["TSMC CoWoS (80%+)", "ASE FOCoS", "Amkor"] },
      { layer: "Substrates", companies: ["Ibiden", "Shinko", "Unimicron"] },
      { layer: "Assembly/Test", companies: ["TSMC", "ASE", "Amkor"] },
    ],
    bottlenecks: [
      { name: "CoWoS Packaging", severity: "CRITICAL", description: "TSMC CoWoS capacity is the #1 bottleneck for AI GPU production. Sold out through 2026." },
      { name: "HBM Supply", severity: "CRITICAL", description: "HBM3E/HBM4 supply 100% sold out. SK Hynix supplies 90% of NVIDIA's HBM." },
      { name: "EUV Lithography", severity: "HIGH", description: "ASML is the sole supplier. 2-3 year backlog for new machines." },
    ],
  },
  {
    id: "dram",
    name: "DRAM (System Memory)",
    icon: "MemoryStick",
    description: "Dynamic Random Access Memory for PCs, servers, and mobile devices",
    marketSize: "$100B+ (2025)",
    keyPlayers: [
      { company: "SK Hynix", share: 36, color: "#EB0028" },
      { company: "Samsung", share: 34, color: "#1428A0" },
      { company: "Micron", share: 23, color: "#0072CE" },
    ],
    layers: [
      { layer: "Design", companies: ["Samsung", "SK Hynix", "Micron"] },
      { layer: "Foundry (Internal)", companies: ["Samsung", "SK Hynix", "Micron"] },
      { layer: "Silicon Wafers", companies: ["Shin-Etsu", "SUMCO", "GlobalWafers"] },
      { layer: "Equipment", companies: ["ASML (EUV)", "Lam Research (Etch)", "Applied Materials (Deposition)", "KLA (Inspection)"] },
      { layer: "Packaging", companies: ["Internal + ASE", "Amkor", "JCET"] },
    ],
    bottlenecks: [
      { name: "South Korea Concentration", severity: "CRITICAL", description: "95% of DRAM produced in South Korea by Samsung and SK Hynix." },
      { name: "HBM Conversion", severity: "HIGH", description: "HBM requires 3x wafer material and longer cycle, reducing standard DRAM capacity." },
    ],
  },
  {
    id: "nand",
    name: "NAND Flash (SSD Storage)",
    icon: "HardDrive",
    description: "Non-volatile flash memory for SSDs, mobile storage",
    marketSize: "$70B+ (2025)",
    keyPlayers: [
      { company: "Samsung", share: 32, color: "#1428A0" },
      { company: "SK Hynix", share: 19, color: "#EB0028" },
      { company: "Kioxia", share: 15, color: "#E60012" },
      { company: "Western Digital", share: 12, color: "#0065BD" },
      { company: "Micron", share: 11, color: "#0072CE" },
    ],
    layers: [
      { layer: "Design", companies: ["Samsung", "SK Hynix", "Kioxia/WD", "Micron"] },
      { layer: "Fabrication", companies: ["Samsung (Korea/China)", "SK Hynix (Korea/China)", "Kioxia/WD (Japan)", "Micron (Singapore/Japan)"] },
      { layer: "Controllers", companies: ["Marvell (22%)", "Silicon Motion (18%)", "Phison (15%)", "Samsung (internal)"] },
      { layer: "Equipment", companies: ["Lam Research (Etch leader)", "Applied Materials", "Tokyo Electron"] },
    ],
    bottlenecks: [
      { name: "Layer Count Race", severity: "MEDIUM", description: "200+ layer 3D NAND requires extreme high-aspect-ratio etching (Lam Research dominant)." },
    ],
  },
  {
    id: "cpu",
    name: "CPU (Processors)",
    icon: "Microchip",
    description: "Central Processing Units for PCs, servers, and data centers",
    marketSize: "$80B+ (2025)",
    keyPlayers: [
      { company: "Intel", share: 65, color: "#0071C5" },
      { company: "AMD", share: 30, color: "#ED1C24" },
      { company: "ARM-based", share: 5, color: "#0091BD" },
    ],
    layers: [
      { layer: "Design", companies: ["Intel", "AMD", "Apple", "Qualcomm", "AWS Graviton", "Ampere"] },
      { layer: "Foundry", companies: ["Intel Internal", "TSMC (AMD, Apple, AWS)", "Samsung (some Qualcomm)"] },
      { layer: "Packaging", companies: ["Intel (EMIB/Foveros)", "TSMC (CoWoS/InFO)", "ASE"] },
      { layer: "Chipsets/Platform", companies: ["Intel", "AMD", "Broadcom"] },
    ],
    bottlenecks: [
      { name: "Intel Process Delays", severity: "HIGH", description: "Intel 18A ramp critical for competitive foundry services." },
      { name: "TSMC Dependency", severity: "HIGH", description: "AMD, Apple, Qualcomm all 100% dependent on TSMC." },
    ],
  },
  {
    id: "hdd",
    name: "HDD (Hard Disk Drives)",
    icon: "Database",
    description: "Magnetic storage drives for data centers and NAS",
    marketSize: "$25B+ (2025)",
    keyPlayers: [
      { company: "Seagate", share: 42, color: "#6EBE49" },
      { company: "Western Digital", share: 41, color: "#0065BD" },
      { company: "Toshiba", share: 17, color: "#FF0000" },
    ],
    layers: [
      { layer: "Recording Heads", companies: ["TDK (external leader)", "Seagate (internal)", "WD (internal)"] },
      { layer: "Magnetic Media", companies: ["Showa Denko (external leader)", "Seagate (internal)", "WD (internal)"] },
      { layer: "Spindle Motors", companies: ["Nidec (85%)", "Seagate (internal)"] },
      { layer: "Controllers", companies: ["Marvell", "Broadcom"] },
      { layer: "Rare Earth Magnets", companies: ["China (60% mining)", "Lynas (Australia)"] },
      { layer: "Assembly", companies: ["Thailand", "Malaysia", "Singapore", "China", "Philippines"] },
    ],
    bottlenecks: [
      { name: "Southeast Asia Concentration", severity: "MEDIUM", description: "Manufacturing concentrated in Thailand, Malaysia, Singapore." },
      { name: "Nidec Motor Dependency", severity: "MEDIUM", description: "Nidec supplies 85% of HDD spindle motors globally." },
    ],
  },
];

export const riskScenarios = [
  {
    id: "asml_disruption",
    name: "ASML EUV Supply Disruption",
    probability: "Low",
    impact: "Catastrophic",
    recoveryTime: "2-3 years",
    description: "No alternative supplier exists for EUV lithography",
    cascade: [
      "TSMC, Samsung, Intel cannot produce <7nm chips",
      "AI accelerator output drops to ZERO",
      "Smartphone launches delayed",
      "Data center expansion stops",
    ],
  },
  {
    id: "taiwan_disruption",
    name: "Taiwan Geographic Disruption",
    probability: "Medium",
    impact: "Catastrophic",
    recoveryTime: "5-10 years",
    description: "90% advanced chip supply and 60%+ global foundry capacity at risk",
    cascade: [
      "90% advanced chip supply LOST",
      "Global electronics production HALTS",
      "AI data center expansion STOPS",
      "Global recession triggered",
      "Tech company revenues collapse",
    ],
  },
  {
    id: "hbm_shortage",
    name: "HBM Supply Disruption",
    probability: "Medium",
    impact: "High",
    recoveryTime: "18-24 months",
    description: "AI GPU production stops without HBM",
    cascade: [
      "NVIDIA, AMD cannot ship AI accelerators",
      "Cloud AI services rationed",
      "GPU prices spike 2-3x",
      "Enterprise AI adoption delayed",
    ],
  },
  {
    id: "china_rare_earth",
    name: "China Rare Earth Export Ban",
    probability: "Medium",
    impact: "High",
    recoveryTime: "3-5 years",
    description: "China controls 60% mining, 85% processing of rare earths",
    cascade: [
      "GaN/GaAs device production constrained",
      "5G base station deployment slows",
      "EV powertrain production affected",
      "Alternative sources activated at higher cost",
    ],
  },
  {
    id: "cowos_bottleneck",
    name: "CoWoS Capacity Constraint",
    probability: "High (current)",
    impact: "Medium",
    recoveryTime: "2026-2027",
    description: "Advanced packaging is the gating factor for AI GPU production",
    cascade: [
      "AI GPU supply limited",
      "NVIDIA allocation system continues",
      "Hyperscaler buildout delayed",
      "Alternative packaging explored",
    ],
  },
];

export const governmentPrograms = [
  { name: "US CHIPS Act", amount: "$52.7B", country: "USA", focus: "Domestic fab capacity", recipients: ["Intel ($8.5B)", "TSMC ($6.6B)", "Samsung ($4.7B)", "Micron ($4.6B)", "GlobalFoundries ($1.5B)"] },
  { name: "European Chips Act", amount: "EUR 43B", country: "EU", focus: "European semiconductor sovereignty", recipients: ["Intel Magdeburg (EUR 30B+)", "Infineon Dresden (EUR 5B)", "STMicro/GF Crolles (EUR 5.7B)"] },
  { name: "Japan Semiconductor Strategy", amount: "JPY 2T", country: "Japan", focus: "2nm fab, equipment ecosystem", recipients: ["Rapidus 2nm fab (Hokkaido)", "TSMC JASM (Kumamoto)", "Equipment makers"] },
];
