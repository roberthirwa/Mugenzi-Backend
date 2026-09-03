import { GoogleGenAI } from "@google/genai";
import {
  GovernmentServiceRecord,
  RagStructuredResponse,
  GovernmentFeeItem,
  ProblemSolvingAnalysis,
  PreventativeCheckItem,
  ProblemSolvingEvidenceSource,
  ProblemType
} from "../src/types/domain";
import { INITIAL_RWANDA_GOVERNMENT_SERVICES } from "../src/data/rwandaGovernmentKnowledgeBase";

// In-memory admin-manageable service repository
export class RwandaGovernmentKnowledgeStore {
  private services: GovernmentServiceRecord[] = [
    ...INITIAL_RWANDA_GOVERNMENT_SERVICES
  ];

  public getAllServices(includeInactive = false): GovernmentServiceRecord[] {
    if (includeInactive) return this.services;
    return this.services.filter((s) => s.status === "active");
  }

  public getServiceById(serviceId: string): GovernmentServiceRecord | undefined {
    return this.services.find((s) => s.service_id === serviceId);
  }

  public addService(service: GovernmentServiceRecord): GovernmentServiceRecord {
    const existingIndex = this.services.findIndex(
      (s) => s.service_id === service.service_id
    );
    if (existingIndex >= 0) {
      this.services[existingIndex] = { ...service, last_verified: new Date().toISOString().split("T")[0] };
      return this.services[existingIndex];
    }
    const newService = {
      ...service,
      last_verified: service.last_verified || new Date().toISOString().split("T")[0],
      status: service.status || "active"
    };
    this.services.push(newService);
    return newService;
  }

  public updateService(
    serviceId: string,
    updates: Partial<GovernmentServiceRecord>
  ): GovernmentServiceRecord | null {
    const index = this.services.findIndex((s) => s.service_id === serviceId);
    if (index === -1) return null;
    this.services[index] = {
      ...this.services[index],
      ...updates,
      last_verified: new Date().toISOString().split("T")[0]
    };
    return this.services[index];
  }

  public deleteService(serviceId: string): boolean {
    const index = this.services.findIndex((s) => s.service_id === serviceId);
    if (index === -1) return false;
    this.services.splice(index, 1);
    return true;
  }

  public toggleServiceStatus(serviceId: string): GovernmentServiceRecord | null {
    const service = this.getServiceById(serviceId);
    if (!service) return null;
    service.status = service.status === "active" ? "inactive" : "active";
    return service;
  }
}

export const knowledgeStore = new RwandaGovernmentKnowledgeStore();

// ====================================================
// DOMAIN IDENTIFICATION & SESSION ISOLATION ENGINE
// ====================================================

export type GovernmentDomain =
  | "LAND_DUE_DILIGENCE_FRAUD"
  | "LAND_TITLE_TRANSFER"
  | "DRIVING_LICENSE_REPLACEMENT"
  | "DRIVING_LICENSE_PROVISIONAL"
  | "DRIVING_LICENSE_DEFINITIVE"
  | "HEALTH_INSURANCE_CBHI"
  | "CIVIL_STATUS_BIRTH"
  | "CIVIL_STATUS_SINGLE"
  | "CIVIL_STATUS_MARRIAGE"
  | "IDENTITY_NIDA"
  | "PASSPORT_IMMIGRATION"
  | "BUSINESS_RDB"
  | "TAX_RRA"
  | "VEHICLE_REGISTRATION"
  | "CRIMINAL_RECORD"
  | "AMBIGUOUS_TRIGGER"
  | "UNKNOWN_DOMAIN";

export function detectGovernmentDomain(query: string): GovernmentDomain {
  const q = query.toLowerCase().trim();

  // Check for Ambiguous triggers / short queries / isolated words
  if (
    !q ||
    q.length < 3 ||
    q === "suggestionchips" ||
    q === "chips" ||
    q === "test" ||
    q === "hello" ||
    q === "hi" ||
    q === "mwaramutse" ||
    q === "help" ||
    q === "how" ||
    q === "info" ||
    q === "what" ||
    q === "none" ||
    q === "null"
  ) {
    return "AMBIGUOUS_TRIGGER";
  }

  // 1. Driving License Replacement (Lost / Damaged / Duplicate) - Higher priority than general driving
  if (
    (q.includes("driving") || q.includes("licence") || q.includes("license") || q.includes("permi")) &&
    (q.includes("lost") || q.includes("replace") || q.includes("duplicate") || q.includes("stolen") || q.includes("yatakaye") || q.includes("gusimbuza") || q.includes("damaged") || q.includes("mutilated") || q.includes("renew"))
  ) {
    return "DRIVING_LICENSE_REPLACEMENT";
  }
  if (q.includes("lost driving") || q.includes("replace driving") || q.includes("duplicate driving") || q.includes("permi yatakaye")) {
    return "DRIVING_LICENSE_REPLACEMENT";
  }

  // 2. Health Insurance (Mutuelle de Sante / CBHI / Ubudehe)
  if (
    q.includes("mutuelle") ||
    q.includes("cbhi") ||
    q.includes("health insurance") ||
    q.includes("mituweli") ||
    (q.includes("ubudehe") && (q.includes("health") || q.includes("pay") || q.includes("insurance") || q.includes("category")))
  ) {
    return "HEALTH_INSURANCE_CBHI";
  }

  // 3. Civil Status: Single / Celibacy
  if (
    q.includes("celibacy") ||
    q.includes("ubuselibateri") ||
    q.includes("single certificate") ||
    q.includes("certificate of being single") ||
    (q.includes("single") && (q.includes("certificate") || q.includes("proof") || q.includes("document")))
  ) {
    return "CIVIL_STATUS_SINGLE";
  }

  // 4. Civil Status: Birth Certificate
  if (
    q.includes("birth certificate") ||
    q.includes("amavuko") ||
    q.includes("icyemezo cy'amavuko") ||
    q.includes("birth record") ||
    (q.includes("birth") && q.includes("certificate"))
  ) {
    return "CIVIL_STATUS_BIRTH";
  }

  // 5. Civil Status: Marriage Declaration & Certificate
  if (
    q.includes("marriage") ||
    q.includes("wedding") ||
    q.includes("gusezerana") ||
    q.includes("marry") ||
    q.includes("banns")
  ) {
    return "CIVIL_STATUS_MARRIAGE";
  }

  // 6. Land Due Diligence & Fraud Prevention
  if (
    (q.includes("land") || q.includes("ubutaka") || q.includes("plot") || q.includes("parcel") || q.includes("upi")) &&
    (q.includes("fraud") || q.includes("scam") || q.includes("avoid") || q.includes("safe") || q.includes("middleman") || q.includes("kamisiyo") || q.includes("verify seller") || q.includes("fake") || q.includes("cheat") || q.includes("due diligence") || q.includes("protect") || q.includes("seller does not own") || q.includes("doesn't own"))
  ) {
    return "LAND_DUE_DILIGENCE_FRAUD";
  }

  // 7. General Land Title Transfer
  if (q.includes("land") || q.includes("ubutaka") || q.includes("plot") || q.includes("parcel") || q.includes("title transfer") || q.includes("upi")) {
    return "LAND_TITLE_TRANSFER";
  }

  // 8. Vehicle & Number Plates
  if (
    (q.includes("car") || q.includes("vehicle") || q.includes("automobile") || q.includes("ikinyabiziga") || q.includes("motorcycle")) &&
    (q.includes("plate") || q.includes("number plate") || q.includes("plaque") || q.includes("register") || q.includes("yellow card") || q.includes("bought a car") || q.includes("bought car") || q.includes("carte jaune") || q.includes("control technique"))
  ) {
    return "VEHICLE_REGISTRATION";
  }

  // 9. Business Registration (RDB) / Online Shop
  if (
    q.includes("online shop") ||
    q.includes("ecommerce") ||
    q.includes("e-commerce") ||
    q.includes("online store") ||
    q.includes("sell online") ||
    q.includes("start a business") ||
    q.includes("start business") ||
    q.includes("register business") ||
    q.includes("register company") ||
    q.includes("sole proprietorship") ||
    q.includes("rdb")
  ) {
    return "BUSINESS_RDB";
  }

  // 10. Tax / TIN (RRA)
  if (q.includes("tin") || q.includes("taxpayer") || q.includes("rra") || q.includes("e-tax") || q.includes("tax clearance")) {
    return "TAX_RRA";
  }

  // 11. National ID (NIDA)
  if (
    q.includes("national id") ||
    q.includes("indangamuntu") ||
    q.includes("identity card") ||
    q.includes("nida") ||
    (q.includes("id") && (q.includes("lost") || q.includes("replace") || q.includes("apply") || q.includes("card")))
  ) {
    return "IDENTITY_NIDA";
  }

  // 12. Driving License: Provisional vs Definitive
  if (q.includes("provisional") || q.includes("agateganyo") || q.includes("theory exam") || q.includes("traffic test")) {
    return "DRIVING_LICENSE_PROVISIONAL";
  }
  if (q.includes("definitive") || q.includes("burundu") || q.includes("smart card") || q.includes("practical test") || q.includes("driving licence") || q.includes("driving license") || q.includes("permi")) {
    return "DRIVING_LICENSE_DEFINITIVE";
  }

  // 13. Passport / Immigration (DGIE)
  if (q.includes("passport") || q.includes("pasiporo") || q.includes("dgie") || q.includes("epassport")) {
    return "PASSPORT_IMMIGRATION";
  }

  // 14. Criminal Record (NPPA / MINIJUST)
  if (q.includes("criminal") || q.includes("casier") || q.includes("ubutabera") || q.includes("police clearance")) {
    return "CRIMINAL_RECORD";
  }

  return "UNKNOWN_DOMAIN";
}

