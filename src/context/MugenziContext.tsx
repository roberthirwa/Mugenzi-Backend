import React, { createContext, useContext, useState, useEffect } from "react";
import {
  AuthMethod,
  ChatMessage,
  CitizenJourney,
  DocumentItem,
  LifeEventTemplate,
  NotificationItem,
  UserProfile,
  RagStructuredResponse,
  GovernmentServiceRecord,
} from "../types/domain";
import {
  MOCK_DOCUMENTS,
  MOCK_LAND_JOURNEY,
  MOCK_NOTIFICATIONS,
  MOCK_STARTING_BUSINESS_JOURNEY,
  MOCK_USER_PROFILE,
  RWANDA_LIFE_EVENTS,
} from "../data/mockRwandaData";
import { AIService } from "../services/AIService";
import { JourneyService } from "../services/JourneyService";
import { DocumentValidationService } from "../services/DocumentValidationService";
import { NotificationService } from "../services/NotificationService";

export type MugenziTab = "journey" | "chat" | "docs" | "life_events" | "profile" | "admin";

interface MugenziContextType {
  // Navigation
  activeTab: MugenziTab;
  setActiveTab: (tab: MugenziTab) => void;

  // Authentication & Profile
  userProfile: UserProfile;
  isLoggedIn: boolean;
  loginWithMethod: (method: AuthMethod, credential?: string) => void;
  logout: () => void;

  // Journeys
  journeys: CitizenJourney[];
  activeJourneyId: string;
  activeJourney: CitizenJourney | undefined;
  setActiveJourneyId: (id: string) => void;
  completeStep: (journeyId: string, stepNumber: number) => void;
  createJourneyFromAI: (title: string, description: string, serviceId?: string) => Promise<CitizenJourney>;
  createJourneyFromRagResponse: (rag: RagStructuredResponse) => CitizenJourney;
  createJourneyFromTemplate: (template: LifeEventTemplate) => CitizenJourney;

  // Documents & Validator
  documents: DocumentItem[];
  uploadDocument: (file: File, docType: string) => Promise<DocumentItem>;
  deleteDocument: (id: string) => void;
  missingRequiredDocs: string[];

  // Chat & AI Assistant
  chatHistory: ChatMessage[];
  isAiThinking: boolean;
  sendMessageToAI: (text: string) => Promise<void>;
  prefillChatWithTopic: (topic: string) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Life Events
  lifeEvents: LifeEventTemplate[];

  // Knowledge Base Administration
  ragServices: GovernmentServiceRecord[];
  refreshRagServices: () => Promise<void>;
  addRagService: (service: GovernmentServiceRecord) => Promise<GovernmentServiceRecord | null>;
  updateRagService: (id: string, updates: Partial<GovernmentServiceRecord>) => Promise<GovernmentServiceRecord | null>;
  toggleRagService: (id: string) => Promise<GovernmentServiceRecord | null>;
  deleteRagService: (id: string) => Promise<boolean>;
}

const MugenziContext = createContext<MugenziContextType | undefined>(undefined);

