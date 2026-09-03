import React, { useState } from "react";
import { RagStructuredResponse } from "../../types/domain";
import { useMugenzi } from "../../context/MugenziContext";

interface RagResponseCardProps {
  rag: RagStructuredResponse;
}

export const RagResponseCard: React.FC<RagResponseCardProps> = ({ rag }) => {
  const { createJourneyFromRagResponse, sendMessageToAI } = useMugenzi();
  const [showAllSteps, setShowAllSteps] = useState(false);
  const [showSources, setShowSources] = useState(false);

  const stepsToDisplay = showAllSteps ? rag.steps : (rag.steps || []).slice(0, 3);

  const formattedFees = Array.isArray(rag.fees)
    ? rag.fees.map((f: any) => {
        if (typeof f === "string") return f;
        return `${f.name}: ${f.amountRwf === 0 ? "Free (0 RWF)" : `${f.amountRwf.toLocaleString()} RWF`}`;
      })
    : [];

  return (
    <div className="mt-3 bg-[#f8f9fa] rounded-2xl p-4 md:p-5 border border-[#e1e3e4] space-y-4 shadow-sm text-[#191c1d]">
      {/* Grounded Badge Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#e1e3e4]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-[#00327d] uppercase tracking-wider">
            {rag.service || "Grounded Government Service"}
          </span>
        </div>
        <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#434653] bg-white px-2.5 py-1 rounded-full border border-[#e1e3e4]">
          <span className="material-symbols-outlined text-[14px] text-emerald-600">verified_user</span>
          <span>Official Rwandan Regulation</span>
        </div>
      </div>

      {/* Problem-Solving Understanding Section */}
      {rag.understanding && (
        <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#00327d]">
            <span className="material-symbols-outlined text-[16px]">psychology</span>
            <span>Citizen Situation & Objective</span>
          </div>
          <p className="text-[#2b3b4f] leading-relaxed">{rag.understanding}</p>
        </div>
      )}

      {/* Clarification Alert (if query requires user intent distinction) */}
      {rag.needs_clarification && rag.clarifying_question && (
        <div className="p-3.5 bg-[#fff8e1] rounded-xl border border-[#ffe082] text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-[#8d6e00]">
            <span className="material-symbols-outlined text-base">help</span>
            <span>Clarification Needed for Precise Guidance</span>
          </div>
          <p className="text-[#5d4037] leading-relaxed">{rag.clarifying_question}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {rag.service.toLowerCase().includes("business") && (
              <>
                <button
                  onClick={() => sendMessageToAI("I want to register an Individual Enterprise (Sole Proprietorship)")}
                  className="px-2.5 py-1 bg-white hover:bg-[#00327d] hover:text-white rounded-lg text-xs font-semibold border border-[#d7ccc8] transition-colors"
                >
                  Individual Enterprise (Sole)
                </button>
                <button
                  onClick={() => sendMessageToAI("I want to register a Limited Liability Company (Ltd)")}
                  className="px-2.5 py-1 bg-white hover:bg-[#00327d] hover:text-white rounded-lg text-xs font-semibold border border-[#d7ccc8] transition-colors"
                >
                  Limited Liability (Ltd)
                </button>
              </>
            )}
            {rag.service.toLowerCase().includes("vehicle") && (
              <>
                <button
                  onClick={() => sendMessageToAI("This is a newly imported motor vehicle cleared through customs")}
                  className="px-2.5 py-1 bg-white hover:bg-[#00327d] hover:text-white rounded-lg text-xs font-semibold border border-[#d7ccc8] transition-colors"
                >
                  Newly Imported Vehicle
                </button>
                <button
                  onClick={() => sendMessageToAI("This is a locally bought vehicle undergoing ownership transfer")}
                  className="px-2.5 py-1 bg-white hover:bg-[#00327d] hover:text-white rounded-lg text-xs font-semibold border border-[#d7ccc8] transition-colors"
                >
                  Local Ownership Transfer
                </button>
              </>
            )}
            {rag.service.toLowerCase().includes("passport") && (
              <>
                <button
                  onClick={() => sendMessageToAI("I am applying for my first Rwandan e-Passport")}
                  className="px-2.5 py-1 bg-white hover:bg-[#00327d] hover:text-white rounded-lg text-xs font-semibold border border-[#d7ccc8] transition-colors"
                >
                  First-Time Passport
                </button>
                <button
                  onClick={() => sendMessageToAI("I want to renew my existing Rwandan passport")}
                  className="px-2.5 py-1 bg-white hover:bg-[#00327d] hover:text-white rounded-lg text-xs font-semibold border border-[#d7ccc8] transition-colors"
                >
                  Passport Renewal
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Preventative Measures / Pre-Action Checklist ("Before You Act") */}
      {rag.before_you_act && rag.before_you_act.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#00327d] uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-amber-600">shield</span>
              <span>Essential Safeguards & Precautions ({rag.before_you_act.length})</span>
            </span>
          </div>
          <div className="space-y-2">
            {rag.before_you_act.map((check) => (
              <div
                key={check.number}
                className="p-3 bg-amber-50/40 rounded-xl border border-amber-200/70 text-xs space-y-1"
              >
                <div className="flex items-center gap-2 font-bold text-[#191c1d]">
                  <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-[10px] shrink-0 font-bold">
                    {check.number}
                  </span>
                  <span>{check.title}</span>
                </div>
                <p className="text-[#3b3426] pl-6 leading-relaxed">{check.recommendation}</p>
                {check.why_it_matters && (
                  <div className="pl-6 text-[11px] text-[#6d4c41] bg-amber-100/50 p-1.5 rounded-lg mt-1 border border-amber-200/50">
                    <span className="font-semibold text-amber-900">Why it matters: </span>
                    {check.why_it_matters}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Why This Matters / Legal Basis */}
      {rag.why_it_matters && (
        <div className="p-3 bg-[#e8f0fe] rounded-xl border border-[#c2e7ff] text-xs space-y-1 text-[#001d35]">
          <div className="flex items-center gap-1.5 font-bold text-[#00327d]">
            <span className="material-symbols-outlined text-[16px]">gavel</span>
            <span>Legal Rationale & Statutory Basis</span>
          </div>
          <p className="text-[11.5px] leading-relaxed">{rag.why_it_matters}</p>
        </div>
      )}

      {/* Official Step-by-Step Roadmap */}
      {rag.steps && rag.steps.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-bold text-[#434653] uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#00327d]">format_list_numbered</span>
            <span>Official Execution Process ({rag.steps.length} Steps)</span>
          </div>
          <div className="space-y-2">
            {stepsToDisplay.map((st) => (
              <div
                key={st.number}
                className="p-3 bg-white rounded-xl border border-[#e1e3e4] text-xs space-y-1.5 shadow-2xs"
              >
                <div className="flex items-center gap-2 font-bold text-[#191c1d]">
                  <span className="w-5 h-5 rounded-full bg-[#dae2ff] text-[#00327d] flex items-center justify-center text-[11px] shrink-0 font-bold">
                    {st.number}
                  </span>
                  <span>{st.title}</span>
                </div>
                <p className="text-[#434653] pl-7 leading-relaxed">{st.explanation}</p>
                {st.documents && st.documents.length > 0 && (
                  <div className="pl-7 flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-bold text-[#737784]">Required:</span>
                    {st.documents.map((doc, dIdx) => (
                      <span
                        key={dIdx}
                        className="bg-[#f0f4f8] text-[#00327d] px-2 py-0.5 rounded text-[10px] font-medium"
                      >
                        {doc}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {rag.steps.length > 3 && (
            <button
              onClick={() => setShowAllSteps(!showAllSteps)}
              className="text-xs font-bold text-[#00327d] hover:underline flex items-center gap-1 pl-1 pt-1"
            >
              <span>{showAllSteps ? "Show Less" : `View all ${rag.steps.length} steps`}</span>
              <span className="material-symbols-outlined text-[16px]">
                {showAllSteps ? "expand_less" : "expand_more"}
              </span>
            </button>
          )}
        </div>
      )}

      {/* Official Warnings */}
      {rag.warnings && rag.warnings.length > 0 && (
        <div className="p-3 bg-red-50/70 rounded-xl border border-red-200 text-xs space-y-1 text-red-950">
          <div className="flex items-center gap-1.5 font-bold text-red-700">
            <span className="material-symbols-outlined text-[16px]">warning</span>
            <span>Official Legal & Safety Warnings</span>
          </div>
          <ul className="list-disc pl-4 space-y-0.5 text-[11.5px] text-red-900">
            {rag.warnings.map((w, wIdx) => (
              <li key={wIdx}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Fees & Processing Time Summary Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        <div className="p-3 bg-white rounded-xl border border-[#e1e3e4] space-y-1">
          <div className="text-[10px] font-bold text-[#737784] uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-[#00327d]">payments</span>
            <span>Official Statutory Fees</span>
          </div>
          <div className="text-xs font-bold text-[#191c1d]">
            {formattedFees.length > 0 ? formattedFees[0] : "0 RWF"}
          </div>
          {formattedFees.length > 1 && (
            <div className="text-[10px] text-[#737784]">{formattedFees.slice(1).join(" • ")}</div>
          )}
        </div>

        <div className="p-3 bg-white rounded-xl border border-[#e1e3e4] space-y-1">
          <div className="text-[10px] font-bold text-[#737784] uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-[#00327d]">schedule</span>
            <span>Expected Timeline</span>
          </div>
          <div className="text-xs font-bold text-[#191c1d]">
            {rag.processing_time || "1-2 business days"}
          </div>
        </div>
      </div>

      {/* Multi-Source Institutional Evidence Accordion */}
      {rag.sources && rag.sources.length > 0 && (
        <div className="pt-1">
          <button
            onClick={() => setShowSources(!showSources)}
            className="w-full flex items-center justify-between p-2.5 bg-white rounded-xl border border-[#e1e3e4] text-xs font-bold text-[#434653] hover:text-[#00327d] transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
              <span>Grounded in {rag.sources.length} Official Government Sources</span>
            </div>
            <span className="material-symbols-outlined text-[16px]">
              {showSources ? "expand_less" : "expand_more"}
            </span>
          </button>
          {showSources && (
            <div className="mt-2 p-3 bg-white rounded-xl border border-[#e1e3e4] space-y-2 text-xs">
              {rag.sources.map((src, sIdx) => (
                <div key={sIdx} className="pb-2 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#00327d]">{src.institution}</span>
                    {src.url && (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5"
                      >
                        <span>Portal</span>
                        <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                      </a>
                    )}
                  </div>
                  <div className="text-[11px] font-medium text-gray-800">{src.title}</div>
                  <div className="text-[10px] text-gray-500">{src.relevance_reason}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Official Actions & Roadmap Creation */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={() => createJourneyFromRagResponse(rag)}
          className="bg-[#00327d] hover:bg-[#0047ab] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">add_task</span>
          <span>Convert to Step-by-Step Journey</span>
        </button>

        {rag.official_url && (
          <a
            href={rag.official_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#00327d] bg-white hover:bg-[#dae2ff] px-3 py-2 rounded-xl border border-[#e1e3e4] transition-colors"
          >
            <span>Open Official Portal</span>
            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </a>
        )}
      </div>

      {/* Grounding Source & Last Verified Date Footer */}
      <div className="pt-2 border-t border-[#e1e3e4] flex items-center justify-between text-[11px] text-[#737784]">
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px] text-[#00327d]">policy</span>
          <span>Source: {rag.source_name || "Official Rwanda Government Knowledge Base"}</span>
        </div>
        <div>Verified: {rag.last_verified || "2026-08-01"}</div>
      </div>
    </div>
  );
};
