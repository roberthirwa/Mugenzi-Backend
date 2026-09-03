import React, { useState } from "react";
import { useMugenzi } from "../../context/MugenziContext";
import { LifeEventTemplate } from "../../types/domain";

export const LifeEventsView: React.FC = () => {
  const { lifeEvents, createJourneyFromTemplate, prefillChatWithTopic } =
    useMugenzi();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Milestones" },
    { id: "business", label: "Business & Work" },
    { id: "family", label: "Family & Health" },
    { id: "property", label: "Land & Property" },
    { id: "education", label: "Education" },
    { id: "legal", label: "Legal & Civil" },
  ];

  const filteredEvents = lifeEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.partnerInstitution.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getEventIcon = (event: LifeEventTemplate) => {
    switch (event.category) {
      case "business":
        return "storefront";
      case "family":
        return event.id.includes("birth") ? "child_care" : "favorite";
      case "property":
        return event.id.includes("building") ? "architecture" : "landscape";
      case "education":
        return "school";
      case "legal":
        return "badge";
      default:
        return "event";
    }
  };

  const partnerLogos = [
    { name: "RDB", full: "Rwanda Development Board" },
    { name: "IremboGov", full: "Digital Government Services" },
    { name: "NIDA", full: "National ID Agency" },
    { name: "RRA", full: "Rwanda Revenue Authority" },
    { name: "RSSB", full: "Rwanda Social Security" },
    { name: "MINALOC", full: "Ministry of Local Government" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 pt-8 pb-32">
      {/* Header matching Stitch Design */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#dae2ff] text-[#00327d] text-xs font-bold">
          <span className="material-symbols-outlined text-[16px]">category</span>
          <span>Rwandan Citizen Milestones</span>
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-[#191c1d] tracking-tight">
          What milestone are you reaching today?
        </h1>
        <p className="text-base md:text-lg text-[#434653] leading-relaxed">
          Access legal documents, government services, and step-by-step guidance for life's most significant transitions in Rwanda.
        </p>

        {/* AI Search Bar matching Stitch Design */}
        <div className="max-w-xl mx-auto pt-2">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-[#737784]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask Mugenzi about a life event (e.g. Land, Business, Marriage)..."
              className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-[#e1e3e4] text-sm text-[#191c1d] placeholder:text-[#737784] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00327d] focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 text-xs font-bold text-[#737784] hover:text-[#191c1d]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto justify-start sm:justify-center pt-3 pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-[#00327d] text-white shadow-md shadow-[#00327d]/20"
                  : "bg-white text-[#434653] hover:bg-[#f3f4f5] border border-[#e1e3e4]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Life Event Cards matching Stitch Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-3xl p-6 md:p-7 border border-[#e1e3e4] ambient-shadow hover:border-[#00327d]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#dae2ff] text-[#00327d] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-2xl">
                    {getEventIcon(event)}
                  </span>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#f3f4f5] text-[#434653]">
                  {event.stepsCount} Steps
                </span>
              </div>

              <h3 className="font-display font-bold text-xl text-[#191c1d] mb-2 group-hover:text-[#00327d] transition-colors">
                {event.title}
              </h3>
              <p className="text-[#434653] text-sm leading-relaxed mb-6">
                {event.description}
              </p>
            </div>

            <div className="pt-4 border-t border-[#f3f4f5] space-y-4">
              <div className="flex items-center justify-between text-xs text-[#737784]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  {event.estimatedDuration}
                </span>
                <span className="font-semibold text-[#00327d]">
                  {event.partnerInstitution}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => createJourneyFromTemplate(event)}
                  className="flex-1 bg-[#00327d] hover:bg-[#0047ab] text-white py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-[#00327d]/15"
                >
                  <span>Start Journey</span>
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </button>
                <button
                  onClick={() =>
                    prefillChatWithTopic(
                      `What are all the requirements and costs for ${event.title} in Rwanda?`
                    )
                  }
                  className="p-2.5 bg-[#f3f4f5] hover:bg-[#e7e8e9] rounded-xl text-[#434653] transition-colors"
                  title="Ask Mugenzi about this"
                >
                  <span className="material-symbols-outlined text-base">
                    help_outline
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* In Partnership With Official Institutions Section matching Stitch Design */}
      <div className="mt-20 text-center border-t border-[#e1e3e4] pt-12">
        <h4 className="text-xs font-bold uppercase tracking-widest text-[#737784] mb-6">
          In Official Partnership with Rwandan Institutions
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {partnerLogos.map((partner, idx) => (
            <div
              key={idx}
              className="p-4 bg-white rounded-2xl border border-[#e1e3e4] flex flex-col items-center justify-center shadow-sm hover:border-[#00327d]/30 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#f3f4f5] flex items-center justify-center font-black text-[#00327d] text-sm mb-1.5">
                {partner.name.slice(0, 3)}
              </div>
              <div className="font-bold text-xs text-[#191c1d]">{partner.name}</div>
              <div className="text-[10px] text-[#737784] line-clamp-1">{partner.full}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
