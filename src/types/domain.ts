/**
 * Mugenzi Domain Types - Clean Architecture Models
 * Designed for Rwandan Digital Citizen Companion with Grounded RAG
 */

export type AuthMethod = "google" | "phone" | "email";

export interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  nationalIdNumber?: string;
  avatarUrl: string;
  authMethod: AuthMethod;
  sector?: string; // Umurenge
  district?: string; // Akarere
}

export type StepStatus = "completed" | "active" | "locked";

export interface JourneyStep {
  stepNumber: number;
  title: string;
  description: string;
  requiredDocuments: string[];
  estimatedTime: string;
  cost: string; // e.g. "0 RWF", "5,000 RWF"
  institution: string; // e.g. "RDB", "Irembo", "RRA", "NIDA", "RSSB"
  status: StepStatus;
  completedAt?: string;
}

export interface CitizenJourney {
  id: string;
  title: string;
  subtitle: string;
  lifeEventId?: string;
  serviceId?: string;
  createdAt: string;
  progressPercentage: number;
  steps: JourneyStep[];
  aiInsight?: {
    title: string;
    quote: string;
  };
  sourceName?: string;
  sourceUrl?: string;
  lastVerified?: string;
}

export interface LifeEventTemplate {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: "business" | "family" | "property" | "education" | "legal" | "transport";
  partnerInstitution: string; // e.g. "RDB", "NIDA", "Irembo", "MINALOC", "RRA", "RNP"
  estimatedDuration: string;
  totalCost: string;
  stepsCount: number;
  featured?: boolean;
}

export type DocValidationStatus = "verified" | "pending" | "rejected" | "missing";

export interface DocumentItem {
  id: string;
  title: string;
  documentType: string;
  institution: string;
  fileSize: string;
  uploadedAt: string;
  status: DocValidationStatus;
  ocrConfidence?: number;
  extractedMetadata?: {
    holderName?: string;
    idNumber?: string;
    issueDate?: string;
    verificationCode?: string;
  };
  fileUrl?: string;
}

// ----------------------------------------------------
// Grounded RAG Knowledge Base & Structured Response Types
// ----------------------------------------------------

export type ProblemType =
  | "risk_prevention"
  | "recovery_replacement"
  | "procedure_execution"
  | "qualification_eligibility"
  | "life_event_planning"
  | "dispute_resolution_risk"
  | "general_inquiry";

export interface ProblemSolvingAnalysis {
  primary_intent: string;
  underlying_goal: string;
  problem_type: ProblemType;
  entities: string[];
  relevant_institutions: string[];
  relevant_services: string[];
  risks: string[];
  desired_outcome: string;
  missing_information?: string[];
  urgency?: "high" | "normal" | "low";
  confidence_score: number;
}

export interface PreventativeCheckItem {
  number: number;
  title: string;
  recommendation: string;
  why_it_matters: string;
  risk_addressed?: string;
}

export interface ProblemSolvingEvidenceSource {
  title: string;
  institution: string;
  relevance_reason: string;
  url?: string;
}

export interface GovernmentFeeItem {
  name: string;
  amountRwf: number;
  description: string;
}

export interface GovernmentServiceStep {
  number: number;
  title: string;
  explanation: string;
  documents?: string[];
  action?: string;
}

export interface CommonQuestion {
  question: string;
  answer: string;
}

export interface GovernmentServiceRecord {
  service_id: string;
  title: string;
  institution: string;
  category: string;
  description: string;
  eligibility: string[];
  required_documents: string[];
  requirements: string[];
  steps: GovernmentServiceStep[];
  fees: GovernmentFeeItem[];
  processing_time: string;
  application_method: string;
  official_url: string;
  related_services: string[];
  common_questions: CommonQuestion[];
  warnings: string[];
  source_name: string;
  source_url: string;
  last_verified: string;
  status: "active" | "inactive";
  intents?: string[];
  goals?: string[];
  problem_types?: ProblemType[];
  risks_addressed?: string[];
  preventative_measures?: string[];
  legal_protections?: string[];
  life_situations?: string[];
}

export interface RagStructuredResponse {
  answer: string;
  intent: string;
  service: string;
  needs_clarification: boolean;
  clarifying_question: string;
  steps: GovernmentServiceStep[];
  fees: GovernmentFeeItem[] | string[];
  processing_time: string;
  official_url: string;
  source_name: string;
  source_url: string;
  last_verified: string;
  is_verified_grounded?: boolean;

  // Problem-solving RAG enhancements
  analysis?: ProblemSolvingAnalysis;
  understanding?: string;
  before_you_act?: PreventativeCheckItem[];
  why_it_matters?: string;
  official_process_summary?: string;
  next_action?: {
    label: string;
    action_description: string;
    target_url?: string;
    institution: string;
  };
  sources?: ProblemSolvingEvidenceSource[];
  warnings?: string[];
  confidence_level?: "high" | "medium" | "low";
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  ragResponse?: RagStructuredResponse;
  suggestedAction?: {
    label: string;
    actionType: "open_journey" | "upload_doc" | "view_requirements" | "open_official_url";
    payload?: any;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  type: "journey_update" | "doc_verified" | "reminder" | "system";
  actionUrl?: string;
}

export interface InstitutionInfo {
  id: string;
  acronym: string;
  fullName: string;
  description: string;
  portalUrl: string;
  supportPhone: string;
}