// ====================================================
// STEP 1: Intent & Goal Understanding Engine
// ====================================================

export function analyzeUserIntentAndGoal(
  query: string,
  history: any[] = []
): ProblemSolvingAnalysis {
  const domain = detectGovernmentDomain(query);
  const q = query.toLowerCase().trim();

  // Ambiguous Trigger or Generic Short Message
  if (domain === "AMBIGUOUS_TRIGGER") {
    return {
      primary_intent: "ambiguous_or_clarification_required",
      underlying_goal: "clarify_citizen_administrative_need",
      problem_type: "general_inquiry",
      entities: ["Rwandan Public Services"],
      relevant_institutions: ["IremboGov"],
      relevant_services: [],
      risks: [],
      desired_outcome: "Request specific service category from user",
      missing_information: ["Specific government service or administrative procedure name"],
      urgency: "low",
      confidence_score: 0.99
    };
  }

  // 1. Driving License Replacement (Lost / Damaged / Duplicate)
  if (domain === "DRIVING_LICENSE_REPLACEMENT") {
    return {
      primary_intent: "lost_driving_license_replacement",
      underlying_goal: "reissue_lost_or_damaged_definitive_driving_smart_card",
      problem_type: "recovery_replacement",
      entities: ["Definitive Driving License", "Rwanda National Police (RNP)", "Certificate of Loss (Icyemezo cyo gutakaza)", "IremboGov", "District Police Unit"],
      relevant_institutions: ["Rwanda National Police (RNP)", "IremboGov"],
      relevant_services: ["rnp_driving_licence_replacement", "nida_national_id"],
      risks: [
        "Driving without physical license carrying traffic penalties under Rwandan traffic law",
        "Paying unauthorized brokers (official statutory replacement fee is 25,000 RWF on IremboGov)"
      ],
      desired_outcome: "Obtain Police Certificate of Loss, apply on IremboGov for duplicate (25,000 RWF), and collect new smart card at District Police",
      missing_information: ["Whether applicant has obtained the Police Certificate of Loss"],
      urgency: "high",
      confidence_score: 0.99
    };
  }

  // 2. Health Insurance (Mutuelle de Sante / CBHI / Ubudehe)
  if (domain === "HEALTH_INSURANCE_CBHI") {
    return {
      primary_intent: "cbhi_mutuelle_sante_payment",
      underlying_goal: "activate_household_health_insurance_and_verify_ubudehe",
      problem_type: "procedure_execution",
      entities: ["Community Based Health Insurance (CBHI)", "Mutuelle de Santé", "RSSB", "MINALOC", "Ubudehe Category", "IremboGov"],
      relevant_institutions: ["Rwanda Social Security Board (RSSB)", "Ministry of Local Government (MINALOC)", "IremboGov"],
      relevant_services: ["rssb_cbhi_mutuelle_sante", "nida_national_id"],
      risks: [
        "Uninsured medical expenses",
        "Mandatory 30-day waiting period penalty if payment is made after the statutory deadline"
      ],
      desired_outcome: "Verify Ubudehe household list, pay annual statutory contribution (3,000 RWF or 7,000 RWF per member; Category 1 free), and activate instant healthcare coverage",
      missing_information: ["Head of Household National ID Number"],
      urgency: "normal",
      confidence_score: 0.99
    };
  }

  // 3. Civil Status: Single / Celibacy
  if (domain === "CIVIL_STATUS_SINGLE") {
    return {
      primary_intent: "certificate_of_being_single",
      underlying_goal: "obtain_official_celibacy_certificate",
      problem_type: "qualification_eligibility",
      entities: ["Certificate of Being Single", "Icyemezo cy'ubuselibateri", "MINALOC", "NIDA", "Sector Office", "IremboGov"],
      relevant_institutions: ["Ministry of Local Government (MINALOC)", "Sector Office (Umurenge)"],
      relevant_services: ["irembo_certificate_being_single", "irembo_marriage_declaration"],
      risks: ["Attempting to declare civil marriage without valid 3-month celibacy certificate"],
      desired_outcome: "Apply on IremboGov (500 RWF) and download official QR-verified PDF certificate",
      urgency: "normal",
      confidence_score: 0.98
    };
  }

  // 4. Civil Status: Birth Certificate
  if (domain === "CIVIL_STATUS_BIRTH") {
    return {
      primary_intent: "birth_certificate_issuance",
      underlying_goal: "obtain_certified_digital_birth_certificate",
      problem_type: "procedure_execution",
      entities: ["Birth Certificate", "Icyemezo cy'amavuko", "NIDA", "MINALOC", "IremboGov"],
      relevant_institutions: ["Ministry of Local Government (MINALOC)", "National Identification Agency (NIDA)", "IremboGov"],
      relevant_services: ["irembo_birth_certificate", "nida_national_id"],
      risks: ["Late birth declaration requiring regularization before certificate issuance"],
      desired_outcome: "Apply on IremboGov (500 RWF) and download official cryptographic QR-verified e-certificate",
      urgency: "normal",
      confidence_score: 0.99
    };
  }

  // 5. Civil Status: Marriage Declaration & Ceremony
  if (domain === "CIVIL_STATUS_MARRIAGE") {
    const isCertificate = q.includes("certificate") && !q.includes("single") && !q.includes("celibacy");
    return {
      primary_intent: isCertificate ? "marriage_certificate" : "civil_marriage_declaration",
      underlying_goal: isCertificate ? "obtain_marriage_certificate" : "book_civil_wedding_and_fulfill_banns",
      problem_type: "life_event_planning",
      entities: ["Civil Marriage", "MINALOC", "Sector Office (Umurenge)", "21-Day Public Banns", "IremboGov"],
      relevant_institutions: ["Ministry of Local Government (MINALOC)", "Sector Office (Umurenge)"],
      relevant_services: isCertificate ? ["irembo_marriage_certificate"] : ["irembo_marriage_declaration", "irembo_certificate_being_single", "irembo_birth_certificate"],
      risks: [
        "Missing statutory 21-day public banns notice period at Sector Office",
        "Incomplete civil documents (missing celibacy certificates or witness IDs)"
      ],
      desired_outcome: "Submit booking on IremboGov at least 21 days in advance, upload prerequisites, and attend Sector solemnization",
      urgency: "normal",
      confidence_score: 0.98
    };
  }

  // 6. Land Due Diligence & Fraud Prevention
  if (domain === "LAND_DUE_DILIGENCE_FRAUD") {
    return {
      primary_intent: "land_purchase_fraud_prevention",
      underlying_goal: "safely_purchase_legitimate_registered_land",
      problem_type: "risk_prevention",
      entities: ["land", "UPI", "buyer", "seller", "spousal consent", "Sector Land Notary", "National Land Authority"],
      relevant_institutions: ["National Land Authority (NLA)", "Sector Land Notary (Umurenge)", "Rwanda Investigation Bureau (RIB)"],
      relevant_services: ["nla_land_due_diligence_verification", "nla_land_title_transfer", "rib_minijust_land_fraud_protection"],
      risks: [
        "Buying unrecorded or contested land",
        "Paying a fake seller or non-owner",
        "Missing mandatory spousal matrimonial consent (invalidating sale under Family Law)",
        "Undetected caveats, bank mortgage liens, or expropriation zoning",
        "Signing informal handwritten agreements (Inyandiko y'intoki) without legal standing"
      ],
      desired_outcome: "Execute a risk-free land purchase with verified ownership and official notary title mutation",
      missing_information: ["Target land UPI number", "Seller's matrimonial property status"],
      urgency: "high",
      confidence_score: 0.98
    };
  }

  // 7. Land Title Transfer
  if (domain === "LAND_TITLE_TRANSFER") {
    return {
      primary_intent: "land_title_mutation",
      underlying_goal: "transfer_registered_land_title_deed",
      problem_type: "procedure_execution",
      entities: ["Land Title Deed", "UPI", "NLA", "Sector Land Notary", "IremboGov"],
      relevant_institutions: ["National Land Authority (NLA)", "Sector Land Notary"],
      relevant_services: ["nla_land_title_transfer", "nla_land_due_diligence_verification"],
      risks: ["Executing transfer without spousal consent or verified tax clearance"],
      desired_outcome: "Complete notary contract signing and receive updated digital title deed",
      urgency: "normal",
      confidence_score: 0.95
    };
  }

  // 8. Vehicle & Number Plates
  if (domain === "VEHICLE_REGISTRATION") {
    const isImported = q.includes("import") || q.includes("customs") || q.includes("border") || q.includes("foreign");
    const isLocal = q.includes("local") || q.includes("used") || q.includes("second") || q.includes("transfer") || q.includes("rwanda");

    return {
      primary_intent: "vehicle_registration_and_plates",
      underlying_goal: "legally_register_vehicle_and_obtain_official_rwandan_plates",
      problem_type: "procedure_execution",
      entities: ["motor vehicle", "license number plates", "RRA Customs", "RNP Traffic", "Technical Inspection", "Yellow Card"],
      relevant_institutions: ["Rwanda Revenue Authority (RRA)", "Rwanda National Police (RNP) Traffic Dept"],
      relevant_services: ["rra_rnp_vehicle_registration", "rra_tin_registration"],
      risks: [
        "Driving without valid registration plates (heavy traffic penalties and vehicle impoundment)",
        "Missing customs tax clearance or unverified chassis number during technical control"
      ],
      desired_outcome: "Complete physical inspection, pay plate statutory fees (45,000 RWF for car / 15,000 RWF for motorcycle), and collect metallic plates with Yellow Card",
      missing_information: !isImported && !isLocal ? ["Whether vehicle is newly imported or locally transferred"] : undefined,
      urgency: "normal",
      confidence_score: 0.95
    };
  }

  // 9. Business Registration (RDB)
  if (domain === "BUSINESS_RDB") {
    return {
      primary_intent: "start_online_shop_ecommerce",
      underlying_goal: "start_compliant_e_commerce_business_in_rwanda",
      problem_type: "life_event_planning",
      entities: ["online shop", "e-commerce", "RDB", "RRA", "TIN", "Electronic Billing Machine (EBM)", "MoMo Pay Gateway"],
      relevant_institutions: ["Rwanda Development Board (RDB)", "Rwanda Revenue Authority (RRA)"],
      relevant_services: ["rdb_business_registration", "rra_tin_registration"],
      risks: [
        "Trading without commercial registration",
        "Inability to integrate official Mobile Money / Bank merchant payment APIs without TIN",
        "Failure to file periodic E-Tax declarations"
      ],
      desired_outcome: "Register enterprise for free on RDB (0 RWF, <6 hours), receive instant RRA TIN, and set up compliant e-commerce operations",
      missing_information: ["Preference between Individual Enterprise vs Limited Liability Company (Ltd)"],
      urgency: "normal",
      confidence_score: 0.97
    };
  }

  // 10. Tax / TIN (RRA)
  if (domain === "TAX_RRA") {
    return {
      primary_intent: "taxpayer_tin_registration",
      underlying_goal: "obtain_taxpayer_identification_number_and_e_tax_credentials",
      problem_type: "procedure_execution",
      entities: ["TIN", "RRA E-Tax", "Tax Clearance"],
      relevant_institutions: ["Rwanda Revenue Authority (RRA)"],
      relevant_services: ["rra_tin_registration", "rdb_business_registration"],
      risks: ["Operating without a TIN or non-declaration penalties"],
      desired_outcome: "Register on RRA E-Tax (0 RWF) and receive 9-digit TIN certificate",
      urgency: "normal",
      confidence_score: 0.95
    };
  }

  // 11. National ID (NIDA)
  if (domain === "IDENTITY_NIDA") {
    return {
      primary_intent: "lost_national_id_replacement",
      underlying_goal: "replace_lost_national_id_and_secure_identity",
      problem_type: "recovery_replacement",
      entities: ["National ID", "Indangamuntu", "NIDA", "Rwanda National Police", "Certificate of Loss", "IremboGov", "Umurenge"],
      relevant_institutions: ["Rwanda National Police (RNP)", "National Identification Agency (NIDA)", "Sector Office (Umurenge)"],
      relevant_services: ["nida_national_id"],
      risks: [
        "Identity theft or unauthorized loan/SIM registration using lost card",
        "Inability to access public and private digital banking/government services"
      ],
      desired_outcome: "Obtain Police Loss Certificate, apply for replacement on IremboGov (1,500 RWF), and collect new smart card",
      missing_information: ["Whether applicant has police loss certificate or National Identification Number (NIN)"],
      urgency: "high",
      confidence_score: 0.98
    };
  }

  // 12. Driving License: Provisional
  if (domain === "DRIVING_LICENSE_PROVISIONAL") {
    return {
      primary_intent: "provisional_driving_licence",
      underlying_goal: "pass_driving_theory_exam_and_get_provisional_permit",
      problem_type: "procedure_execution",
      entities: ["Provisional Driving License", "RNP Traffic", "Highway Code", "IremboGov"],
      relevant_institutions: ["Rwanda National Police (RNP)", "IremboGov"],
      relevant_services: ["rnp_provisional_driving_licence", "nida_national_id"],
      risks: ["Late arrival forfeiting exam slot", "Driving without provisional certificate"],
      desired_outcome: "Book computer theory exam on Irembo (5,000 RWF), score 12+/20, pay certificate fee (5,000 RWF), and download 1-year valid permit",
      urgency: "normal",
      confidence_score: 0.96
    };
  }

  // 13. Driving License: Definitive
  if (domain === "DRIVING_LICENSE_DEFINITIVE") {
    return {
      primary_intent: "definitive_driving_licence",
      underlying_goal: "obtain_permanent_driving_smart_card",
      problem_type: "procedure_execution",
      entities: ["Definitive Driving License", "RNP Traffic", "Practical Road Exam", "Smart Card", "IremboGov"],
      relevant_institutions: ["Rwanda National Police (RNP)", "IremboGov"],
      relevant_services: ["rnp_definitive_driving_licence", "rnp_provisional_driving_licence"],
      risks: ["Driving on expired provisional permit before acquiring definitive license"],
      desired_outcome: "Book practical test on Irembo (10,000 RWF), pass road test, apply for smart card (50,000 RWF), and collect biometric card at District Police",
      urgency: "normal",
      confidence_score: 0.96
    };
  }

  // 14. Passport / Immigration
  if (domain === "PASSPORT_IMMIGRATION") {
    const isRenewal = q.includes("renew") || q.includes("replace") || q.includes("lost") || q.includes("expired");
    return {
      primary_intent: isRenewal ? "passport_renewal" : "first_passport_application",
      underlying_goal: isRenewal ? "renew_or_replace_rwandan_passport" : "obtain_first_rwandan_epassport",
      problem_type: isRenewal ? "recovery_replacement" : "procedure_execution",
      entities: ["e-Passport", "DGIE", "IremboGov", "Biometrics"],
      relevant_institutions: ["Directorate General of Immigration and Emigration (DGIE)", "IremboGov"],
      relevant_services: isRenewal ? ["dgie_passport_renewal"] : ["dgie_first_epassport"],
      risks: ["Traveling on expired passport or unverified identity records"],
      desired_outcome: "Apply on IremboGov, pay statutory fee (75,000 RWF / 100,000 RWF), complete biometrics at DGIE, and collect booklet in 4 days",
      urgency: "normal",
      confidence_score: 0.96
    };
  }

  // 15. Criminal Record
  if (domain === "CRIMINAL_RECORD") {
    return {
      primary_intent: "criminal_record_certificate",
      underlying_goal: "obtain_official_criminal_record_clearance",
      problem_type: "qualification_eligibility",
      entities: ["Criminal Record Certificate", "NPPA", "MINIJUST", "IremboGov", "QR Code"],
      relevant_institutions: ["National Public Prosecution Authority (NPPA)", "Ministry of Justice (MINIJUST)", "IremboGov"],
      relevant_services: ["minijust_criminal_record"],
      risks: ["Submitting altered document (verifiable internationally via embedded QR)"],
      desired_outcome: "Apply on IremboGov (1,200 RWF) and receive digital certified clearance PDF within 1 to 3 days",
      urgency: "normal",
      confidence_score: 0.98
    };
  }

  // Unknown domain fallback
  return {
    primary_intent: "unverified_general_inquiry",
    underlying_goal: "understand_rwandan_government_service_procedure",
    problem_type: "general_inquiry",
    entities: ["Citizen", "IremboGov"],
    relevant_institutions: ["IremboGov"],
    relevant_services: [],
    risks: [],
    desired_outcome: "Receive verified, grounded government instructions",
    confidence_score: 0.40
  };
}