export const MugenziProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeTab, setActiveTab] = useState<MugenziTab>("journey");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile>(MOCK_USER_PROFILE);

  const [journeys, setJourneys] = useState<CitizenJourney[]>([
    MOCK_STARTING_BUSINESS_JOURNEY,
    MOCK_LAND_JOURNEY,
  ]);
  const [activeJourneyId, setActiveJourneyId] = useState<string>(
    MOCK_STARTING_BUSINESS_JOURNEY.id
  );

  const [documents, setDocuments] = useState<DocumentItem[]>(MOCK_DOCUMENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    MOCK_NOTIFICATIONS
  );

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: "msg-init-1",
      sender: "ai",
      text: "Mwaramutse, Citizen! I am Mugenzi, your grounded Rwandan Digital Citizen Companion. My answers are strictly grounded in official services across IremboGov, RDB, NIDA, RRA, and National Land Authority. How can I assist you today?",
      timestamp: "10:00 AM",
    },
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [ragServices, setRagServices] = useState<GovernmentServiceRecord[]>([]);

  const activeJourney = journeys.find((j) => j.id === activeJourneyId) || journeys[0];

  const unreadNotificationCount =
    NotificationService.getUnreadCount(notifications);

  const missingRequiredDocs = activeJourney
    ? JourneyService.getMissingDocuments(
        activeJourney,
        documents.map((d) => d.title)
      )
    : [];

  const refreshRagServices = async () => {
    const services = await AIService.fetchKnowledgeBaseServices(true);
    setRagServices(services);
  };

  useEffect(() => {
    refreshRagServices();
  }, []);

  const loginWithMethod = (method: AuthMethod, credential?: string) => {
    setIsLoggedIn(true);
    setUserProfile((prev) => ({
      ...prev,
      authMethod: method,
      email: credential && credential.includes("@") ? credential : prev.email,
      phone: credential && !credential.includes("@") ? credential : prev.phone,
    }));
    const notif = NotificationService.createNotification(
      "Signed in via Firebase Auth",
      `Welcome back, ${userProfile.fullName}! Authenticated using ${method.toUpperCase()}.`,
      "system"
    );
    setNotifications((prev) => [notif, ...prev]);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const completeStep = (journeyId: string, stepNumber: number) => {
    setJourneys((prev) =>
      prev.map((journey) => {
        if (journey.id !== journeyId) return journey;
        const updated = JourneyService.completeStep(journey, stepNumber);
        return updated;
      })
    );

    const stepObj = activeJourney?.steps.find((s) => s.stepNumber === stepNumber);
    const notif = NotificationService.createNotification(
      "Journey Milestone Achieved!",
      `You completed "${stepObj?.title || `Step ${stepNumber}`}" in ${activeJourney?.title || "your journey"}.`,
      "journey_update"
    );
    setNotifications((prev) => [notif, ...prev]);
  };

  const createJourneyFromAI = async (
    title: string,
    description: string,
    serviceId?: string
  ): Promise<CitizenJourney> => {
    setIsAiThinking(true);
    try {
      const newJourney = await AIService.generateJourney(title, description, serviceId);
      setJourneys((prev) => [newJourney, ...prev]);
      setActiveJourneyId(newJourney.id);
      setActiveTab("journey");

      const notif = NotificationService.createNotification(
        "New Roadmap Initialized",
        `Created step-by-step roadmap for "${newJourney.title}".`,
        "journey_update"
      );
      setNotifications((prev) => [notif, ...prev]);
      return newJourney;
    } finally {
      setIsAiThinking(false);
    }
  };

  const createJourneyFromRagResponse = (rag: RagStructuredResponse): CitizenJourney => {
    const feeStr = Array.isArray(rag.fees) && rag.fees.length > 0
      ? typeof rag.fees[0] === "string"
        ? rag.fees[0]
        : `${(rag.fees[0] as any).amountRwf || 0} RWF`
      : "0 RWF";

    const newJourney: CitizenJourney = {
      id: "journey-rag-" + Date.now(),
      title: rag.service || rag.intent || "Rwandan Citizen Service",
      subtitle: rag.answer || "Official government procedure roadmap.",
      createdAt: new Date().toISOString().split("T")[0],
      progressPercentage: 10,
      steps: (rag.steps || []).map((s, idx) => ({
        stepNumber: s.number || idx + 1,
        title: s.title || `Step ${idx + 1}`,
        description: s.explanation || "",
        requiredDocuments: s.documents && s.documents.length > 0 ? s.documents : ["National ID"],
        estimatedTime: rag.processing_time || "1-2 days",
        cost: feeStr,
        institution: rag.source_name || "IremboGov",
        status: idx === 0 ? "active" : "locked",
      })),
      sourceName: rag.source_name,
      sourceUrl: rag.source_url,
      lastVerified: rag.last_verified,
      aiInsight: {
        title: "Grounded Service Guidance",
        quote: `"${rag.answer.slice(0, 140)}..."`,
      },
    };

    setJourneys((prev) => [newJourney, ...prev]);
    setActiveJourneyId(newJourney.id);
    setActiveTab("journey");

    const notif = NotificationService.createNotification(
      "Roadmap Created from Assistant",
      `Active roadmap initialized for "${newJourney.title}".`,
      "journey_update"
    );
    setNotifications((prev) => [notif, ...prev]);
    return newJourney;
  };

  const createJourneyFromTemplate = (template: LifeEventTemplate): CitizenJourney => {
    const existing = journeys.find((j) => j.lifeEventId === template.id);
    if (existing) {
      setActiveJourneyId(existing.id);
      setActiveTab("journey");
      return existing;
    }

    const newJourney: CitizenJourney = {
      id: "journey-template-" + Date.now(),
      title: template.title,
      subtitle: template.description,
      lifeEventId: template.id,
      createdAt: new Date().toISOString().split("T")[0],
      progressPercentage: 0,
      steps: [
        {
          stepNumber: 1,
          title: `Initial Verification & Document Preparation`,
          description: `Gather required identification and certificates for ${template.title}.`,
          requiredDocuments: ["National ID", "Passport Photo"],
          estimatedTime: "2 hours",
          cost: "0 RWF",
          institution: template.partnerInstitution,
          status: "active",
        },
        {
          stepNumber: 2,
          title: `Online Application Submission`,
          description: `Submit your application digitally through ${template.partnerInstitution}.`,
          requiredDocuments: ["Completed Application Form", "National ID Copy"],
          estimatedTime: "1 day",
          cost: template.totalCost,
          institution: template.partnerInstitution,
          status: "locked",
        },
        {
          stepNumber: 3,
          title: `Official Assessment & Verification`,
          description: `Government officials review your submission and verify records.`,
          requiredDocuments: ["Payment Receipt SMS"],
          estimatedTime: template.estimatedDuration,
          cost: "0 RWF",
          institution: template.partnerInstitution,
          status: "locked",
        },
        {
          stepNumber: 4,
          title: `Certificate Issuance & Completion`,
          description: `Receive your official digital certificate or visit Sector Office.`,
          requiredDocuments: ["Verification Reference SMS"],
          estimatedTime: "1 day",
          cost: "0 RWF",
          institution: "Umurenge / Irembo",
          status: "locked",
        },
      ],
      aiInsight: {
        title: "Mugenzi Assistant",
        quote: `"I have initialized your roadmap for ${template.title}. Complete Step 1 to begin!"`,
      },
    };

    setJourneys((prev) => [newJourney, ...prev]);
    setActiveJourneyId(newJourney.id);
    setActiveTab("journey");
    return newJourney;
  };

  const uploadDocument = async (
    file: File,
    docType: string
  ): Promise<DocumentItem> => {
    const institution = DocumentValidationService.inferInstitution(file.name);
    const sizeStr = DocumentValidationService.formatFileSize(file.size);

    const tempDoc: DocumentItem = {
      id: "doc-" + Date.now(),
      title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      documentType: docType || "Rwandan Citizen Document",
      institution: institution,
      fileSize: sizeStr,
      uploadedAt: new Date().toISOString().split("T")[0],
      status: "pending",
      fileUrl: URL.createObjectURL(file),
    };

    setDocuments((prev) => [tempDoc, ...prev]);

    // Simulate OCR Validation API call
    const result = await AIService.validateDocumentOCR(file, docType);

    const verifiedDoc: DocumentItem = {
      ...tempDoc,
      status: (result.status as any) || "verified",
      ocrConfidence: result.ocrConfidence || 0.97,
      extractedMetadata: result.extractedMetadata || {
        holderName: userProfile.fullName,
        idNumber: userProfile.nationalIdNumber || "RW-ID-11993",
        issueDate: "2024-02-15",
        verificationCode: "RW-OCR-8821",
      },
    };

    setDocuments((prev) =>
      prev.map((d) => (d.id === tempDoc.id ? verifiedDoc : d))
    );

    const notif = NotificationService.createNotification(
      "OCR Document Verified",
      `"${verifiedDoc.title}" verified by ${verifiedDoc.institution} with ${Math.round(
        (verifiedDoc.ocrConfidence || 0.96) * 100
      )}% confidence.`,
      "doc_verified"
    );
    setNotifications((prev) => [notif, ...prev]);

    return verifiedDoc;
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const sendMessageToAI = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: "msg-u-" + Date.now(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setIsAiThinking(true);

    try {
      const result = await AIService.sendMessage(text, chatHistory);
      const aiMsg: ChatMessage = {
        id: "msg-ai-" + Date.now(),
        sender: "ai",
        text: result.reply,
        ragResponse: result.ragResponse,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatHistory((prev) => [...prev, aiMsg]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const prefillChatWithTopic = (topic: string) => {
    setActiveTab("chat");
    sendMessageToAI(topic);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const addRagService = async (service: GovernmentServiceRecord) => {
    const created = await AIService.addKnowledgeBaseService(service);
    if (created) {
      await refreshRagServices();
    }
    return created;
  };

  const updateRagService = async (id: string, updates: Partial<GovernmentServiceRecord>) => {
    const updated = await AIService.updateKnowledgeBaseService(id, updates);
    if (updated) {
      await refreshRagServices();
    }
    return updated;
  };

  const toggleRagService = async (id: string) => {
    const toggled = await AIService.toggleKnowledgeBaseService(id);
    if (toggled) {
      await refreshRagServices();
    }
    return toggled;
  };

  const deleteRagService = async (id: string) => {
    const success = await AIService.deleteKnowledgeBaseService(id);
    if (success) {
      await refreshRagServices();
    }
    return success;
  };

  return (
    <MugenziContext.Provider
      value={{
        activeTab,
        setActiveTab,
        userProfile,
        isLoggedIn,
        loginWithMethod,
        logout,
        journeys,
        activeJourneyId,
        activeJourney,
        setActiveJourneyId,
        completeStep,
        createJourneyFromAI,
        createJourneyFromRagResponse,
        createJourneyFromTemplate,
        documents,
        uploadDocument,
        deleteDocument,
        missingRequiredDocs,
        chatHistory,
        isAiThinking,
        sendMessageToAI,
        prefillChatWithTopic,
        notifications,
        unreadNotificationCount,
        markNotificationRead,
        clearAllNotifications,
        lifeEvents: RWANDA_LIFE_EVENTS,
        ragServices,
        refreshRagServices,
        addRagService,
        updateRagService,
        toggleRagService,
        deleteRagService,
      }}
    >
      {children}
    </MugenziContext.Provider>
  );
};

export const useMugenzi = (): MugenziContextType => {
  const context = useContext(MugenziContext);
  if (!context) {
    throw new Error("useMugenzi must be used within a MugenziProvider");
  }
  return context;
};
