import React, { useState } from "react";
import { useMugenzi } from "../../context/MugenziContext";

interface ProfileViewProps {
  onOpenAuthModal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onOpenAuthModal,
}) => {
  const { userProfile, journeys, documents, setActiveJourneyId, setActiveTab } =
    useMugenzi();

  const [language, setLanguage] = useState<"rw" | "en" | "fr">("en");

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 pt-8 pb-32">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#e1e3e4] ambient-shadow mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.fullName}
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-[#dae2ff] shadow-md"
            />
            <span
              className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-1 ring-2 ring-white"
              title="Verified Citizen"
            >
              <span className="material-symbols-outlined text-sm block">check</span>
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="font-display text-2xl font-bold text-[#191c1d]">
                {userProfile.fullName}
              </h2>
              <span className="bg-[#dae2ff] text-[#00327d] text-xs font-bold px-2.5 py-0.5 rounded-full">
                NIDA Verified
              </span>
            </div>
            <p className="text-sm text-[#737784]">{userProfile.email}</p>
            <p className="text-xs text-[#434653] font-mono mt-1">
              National ID: {userProfile.nationalIdNumber || "1199380012345678"}
            </p>
            <p className="text-xs text-[#737784]">
              Location: {userProfile.sector} Sector, {userProfile.district} District
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <button
              onClick={onOpenAuthModal}
              className="px-4 py-2 bg-[#f3f4f5] hover:bg-[#e7e8e9] text-[#00327d] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">switch_account</span>
              Switch Account
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Profile Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Journeys Status */}
        <div className="bg-white rounded-3xl p-6 border border-[#e1e3e4] ambient-shadow space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-[#191c1d] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00327d]">route</span>
              Active Roadmaps ({journeys.length})
            </h3>
            <button
              onClick={() => setActiveTab("life_events")}
              className="text-xs font-bold text-[#00327d] hover:underline"
            >
              + New Roadmap
            </button>
          </div>

          <div className="space-y-3">
            {journeys.map((j) => (
              <div
                key={j.id}
                onClick={() => {
                  setActiveJourneyId(j.id);
                  setActiveTab("journey");
                }}
                className="p-4 rounded-2xl bg-[#f8f9fa] hover:bg-[#dae2ff]/30 border border-[#e1e3e4] transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-sm text-[#191c1d]">{j.title}</div>
                  <div className="text-xs text-[#737784] mt-0.5">
                    {j.steps.filter((s) => s.status === "completed").length} of {j.steps.length} steps completed
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-[#00327d]">
                    {j.progressPercentage}%
                  </span>
                  <div className="w-16 h-1.5 bg-[#e1e3e4] rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-[#00327d] h-full rounded-full"
                      style={{ width: `${j.progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Linked Services & Preferences */}
        <div className="bg-white rounded-3xl p-6 border border-[#e1e3e4] ambient-shadow space-y-4">
          <h3 className="font-display font-bold text-lg text-[#191c1d] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00327d]">tune</span>
            Companion Preferences
          </h3>

          <div className="space-y-4 text-xs">
            {/* Language */}
            <div>
              <label className="block font-bold text-[#434653] uppercase tracking-wider mb-2">
                Preferred Interface Language
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "rw", label: "Ikinyarwanda" },
                  { id: "en", label: "English" },
                  { id: "fr", label: "Français" },
                ].map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setLanguage(lang.id as any)}
                    className={`py-2 px-3 rounded-xl font-bold transition-all ${
                      language === lang.id
                        ? "bg-[#00327d] text-white shadow-sm"
                        : "bg-[#f3f4f5] text-[#434653] hover:bg-[#e7e8e9]"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Document stats */}
            <div className="p-4 bg-[#f8f9fa] rounded-2xl border border-[#e1e3e4] flex items-center justify-between">
              <div>
                <div className="font-bold text-[#191c1d]">Vault Documents</div>
                <div className="text-[#737784] mt-0.5">{documents.length} verified citizen files</div>
              </div>
              <button
                onClick={() => setActiveTab("docs")}
                className="bg-[#00327d] text-white px-3 py-1.5 rounded-xl font-bold hover:bg-[#0047ab]"
              >
                Manage Docs
              </button>
            </div>

            {/* Official Rwandan Portals */}
            <div>
              <div className="font-bold text-[#434653] uppercase tracking-wider mb-2">
                Official Rwandan Portals
              </div>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="https://irembo.gov.rw"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-[#f8f9fa] rounded-xl border border-[#e1e3e4] hover:border-[#00327d] flex items-center gap-2 font-semibold text-[#00327d]"
                >
                  <span className="material-symbols-outlined text-base">open_in_new</span>
                  <span>IremboGov</span>
                </a>
                <a
                  href="https://rdb.rw"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 bg-[#f8f9fa] rounded-xl border border-[#e1e3e4] hover:border-[#00327d] flex items-center gap-2 font-semibold text-[#00327d]"
                >
                  <span className="material-symbols-outlined text-base">open_in_new</span>
                  <span>RDB Portal</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