// ====================================================
// STEP 2: Semantic Query Rewriting (Multi-Query Generation)
// ====================================================

export function generateSemanticSearchQueries(
  analysis: ProblemSolvingAnalysis,
  originalQuery: string
): string[] {
  const queries: string[] = [originalQuery];

  switch (analysis.primary_intent) {
    case "lost_driving_license_replacement":
      queries.push("duplicate replacement definitive driving license RNP Irembo");
      queries.push("gusimbuza permi ya burundu icyemezo cyo gutakaza");
      queries.push("lost driving license 25000 RWF fee smart card");
      break;

    case "cbhi_mutuelle_sante_payment":
      queries.push("community based health insurance Mutuelle de Sante CBHI RSSB");
      queries.push("ubudehe category health insurance payment Irembo");
      queries.push("mituweli payment 3000 RWF 7000 RWF RSSB");
      break;

    case "birth_certificate_issuance":
      queries.push("application for birth certificate icyemezo cy'amavuko NIDA MINALOC");
      queries.push("birth certificate 500 RWF digital download IremboGov");
      break;

    case "certificate_of_being_single":
      queries.push("certificate of being single celibacy icyemezo cy'ubuselibateri MINALOC");
      queries.push("single certificate 500 RWF IremboGov");
      break;

    case "land_purchase_fraud_prevention":
      queries.push("land status verification due diligence fraud prevention");
      queries.push("verify UPI seller ownership caveats mortgages NLA");
      queries.push("spousal consent matrimonial property Rwandan Land Law");
      queries.push("notarized land transfer sector notary IremboGov");
      break;

    case "vehicle_registration_and_plates":
      queries.push("motor vehicle registration number plates RRA RNP");
      queries.push("imported vehicle customs clearance single administrative document");
      queries.push("local vehicle transfer yellow card logbook mutation");
      queries.push("technical control inspection Contrôle Technique");
      break;

    case "start_online_shop_ecommerce":
      queries.push("domestic business company registration online shop RDB");
      queries.push("e-commerce taxpayer identification number TIN RRA");
      queries.push("individual enterprise sole proprietorship vs Ltd company");
      break;

    case "lost_national_id_replacement":
      queries.push("replacement lost damaged national identity card NIDA");
      queries.push("police certificate of loss Icyemezo cyo gutakaza");
      queries.push("biometric national ID application Umurenge IremboGov 1500 RWF");
      break;

    case "civil_marriage_declaration":
      queries.push("civil marriage declaration 21 days public banns MINALOC");
      queries.push("certificate of being single celibacy ubuselibateri");
      queries.push("birth certificate application NIDA civil status");
      break;

    default:
      if (analysis.relevant_services.length > 0) {
        queries.push(...analysis.relevant_services);
      }
      break;
  }

  return Array.from(new Set(queries));
}

