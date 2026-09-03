import React from "react";
import { useMugenzi, MugenziTab } from "../../context/MugenziContext";

export const BottomNavBar: React.FC = () => {
  const { activeTab, setActiveTab } = useMugenzi();

  const tabs: { id: MugenziTab; label: string; icon: string }[] = [
    { id: "journey", label: "Explore", icon: "explore" },
    { id: "life_events", label: "Events", icon: "category" },
    { id: "docs", label: "Docs", icon: "description" },
    { id: "chat", label: "RAG AI", icon: "chat_bubble" },
    { id: "admin", label: "Catalog", icon: "database" },
    { id: "profile", label: "Profile", icon: "person" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-1 py-2 pb-safe bg-white/90 backdrop-blur-xl shadow-[0_-10px_30px_rgba(0,0,0,0.06)] rounded-t-2xl md:hidden border-t border-[#e1e3e4]">
      {tabs.map((t) => {
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex flex-col items-center justify-center p-1.5 transition-all duration-200 ${
              isActive
                ? "bg-[#0047ab] text-white rounded-xl px-3 scale-105 shadow-md shadow-[#0047ab]/20"
                : "text-[#434653] hover:text-[#00327d]"
            }`}
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                isActive ? "filled-icon" : ""
              }`}
              style={{
                fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              {t.icon}
            </span>
            <span className="text-[9px] font-semibold mt-0.5 tracking-tight">
              {t.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
