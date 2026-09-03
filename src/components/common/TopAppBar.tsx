import React from "react";
import { useMugenzi, MugenziTab } from "../../context/MugenziContext";

interface TopAppBarProps {
  onOpenNotifications: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  onOpenNotifications,
}) => {
  const {
    activeTab,
    setActiveTab,
    userProfile,
    unreadNotificationCount,
    journeys,
    activeJourneyId,
    setActiveJourneyId,
  } = useMugenzi();

  const navItems: { id: MugenziTab; label: string; icon?: string }[] = [
    { id: "journey", label: "Journey Builder" },
    { id: "life_events", label: "Life Events" },
    { id: "docs", label: "Document Validator" },
    { id: "chat", label: "AI Assistant (RAG)" },
    { id: "admin", label: "Knowledge Base" },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-xl text-[#00327d] sticky top-0 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex justify-between items-center px-4 md:px-10 h-16 w-full z-50 border-b border-[#e1e3e4]">
      {/* Left Brand */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setActiveTab("journey")}
          className="hover:bg-[#f3f4f5] transition-colors p-2 rounded-full active:scale-95 flex items-center justify-center text-[#00327d]"
          title="Home / Journeys"
        >
          <span className="material-symbols-outlined">explore</span>
        </button>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1
              onClick={() => setActiveTab("journey")}
              className="font-extrabold text-2xl md:text-3xl tracking-tight text-[#00327d] cursor-pointer hover:opacity-90"
            >
              Mugenzi
            </h1>
            <span className="hidden sm:inline-block bg-[#dae2ff] text-[#00327d] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Rwanda RAG Companion
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex items-center gap-1.5">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3.5 py-2 rounded-xl font-medium text-xs lg:text-sm transition-all duration-200 flex items-center gap-1.5 ${
                isActive
                  ? "bg-[#00327d] text-white shadow-md shadow-[#00327d]/20"
                  : "text-[#434653] hover:bg-[#f3f4f5]"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Right Actions: Notification Bell & Citizen Headshot */}
      <div className="flex items-center gap-3">
        {/* Quick journey selector dropdown on desktop */}
        {journeys.length > 1 && (
          <div className="hidden lg:flex items-center bg-[#f3f4f5] px-3 py-1.5 rounded-xl border border-[#c3c6d5]/40 text-xs text-[#434653]">
            <span className="material-symbols-outlined text-[16px] mr-1 text-[#00327d]">
              alt_route
            </span>
            <select
              value={activeJourneyId}
              onChange={(e) => setActiveJourneyId(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold text-[#00327d] focus:outline-none focus:ring-0 cursor-pointer pr-4"
            >
              {journeys.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.progressPercentage}%)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          className="relative hover:bg-[#f3f4f5] transition-colors p-2 rounded-full active:scale-95 text-[#00327d]"
          title="Notifications"
        >
          <span className="material-symbols-outlined">notifications</span>
          {unreadNotificationCount > 0 && (
            <span className="absolute top-1 right-1 w-5 h-5 bg-[#ba1a1a] text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse">
              {unreadNotificationCount}
            </span>
          )}
        </button>

        {/* User Profile Avatar */}
        <button
          onClick={() => setActiveTab("profile")}
          className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#00327d]/20 hover:border-[#00327d] transition-all duration-200 active:scale-95"
          title="Citizen Profile"
        >
          <img
            src={userProfile.avatarUrl}
            alt={userProfile.fullName}
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </header>
  );
};