// ====================================================
// STEP 3: Multi-Source Knowledge Retrieval & Evaluation
// ====================================================

export interface MultiSourceKnowledgeResult {
  primaryService: GovernmentServiceRecord | null;
  supportingServices: GovernmentServiceRecord[];
  allRetrieved: GovernmentServiceRecord[];
  evidenceSources: ProblemSolvingEvidenceSource[];
  preventativeMeasures: PreventativeCheckItem[];
  warnings: string[];
  relevanceScore: number;
}

export function retrieveMultiSourceGovernmentKnowledge(
  queries: string[],
  analysis: ProblemSolvingAnalysis
): MultiSourceKnowledgeResult {
  const activeServices = knowledgeStore.getAllServices(false);
  const scoredMap = new Map<string, { service: GovernmentServiceRecord; score: number }>();

  for (const service of activeServices) {
    let score = 0;
    const titleLower = service.title.toLowerCase();
    const descLower = service.description.toLowerCase();
    const catLower = service.category.toLowerCase();
    const instLower = service.institution.toLowerCase();

    // 1. Direct match with specific service IDs identified in intent analysis (STRONG PRIORITY)
    if (analysis.relevant_services.includes(service.service_id)) {
      const idx = analysis.relevant_services.indexOf(service.service_id);
      score += 200 - idx * 40;
    }

    // 2. Score across all generated semantic queries
    for (const qStr of queries) {
      const q = qStr.toLowerCase().trim();
      if (q.includes(service.service_id.toLowerCase())) score += 80;
      if (q.includes(catLower)) score += 40;

      // Match in intents, goals, or problem types
      if (service.intents?.some((i) => q.includes(i) || i.includes(q))) score += 60;
      if (service.goals?.some((g) => q.includes(g) || g.includes(g))) score += 50;
      if (service.risks_addressed?.some((r) => q.includes(r))) score += 40;

      // Keyword tokens
      const words = q.split(/\s+/).filter((w) => w.length > 2);
      for (const w of words) {
        if (titleLower.includes(w)) score += 10;
        if (descLower.includes(w)) score += 5;
        if (instLower.includes(w)) score += 6;
      }
    }

    if (score > 25) {
      scoredMap.set(service.service_id, { service, score });
    }
  }

  const sorted = Array.from(scoredMap.values()).sort((a, b) => b.score - a.score);
  const allRetrieved = sorted.map((s) => s.service);

  const primaryService = allRetrieved.length > 0 ? allRetrieved[0] : null;

  // STRICT ANTI-POLLUTION: Only allow supporting services that belong to the SAME domain or are explicitly linked in `related_services`
  const supportingServices: GovernmentServiceRecord[] = [];
  if (primaryService) {
    for (const other of allRetrieved.slice(1)) {
      const isRelated = primaryService.related_services?.includes(other.service_id);
      const isSameCategory = primaryService.category === other.category;
      const isSameInstitution = primaryService.institution === other.institution;
      const isAllowedCrossDomain =
        (primaryService.service_id.includes("land") && other.service_id.includes("land")) ||
        (primaryService.service_id.includes("business") && other.service_id.includes("tin")) ||
        (primaryService.service_id.includes("marriage") && (other.service_id.includes("single") || other.service_id.includes("birth")));

      if (isRelated || isSameCategory || isAllowedCrossDomain || (isSameInstitution && !primaryService.service_id.includes("driving") && !other.service_id.includes("land"))) {
        supportingServices.push(other);
      }
    }
  }

  // Build evidence sources with clear relevance reasons
  const evidenceSources: ProblemSolvingEvidenceSource[] = [];
  if (primaryService) {
    evidenceSources.push({
      title: primaryService.title,
      institution: primaryService.institution,
      relevance_reason: "Primary official government procedure and authoritative statutory guidelines",
      url: primaryService.official_url
    });
  }

  for (const supp of supportingServices.slice(0, 3)) {
    let reason = "Supporting prerequisite and cross-institutional verification";
    if (supp.category.includes("Due Diligence") || supp.category.includes("Legal Protection")) {
      reason = "Fraud prevention, legal safeguards, and due diligence checks";
    } else if (supp.category.includes("Certificate") || supp.category.includes("TIN")) {
      reason = "Prerequisite civil document / compliance credential";
    }
    evidenceSources.push({
      title: supp.title,
      institution: supp.institution,
      relevance_reason: reason,
      url: supp.official_url
    });
  }

  // Compile preventative measures based strictly on primary domain
  const preventativeMeasures: PreventativeCheckItem[] = [];

  if (analysis.primary_intent === "land_purchase_fraud_prevention") {
    preventativeMeasures.push(
      {
        number: 1,
        title: "Search UPI on Official Land Registry",
        recommendation: "Query the Unique Parcel Identifier (UPI) on IremboGov or at the Sector Land Office before signing any contract or paying any deposit.",
        why_it_matters: "Confirms true registered ownership and ensures the parcel has NO active bank mortgages, court freezes (Ibiziriko), or tax liens.",
        risk_addressed: "Buying encumbered, contested, or non-existent land"
      },
      {
        number: 2,
        title: "Verify Seller Identity & Spousal Matrimonial Consent",
        recommendation: "Match the seller's National ID against the official registry title and obtain written, verified spousal consent if the seller is married.",
        why_it_matters: "Under Rwandan Family Law (Law N° 32/2016), land registered under Community of Property cannot be transferred without written consent from both spouses. An unconsented sale can be annulled in court.",
        risk_addressed: "Invalid transactions and post-purchase property forfeiture"
      },
      {
        number: 3,
        title: "Conduct On-Site Physical Inspection with Cell Leaders & Neighbors (Abaturanyi)",
        recommendation: "Visit the physical parcel with the Cell Executive Secretary (Akagari) and adjacent neighbors to confirm physical boundaries.",
        why_it_matters: "Ensures the physical land matches the cadastral demarcation sketch and exposes any hidden community boundary disputes.",
        risk_addressed: "Boundary overlaps and contested property lines"
      },
      {
        number: 4,
        title: "Execute Notarized Contract Before Sector Land Notary",
        recommendation: "Never rely on informal handwritten chits (Inyandiko y'intoki) or pay cash to informal brokers. Sign strictly before the public Sector Land Notary.",
        why_it_matters: "Under Rwandan Land Law (Law N° 27/2021), only notarized title mutations executed on IremboGov confer legal property ownership.",
        risk_addressed: "Unenforceable contracts and financial fraud"
      }
    );
  } else if (analysis.primary_intent === "lost_driving_license_replacement") {
    preventativeMeasures.push(
      {
        number: 1,
        title: "Obtain Police Certificate of Loss (Icyemezo cyo gutakaza)",
        recommendation: "Report the loss of your driving license immediately at the nearest Rwanda National Police station.",
        why_it_matters: "Mandatory official requirement before applying for duplicate reissuance on IremboGov, protecting you against unauthorized misuse.",
        risk_addressed: "Application rejection and fraudulent impersonation"
      },
      {
        number: 2,
        title: "Apply for Duplicate on IremboGov (25,000 RWF)",
        recommendation: "Select 'Duplicate / Replacement of Definitive Driving License' on IremboGov and pay the statutory 25,000 RWF fee.",
        why_it_matters: "You do not need to retake driving exams; your record is securely registered with RNP Traffic Department.",
        risk_addressed: "Paying unauthorized third-party fixers"
      }
    );
  } else if (analysis.primary_intent === "cbhi_mutuelle_sante_payment") {
    preventativeMeasures.push(
      {
        number: 1,
        title: "Verify Household List & Ubudehe Category on Irembo (*909#)",
        recommendation: "Query your household head National ID on IremboGov or via USSD *909# to review all listed family members and calculated contribution.",
        why_it_matters: "All registered family members must be covered under the same profile according to RSSB regulations.",
        risk_addressed: "Partial household payment leaving dependents uncovered"
      },
      {
        number: 2,
        title: "Pay Before June 30 Deadline",
        recommendation: "Pay your annual CBHI contribution (3,000 RWF / 7,000 RWF per person; Category 1 subsidized) before July 1st.",
        why_it_matters: "Avoids the statutory 30-day waiting period penalty before healthcare benefits become active.",
        risk_addressed: "30-day waiting period coverage penalty"
      }
    );
  } else if (analysis.primary_intent === "lost_national_id_replacement") {
    preventativeMeasures.push(
      {
        number: 1,
        title: "Obtain Police Certificate of Loss (Icyemezo cyo gutakaza)",
        recommendation: "Report the lost document immediately to the nearest Rwanda National Police (RNP) station or local Sector.",
        why_it_matters: "Protects you against identity theft, fraudulent SIM card registrations, or unauthorized loans taken in your name.",
        risk_addressed: "Identity theft and financial impersonation"
      },
      {
        number: 2,
        title: "Submit Replacement Application on IremboGov (1,500 RWF)",
        recommendation: "Log into IremboGov, select 'Replacement of National ID' (1,500 RWF), and choose your preferred collection Sector Office.",
        why_it_matters: "Generates an official NIDA biometric production request with verifiable tracking number.",
        risk_addressed: "Delayed credential reissue"
      }
    );
  } else if (analysis.primary_intent === "start_online_shop_ecommerce") {
    preventativeMeasures.push(
      {
        number: 1,
        title: "Register Enterprise / Company Free on RDB",
        recommendation: "Visit org.rdb.rw and register an Individual Enterprise or Limited Company (0 RWF, under 6 hours).",
        why_it_matters: "Grants legal corporate existence and generates an automatic 9-digit RRA Taxpayer Identification Number (TIN).",
        risk_addressed: "Operating an unlicensed business"
      },
      {
        number: 2,
        title: "Integrate Compliant Payment Gateways with TIN",
        recommendation: "Use your verified RRA TIN and incorporation certificate to open merchant accounts with MTN MoMo API, Airtel Money, or Bank.",
        why_it_matters: "Required by financial regulators for compliant digital customer payments.",
        risk_addressed: "Payment gateway freezes and compliance blocks"
      }
    );
  } else if (analysis.primary_intent === "civil_marriage_declaration") {
    preventativeMeasures.push(
      {
        number: 1,
        title: "Observe 21-Day Mandatory Banns Period",
        recommendation: "Submit your joint civil marriage booking on IremboGov at least 21 calendar days before your planned wedding date.",
        why_it_matters: "Rwandan Family Law mandates a 21-day public display of marriage banns at the Sector Office to ensure no legal impediments exist.",
        risk_addressed: "Postponed ceremony due to statutory timeline violations"
      },
      {
        number: 2,
        title: "Obtain Certificates of Being Single & Birth Certificates",
        recommendation: "Download certified digital Birth Certificates and Certificates of Being Single (Icyemezo cy'ubuselibateri - 500 RWF each) on IremboGov.",
        why_it_matters: "Proves legal capacity to contract civil marriage under Rwandan law.",
        risk_addressed: "Application rejection by Civil Registrar"
      }
    );
  }

  // STRICT FILTERING: Only include warnings retrieved directly from the matching official service schema
  const warnings: string[] = [];
  if (primaryService) {
    warnings.push(...primaryService.warnings);
  }
  for (const s of supportingServices) {
    warnings.push(...s.warnings);
  }

  return {
    primaryService,
    supportingServices,
    allRetrieved,
    evidenceSources,
    preventativeMeasures,
    warnings: Array.from(new Set(warnings)).slice(0, 3),
    relevanceScore: sorted.length > 0 ? sorted[0].score : 0
  };
}

