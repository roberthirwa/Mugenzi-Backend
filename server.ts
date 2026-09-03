import express from "express";
import path from "path";
import cors from 'cors';
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import {
  executeGroundedRagQuery,
  knowledgeStore,
  retrieveGovernmentKnowledge
} from "./server/ragService";

const app = express();

// Enable CORS for mobile app requests
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: "20mb" }));

// 1. Grounded AI Chat & RAG Guidance Endpoint
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Execute Grounded RAG Flow
    const ragResponse = await executeGroundedRagQuery(message || "", history || [], apiKey);

    res.json({
      reply: ragResponse.answer,
      ragResponse: ragResponse,
      source: "grounded_rwanda_rag",
      isGrounded: ragResponse.is_verified_grounded !== false
    });
  } catch (error: any) {
    console.error("Grounded RAG Chat Error:", error);
    res.status(500).json({ error: "Failed to process grounded query", message: error.message });
  }
});

// 2. AI Journey Builder Endpoint (Grounded in Knowledge Base)
app.post("/api/ai/generate-journey", async (req, res) => {
  try {
    const { title, description, serviceId } = req.body;
    const searchTarget = serviceId || title || description || "";
    const { matchedService } = retrieveGovernmentKnowledge(searchTarget);

    if (matchedService) {
      return res.json({
        title: matchedService.title,
        description: matchedService.description,
        serviceId: matchedService.service_id,
        steps: matchedService.steps.map((step, idx) => ({
          stepNumber: step.number,
          title: step.title,
          description: step.explanation,
          requiredDocuments: step.documents || matchedService.required_documents,
          estimatedTime: matchedService.processing_time,
          cost: matchedService.fees.length > 0 ? `${matchedService.fees[0].amountRwf} RWF` : "0 RWF",
          institution: matchedService.institution,
          status: idx === 0 ? "active" : "locked"
        })),
        sourceName: matchedService.source_name,
        sourceUrl: matchedService.source_url,
        lastVerified: matchedService.last_verified
      });
    }

    // Default structured roadmap if no direct match
    res.json({
      title: title || "Custom Rwanda Citizen Journey",
      description: description || "Step-by-step roadmap to formalize your procedure in Rwanda.",
      steps: [
        {
          stepNumber: 1,
          title: "Initial Verification & Document Gathering",
          description: "Prepare required identification and certificates via NIDA/Irembo.",
          requiredDocuments: ["National ID", "Passport Photo"],
          estimatedTime: "2 hours",
          cost: "0 RWF",
          institution: "NIDA / Irembo",
          status: "active"
        },
        {
          stepNumber: 2,
          title: "Online Submission on Official Portal",
          description: "Complete digital application form and attach verified documents.",
          requiredDocuments: ["Completed Application Form", "National ID Copy"],
          estimatedTime: "1-2 days",
          cost: "5,000 RWF",
          institution: "IremboGov",
          status: "locked"
        },
        {
          stepNumber: 3,
          title: "Official Approval & Certificate Issuance",
          description: "Receive digital certificate via SMS/Email or collect at Sector office.",
          requiredDocuments: ["Payment Receipt SMS"],
          estimatedTime: "2-3 days",
          cost: "0 RWF",
          institution: "MINALOC / Sector Office",
          status: "locked"
        }
      ]
    });
  } catch (error: any) {
    console.error("Journey Gen Error:", error);
    res.status(500).json({ error: "Failed to generate journey" });
  }
});

// 3. Document OCR Validator Endpoint
app.post("/api/ai/validate-document", async (req, res) => {
  try {
    const { docType, fileName } = req.body;
    const isRwandaID = (fileName || "").toLowerCase().includes("id") || (docType || "").toLowerCase().includes("id") || (fileName || "").toLowerCase().includes("indangamuntu");
    const isTin = (fileName || "").toLowerCase().includes("tin") || (docType || "").toLowerCase().includes("tax") || (docType || "").toLowerCase().includes("rra");
    const isCertificate = (fileName || "").toLowerCase().includes("cert") || (fileName || "").toLowerCase().includes("name") || (docType || "").toLowerCase().includes("certificate");

    const responseObj = {
      status: "verified",
      confidence: 0.96,
      ocrExtractedData: {
        documentType: docType || "Rwandan Citizen Document",
        issuedBy: isTin ? "Rwanda Revenue Authority (RRA)" : isCertificate ? "Rwanda Development Board (RDB)" : "National Identification Agency (NIDA)",
        verificationNumber: "RW-" + Math.floor(100000000 + Math.random() * 900000000),
        issueDate: "2024-03-15",
        holderName: "Jean de Dieu Mugisha",
        validity: "Valid / Verified against registry"
      },
      checklistMatched: true,
      message: "Document successfully verified with simulated Rwandan OCR architecture. Quality and security watermark checks passed."
    };

    setTimeout(() => {
      res.json(responseObj);
    }, 400);
  } catch (error: any) {
    console.error("Document Validation Error:", error);
    res.status(500).json({ error: "Failed to validate document" });
  }
});

// ----------------------------------------------------
// 4. Knowledge Base Administration API Endpoints
// ----------------------------------------------------

// List all knowledge base services
app.get("/api/rag/services", (req, res) => {
  const includeInactive = req.query.includeInactive === "true";
  const services = knowledgeStore.getAllServices(includeInactive);
  res.json({ services, count: services.length });
});

// Get a single service
app.get("/api/rag/services/:id", (req, res) => {
  const service = knowledgeStore.getServiceById(req.params.id);
  if (!service) {
    return res.status(404).json({ error: "Service not found" });
  }
  res.json({ service });
});

// Add a new service
app.post("/api/rag/services", (req, res) => {
  const newService = req.body;
  if (!newService.service_id || !newService.title) {
    return res.status(400).json({ error: "service_id and title are required" });
  }
  const created = knowledgeStore.addService(newService);
  res.status(201).json({ service: created, message: "Service added to knowledge base" });
});

// Update a service
app.put("/api/rag/services/:id", (req, res) => {
  const updated = knowledgeStore.updateService(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: "Service not found" });
  }
  res.json({ service: updated, message: "Service updated successfully" });
});

// Delete a service
app.delete("/api/rag/services/:id", (req, res) => {
  const success = knowledgeStore.deleteService(req.params.id);
  if (!success) {
    return res.status(404).json({ error: "Service not found" });
  }
  res.json({ success: true, message: "Service removed from knowledge base" });
});

// Toggle service status
app.post("/api/rag/services/:id/toggle", (req, res) => {
  const service = knowledgeStore.toggleServiceStatus(req.params.id);
  if (!service) {
    return res.status(404).json({ error: "Service not found" });
  }
  res.json({ service, message: `Service is now ${service.status}` });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Mugenzi Grounded RAG Companion Backend" });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Ensure server binds to process.env.PORT and 0.0.0.0 for host environments
  const PORT = process.env.PORT || 5000;
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Mugenzi RAG Backend live on port ${PORT}`);
  });
}

startServer();
