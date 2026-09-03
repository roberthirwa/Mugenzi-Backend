import React, { useState } from "react";
import { useMugenzi } from "../../context/MugenziContext";
import { GovernmentServiceRecord } from "../../types/domain";

export const KnowledgeBaseAdminView: React.FC = () => {
  const {
    ragServices,
    updateRagService,
    addRagService,
    toggleRagService,
    deleteRagService,
    prefillChatWithTopic,
  } = useMugenzi();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [editingService, setEditingService] = useState<GovernmentServiceRecord | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  const categories = ["All", ...Array.from(new Set(ragServices.map((s) => s.category)))];

  const filteredServices = ragServices.filter((s) => {
    const matchesCat = selectedCategory === "All" || s.category === selectedCategory;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.service_id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleToggle = async (id: string) => {
    await toggleRagService(id);
    setSaveSuccessMsg("Status updated successfully!");
    setTimeout(() => setSaveSuccessMsg(""), 3000);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    if (isAddingNew) {
      await addRagService(editingService);
      setSaveSuccessMsg(`Service "${editingService.title}" created successfully!`);
    } else {
      await updateRagService(editingService.service_id, editingService);
      setSaveSuccessMsg(`Service "${editingService.title}" updated successfully!`);
    }

    setEditingService(null);
    setIsAddingNew(false);
    setTimeout(() => setSaveSuccessMsg(""), 3000);
  };

  const handleAddNewClick = () => {
    const newTemplate: GovernmentServiceRecord = {
      service_id: `gov_${Date.now()}`,
      title: "",
      institution: "IremboGov",
      category: "Civil Registration",
      description: "",
      eligibility: ["Rwandan citizen aged 18+"],
      required_documents: ["National ID Card"],
      requirements: ["Online application via official portal"],
      steps: [
        {
          number: 1,
          title: "Online Submission",
          explanation: "Submit online application form.",
          documents: ["National ID"],
          action: "Apply Online",
        },
      ],
      fees: [{ name: "Standard Service Fee", amountRwf: 500, description: "Statutory processing fee" }],
      processing_time: "1-2 working days",
      application_method: "100% Digital via IremboGov",
      official_url: "https://irembo.gov.rw",
      related_services: [],
      common_questions: [],
      warnings: [],
      source_name: "Official Rwanda Government Knowledge Base",
      source_url: "https://irembo.gov.rw",
      last_verified: new Date().toISOString().split("T")[0],
      status: "active",
    };
    setEditingService(newTemplate);
    setIsAddingNew(true);
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-4 md:px-8 py-8 space-y-6 pb-32">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dae2ff] text-[#00327d] text-xs font-bold mb-1">
            <span className="material-symbols-outlined text-[16px]">database</span>
            <span>RAG Grounding Catalog</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[#00327d]">
            Rwanda Government Knowledge Base
          </h1>
          <p className="text-sm text-[#434653]">
            Curated and verified repository of official Rwandan public services powering Mugenzi RAG.
          </p>
        </div>

        <button
          onClick={handleAddNewClick}
          className="bg-[#00327d] hover:bg-[#0047ab] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add Official Service</span>
        </button>
      </div>

      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#e1e3e4] ambient-shadow flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737784] text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search procedures, institutions, IDs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#e1e3e4] focus:outline-none focus:border-[#00327d]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-[#00327d] text-white"
                  : "bg-[#f0f4f8] text-[#434653] hover:bg-[#e1e3e4]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((svc) => (
          <div
            key={svc.service_id}
            className={`bg-white rounded-2xl border p-5 space-y-3 transition-all flex flex-col justify-between ${
              svc.status === "active"
                ? "border-[#e1e3e4] hover:border-[#00327d]/40 shadow-xs"
                : "border-rose-200 bg-rose-50/20 opacity-75"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#dae2ff] text-[#00327d]">
                  {svc.category}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    svc.status === "active"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {svc.status.toUpperCase()}
                </span>
              </div>

              <h3 className="font-bold text-sm text-[#191c1d] leading-snug line-clamp-2">
                {svc.title}
              </h3>
              <div className="text-xs text-[#00327d] font-semibold">{svc.institution}</div>
              <p className="text-xs text-[#434653] line-clamp-3 leading-relaxed">
                {svc.description}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-[#f0f4f8]">
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-[#f8f9fa] rounded-lg">
                  <div className="text-[#737784] font-medium">Timeline</div>
                  <div className="font-bold text-[#191c1d] truncate">{svc.processing_time}</div>
                </div>
                <div className="p-2 bg-[#f8f9fa] rounded-lg">
                  <div className="text-[#737784] font-medium">Fee</div>
                  <div className="font-bold text-[#191c1d] truncate">
                    {svc.fees.length > 0
                      ? svc.fees[0].amountRwf === 0
                        ? "Free (0 RWF)"
                        : `${svc.fees[0].amountRwf.toLocaleString()} RWF`
                      : "0 RWF"}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#737784]">
                <div>Verified: {svc.last_verified}</div>
                <div>{svc.steps.length} Steps</div>
              </div>

              <div className="flex items-center gap-1.5 pt-1">
                <button
                  onClick={() => prefillChatWithTopic(`Tell me how to apply for ${svc.title}`)}
                  className="flex-1 bg-[#dae2ff] hover:bg-[#00327d] hover:text-white text-[#00327d] py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                  title="Test in Chat"
                >
                  <span className="material-symbols-outlined text-sm">chat</span>
                  <span>Test in Chat</span>
                </button>

                <button
                  onClick={() => {
                    setEditingService(svc);
                    setIsAddingNew(false);
                  }}
                  className="p-1.5 bg-[#f0f4f8] hover:bg-[#e1e3e4] text-[#434653] rounded-lg transition-colors"
                  title="Edit Service"
                >
                  <span className="material-symbols-outlined text-base">edit</span>
                </button>

                <button
                  onClick={() => handleToggle(svc.service_id)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    svc.status === "active"
                      ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                      : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                  }`}
                  title={svc.status === "active" ? "Deactivate" : "Activate"}
                >
                  <span className="material-symbols-outlined text-base">
                    {svc.status === "active" ? "block" : "check"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 ambient-shadow animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#e1e3e4]">
              <h2 className="font-bold text-lg text-[#00327d]">
                {isAddingNew ? "Add New Official Service" : `Edit Service: ${editingService.title}`}
              </h2>
              <button
                onClick={() => setEditingService(null)}
                className="w-8 h-8 rounded-full bg-[#f0f4f8] text-[#434653] flex items-center justify-center hover:bg-[#e1e3e4]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#434653] block mb-1">Service ID (Unique)</label>
                  <input
                    type="text"
                    required
                    disabled={!isAddingNew}
                    value={editingService.service_id}
                    onChange={(e) =>
                      setEditingService({ ...editingService, service_id: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-[#e1e3e4] bg-[#f8f9fa] disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#434653] block mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={editingService.category}
                    onChange={(e) =>
                      setEditingService({ ...editingService, category: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-[#e1e3e4]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#434653] block mb-1">Official Service Title</label>
                <input
                  type="text"
                  required
                  value={editingService.title}
                  onChange={(e) =>
                    setEditingService({ ...editingService, title: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-[#e1e3e4]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#434653] block mb-1">Responsible Institution</label>
                  <input
                    type="text"
                    required
                    value={editingService.institution}
                    onChange={(e) =>
                      setEditingService({ ...editingService, institution: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-[#e1e3e4]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#434653] block mb-1">Expected Processing Time</label>
                  <input
                    type="text"
                    required
                    value={editingService.processing_time}
                    onChange={(e) =>
                      setEditingService({ ...editingService, processing_time: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-[#e1e3e4]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#434653] block mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingService.description}
                  onChange={(e) =>
                    setEditingService({ ...editingService, description: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-[#e1e3e4]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#434653] block mb-1">Official Portal URL</label>
                  <input
                    type="url"
                    value={editingService.official_url}
                    onChange={(e) =>
                      setEditingService({ ...editingService, official_url: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-[#e1e3e4]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#434653] block mb-1">Source Name</label>
                  <input
                    type="text"
                    value={editingService.source_name}
                    onChange={(e) =>
                      setEditingService({ ...editingService, source_name: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-[#e1e3e4]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 text-xs font-bold text-[#434653] hover:bg-[#f0f4f8] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#00327d] hover:bg-[#0047ab] text-white px-5 py-2.5 text-xs font-bold rounded-xl shadow-sm"
                >
                  Save to Knowledge Base
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