// ====================================================
// STEP 4: Deterministic Grounded Solution Synthesizer
// ====================================================

export function buildDeterministicProblemSolvingResponse(
  userQuery: string,
  analysis: ProblemSolvingAnalysis,
  retrieval: MultiSourceKnowledgeResult
): RagStructuredResponse {
  const q = userQuery.toLowerCase().trim();
  const primary = retrieval.primaryService;

  // Handle Ambiguous / Trigger query
  if (analysis.primary_intent === "ambiguous_or_clarification_required" || !primary || retrieval.relevanceScore < 25) {
    if (analysis.primary_intent === "ambiguous_or_clarification_required") {
      return {
        answer: "Could you please specify which Rwandan government service or administrative procedure you need assistance with?",
        intent: "clarification_needed",
        service: "Rwandan Public Services Assistant",
        needs_clarification: true,
        clarifying_question: "Which official Rwandan government service do you need guidance on (for example: Land Title Transfer, Lost ID Replacement, Mutuelle de Santé / CBHI, or Driving License)?",
        steps: [],
        fees: [],
        processing_time: "Instant guidance upon specifying service",
        official_url: "https://irembo.gov.rw",
        source_name: "Official Rwanda Government Knowledge Base",
        source_url: "https://irembo.gov.rw",
        last_verified: "2026-08-01",
        is_verified_grounded: true,
        analysis,
        understanding: "You contacted Mugenzi. Please specify your desired government procedure.",
        confidence_level: "low"
      };
    }

    return {
      answer:
        "I don't have enough verified information in my current Rwandan government knowledge base to answer that safely. I don't want to give you incorrect instructions. I can help connect you to official Rwandan institutions such as IremboGov, NLA, NIDA, RNP, or RDB.",
      intent: "unverified_government_inquiry",
      service: "Unverified Official Service",
      needs_clarification: false,
      clarifying_question: "",
      steps: [],
      fees: [],
      processing_time: "Information not verified",
      official_url: "https://irembo.gov.rw",
      source_name: "Official Rwanda Government Knowledge Base",
      source_url: "https://irembo.gov.rw",
      last_verified: "2026-08-01",
      is_verified_grounded: false,
      analysis,
      confidence_level: "low"
    };
  }

  // Clarification Check for specific cases
  let needsClarification = false;
  let clarifyingQuestion = "";

  if (analysis.missing_information && analysis.missing_information.length > 0) {
    if (analysis.primary_intent === "vehicle_registration_and_plates" && !q.includes("import") && !q.includes("local") && !q.includes("transfer") && !q.includes("used")) {
      needsClarification = true;
      clarifyingQuestion = "Is this vehicle newly imported from abroad (requiring customs tax clearance) or already registered in Rwanda undergoing local ownership transfer?";
    } else if (analysis.primary_intent === "start_online_shop_ecommerce" && !q.includes("enterprise") && !q.includes("company") && !q.includes("ltd") && !q.includes("sole")) {
      needsClarification = true;
      clarifyingQuestion = "Are you planning to register your online shop as an Individual Enterprise (sole proprietorship linked to your National ID) or a Limited Liability Company (Ltd)? Both are 100% free on RDB.";
    }
  }

  // Construct Problem-Solving Content
  let understanding = "";
  let answerText = "";
  let whyItMatters = "";
  let officialProcessSummary = "";

  if (analysis.primary_intent === "land_purchase_fraud_prevention") {
    understanding = "You are preparing to buy land in Rwanda and want to avoid fraud, fake sellers, double sales, and unverified informal agreements.";
    whyItMatters = "Under Rwandan Land Law (Law N° 27/2021) and Family Law, informal handwritten contracts (inyandiko z'intoki) without title deeds or spousal consent have no legal standing. Safe land acquisition requires digital registry verification on IremboGov and official signing before the Sector Land Notary.";
    answerText = `To safely buy land and prevent fraud in Rwanda, do NOT rely on informal agreements or pay cash upfront. Follow these 4 mandatory safeguards:\n\n1. **Verify UPI on IremboGov**: Check that the parcel is registered to the seller and free of active caveats (Ibiziriko), mortgages, or disputes.\n2. **Verify Matrimonial Spousal Consent**: If married, both spouses must provide authenticated written consent.\n3. **Inspect with Neighbors (Abaturanyi)**: Confirm physical boundaries with Cell leadership.\n4. **Sign Strictly with Sector Land Notary**: Execute the official transfer on IremboGov (50,000 RWF total fees).`;
    officialProcessSummary = `Official title mutation is completed through the National Land Authority (NLA) and Sector Land Notary on IremboGov. Processing takes 7 working days once notarized.`;
  } else if (analysis.primary_intent === "lost_driving_license_replacement") {
    understanding = "You lost your definitive driving license smart card in Rwanda and need to obtain an official replacement.";
    whyItMatters = "In Rwanda, you do not need to retake the driving test if you lose your license. Your driving credentials are saved in the central RNP database. You simply obtain an official Police Certificate of Loss and request a duplicate smart card on IremboGov for 25,000 RWF.";
    answerText = `To replace your lost driving license in Rwanda:\n\n1. **Obtain Police Certificate of Loss (Icyemezo cyo gutakaza)**: Report to the nearest Rwanda National Police station.\n2. **Apply on IremboGov for Duplicate Driving License**: Select 'Duplicate of Definitive Driving License' under Police Services and enter your National ID.\n3. **Pay 25,000 RWF Replacement Fee**: Pay via Mobile Money or Bank using your Irembo billing reference.\n4. **Collect New Smart Card**: Receive an SMS when printed and collect your card at your selected District Police Unit.`;
    officialProcessSummary = `Processed by Rwanda National Police (RNP) Department of Traffic & Road Safety via IremboGov. Reissue fee is 25,000 RWF.`;
  } else if (analysis.primary_intent === "cbhi_mutuelle_sante_payment") {
    understanding = "You want to pay or renew your Community Based Health Insurance (Mutuelle de Santé / CBHI) in Rwanda.";
    whyItMatters = "The CBHI fiscal coverage year runs annually from July 1st to June 30th. RSSB requires all members in a household to be covered under the registered Ubudehe category (Category 1: 0 RWF subsidized, Category 2 & 3: 3,000 RWF per person, Category 4: 7,000 RWF per person).";
    answerText = `To pay your Mutuelle de Santé (CBHI) in Rwanda:\n\n1. **Query Household on IremboGov or USSD *909#**: Enter Household Head National ID to check family members and calculated contribution.\n2. **Pay Statutory Amount**: Pay via MTN Mobile Money (*182*3*7#), Airtel Money, or Bank.\n3. **Instant Activation**: Healthcare coverage activates immediately at health centers (Centre de Santé) and District Hospitals.`;
    officialProcessSummary = `Administered by the Rwanda Social Security Board (RSSB) & MINALOC via IremboGov and USSD *909#.`;
  } else if (analysis.primary_intent === "birth_certificate_issuance") {
    understanding = "You need an official certified electronic birth certificate in Rwanda.";
    whyItMatters = "Rwandan e-certificates generated through IremboGov feature an official NIDA cryptographic QR code that is accepted digitally by all schools, embassies, and institutions without requiring physical sector stamps.";
    answerText = `To obtain a Birth Certificate in Rwanda:\n\n1. **Access IremboGov**: Select 'Application for Birth Certificate' under Family & Civil Status.\n2. **Enter National ID or Child NIN**: Auto-retrieves details from NIDA Civil Status database.\n3. **Pay 500 RWF**: Pay via Mobile Money or Bank.\n4. **Instant Download**: Receive SMS with download link to your cryptographically signed PDF certificate.`;
    officialProcessSummary = `Administered by NIDA & MINALOC via IremboGov. Fee: 500 RWF. Processing: Instant.`;
  } else if (analysis.primary_intent === "certificate_of_being_single") {
    understanding = "You need an official Certificate of Being Single (Icyemezo cy'ubuselibateri) in Rwanda.";
    whyItMatters = "Civil status certificates such as the Certificate of Being Single are valid for 3 months from issuance and are mandatory prerequisites for civil marriage declarations.";
    answerText = `To obtain a Certificate of Being Single in Rwanda:\n\n1. **Apply on IremboGov**: Select 'Certificate of Being Single' under Family and Civil Status.\n2. **Enter National ID & Reason**: Indicate purpose (e.g. Civil Marriage, Visa, Scholarship).\n3. **Pay 500 RWF**: Pay via Mobile Money or Bank.\n4. **Download Certificate**: Sector Civil Registrar approves and issues your QR-verified PDF certificate.`;
    officialProcessSummary = `Administered by MINALOC & Sector Civil Registrar via IremboGov. Fee: 500 RWF.`;
  } else if (analysis.primary_intent === "start_online_shop_ecommerce") {
    understanding = "You want to start an e-commerce online shop in Rwanda and need official business registration.";
    whyItMatters = "In Rwanda, business registration is 100% digital and free on RDB (org.rdb.rw). Registering gives you an official RRA Taxpayer Identification Number (TIN) required to open commercial bank accounts and integrate Mobile Money payment APIs.";
    answerText = `To start a compliant online shop in Rwanda:\n\n1. **Register on RDB (org.rdb.rw)**: 100% free of charge (0 RWF), approved in under 6 hours.\n2. **Receive Automatic RRA TIN**: Issued immediately with your incorporation certificate.\n3. **Integrate Payment Gateways**: Connect MTN MoMo / Airtel / Card merchant APIs using your business TIN.\n4. **Maintain Tax Compliance**: Set up RRA Electronic Billing Machine (EBM) and file periodic E-Tax declarations.`;
    officialProcessSummary = `Registration is handled 100% online via Rwanda Development Board (RDB) with automatic tax registration at Rwanda Revenue Authority (RRA).`;
  } else if (analysis.primary_intent === "lost_national_id_replacement") {
    understanding = "You lost your Rwandan National ID card (Indangamuntu) and need to replace it while protecting your identity.";
    whyItMatters = "A lost National ID must be reported immediately to prevent identity theft, unauthorized loans, or SIM registrations in your name.";
    answerText = `To replace your lost National ID card:\n\n1. **Obtain Certificate of Loss (Icyemezo cyo gutakaza)**: Report to the nearest Rwanda National Police station or Sector Office.\n2. **Apply for Replacement on IremboGov**: Select 'Replacement of National ID' under NIDA services.\n3. **Pay 1,500 RWF Fee**: Pay via Mobile Money or Bank using your Irembo billing number.\n4. **Collect New Smart ID**: Receive SMS notification and collect your new card at your chosen Sector Office.`;
    officialProcessSummary = `Processed by the National Identification Agency (NIDA) via IremboGov. Replacement fee: 1,500 RWF.`;
  } else {
    understanding = `I understand you want assistance with ${primary.title}.`;
    whyItMatters = `In Rwanda, this procedure is officially regulated by ${primary.institution}. Following official channels ensures your documentation is authentic and legally recognized.`;
    answerText = `I understand you want to complete ${primary.title}. In Rwanda, this is officially processed through ${primary.institution} (${primary.application_method}). Follow the official steps below to complete your application smoothly.`;
    officialProcessSummary = `Processed officially through ${primary.institution} via ${primary.official_url}.`;
  }

  return {
    answer: answerText,
    intent: analysis.primary_intent,
    service: primary.title,
    needs_clarification: needsClarification,
    clarifying_question: clarifyingQuestion,
    steps: primary.steps,
    fees: primary.fees,
    processing_time: primary.processing_time,
    official_url: primary.official_url,
    source_name: primary.source_name,
    source_url: primary.source_url,
    last_verified: primary.last_verified,
    is_verified_grounded: true,
    analysis,
    understanding,
    before_you_act: retrieval.preventativeMeasures,
    why_it_matters: whyItMatters,
    official_process_summary: officialProcessSummary,
    next_action: {
      label: `Proceed to ${primary.institution}`,
      action_description: `Access official portal to initiate ${primary.title}`,
      target_url: primary.official_url,
      institution: primary.institution
    },
    sources: retrieval.evidenceSources,
    warnings: retrieval.warnings,
    confidence_level: "high"
  };
}

