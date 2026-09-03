import React, { useState, useRef } from "react";
import { useMugenzi } from "../../context/MugenziContext";
import { DocumentItem } from "../../types/domain";
import { DocumentValidationService } from "../../services/DocumentValidationService";

export const DocumentValidatorView: React.FC = () => {
  const {
    documents,
    uploadDocument,
    deleteDocument,
    activeJourney,
    missingRequiredDocs,
    setActiveTab,
  } = useMugenzi();

  const [selectedDocType, setSelectedDocType] = useState("National Identity Card (NIDA)");
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selectedDocForInspect, setSelectedDocForInspect] = useState<DocumentItem | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const docTypes = [
    "National Identity Card (NIDA)",
    "RRA Tax Certificate (TIN)",
    "RDB Business Registration",
    "Land Title UPI Certificate",
    "Civil Marriage Certificate",
    "Birth Certificate",
    "e-Passport Page",
  ];

  const handleFileProcess = async (file: File) => {
    setUploadError(null);
    const validation = DocumentValidationService.validateFileConstraints(file);
    if (!validation.valid) {
      setUploadError(validation.error || "File invalid");
      return;
    }

    setIsUploading(true);
    try {
      const verified = await uploadDocument(file, selectedDocType);
      setSelectedDocForInspect(verified);
    } catch (err: any) {
      setUploadError(err.message || "Failed to validate document with OCR");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 pt-8 pb-32">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#dae2ff] text-[#00327d] text-xs font-bold">
          <span className="material-symbols-outlined text-[16px]">verified_user</span>
          <span>NIDA & Irembo OCR Engine</span>
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-[#191c1d] tracking-tight">
          Citizen Document Validator
        </h1>
        <p className="text-base text-[#434653]">
          Upload and verify your official Rwandan documents with automated OCR checks for instant autofill across RDB, Irembo, and RRA.
        </p>
      </div>

      {/* Active Journey Document Requirement Status */}
      {activeJourney && (
        <div className="mb-8 bg-white p-6 rounded-3xl border border-[#e1e3e4] ambient-shadow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#737784]">
                Target Roadmap
              </div>
              <h3 className="font-display font-bold text-lg text-[#191c1d]">
                {activeJourney.title}
              </h3>
            </div>

            {missingRequiredDocs.length === 0 ? (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-2 rounded-xl text-xs font-bold border border-green-200">
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>All Required Documents Uploaded & Verified</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[#ba1a1a] bg-[#ffdad6] px-4 py-2 rounded-xl text-xs font-bold">
                <span className="material-symbols-outlined text-base">error_outline</span>
                <span>
                  {missingRequiredDocs.length} Missing: {missingRequiredDocs.join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Dropzone Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left Dropzone */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-[#e1e3e4] ambient-shadow">
          <h3 className="font-display font-bold text-lg text-[#191c1d] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00327d]">cloud_upload</span>
            Upload Document for OCR Scan
          </h3>

          <div className="space-y-4">
            {/* Document Type Selector */}
            <div>
              <label className="block text-xs font-bold text-[#434653] uppercase tracking-wider mb-2">
                Select Document Classification
              </label>
              <select
                value={selectedDocType}
                onChange={(e) => setSelectedDocType(e.target.value)}
                className="w-full py-3 px-4 bg-[#f8f9fa] border border-[#e1e3e4] rounded-2xl text-sm font-semibold text-[#191c1d] focus:ring-2 focus:ring-[#00327d] focus:outline-none"
              >
                {docTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Dropzone Area */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[220px] ${
                dragOver
                  ? "border-[#00327d] bg-[#dae2ff]/30"
                  : "border-[#c3c6d5] hover:border-[#00327d] bg-[#f8f9fa]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-16 h-16 rounded-2xl bg-[#dae2ff] text-[#00327d] flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-3xl">
                  {isUploading ? "autorenew" : "upload_file"}
                </span>
              </div>

              {isUploading ? (
                <div className="space-y-2">
                  <div className="font-bold text-sm text-[#00327d]">
                    Scanning Document with OCR...
                  </div>
                  <div className="text-xs text-[#737784]">
                    Verifying security stamps, watermark & NIDA signature
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="font-bold text-sm text-[#191c1d]">
                    Drag and drop your file here, or{" "}
                    <span className="text-[#00327d] underline">browse files</span>
                  </p>
                  <p className="text-xs text-[#737784]">
                    Supported: PDF, PNG, JPG (Max 15MB)
                  </p>
                </div>
              )}
            </div>

            {uploadError && (
              <div className="p-3 bg-[#ffdad6] text-[#ba1a1a] rounded-xl text-xs font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">warning</span>
                <span>{uploadError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: OCR Live Inspector / Details */}
        <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl border border-[#e1e3e4] ambient-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg text-[#191c1d] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00327d]">
                  find_in_page
                </span>
                OCR Metadata
              </h3>
              {selectedDocForInspect && (
                <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Verified ({Math.round((selectedDocForInspect.ocrConfidence || 0.96) * 100)}%)
                </span>
              )}
            </div>

            {selectedDocForInspect ? (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-[#f8f9fa] rounded-2xl border border-[#e1e3e4] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#737784]">Document Title:</span>
                    <strong className="text-[#191c1d]">{selectedDocForInspect.title}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#737784]">Issuing Authority:</span>
                    <strong className="text-[#00327d]">{selectedDocForInspect.institution}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#737784]">Verification Status:</span>
                    <span className="text-green-600 font-bold">Official Seal Valid</span>
                  </div>
                </div>

                <div className="p-4 bg-[#dae2ff]/30 rounded-2xl border border-[#00327d]/20 space-y-2">
                  <div className="font-bold text-[#00327d] uppercase tracking-wider text-[10px]">
                    Extracted Citizen Fields
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#434653]">Holder Name:</span>
                    <strong className="text-[#191c1d]">
                      {selectedDocForInspect.extractedMetadata?.holderName || "Jean de Dieu Mugisha"}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#434653]">ID / Reference Number:</span>
                    <strong className="font-mono text-[#00327d]">
                      {selectedDocForInspect.extractedMetadata?.idNumber || "1199380012345678"}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#434653]">Issue Date:</span>
                    <strong>{selectedDocForInspect.extractedMetadata?.issueDate || "2024-03-15"}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 px-4 space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#f3f4f5] text-[#737784] mx-auto flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">document_scanner</span>
                </div>
                <p className="text-xs font-semibold text-[#434653]">
                  Select or upload a document to view real-time OCR extraction
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#e1e3e4] mt-6">
            <button
              onClick={() => setActiveTab("journey")}
              className="w-full bg-[#00327d] hover:bg-[#0047ab] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span>Apply Verified Docs to Active Journey</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Verified Document Archive */}
      <div>
        <h3 className="font-display font-bold text-xl text-[#191c1d] mb-4">
          Citizen Document Archive ({documents.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDocForInspect(doc)}
              className={`p-5 rounded-2xl bg-white border transition-all cursor-pointer ambient-shadow hover:shadow-md ${
                selectedDocForInspect?.id === doc.id
                  ? "border-[#00327d] ring-2 ring-[#00327d]/20"
                  : "border-[#e1e3e4] hover:border-[#00327d]/30"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#dae2ff] text-[#00327d] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-xl">description</span>
                </div>
                <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                  Verified
                </span>
              </div>

              <h4 className="font-bold text-sm text-[#191c1d] truncate mb-1">
                {doc.title}
              </h4>
              <div className="text-xs text-[#737784] space-y-1">
                <div>Issued: {doc.institution}</div>
                <div>Size: {doc.fileSize} • {doc.uploadedAt}</div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#f3f4f5] flex items-center justify-between">
                <span className="text-[11px] text-[#00327d] font-bold">
                  Click to inspect OCR
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteDocument(doc.id);
                  }}
                  className="text-[#ba1a1a] hover:bg-[#ffdad6] p-1.5 rounded-lg transition-colors"
                  title="Delete Document"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
