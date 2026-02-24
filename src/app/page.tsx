"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Sidebar, { type ViewType } from "@/components/Sidebar";
import OverviewView from "@/components/OverviewView";

const WorldMap = dynamic(() => import("@/components/WorldMap"), {
  ssr: false,
  loading: () => <ViewLoading label="Loading World Map..." />,
});

const SupplyChainView = dynamic(() => import("@/components/SupplyChainView"), {
  loading: () => <ViewLoading label="Loading Supply Chain..." />,
});

const CompaniesView = dynamic(() => import("@/components/CompaniesView"), {
  loading: () => <ViewLoading label="Loading Companies..." />,
});

const MarketShareView = dynamic(() => import("@/components/MarketShareView"), {
  loading: () => <ViewLoading label="Loading Market Data..." />,
});

const RiskView = dynamic(() => import("@/components/RiskView"), {
  loading: () => <ViewLoading label="Loading Risk Analysis..." />,
});

const ProductView = dynamic(() => import("@/components/ProductView"), {
  loading: () => <ViewLoading label="Loading Product View..." />,
});

function ViewLoading({ label }: { label: string }) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-400">{label}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeView, setActiveView] = useState<ViewType>("overview");

  const renderView = () => {
    switch (activeView) {
      case "overview":
        return <OverviewView onNavigate={setActiveView} />;
      case "map":
        return <WorldMap />;
      case "supply-chain":
        return <SupplyChainView />;
      case "companies":
        return <CompaniesView />;
      case "market-share":
        return <MarketShareView />;
      case "risk":
        return <RiskView />;
      case "gpu":
      case "dram":
      case "nand":
      case "cpu":
      case "hdd":
        return <ProductView productId={activeView} />;
      default:
        return <OverviewView onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-background">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 overflow-hidden">{renderView()}</main>
    </div>
  );
}