// ====================================================
// STEP 5: Main Grounded RAG Query Processor
// ====================================================

export async function executeGroundedRagQuery(
  userQuery: string,
  history: any[] = [],
  apiKey?: string
): Promise<RagStructuredResponse> {
  // 1. Check if the user query is switching domains vs. previous conversation turn
  let scopedHistory = history;
  if (history && history.length > 0) {
    const lastUserMsg = [...history].reverse().find((h) => h.sender === "user");
    if (lastUserMsg && lastUserMsg.text) {
      const prevDomain = detectGovernmentDomain(lastUserMsg.text);
      const currDomain = detectGovernmentDomain(userQuery);

      // If domain switched, isolate session and clear prior domain history
      if (prevDomain !== currDomain && currDomain !== "UNKNOWN_DOMAIN" && currDomain !== "AMBIGUOUS_TRIGGER") {
        scopedHistory = [];
      }
    }
  }

  // 2. Intent & Goal Understanding
  const analysis = analyzeUserIntentAndGoal(userQuery, scopedHistory);

  // If ambiguous or clarification required
  if (analysis.primary_intent === "ambiguous_or_clarification_required") {
    return buildDeterministicProblemSolvingResponse(userQuery, analysis, {
      primaryService: null,
      supportingServices: [],
      allRetrieved: [],
      evidenceSources: [],
      preventativeMeasures: [],
      warnings: [],
      relevanceScore: 0
    });
  }

  // 3. Semantic Query Rewriting
  const searchQueries = generateSemanticSearchQueries(analysis, userQuery);

  // 4. Multi-Source Knowledge Retrieval
  const retrieval = retrieveMultiSourceGovernmentKnowledge(searchQueries, analysis);

  // If no sufficiently relevant knowledge was retrieved
  if (!retrieval.primaryService || retrieval.relevanceScore < 25) {
    return buildDeterministicProblemSolvingResponse(userQuery, analysis, retrieval);
  }

  // If no Gemini API Key, use the deterministic problem-solving engine
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return buildDeterministicProblemSolvingResponse(userQuery, analysis, retrieval);
  }

  // 5. Pass Grounded Knowledge & Analysis to Gemini
  try {
    const ai = new GoogleGenAI({ apiKey });

    const primaryServiceJson = JSON.stringify(retrieval.primaryService, null, 2);
    const supportingServicesJson = JSON.stringify(retrieval.supportingServices, null, 2);
    const analysisJson = JSON.stringify(analysis, null, 2);
    const preventativeChecksJson = JSON.stringify(retrieval.preventativeMeasures, null, 2);

    const ragSystemPrompt = `You are Mugenzi, the intelligent AI Rwanda Government Service Companion.
You are NOT a basic keyword-matching search chatbot. You are an INTELLIGENT PROBLEM-SOLVING SYSTEM.

### CORE PRINCIPLE:
Never assume the user's desired answer is the closest matching document title.
Distinguish between:
- Topic (e.g. Land, Driving, Health)
- Intent (e.g. Land due diligence, Replace lost driving license, Pay Mutuelle de Santé)
- Problem (e.g. Avoid getting scammed, replace lost credentials, activate medical coverage)
- Goal (e.g. Safely purchase legitimate land, restore driving credentials for 25,000 RWF)

### MANDATORY ANTI-HALLUCINATION & STRICT SCOPING RULES:
1. Ground ALL factual statements, statutory fees, processing times, required documents, and URLs strictly in the provided GROUNDED KNOWLEDGE BASE below.
2. STRICT FILTERING: NEVER leak cross-domain warnings or metadata.
   - For a Driving License response, ONLY include Driving / Police warnings (Never Land, Passport, or Tax warnings).
   - For a Birth Certificate response, ONLY include Birth / Civil Status warnings.
   - For a Mutuelle de Santé response, ONLY include CBHI / Health warnings.
3. If verified information is missing, state: "I don't have enough verified information in my current Rwandan government knowledge base to answer that safely."
4. Do not invent government requirements or fees.

### PROBLEM-SOLVING RESPONSE STRUCTURE:
Your output must provide comprehensive guidance covering:
1. "understanding": What you understand about the citizen's actual situation and problem.
2. "answer": Clear, structured conversational response with actionable advice and step-by-step guidance.
3. "why_it_matters": Explanation of why specific checks matter under Rwandan law (e.g. Land Law N° 27/2021, Family Law spousal consent, Traffic Law).
4. "before_you_act": List of concrete preventative checks / precautions with rationale.
5. "needs_clarification": True ONLY if critical details are missing to give a safe answer. If true, ask a single focused "clarifying_question".
6. "steps": Official step-by-step procedure from the grounded knowledge base.
7. "fees": Official statutory fees.
8. "processing_time": Official processing timeline.
9. "official_url": Official government portal link.
10. "sources": List of participating government institutions with relevance reasons.

### GROUNDED CONTEXT:
PRIMARY GOVERNMENT SERVICE:
${primaryServiceJson}

SUPPORTING SERVICES:
${supportingServicesJson}

INTENT & GOAL ANALYSIS:
${analysisJson}

PREVENTATIVE MEASURES:
${preventativeChecksJson}

### USER MESSAGE:
"${userQuery}"

### OUTPUT FORMAT:
Output MUST be a valid JSON object matching the RagStructuredResponse format:
{
  "answer": "Comprehensive, structured explanation addressing the user's core problem",
  "intent": "${analysis.primary_intent}",
  "service": "${retrieval.primaryService.title}",
  "understanding": "Clear statement of the citizen's situation",
  "why_it_matters": "Legal and practical reasons for the recommended safeguards",
  "needs_clarification": false,
  "clarifying_question": "",
  "before_you_act": ${preventativeChecksJson},
  "steps": ${JSON.stringify(retrieval.primaryService.steps)},
  "fees": ${JSON.stringify(retrieval.primaryService.fees)},
  "processing_time": "${retrieval.primaryService.processing_time}",
  "official_url": "${retrieval.primaryService.official_url}",
  "source_name": "${retrieval.primaryService.source_name}",
  "source_url": "${retrieval.primaryService.source_url}",
  "last_verified": "${retrieval.primaryService.last_verified}"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: ragSystemPrompt }] }],
      config: {
        responseMimeType: "application/json"
      }
    });

    const jsonText = response.text || "{}";
    const parsed: Partial<RagStructuredResponse> = JSON.parse(jsonText);

    return {
      answer: parsed.answer || retrieval.primaryService.description,
      intent: parsed.intent || analysis.primary_intent,
      service: retrieval.primaryService.title,
      needs_clarification: Boolean(parsed.needs_clarification),
      clarifying_question: parsed.clarifying_question || "",
      understanding: parsed.understanding || `I understand you need assistance regarding ${retrieval.primaryService.title}.`,
      why_it_matters: parsed.why_it_matters || `Regulated under official Rwandan statutory guidelines.`,
      before_you_act: Array.isArray(parsed.before_you_act) && parsed.before_you_act.length > 0
        ? (parsed.before_you_act as PreventativeCheckItem[])
        : retrieval.preventativeMeasures,
      steps: Array.isArray(parsed.steps) && parsed.steps.length > 0 ? parsed.steps : retrieval.primaryService.steps,
      fees: Array.isArray(parsed.fees) && parsed.fees.length > 0 ? parsed.fees : retrieval.primaryService.fees,
      processing_time: parsed.processing_time || retrieval.primaryService.processing_time,
      official_url: parsed.official_url || retrieval.primaryService.official_url,
      source_name: retrieval.primaryService.source_name,
      source_url: retrieval.primaryService.source_url,
      last_verified: retrieval.primaryService.last_verified,
      is_verified_grounded: true,
      analysis,
      official_process_summary: `Official service processed via ${retrieval.primaryService.institution}.`,
      next_action: {
        label: `Proceed to ${retrieval.primaryService.institution}`,
        action_description: `Access official portal to initiate ${retrieval.primaryService.title}`,
        target_url: retrieval.primaryService.official_url,
        institution: retrieval.primaryService.institution
      },
      sources: retrieval.evidenceSources,
      warnings: retrieval.warnings,
      confidence_level: "high"
    };
  } catch (error) {
    console.error("Gemini Intelligent RAG generation error, falling back to deterministic problem solver:", error);
    return buildDeterministicProblemSolvingResponse(userQuery, analysis, retrieval);
  }
}

// Re-export backward compatibility aliases
export function retrieveGovernmentKnowledge(query: string) {
  const analysis = analyzeUserIntentAndGoal(query);
  const queries = generateSemanticSearchQueries(analysis, query);
  const retrieval = retrieveMultiSourceGovernmentKnowledge(queries, analysis);
  return {
    matchedService: retrieval.primaryService,
    relevanceScore: retrieval.relevanceScore,
    allMatches: retrieval.allRetrieved
  };
}

export function buildDeterministicGroundedResponse(userQuery: string, service: GovernmentServiceRecord | null) {
  const analysis = analyzeUserIntentAndGoal(userQuery);
  const queries = generateSemanticSearchQueries(analysis, userQuery);
  const retrieval = retrieveMultiSourceGovernmentKnowledge(queries, analysis);
  return buildDeterministicProblemSolvingResponse(userQuery, analysis, retrieval);
}
