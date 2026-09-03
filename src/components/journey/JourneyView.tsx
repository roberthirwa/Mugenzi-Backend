import React, { useState } from "react";
import { useMugenzi } from "../../context/MugenziContext";
import { JourneyStep } from "../../types/domain";

interface JourneyViewProps {
  onOpenDocModal?: () => void;
}

export const JourneyView: React.FC<JourneyViewProps> = ({ onOpenDocModal }) => {
  const {
    activeJourney,
    journeys,
    setActiveJourneyId,
    completeStep,
    setActiveTab,
    prefillChatWithTopic,
    missingRequiredDocs,
  } = useMugenzi();

  const [selectedStepForDetails, setSelectedStepForDetails] = useState<JourneyStep | null>(null);
  const [isAdvancingStep, setIsAdvancingStep] = useState(false);

  if (!activeJourney) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-bold text-[#191c1d]">No active journey found</h3>
        <button
          onClick={() => setActiveTab("life_events")}
          className="mt-4 bg-[#00327d] text-white px-6 py-2 rounded-xl font-semibold"
        >
          Explore Life Events
        </button>
      </div>
    );
  }

  const activeStep = activeJourney.steps.find((s) => s.status === "active");

  const handleAdvanceActiveStep = (stepNumber: number) => {
    setIsAdvancingStep(true);
    setTimeout(() => {
      completeStep(activeJourney.id, stepNumber);
      setIsAdvancingStep(false);
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 mt-6 md:mt-10 pb-28">
      {/* Journey Selector Bar (if multiple journeys exist) */}
      {journeys.length > 1 && (
        <div className="mb-6 flex items-center justify-between bg-white p-3 rounded-2xl border border-[#e1e3e4] shadow-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00327d]">route</span>
            <span className="text-xs font-bold text-[#434653] uppercase tracking-wider">
              Active Roadmap:
            </span>
          </div>
          <select
            value={activeJourney.id}
            onChange={(e) => setActiveJourneyId(e.target.value)}
            className="bg-[#f3f4f5] text-xs font-bold text-[#00327d] py-1.5 px-3 rounded-xl border-none focus:ring-2 focus:ring-[#00327d]"
          >
            {journeys.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} ({j.progressPercentage}% complete)
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Header Content matching Stitch Design */}
      <div className="mb-10 text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#191c1d] tracking-tight">
            {activeJourney.title}
          </h2>
          <span className="bg-[#dae2ff] text-[#00327d] text-xs font-bold px-3 py-1 rounded-full">
            {activeJourney.progressPercentage}% Completed
          </span>
        </div>
        <p className="text-[#434653] text-base md:text-lg max-w-xl leading-relaxed">
          {activeJourney.subtitle}
        </p>

        {/* Missing Documents Alert Banner */}
        {missingRequiredDocs.length > 0 && activeStep && (
          <div className="mt-4 bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] p-3 rounded-xl flex items-center justify-between text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">warning</span>
              <span>
                Missing for current step: <strong>{missingRequiredDocs.slice(0, 2).join(", ")}</strong>
              </span>
            </div>
            <button
              onClick={() => setActiveTab("docs")}
              className="bg-[#ba1a1a] text-white px-3 py-1 rounded-lg text-[11px] font-bold hover:bg-[#93000a] transition-colors"
            >
              Upload Now
            </button>
          </div>
        )}
      </div>

      {/* Journey Canvas & Connected Timeline */}
      <div className="relative">
        {/* Timeline Connecting Line */}
        <div className="absolute left-6 top-8 bottom-8 w-[2px] z-0">
          <div className="timeline-line h-full w-full"></div>
        </div>

        {/* Steps List */}
        <div className="space-y-10 relative z-10">
          {activeJourney.steps.map((step) => {
            const isCompleted = step.status === "completed";
            const isActive = step.status === "active";
            const isLocked = step.status === "locked";

            if (isCompleted) {
              return (
                <div key={step.stepNumber} className="flex gap-6 group">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#22c55e] text-white flex items-center justify-center shadow-lg ring-4 ring-white">
                      <span
                        className="material-symbols-outlined filled-icon text-2xl"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 bg-white p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-[#e1e3e4] hover:shadow-md transition-all duration-300">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-display font-bold text-lg text-[#191c1d]">
                        {step.title}
                      </h3>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                        Completed
                      </span>
                    </div>
                    <p className="text-[#434653] text-sm leading-relaxed">
                      {step.description}
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-[#737784]">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">business</span>
                        {step.institution}
                      </span>
                      {step.completedAt && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          Verified on {step.completedAt}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            if (isActive) {
              return (
                <div key={step.stepNumber} className="flex gap-6 group">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#00327d] text-white flex items-center justify-center shadow-lg ring-4 ring-white pulse-glow">
                      <span
                        className="material-symbols-outlined filled-icon text-2xl"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        rocket_launch
                      </span>
                    </div>
                    {/* Top connection from previous step */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 h-10 w-[2px] bg-[#22c55e] -z-10"></div>
                  </div>

                  <div className="flex-1 bg-white p-6 md:p-8 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] border-2 border-[#00327d]/20 hover:border-[#00327d]/40 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-display font-bold text-xl text-[#191c1d]">
                          {step.title}
                        </h3>
                        <p className="text-[#434653] text-sm mt-1">{step.description}</p>
                      </div>
                      <span className="bg-[#0047ab] text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm">
                        Active
                      </span>
                    </div>

                    {/* Details Grid matching Stitch Design */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                      <div className="bg-[#f3f4f5] p-3 rounded-xl">
                        <p className="text-[#737784] text-[10px] font-bold uppercase tracking-tight mb-1">
                          Estimated Time
                        </p>
                        <div className="flex items-center gap-2 text-[#00327d]">
                          <span className="material-symbols-outlined text-lg">schedule</span>
                          <span className="font-bold text-sm">{step.estimatedTime}</span>
                        </div>
                      </div>

                      <div className="bg-[#f3f4f5] p-3 rounded-xl">
                        <p className="text-[#737784] text-[10px] font-bold uppercase tracking-tight mb-1">
                          Cost
                        </p>
                        <div className="flex items-center gap-2 text-[#00327d]">
                          <span className="material-symbols-outlined text-lg">payments</span>
                          <span className="font-bold text-sm">{step.cost}</span>
                        </div>
                      </div>

                      <div className="bg-[#f3f4f5] p-3 rounded-xl">
                        <p className="text-[#737784] text-[10px] font-bold uppercase tracking-tight mb-1">
                          Required
                        </p>
                        <div className="flex items-center gap-2 text-[#00327d]">
                          <span className="material-symbols-outlined text-lg">badge</span>
                          <span className="font-bold text-sm truncate">
                            {step.requiredDocuments.join(", ")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar inside card */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => {
                          if (onOpenDocModal) {
                            onOpenDocModal();
                          } else {
                            setActiveTab("docs");
                          }
                        }}
                        className="flex-1 bg-[#00327d] hover:bg-[#0047ab] text-white py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-[#00327d]/25"
                      >
                        <span className="material-symbols-outlined">upload_file</span>
                        Upload Documents
                      </button>

                      <button
                        onClick={() => setSelectedStepForDetails(step)}
                        className="flex-1 bg-[#f3f4f5] text-[#434653] hover:bg-[#e7e8e9] py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                      >
                        <span className="material-symbols-outlined">info</span>
                        View Requirements
                      </button>
                    </div>

                    {/* Complete Step Trigger */}
                    <div className="mt-4 pt-4 border-t border-[#e1e3e4] flex items-center justify-between">
                      <span className="text-xs text-[#737784]">
                        Responsible Institution: <strong>{step.institution}</strong>
                      </span>
                      <button
                        onClick={() => handleAdvanceActiveStep(step.stepNumber)}
                        disabled={isAdvancingStep}
                        className="text-xs font-bold text-[#00327d] hover:text-[#0047ab] flex items-center gap-1 hover:underline disabled:opacity-50"
                      >
                        {isAdvancingStep ? "Verifying..." : "Mark Step Complete →"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // Locked steps
            return (
              <div key={step.stepNumber} className="flex gap-6 opacity-60 grayscale group">
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#e7e8e9] text-[#737784] flex items-center justify-center shadow ring-4 ring-white">
                    <span className="material-symbols-outlined text-xl">lock</span>
                  </div>
                </div>
                <div className="flex-1 bg-[#f8f9fa] p-6 rounded-2xl border border-dashed border-[#c3c6d5]">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-display font-semibold text-base text-[#191c1d]">
                      {step.title}
                    </h3>
                    <span className="bg-[#e1e3e4] text-[#434653] px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                      Locked
                    </span>
                  </div>
                  <p className="text-[#434653] text-sm">{step.description}</p>
                  <div className="mt-2 text-xs text-[#737784]">
                    Unlocks upon completion of Step {step.stepNumber - 1}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ambient AI Insight Banner matching Stitch Design */}
      <div className="mt-14 bg-gradient-to-br from-[#00327d] to-[#0047ab] p-6 md:p-8 rounded-3xl text-white relative overflow-hidden shadow-xl shadow-[#00327d]/15">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30 shrink-0">
            <span
              className="material-symbols-outlined text-3xl filled-icon text-[#ffaa8a]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="font-display text-xl font-bold mb-1">
              {activeJourney.aiInsight?.title || "Mugenzi Assistant"}
            </h4>
            <p className="text-[#dae2ff] text-sm md:text-base leading-relaxed">
              {activeJourney.aiInsight?.quote ||
                '"I\'ve verified your details. Once you upload your ID, I can pre-fill your government forms in seconds."'}
            </p>
          </div>
          <button
            onClick={() =>
              prefillChatWithTopic(
                `Can you help me with Step ${activeStep?.stepNumber || 1} (${activeStep?.title || "registration"}) for ${activeJourney.title}?`
              )
            }
            className="bg-white text-[#00327d] hover:bg-[#dae2ff] px-6 py-3 rounded-full font-bold shadow-xl active:scale-95 transition-all text-sm shrink-0"
          >
            Chat Now
          </button>
        </div>
      </div>

      {/* Requirements Modal */}
      {selectedStepForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#e1e3e4] pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00327d]">
                  assignment
                </span>
                <h3 className="font-display font-bold text-lg text-[#191c1d]">
                  Step {selectedStepForDetails.stepNumber}: Requirements
                </h3>
              </div>
              <button
                onClick={() => setSelectedStepForDetails(null)}
                className="w-8 h-8 rounded-full hover:bg-[#f3f4f5] flex items-center justify-center text-[#434653]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4 text-sm text-[#434653]">
              <div>
                <h4 className="font-bold text-[#191c1d] mb-1">{selectedStepForDetails.title}</h4>
                <p>{selectedStepForDetails.description}</p>
              </div>

              <div className="bg-[#f8f9fa] p-4 rounded-xl space-y-2 border border-[#e1e3e4]">
                <h5 className="font-bold text-xs uppercase tracking-wider text-[#00327d]">
                  Required Documents Checklist
                </h5>
                <ul className="space-y-1.5">
                  {selectedStepForDetails.requiredDocuments.map((doc, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#00327d] text-base">
                        check_box
                      </span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#f3f4f5] rounded-xl">
                  <span className="text-[#737784] block">Authority</span>
                  <strong className="text-[#00327d]">{selectedStepForDetails.institution}</strong>
                </div>
                <div className="p-3 bg-[#f3f4f5] rounded-xl">
                  <span className="text-[#737784] block">Processing Fee</span>
                  <strong className="text-[#00327d]">{selectedStepForDetails.cost}</strong>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setSelectedStepForDetails(null)}
                className="px-4 py-2 text-sm font-semibold text-[#434653] hover:bg-[#f3f4f5] rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedStepForDetails(null);
                  setActiveTab("docs");
                }}
                className="px-5 py-2 text-sm font-bold bg-[#00327d] text-white rounded-xl hover:bg-[#0047ab]"
              >
                Upload Required Docs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
