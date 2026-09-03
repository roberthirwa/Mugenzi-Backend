import { GovernmentServiceRecord } from "../types/domain";

export const INITIAL_RWANDA_GOVERNMENT_SERVICES: GovernmentServiceRecord[] = [
  {
    service_id: "nla_land_due_diligence_verification",
    title: "Land Status Verification, Due Diligence & Fraud Prevention (Kugenzura Ubutaka n'Umutekano wabwo)",
    institution: "National Land Authority (NLA) & Sector Land Notary",
    category: "Land Due Diligence & Safety",
    description: "Official legal procedures, statutory safeguards, and digital registry checks required before executing any land transaction or making payments in Rwanda to prevent fraud, fake sellers, unnotarized agreements, and encumbrance losses.",
    eligibility: [
      "Prospective land buyers and investors conducting pre-purchase due diligence",
      "Landowners verifying the active status of their Unique Parcel Identifier (UPI)",
      "Citizens confirming registered boundaries, ownership, and zoning compliance"
    ],
    required_documents: [
      "Unique Parcel Identifier (UPI) number of the target land (e.g., 1/02/03/04/1234)",
      "Official Land Title Deed (Icyangombwa cy'ubutaka) copy for cross-checking",
      "Seller's National ID card and matrimonial civil status verification",
      "Notarized Power of Attorney (Ububasha) if seller is represented by a third-party agent"
    ],
    requirements: [
      "Mandatory UPI registry search on IremboGov or via Sector Land Officer before executing private sale contracts or transferring money.",
      "In-person physical boundary verification with adjacent neighbors (Abaturanyi) and local Cell leadership (Akagari).",
      "Verification that the parcel is free of active bank mortgages, court caveats (Ibiziriko), tax liens, or expropriation master plan reservations."
    ],
    steps: [
      {
        number: 1,
        title: "Search UPI in Official NLA Land Registry via IremboGov",
        explanation: "Enter the seller's UPI on IremboGov Land Services. Confirm the registered owner's name, parcel size, land use zoning, and verify that there are NO active caveats, court freezes, or bank mortgage liens on the title.",
        documents: ["UPI Number"],
        action: "Check Parcel on Irembo"
      },
      {
        number: 2,
        title: "Verify Seller Identity & Spousal Matrimonial Consent",
        explanation: "Match the seller's National ID against the official registry title. If the seller is married under Community of Property (Umutungo w'Umuryango), Rwandan law requires written and authenticated consent from both spouses.",
        documents: ["Seller National ID", "Marriage Certificate / Spousal Consent"],
        action: "Verify Identity & Spousal Consent"
      },
      {
        number: 3,
        title: "On-Site Physical Inspection & Neighbor Confirmation (Abaturanyi)",
        explanation: "Visit the physical parcel with the local Cell (Akagari) Executive Secretary and adjacent neighbors to confirm boundaries, verify absence of informal disputes, and ensure the physical land matches the cadastral map.",
        documents: ["Cadastral Sketch", "UPI Title Copy"],
        action: "Inspect Boundaries on Site"
      },
      {
        number: 4,
        title: "Execute Notarized Sale Contract Before Sector Notary",
        explanation: "Never make full cash payment or rely on informal handwritten chits (Inyandiko y'intoki). Execute the official sale agreement strictly before the public Sector Land Notary (Umwanditsi w'Ubutaka) or a certified private notary.",
        documents: ["Official Sale Contract", "National IDs", "Spousal Consent"],
        action: "Sign with Notary & Transfer on Irembo"
      }
    ],
    fees: [
      { name: "Online Land UPI Status Query", amountRwf: 0, description: "Free digital verification on IremboGov" },
      { name: "Sector Notary Authentication & Title Mutation", amountRwf: 50000, description: "Official statutory mutation and notary certification fees" }
    ],
    processing_time: "Instant digital registry verification; 7 working days for final notarized mutation",
    application_method: "100% Digital verification on IremboGov + On-site inspection at local Sector/Cell",
    official_url: "https://irembo.gov.rw/home/citizen/all_services",
    related_services: ["nla_land_title_transfer", "nla_first_land_registration", "rib_minijust_land_fraud_protection"],
    common_questions: [
      {
        question: "Can I buy land if the seller only has an informal handwritten agreement?",
        answer: "No. Under Rwandan Land Law, informal contracts (inyandiko z'intoki) without official NLA title deeds have no legal standing and cannot transfer legal ownership. You risk losing all funds."
      },
      {
        question: "What happens if a married seller tries to sell without spousal consent?",
        answer: "The transaction is legally invalid under Rwandan Family Law. The non-consenting spouse can challenge and annul the sale in court, resulting in loss of the property."
      }
    ],
    warnings: [
      "CRITICAL: Never pay money directly to unauthorized middlemen or brokers (abakomiseri) without certified notary presence.",
      "Check with the City/District One Stop Center to ensure the land is not designated for high-voltage infrastructure, wetland buffers, or government expropriation."
    ],
    source_name: "National Land Authority (NLA) & Ministry of Environment Land Guidelines",
    source_url: "https://environment.gov.rw",
    last_verified: "2026-08-01",
    status: "active",
    intents: ["land_purchase_safety", "avoid_land_fraud", "verify_land_ownership", "land_status_check", "pre_purchase_due_diligence"],
    goals: ["avoid_land_fraud", "safely_purchase_legitimate_land", "verify_seller_authority", "prevent_double_sales", "ensure_legal_titling"],
    problem_types: ["risk_prevention", "dispute_resolution_risk"],
    risks_addressed: ["buying_unregistered_or_encumbered_land", "fake_sellers", "omitted_spousal_consent", "unnotarized_informal_contracts", "zoning_violations"],
    preventative_measures: [
      "Verify the UPI in NLA registry to confirm registered owner and check for caveats/mortgages.",
      "Verify seller National ID and require mandatory written spousal consent if married.",
      "Conduct on-site boundary inspection with adjacent neighbors (Abaturanyi).",
      "Only execute transactions before the official Sector Land Notary on IremboGov."
    ],
    legal_protections: ["Law N° 27/2021 Governing Land in Rwanda", "Law N° 32/2016 Governing Persons and Family"],
    life_situations: ["Buying land or residential plot", "Property investment", "Building a family home"]
  },
  {
    service_id: "rib_minijust_land_fraud_protection",
    title: "Land Dispute Resolution, Unauthorized Seller Protection & Legal Remedies",
    institution: "National Land Authority (NLA), MINIJUST & Rwanda Investigation Bureau (RIB)",
    category: "Legal Protection & Remedies",
    description: "Legal recourse, dispute resolution, and statutory protections when encountering fraudulent sellers, unauthorized sales, contested titles, or non-ownership disputes under Rwandan law.",
    eligibility: [
      "Citizens suspecting fraudulent land transactions or fake document presentation",
      "Buyers discovering that a seller does not legally own the transacted parcel",
      "Victims of illegal double-sale schemes or unauthorized proxy sales"
    ],
    required_documents: [
      "Evidence of transaction (payment receipts, banking records, SMS/mobile money logs)",
      "Alleged land title or UPI documentation presented by the fraudulent party",
      "National ID copy and identity details of the suspect",
      "Signed witness statements from Cell leadership or adjacent neighbors"
    ],
    requirements: [
      "Under Rwandan civil and penal law, an agreement to transfer land by a person who is NOT the registered owner or authorized agent (holding an authentic notarized power of attorney) is NULL AND VOID.",
      "Immediate reporting to the nearest Rwanda Investigation Bureau (RIB) station or local Sector Land Officer."
    ],
    steps: [
      {
        number: 1,
        title: "Immediate Cease of All Financial Transactions",
        explanation: "Stop all payments immediately. Do not make additional installments or sign supplemental private memorandums.",
        documents: [],
        action: "Stop Payments"
      },
      {
        number: 2,
        title: "Official Registry Audit at Sector Land Office (Umurenge)",
        explanation: "Request the Sector Land Manager or District Land Registrar to pull the authentic title record from the National Land Registry using the UPI to verify the true lawful owner.",
        documents: ["UPI Number"],
        action: "Audit Ownership Record"
      },
      {
        number: 3,
        title: "File Criminal Fraud Report at Rwanda Investigation Bureau (RIB)",
        explanation: "Lodge a formal criminal complaint with RIB Economic Crimes Division for fraud, forgery, or selling property not belonging to the vendor (Kugurisha umutungo utari uwawe).",
        documents: ["Bank Statements", "Communication Logs", "Fake Title Copy"],
        action: "File RIB Complaint"
      },
      {
        number: 4,
        title: "Civil Restitution & Injunction (Kwizirika Ubutaka)",
        explanation: "Engage an advocate or Legal Aid clinic (MAJ - Maison d'Accès à la Justice) at District level to place an official caveat on the UPI to prevent further fraudulent transactions.",
        documents: ["RIB Case Number", "Legal Notice"],
        action: "Place Legal Caveat"
      }
    ],
    fees: [
      { name: "RIB Criminal Complaint Filing", amountRwf: 0, description: "Completely free public justice service" },
      { name: "District MAJ Legal Aid Consultation", amountRwf: 0, description: "Free legal orientation for citizens" }
    ],
    processing_time: "Immediate recording of criminal complaint; 24-48 hours for emergency registry caveat",
    application_method: "In-person at RIB station or District MAJ Office + Official submission to NLA Registrar",
    official_url: "https://www.rib.gov.rw",
    related_services: ["nla_land_due_diligence_verification", "nla_land_title_transfer"],
    common_questions: [
      {
        question: "Can I claim ownership if I paid money in good faith to someone who didn't own the land?",
        answer: "No. Under Rwandan Property Law, you cannot obtain valid title from a non-owner. However, you have the full legal right to pursue criminal prosecution against the fraudster through RIB and civil suit for financial recovery."
      }
    ],
    warnings: [
      "Forging land documents or misrepresenting land ownership carries severe prison sentences under the Rwandan Penal Code.",
      "Always verify that powers of attorney (Ububasha) are signed by an authorized notary before accepting agent representation."
    ],
    source_name: "Ministry of Justice (MINIJUST) & Rwanda Investigation Bureau (RIB)",
    source_url: "https://www.minijust.gov.rw",
    last_verified: "2026-08-01",
    status: "active",
    intents: ["seller_non_ownership_risk", "land_fraud_remedy", "dispute_resolution", "fake_seller_recourse"],
    goals: ["protect_against_unauthorized_sale", "report_land_fraud", "recover_funds", "freeze_contested_land"],
    problem_types: ["dispute_resolution_risk", "risk_prevention"],
    risks_addressed: ["fake_seller_non_owner", "unauthorized_proxy_sale", "forged_land_titles", "double_sale_fraud"],
    preventative_measures: ["Verify title before paying", "Never accept unnotarized power of attorney", "Consult Sector Land Officer immediately"],
    legal_protections: ["Law N° 68/2018 Determining Offences and Penalties", "Law N° 27/2021 Governing Land in Rwanda"],
    life_situations: ["Land transaction disputes", "Suspected fraud", "Contract breach"]
  },
  {
    service_id: "nla_land_title_transfer",
    title: "Land Title Transfer / Mutation (Gusimbuza Nyir'ubutaka - Sale / Donation / Succession)",
    institution: "National Land Authority (NLA) & Sector Land Notary",
    category: "Land Title Transfer",
    description: "Official legal transfer of land ownership and issuance of an updated title deed from seller/donor/deceased to buyer/recipient/heir.",
    eligibility: [
      "Seller/Donor holding a valid Land Title Deed with clear UPI and no encumbrances/mortgages",
      "Buyer/Recipient holding valid Rwandan National ID or passport",
      "Spousal consent required for married property owners"
    ],
    required_documents: [
      "Digital Land Title with UPI number",
      "National IDs of both Seller(s) and Buyer(s)",
      "Notarized Sale Agreement or Donation/Succession Act",
      "Spousal consent confirmation (with marriage certificate) if seller is married",
      "RRA Tax Clearance on property (if applicable)"
    ],
    requirements: [
      "Both parties (or legally authorized proxies with power of attorney) must sign before the Sector Land Notary or certified private notary.",
      "Parcel must not have an active caveat, mortgage lien, or court injunction in the land registry."
    ],
    steps: [
      {
        number: 1,
        title: "Initiate Title Transfer on IremboGov",
        explanation: "Enter the land UPI number, seller National ID, and buyer National ID to verify parcel status and initiate mutation.",
        documents: ["UPI Number", "National IDs"],
        action: "Initiate on Irembo"
      },
      {
        number: 2,
        title: "Upload Notarized Agreement & Spousal Consent",
        explanation: "Attach sale agreement and written spousal consent (or proof of single status / marriage property regime).",
        documents: ["Sale Contract", "Spousal Consent"],
        action: "Upload Documents"
      },
      {
        number: 3,
        title: "Notary Signing & Payment",
        explanation: "Pay 20,000 RWF transfer fee + 30,000 RWF Sector Notary certification fee on Irembo and sign before the Sector Notary.",
        documents: ["Billing Number"],
        action: "Sign with Notary"
      },
      {
        number: 4,
        title: "NLA Review & New Title Deed Issuance",
        explanation: "The District Land Registrar approves the mutation. Buyer receives an SMS to download the newly registered Land Title in their name.",
        documents: ["SMS Confirmation Link"],
        action: "Download New Title"
      }
    ],
    fees: [
      { name: "Land Title Mutation & Transfer Fee", amountRwf: 20000, description: "Official NLA land transfer fee" },
      { name: "Public Notary Authentication Fee", amountRwf: 30000, description: "Sector Notary legal verification and contract authentication fee" }
    ],
    processing_time: "7 working days after notary signature",
    application_method: "Online via IremboGov + In-person contract notarization at Sector Office (Umurenge)",
    official_url: "https://irembo.gov.rw/home/citizen/all_services",
    related_services: ["nla_land_due_diligence_verification", "nla_first_land_registration", "nla_land_title_update"],
    common_questions: [
      {
        question: "Can land be sold without the consent of the spouse in Rwanda?",
        answer: "No. Under Rwandan law, land held under community of property cannot be transferred without verified, notarized consent from both spouses."
      }
    ],
    warnings: [
      "Always verify the UPI on IremboGov before making any land purchase payments to ensure the parcel is free of liens or disputes."
    ],
    source_name: "National Land Authority (NLA) Guidelines & IremboGov",
    source_url: "https://irembo.gov.rw",
    last_verified: "2026-08-01",
    status: "active",
    intents: ["land_transfer", "buy_land_transfer", "sell_land", "title_mutation", "inherit_land"],
    goals: ["transfer_land_title", "formalize_land_ownership", "register_acquired_property"],
    problem_types: ["procedure_execution"],
    risks_addressed: ["unregistered_transfer", "omitted_mutation_taxes"],
    preventative_measures: ["Complete due diligence before transfer", "Obtain all spousal consents"],
    legal_protections: ["Law N° 27/2021 Governing Land in Rwanda"],
    life_situations: ["Purchasing land", "Inheriting family estate", "Gifting land to children"]
  },
  {
    service_id: "nla_first_land_registration",
    title: "First Land Registration & Title Issuance (Kwibarura Ubutaka bwa mbere)",
    institution: "National Land Authority (NLA) & Local Sector Land Office",
    category: "First Land Registration",
    description: "Initial demarcation, registration, and title deed issuance for previously unrecorded land parcels in Rwanda.",
    eligibility: [
      "Rwandan citizen or legal entity owning unregistered land acquired through legitimate customary inheritance or legal acquisition",
      "Land parcel with undisputed boundaries verified by local cell leaders"
    ],
    required_documents: [
      "National ID of the landowner(s)",
      "Proof of lawful acquisition (e.g. Customary inheritance confirmation signed by family/cell, purchase agreement, or local leadership certificate)",
      "Cadastral demarcation sketch from authorized land surveyor"
    ],
    requirements: [
      "Physical parcel boundary demarcation and public neighborhood confirmation with adjacent neighbors (Abaturanyi).",
      "Verification by the Sector Land Manager."
    ],
    steps: [
      {
        number: 1,
        title: "Field Demarcation & Surveying",
        explanation: "Engage Sector Land Officer or certified surveyor to record GPS coordinates and demarcate parcel boundaries with neighbors present.",
        documents: ["Boundary Sketch", "Witness Signatures"],
        action: "Complete Survey"
      },
      {
        number: 2,
        title: "Submit Registration on IremboGov",
        explanation: "Submit First Land Registration application on IremboGov with cadastral survey and local authority approval.",
        documents: ["Survey Report", "Ownership Proof", "National IDs"],
        action: "Apply on Irembo"
      },
      {
        number: 3,
        title: "Pay Demarcation & Title Deed Fee",
        explanation: "Pay 5,000 RWF parcel titling fee via Irembo billing code.",
        documents: ["Billing Number"],
        action: "Pay 5,000 RWF"
      },
      {
        number: 4,
        title: "NLA Approval & Digital Title Deed Issuance",
        explanation: "National Land Authority assigns Unique Parcel Identifier (UPI) and issues digital Land Title Deed (Icyangombwa cy'ubutaka).",
        documents: ["SMS Confirmation"],
        action: "Download Land Title"
      }
    ],
    fees: [
      { name: "First Parcel Titling & Registration Fee", amountRwf: 5000, description: "Official NLA titling fee on Irembo" }
    ],
    processing_time: "30 working days following survey and local neighbor approval",
    application_method: "Field survey by Sector Land Officer + Digital registration on IremboGov",
    official_url: "https://irembo.gov.rw/home/citizen/all_services",
    related_services: ["nla_land_title_transfer", "nla_land_title_update"],
    common_questions: [
      {
        question: "What is a UPI in Rwanda?",
        answer: "UPI stands for Unique Parcel Identifier (e.g. 1/02/03/04/1234), which is the official digital identification number for every land parcel in Rwanda."
      }
    ],
    warnings: [
      "All boundary disputes must be resolved before title issuance; NLA cannot title contested land."
    ],
    source_name: "National Land Authority (NLA) Official Procedures",
    source_url: "https://environment.gov.rw",
    last_verified: "2026-08-01",
    status: "active",
    intents: ["first_land_registration", "register_customary_land", "title_unregistered_land"],
    goals: ["secure_land_title_deed", "formalize_family_land"],
    problem_types: ["procedure_execution"]
  },
  {
    service_id: "nla_land_title_update",
    title: "Land Title Information Update, Merging & Subdivision (Guhindura amakuru ku cyangombwa cy'ubutaka)",
    institution: "National Land Authority (NLA)",
    category: "Land Title Update",
    description: "Modification of existing land title information, subdivision of a parcel into multiple plots, merging adjacent parcels, or correcting landowner identity details.",
    eligibility: [
      "Registered landowner(s) holding an active UPI title deed in Rwanda"
    ],
    required_documents: [
      "Existing Land Title Deed (UPI Number)",
      "National ID of landowner(s)",
      "Survey report & new parcel subdivision/merging sketch from certified surveyor (for subdivision/merging)",
      "Legal justification document (e.g. NIDA identity correction certificate)"
    ],
    requirements: [
      "Compliance with Master Plan zoning regulations (for plot subdivisions in Kigali and secondary cities)."
    ],
    steps: [
      {
        number: 1,
        title: "Submit Update Request on IremboGov",
        explanation: "Choose 'Land Title Information Update' or 'Subdivision/Merging' on IremboGov and enter your UPI.",
        documents: ["UPI Number", "National ID"],
        action: "Apply on Irembo"
      },
      {
        number: 2,
        title: "Upload Surveyor Sketch & Supporting Docs",
        explanation: "Attach zoning-compliant surveyor subdivision map or identity rectification document.",
        documents: ["Cadastral Sketch", "ID Proof"],
        action: "Upload Documents"
      },
      {
        number: 3,
        title: "Pay Service Fee",
        explanation: "Pay 5,000 RWF (information update) or 10,000 RWF per subdivided new plot.",
        documents: ["Billing Number"],
        action: "Pay Service Fee"
      },
      {
        number: 4,
        title: "Receive Updated Title Deeds",
        explanation: "Receive SMS with download link for updated title deed(s) with new UPIs.",
        documents: ["SMS Confirmation"],
        action: "Download Titles"
      }
    ],
    fees: [
      { name: "Land Title Information Update Fee", amountRwf: 5000, description: "Correction or update of registry details" },
      { name: "Parcel Subdivision / Merging Fee (Per Plot)", amountRwf: 10000, description: "Fee for each resulting parcel" }
    ],
    processing_time: "5 to 7 working days",
    application_method: "Online via IremboGov",
    official_url: "https://irembo.gov.rw/home/citizen/all_services",
    related_services: ["nla_land_title_transfer", "nla_first_land_registration"],
    common_questions: [
      {
        question: "Can I subdivide agricultural or residential land below master plan minimum plot sizes?",
        answer: "No. Subdivision must strictly comply with local master plan regulations and minimum plot size requirements."
      }
    ],
    warnings: [
      "Unapproved subdivisions without NLA approval have no legal recognition."
    ],
    source_name: "National Land Authority (NLA) Registry Regulations",
    source_url: "https://environment.gov.rw",
    last_verified: "2026-08-01",
    status: "active",
    intents: ["subdivide_land", "merge_parcels", "correct_land_title"],
    goals: ["split_plot", "update_title_details"],
    problem_types: ["procedure_execution"]
  },
  {
    service_id: "nida_national_id",
    title: "National Identity Card (Indangamuntu) Issuance & Replacement",
    institution: "National Identification Agency (NIDA) / IremboGov",
    category: "National ID",
    description: "Application for the first issuance of the Rwandan National ID card for citizens aged 16 and above, or replacement of lost/damaged National Identity cards.",
    eligibility: [
      "Rwandan citizen aged 16 years or older (First issuance)",
      "Registered citizen with biometric and civil status records in NIDA database",
      "Citizens with lost, stolen, mutilated, or outdated ID cards (Replacement)"
    ],
    required_documents: [
      "Birth Certificate or Citizen Registration Number (for first issuance)",
      "Certificate of Loss from Rwanda National Police / Sector (for replacement of lost ID)",
      "Copy of previous National ID or NIDA citizen application code (if available)"
    ],
    requirements: [
      "Physical biometric verification (fingerprints and photo) at local Sector Office (Umurenge)",
      "Valid Rwandan phone number and National Identification Number (NIN) for tracking"
    ],
    steps: [
      {
        number: 1,
        title: "Submit Application on IremboGov",
        explanation: "Log in or access IremboGov, select National Identification Services, and choose 'Application for National ID' or 'Replacement of National ID'.",
        documents: ["Citizen Profile", "Police Loss Report (if replacement)"],
        action: "Apply on IremboGov"
      },
      {
        number: 2,
        title: "Pay the Processing Fee",
        explanation: "Pay via Mobile Money (MTN/Airtel), Bank of Kigali (BK), or online card using the generated Irembo billing number.",
        documents: ["Irembo Bill ID"],
        action: "Make Payment"
      },
      {
        number: 3,
        title: "Biometric Capture at Sector Office",
        explanation: "Visit your local Sector Office (Umurenge) Civil Registrar for digital fingerprint and portrait photo capture if not already on file.",
        documents: ["Payment SMS Receipt", "National ID Slip"],
        action: "Visit Sector Office"
      },
      {
        number: 4,
        title: "ID Production and Collection",
        explanation: "Track SMS notification when the physical smart ID is printed. Collect your new ID at your chosen Sector Office upon signing the register.",
        documents: ["Collection SMS Notification", "Previous ID or Loss Certificate"],
        action: "Collect Card at Umurenge"
      }
    ],
    fees: [
      { name: "First National ID Issuance (Citizens 16+)", amountRwf: 500, description: "Official statutory fee for initial ID registration" },
      { name: "Replacement of Lost or Damaged ID", amountRwf: 1500, description: "Fee to reissue duplicate National ID card" }
    ],
    processing_time: "30 calendar days for standard production, or 15 days in expedited urban centers",
    application_method: "Online via IremboGov portal + Physical biometric capture at Sector Office (Umurenge)",
    official_url: "https://irembo.gov.rw/home/citizen/all_services",
    related_services: ["dgie_first_epassport", "irembo_birth_certificate", "rnp_provisional_driving_licence"],
    common_questions: [
      {
        question: "What should I do immediately if I lose my National ID?",
        answer: "Report the loss immediately to the nearest Rwanda National Police station to obtain a Certificate of Loss, then apply for replacement on IremboGov."
      },
      {
        question: "Can I collect my ID from a different Sector than where I applied?",
        answer: "During application on IremboGov, you must select your preferred collection Sector Office."
      }
    ],
    warnings: [
      "Do not pay unauthorized third-party agents; all official fees are paid directly to the Irembo billing code.",
      "Providing false identity information is punishable under Rwandan penal law."
    ],
    source_name: "Official IremboGov & NIDA Service Catalog",
    source_url: "https://irembo.gov.rw",
    last_verified: "2026-08-01",
    status: "active",
    intents: ["national_id_replacement", "lost_id_recovery", "first_national_id", "replace_damaged_id"],
    goals: ["replace_lost_id", "obtain_first_national_id", "restore_citizen_credentials"],
    problem_types: ["recovery_replacement", "procedure_execution"],
    risks_addressed: ["identity_theft", "unauthorized_impersonation"],
    preventative_measures: ["Obtain police certificate of loss immediately to protect against fraudulent loans or SIM registrations."]
  },
  {
    service_id: "irembo_birth_certificate",
    title: "Application for Birth Certificate (Icyemezo cy'amavuko)",
    institution: "Ministry of Local Government (MINALOC) & NIDA",
    category: "Birth Certificate",
    description: "Issuance of an official certified electronic birth certificate for Rwandan citizens registered in the National Civil Status database.",
    eligibility: [
      "Citizen born in Rwanda whose birth was declared to civil status officers within statutory timelines",
      "Parents or legal guardians of a child registered in the civil register"
    ],
    required_documents: [
      "National Identification Number (NIN) of the child or applicant",
      "Parents' National ID numbers",
      "Hospital Birth Notification Slip (for newborns not yet in civil database)"
    ],
    requirements: [
      "The birth must already be recorded in the Rwandan National Civil Status Register (NIDA/MINALOC)."
    ],
    steps: [
      {
        number: 1,
        title: "Access Civil Status on IremboGov",
        explanation: "Go to IremboGov > Family & Civil Status > Birth Certificate.",
        documents: ["Applicant National ID or Child NIN"],
        action: "Fill Online Form"
      },
      {
        number: 2,
        title: "Verify Child & Parents Data",
        explanation: "Enter National ID / NIN to auto-retrieve and confirm names, place of birth, and parents' details.",
        documents: [],
        action: "Confirm Details"
      },
      {
        number: 3,
        title: "Pay Statutory Fee",
        explanation: "Pay 500 RWF via Mobile Money or Bank using the 9-digit Irembo payment number.",
        documents: ["Billing Number"],
        action: "Pay 500 RWF"
      },
      {
        number: 4,
        title: "Instant Digital Certificate Download",
        explanation: "Once approved by the Sector Civil Registrar, receive an SMS with a download link containing the cryptographically signed PDF with verification QR code.",
        documents: ["SMS Confirmation"],
        action: "Download PDF Certificate"
      }
    ],
    fees: [
      { name: "Certified Digital Birth Certificate", amountRwf: 500, description: "Standard government service fee per certificate copy" }
    ],
    processing_time: "1 working day (often instantaneous upon automatic registry match)",
    application_method: "100% Digital via IremboGov portal with instant PDF download",
    official_url: "https://irembo.gov.rw/home/citizen/all_services",
    related_services: ["nida_national_id", "irembo_marriage_declaration", "dgie_first_epassport"],
    common_questions: [
      {
        question: "Does the digital birth certificate require physical stamps from the Sector?",
        answer: "No. Rwandan e-certificates feature an official NIDA cryptographic QR code that can be verified instantly online by any institution, embassy, or school."
      }
    ],
    warnings: [
      "If the child was not declared at birth within 30 days, you must first visit the Sector Civil Officer for late registration regularization."
    ],
    source_name: "Official IremboGov Civil Status Documentation",
    source_url: "https://irembo.gov.rw",
    last_verified: "2026-08-01",
    status: "active",
    intents: ["birth_certificate", "obtain_birth_record", "child_civil_registration"],
    goals: ["obtain_birth_certificate", "enrol_child_school", "passport_application_requirement"],
    problem_types: ["procedure_execution"]
  },
  {
    service_id: "irembo_marriage_declaration",
    title: "Civil Marriage Declaration & Booking (Gusezerana mu mategeko)",
    institution: "Ministry of Local Government (MINALOC) / Sector Office",
    category: "Marriage Declaration",
    description: "Declaration of intention to contract civil marriage, publication of marriage banns for 21 days, and scheduling the marriage ceremony at the Sector Office.",
    eligibility: [
      "Both spouses must be at least 21 years of age (or have judicial consent if permitted by law)",
      "Both spouses must be legally single, divorced, or widowed",
      "At least one spouse must have a registered residence in the chosen Sector"
    ],
    required_documents: [
      "National ID copies of both intending spouses",
      "Birth Certificates of both spouses",
      "Certificate of Being Single (Icyemezo cy'ubuselibateri) or Certificate of Celibacy for each spouse",
      "Divorce Certificate (if previously married) or Death Certificate of deceased spouse (if widowed)",
      "National IDs of 2 adult witnesses"
    ],
    requirements: [
      "Application must be initiated at least 21 calendar days before the intended date of marriage to allow statutory public banns publication at the Sector Office."
    ],
    steps: [
      {
        number: 1,
        title: "Submit Joint Marriage Application on IremboGov",
        explanation: "Enter both spouses' National ID numbers, select the solemnization Sector Office, and choose the requested wedding ceremony date (minimum 21 days ahead).",
        documents: ["Both National IDs", "Certificates of Being Single"],
        action: "Book Ceremony on Irembo"
      },
      {
        number: 2,
        title: "Upload Supporting Civil Certificates",
        explanation: "Upload birth certificates, certificates of celibacy, and witness IDs for preliminary verification by the Sector Civil Registrar.",
        documents: ["Birth Certs", "Single Certs", "Witness IDs"],
        action: "Attach Documents"
      },
      {
        number: 3,
        title: "Public Banns Display Period (21 Days)",
        explanation: "The Sector Office displays the public marriage announcement for 21 days to ensure there are no legal oppositions.",
        documents: [],
        action: "Wait for Banns Period"
      },
      {
        number: 4,
        title: "Pre-Marriage Civil Interview & Solemnization",
        explanation: "Attend the Sector Office with your 2 witnesses on the booked date for the official civil wedding ceremony and signing of the marriage register.",
        documents: ["Original National IDs", "Witnesses Present"],
        action: "Attend Ceremony at Umurenge"
      }
    ],
    fees: [
      { name: "Marriage Declaration Filing", amountRwf: 0, description: "Free online booking on Irembo" },
      { name: "Sector Marriage Solemnization Fee", amountRwf: 5000, description: "Official administrative ceremony fee at Sector Office" }
    ],
    processing_time: "21 calendar days mandatory statutory banns publication period",
    application_method: "Online booking on IremboGov followed by physical appearance at the Sector Office (Umurenge)",
    official_url: "https://irembo.gov.rw/home/citizen/all_services",
    related_services: ["irembo_certificate_being_single", "irembo_marriage_certificate", "irembo_birth_certificate"],
    common_questions: [
      {
        question: "Can we get married immediately in less than 21 days?",
        answer: "The 21-day notice is required by Rwandan Family Law. Exemptions require an official waiver approved by the District Mayor for grave emergency reasons."
      }
    ],
    warnings: [
      "Religious or traditional weddings without prior civil marriage at the Sector Office have no legal standing under Rwandan civil law."
    ],
    source_name: "MINALOC Civil Status Regulations & IremboGov",
    source_url: "https://irembo.gov.rw",
    last_verified: "2026-08-01",
    status: "active",
    intents: ["civil_marriage_booking", "getting_married", "marriage_preparation", "gusezerana"],
    goals: ["plan_civil_wedding", "fulfill_21_day_banns", "legalize_union"],
    problem_types: ["life_event_planning", "procedure_execution"],
    risks_addressed: ["unregistered_marriage", "lack_of_legal_protection"]
  },
  {
    service_id: "irembo_marriage_certificate",
    title: "Application for Marriage Certificate (Icyemezo cyo gushyingirwa)",
    institution: "Ministry of Local Government (MINALOC) & NIDA",
    category: "Marriage Certificate",
    description: "Issuance of an official certified electronic marriage certificate for couples legally married under Rwandan civil law.",
    eligibility: [
      "Spouses who completed civil marriage registration at any Rwandan Sector Office or Rwandan Embassy abroad",
      "Authorized legal representatives"
    ],
    required_documents: [
      "National ID number of either spouse or the civil marriage registration number"
    ],
    requirements: [
      "The civil marriage must already have taken place and been logged in the national civil registry."
    ],
    steps: [
      {
        number: 1,
        title: "Select Marriage Certificate on IremboGov",
        explanation: "Navigate to IremboGov > Family and Civil Status > Marriage Certificate.",
        documents: ["Spouse National ID"],
        action: "Enter ID Details"
      },
      {
        number: 2,
        title: "Confirm Spouses & Registration Record",
        explanation: "Verify the marriage registration details, wedding date, and matrimonial property regime (Community of Property, Limited Community, or Separation of Property).",
        documents: [],
        action: "Verify Record"
      },
      {
        number: 3,
        title: "Pay Service Fee",
        explanation: "Pay 500 RWF via Mobile Money or Bank.",
        documents: ["Irembo Bill ID"],
        action: "Pay 500 RWF"
      },
      {
        number: 4,
        title: "Download Certified PDF",
        explanation: "Download the officially authenticated electronic certificate with QR code.",
        documents: ["SMS Confirmation"],
        action: "Download PDF"
      }
    ],
    fees: [
      { name: "Certified Marriage Certificate", amountRwf: 500, description: "Statutory fee for authenticated digital certificate" }
    ],
    processing_time: "1 working day (instant digital generation upon registry verification)",
    application_method: "100% Digital via IremboGov portal",
    official_url: "https://irembo.gov.rw/home/citizen/all_services",
    related_services: ["irembo_marriage_declaration", "irembo_birth_certificate"],
    common_questions: [
      {
        question: "Does the certificate state our property regime?",
        answer: "Yes, Rwandan civil marriage certificates state the chosen property regime (e.g. Umutungo w'Umuryango / Community of Property)."
      }
    ],
    warnings: [
      "Ensure your marriage was officially recorded by the Sector Civil Officer immediately following your ceremony."
    ],
    source_name: "Official IremboGov Service Catalog",
    source_url: "https://irembo.gov.rw",
    last_verified: "2026-08-01",
    status: "active",
    intents: ["marriage_certificate", "proof_of_marriage"],
    goals: ["obtain_marriage_certificate", "visa_application", "joint_property_purchase"],
    problem_types: ["procedure_execution"]
  },
  {
    service_id: "irembo_certificate_being_single",
    title: "Certificate of Being Single (Icyemezo cy'Ubuselibateri / Celibacy Certificate)",
    institution: "Ministry of Local Government (MINALOC) / Sector Office",
    category: "Certificate of Being Single",
    description: "Official civil status certificate confirming that an individual is currently not married under civil law in Rwanda.",
    eligibility: [
      "Rwandan citizen aged 18 and above",
      "Must be legally unmarried (bachelor/spinster, legally divorced with decree, or widow/widower)"
    ],
    required_documents: [
      "National ID Number of applicant",
      "Divorce Certificate (if previously divorced)",
      "Death Certificate of late spouse (if widowed)"
    ],
    requirements: [
      "Applicant must have a clean civil status record with no active civil marriage registered."
    ],
    steps: [
      {
        number: 1,
        title: "Initiate Application on IremboGov",
        explanation: "Go to IremboGov > Family and Civil Status > Certificate of Being Single.",
        documents: ["National ID"],
        action: "Fill Application"
      },
      {
        number: 2,
        title: "Select Purpose and Reason",
        explanation: "State the purpose of certificate (e.g. Civil Marriage Declaration, Scholarship/Study Abroad, Visa Application).",
        documents: [],
        action: "Select Purpose"
      },
      {
        number: 3,
        title: "Pay Official Fee",
        explanation: "Pay 500 RWF using Mobile Money or Bank.",
        documents: ["Billing Number"],
        action: "Pay 500 RWF"
      },
      {
        number: 4,
        title: "Receive and Download Certificate",
        explanation: "The Sector Civil Registrar verifies registry records and releases the QR-coded official certificate for instant PDF download.",
        documents: ["SMS Confirmation Link"],
        action: "Download Certificate"
      }
    ],
    fees: [
      { name: "Certificate of Being Single", amountRwf: 500, description: "Official certificate fee" }
    ],
    processing_time: "1 working day",
    application_method: "100% Digital via IremboGov portal",
    official_url: "https://irembo.gov.rw/home/citizen/all_services",
    related_services: ["irembo_marriage_declaration", "dgie_first_epassport"],
    common_questions: [
      {
        question: "How long is the Certificate of Being Single valid?",
        answer: "In Rwanda, civil status certificates such as the Certificate of Being Single are generally valid for 3 months from the date of issuance for legal proceedings and marriage declarations."
      }
    ],
    warnings: [
      "Attempting to obtain a single certificate while in an active civil marriage is illegal and detected by NIDA cross-checks."
    ],
    source_name: "MINALOC & IremboGov Civil Registry Portal",
    source_url: "https://irembo.gov.rw",
    last_verified: "2026-08-01",
    status: "active",
    intents: ["single_certificate", "celibacy_proof", "ubuselibateri"],
    goals: ["prove_unmarried_status", "prepare_for_marriage_declaration", "visa_requirement"],
    problem_types: ["qualification_eligibility", "procedure_execution"]
  },
  {
    service_id: "dgie_first_epassport",
    title: "Application for First Rwandan Ordinary e-Passport (Pasiporo Nshya)",
    institution: "Directorate General of Immigration and Emigration (DGIE)",
    category: "First e-Passport",
    description: "Application for the first issuance of the East African Community (EAC) biometric electronic passport for Rwandan citizens traveling internationally.",
    eligibility: [
      "Rwandan citizen holding a valid National Identity Card (Adults 18+)",
      "Minors with valid Rwandan birth certificate and certified parental/guardian consent"
    ],
    required_documents: [
      "Valid Rwandan National ID Card",
      "1 Clear digital passport-sized photo on white background",
      "Proof of payment of statutory passport fee",
      "Recommendation or parental consent letter with parents' IDs (for minors under 18)"
    ],
    requirements: [
      "Physical appearance at DGIE Headquarters (Kigali) or District Immigration Offices for biometric capture (digital photo, fingerprints, and iris scan)."
    ],
    steps: [
      {
        number: 1,
        title: "Submit Online Application on IremboGov",
        explanation: "Select Immigration & Travel Documents > Application for e-Passport. Enter National ID and select passport category (5-year validity or 10-year validity).",
        documents: ["National ID", "Digital Photo"],
        action: "Apply on IremboGov"
      },
      {
        number: 2,
        title: "Pay Passport Fees",
        explanation: "Pay 75,000 RWF (5-year, 50 pages) or 100,000 RWF (10-year, 66 pages for adults) via Mobile Money, Bank, or Card.",
        documents: ["Irembo Billing Number"],
        action: "Pay Passport Fee"
      },
      {
        number: 3,
        title: "Biometric Appointment at DGIE Office",
        explanation: "Visit DGIE headquarters in Nyarugenge, Kigali or your selected District Immigration biometric office with your original National ID.",
        documents: ["Original National ID", "Irembo Application Slip"],
        action: "Complete Biometrics"
      },
      {
        number: 4,
        title: "Passport Collection",
        explanation: "Receive SMS notification within 4 working days to collect your physical e-Passport booklet from DGIE.",
        documents: ["Original National ID", "Collection SMS Notification"],
        action: "Collect Passport at DGIE"
      }
    ],
    fees: [
      { name: "Adult Ordinary e-Passport (5-Year Validity, 50 Pages)", amountRwf: 75000, description: "Standard fee for 5-year adult passport" },
      { name: "Adult Ordinary e-Passport (10-Year Validity, 66 Pages)", amountRwf: 100000, description: "Extended validity 10-year passport for adult citizens" },
      { name: "Child Ordinary e-Passport (2-Year Validity for Minors)", amountRwf: 25000, description: "Passport for children under 16 years" }
    ],
    processing_time: "4 working days following biometric capture at DGIE",
    application_method: "Online application on IremboGov + In-person biometric capture at DGIE offices",
    official_url: "https://irembo.gov.rw/home/citizen/all_services",
    related_services: ["dgie_passport_renewal", "nida_national_id", "minijust_criminal_record"],
    common_questions: [
      {
        question: "Can I apply for an expedited/emergency passport in Rwanda?",
        answer: "Yes, DGIE provides expedited processing for medical emergencies or urgent official travel upon presentation of verifiable proof."
      }
    ],
    warnings: [
      "Ensure your National ID information exactly matches your civil status before applying for a passport.",
      "The old non-biometric Rwandan passports are no longer valid for international travel."
    ],
    source_name: "Directorate General of Immigration and Emigration (DGIE) Official Guide",
    source_url: "https://www.migration.gov.rw",
    last_verified: "2026-08-01",
    status: "active",
    intents: ["first_passport", "apply_epassport", "international_travel_document"],
    goals: ["obtain_first_passport", "travel_abroad"],
    problem_types: ["procedure_execution"]
  },
  {
    service_id: "dgie_passport_renewal",
    title: "Renewal & Replacement of Rwandan e-Passport (Gusimbuza Pasiporo)",
    institution: "Directorate General of Immigration and Emigration (DGIE)",
    category: "Passport Renewal/Replacement",
    description: "Renewal of an expired or page-exhausted Rwandan passport, or replacement of a lost, stolen, or damaged passport.",
    eligibility: [
      "Holder of an expired Rwandan passport or one with less than 6 months validity",
      "Holder of a damaged passport or citizen whose passport pages are full",
      "Citizen whose passport was lost or stolen"
    ],
    required_documents: [
      "Valid Rwandan National ID Card",
      "Current/Previous Passport booklet (for renewal or damaged replacement)",
      "Certificate of Loss from Rwanda National Police (strictly mandatory if passport was lost/stolen)",
      "Affidavit / explanatory letter detailing circumstances of loss"
    ],
    requirements: [
      "Surrender the old/damaged passport booklet during physical collection.",
      "Police Loss Certificate is mandatory before replacing a lost passport."
    ],
    steps: [
      {
        number: 1,
        title: "Apply for Passport Renewal on IremboGov",
        explanation: "Choose 'Passport Renewal' or 'Replacement of Lost/Damaged Passport' under DGIE services.",
        documents: ["National ID", "Old Passport Number", "Police Report (if lost)"],
        action: "Apply on Irembo"
      },
      {
        number: 2,
        title: "Pay Applicable Renewal or Replacement Fee",
        explanation: "Pay standard fee (75,000 RWF for 5-year, 100,000 RWF for 10-year renewal). For replacement of lost passports, an additional penalty fee may apply.",
        documents: ["Irembo Billing ID"],
        action: "Pay Fee"
      },
      {
        number: 3,
        title: "Biometric Verification at DGIE",
        explanation: "Visit DGIE office to verify biometrics and submit the previous passport booklet.",
        documents: ["Original National ID", "Old Passport Booklet"],
        action: "Verify at DGIE"
      },
      {
        number: 4,
        title: "Collect New e-Passport",
        explanation: "Collect new passport within 4 working days upon receiving SMS notification.",
        documents: ["Original ID", "SMS Notice"],
        action: "Collect New Passport"
      }
    ],
    fees: [
      { name: "5-Year e-Passport Renewal", amountRwf: 75000, description: "Standard renewal fee for 50 pages" },
      { name: "10-Year e-Passport Renewal", amountRwf: 100000, description: "Standard renewal fee for 66 pages" },
      { name: "Replacement of Lost Passport", amountRwf: 100000, description: "Reissue fee requiring Police loss clearance report" }
    ],
    processing_time: "4 working days",
    application_method: "Online application on IremboGov + In-person booklet collection at DGIE",
    official_url: "https://irembo.gov.rw/home/citizen/all_services",
    related_services: ["dgie_first_epassport", "nida_national_id"],
    common_questions: [
      {
        question: "Can I renew my passport before it expires?",
        answer: "Yes, you can renew your Rwandan passport if it has less than 6 months of validity or if all visa pages are full."
      }
    ],
    warnings: [
      "Losing a passport must be reported immediately to police to prevent fraudulent misuse."
    ],
    source_name: "DGIE Official Passport Guidelines",
    source_url: "https://www.migration.gov.rw",
    last_verified: "2026-08-01",
    status: "active",
    intents: ["passport_renewal", "replace_lost_passport", "damaged_passport"],
    goals: ["renew_expired_passport", "recover_lost_passport"],
    problem_types: ["recovery_replacement", "procedure_execution"]
  },
  {
    service_id: "rdb_business_registration",
    title: "Domestic Business & Company Registration (Kwiyandikisha muri RDB)",
    institution: "Rwanda Development Board (RDB)",
    category: "Business Registration",
    description: "Online registration of individual enterprises (sole proprietorships), limited liability companies (Ltd / Ltd by Shares), e-commerce ventures, and branch offices in Rwanda.",
    eligibility: [
      "Rwandan citizens or foreign investors aged 18+",
      "Valid National ID (for citizens) or Passport (for foreign nationals)"
    ],
    required_documents: [
      "National ID copies or Passport copies of all shareholders and managing directors",
      "Proposed company enterprise name(s)",
      "Business physical address (District, Sector, Cell, Village, Building/Street)",
      "Standard Articles of Association / Memorandum (auto-generated or customized)"
    ],
    requirements: [
      "Online registration is 100% free of charge and integrated directly with RRA for automatic TIN generation."
    ],
    steps: [
      {
        number: 1,
        title: "Access RDB Business Registration Portal",
        explanation: "Visit org.rdb.rw or RDB e-Services. Create or log into your investor profile with your National ID.",
        documents: ["National ID"],
        action: "Open RDB Portal"
      },
      {
        number: 2,
        title: "Enterprise Name Search & Reservation",
        explanation: "Enter your proposed business trade name to check availability in the company registry.",
        documents: ["Proposed Business Name"],
        action: "Check Name Availability"
      },
      {
        number: 3,
        title: "Fill Enterprise Details & Shareholders",
        explanation: "Select legal structure (Individual Enterprise or Company Ltd), business activities (ISIC codes, e.g. Retail Trade / E-Commerce), capital, and share distribution.",
        documents: ["Shareholder IDs", "Business Address"],
        action: "Enter Business Details"
      },
      {
        number: 4,
        title: "Receive Full Business Registration & Free TIN",
        explanation: "RDB registrar approves application within 6 hours. Download your official Certificate of Incorporation, containing your business registration number and automatic RRA Taxpayer Identification Number (TIN).",
        documents: ["Email Notification"],
        action: "Download RDB Certificate"
      }
    ],
    fees: [
      { name: "Online Business Registration Fee", amountRwf: 0, description: "Completely free of charge (0 RWF) as part of Rwanda's Ease of Doing Business reform" }
    ],
    processing_time: "Less than 6 hours (often approved within 2 hours)",
    application_method: "100% Digital via RDB Business Registration Portal (org.rdb.rw)",
    official_url: "https://org.rdb.rw",
    related_services: ["rra_tin_registration", "minijust_criminal_record"],
    common_questions: [
      {
        question: "Do I need to visit RDB offices in person to register a business?",
        answer: "No. The entire business registration process in Rwanda is 100% digital online. Your incorporation certificate and tax TIN are generated electronically."
      },
      {
        question: "How do I start an online shop / e-commerce store in Rwanda?",
        answer: "Register your business or company for free on RDB under retail/e-commerce ISIC activity. You instantly receive your RRA TIN to integrate payment gateways (MTN MoMo API, Airtel, Card) and issue electronic invoices."
      }
    ],
    warnings: [
      "Once registered, your company must file periodic monthly or quarterly tax declarations on RRA E-Tax, even if inactive (nil returns)."
    ],
    source_name: "Rwanda Development Board (RDB) Official Business Registration Guide",
    source_url: "https://org.rdb.rw",
    last_verified: "2026-08-01",
    status: "active",
    intents: ["business_registration", "start_online_shop", "open_company", "register_sole_proprietorship", "e_commerce_setup"],
    goals: ["start_compliant_business", "register_online_shop", "obtain_business_tin", "formalize_enterprise"],
    problem_types: ["procedure_execution", "life_event_planning"],
    risks_addressed: ["trading_without_license", "tax_non_compliance"],
    preventative_measures: ["File timely E-Tax nil returns if operations haven't started to avoid late filing penalties."]
  },
  {
    service_id: "rra_tin_registration",
    title: "Taxpayer Identification Number (TIN) Registration & Tax Clearance",
    institution: "Rwanda Revenue Authority (RRA)",
    category: "Tax/TIN Registration",
    description: "Issuance of an official 9-digit Taxpayer Identification Number (TIN) for individuals, self-employed professionals, and commercial entities for tax compliance in Rwanda.",
    eligibility: [
      "Any individual or entity conducting commercial activities or required to pay taxes in Rwanda",
      "Registered businesses automatically receive a TIN upon RDB incorporation"
    ],
    required_documents: [
      "Valid Rwandan National ID or Passport",
      "Business Certificate of Incorporation (if registering a corporate entity)",
      "Proof of physical address or employment contract"
    ],
    requirements: [
      "Access to RRA E-Tax portal (etax.rra.gov.rw)."
    ],
    steps: [
      {
        number: 1,
        title: "Access RRA E-Tax Portal",
        explanation: "Visit etax.rra.gov.rw and select 'New Taxpayer Registration'.",
        documents: ["National ID"],
        action: "Open RRA E-Tax"
      },
      {
        number: 2,
        title: "Select Taxpayer Category",
        explanation: "Choose Individual Taxpayer (e.g. employee, freelancer, property landlord) or Corporate Entity.",
        documents: ["Identity Details"],
        action: "Select Category"
      },
      {
        number: 3,
        title: "Submit Registration & Verification",
        explanation: "Confirm personal details linked to NIDA, business activity type, and contact details.",
        documents: [],
        action: "Confirm Details"
      },
      {
        number: 4,
        title: "Instant TIN Generation & E-Tax Credentials",
        explanation: "Receive your 9-digit TIN certificate and E-Tax portal login password via SMS and email.",
        documents: ["SMS Confirmation"],
        action: "Receive 9-Digit TIN"
      }
    ],
    fees: [
      { name: "TIN Registration Fee", amountRwf: 0, description: "Free of charge (0 RWF)" }
    ],
    processing_time: "Instant for online registration, or 1 working day if manual verification is required",
    application_method: "100% Digital via RRA E-Tax portal (etax.rra.gov.rw) or automatic via RDB business registration",
    official_url: "https://etax.rra.gov.rw",
    related_services: ["rdb_business_registration", "rra_rnp_vehicle_registration"],
    common_questions: [
      {
        question: "Does an individual need a TIN to buy a motor vehicle or property?",
        answer: "Yes, Rwandan tax and property transfer systems require a valid TIN to record ownership and issue tax clearance."
      }
    ],
    warnings: [
      "Keep your RRA E-Tax password secure; all annual tax declarations and withholding statements are filed using this account."
    ],
    source_name: "Rwanda Revenue Authority (RRA) Official Taxpayer Guide",
    source_url: "https://www.rra.gov.rw",
    last_verified: "2026-08-01",
    status: "active",
    intents: ["tax_registration", "obtain_tin", "freelance_tin"],
    goals: ["get_taxpayer_id", "tax_compliance"],
    problem_types: ["procedure_execution"]
  },
  {
    service_id: "rra_rnp_vehicle_registration",
    title: "Motor Vehicle Registration & Number Plate Issuance (Kwandikisha Ikinyabiziga)",
    institution: "Rwanda Revenue Authority (RRA) Customs & Rwanda National Police Traffic Dept",
    category: "Vehicle Registration",
    description: "Official registration of newly imported or locally transferred motor vehicles, technical inspection, and issuance of Rwandan license number plates and Yellow Card logbook (Kareshereza).",
    eligibility: [
      "Owner of newly imported motor vehicle cleared through customs",
      "Buyer of locally registered vehicle undergoing ownership mutation"
    ],
    required_documents: [
      "Owner's National ID and RRA Taxpayer Identification Number (TIN)",
      "Customs Single Administrative Document (SAD) & Tax Clearance (for imports)",
      "Original Yellow Card / Carte Jaune logbook (for local transfers)",
      "Valid Technical Control Certificate (Contrôle Technique)",
      "Motor Third-Party Liability Insurance"
    ],
    requirements: [
      "Mandatory physical vehicle inspection by RRA/RNP at Gikondo / Masaka Motor Vehicle Inspection Center.",
      "Clearance of all import duties or transfer taxes."
    ],
    steps: [
      {
        number: 1,
        title: "Determine Vehicle Registration Intent",
        explanation: "Clarify whether the vehicle is newly imported from abroad (requiring customs tax clearance) or already registered in Rwanda undergoing local ownership transfer.",
        documents: ["Customs SAD or Previous Logbook"],
        action: "Verify Vehicle Status"
      },
      {
        number: 2,
        title: "Physical Vehicle Technical Inspection",
        explanation: "Bring vehicle to RNP Motor Vehicle Inspection Center (Contrôle Technique) for roadworthiness and chassis number verification.",
        documents: ["Vehicle", "Temporary Clearance Permit"],
        action: "Pass Inspection"
      },
      {
        number: 3,
        title: "Pay Plate & Registration Fees on RRA E-Tax",
        explanation: "Generate RRA payment reference for license plate fee (45,000 RWF for motor vehicle, 15,000 RWF for motorcycle) and registration taxes.",
        documents: ["RRA Payment Ref"],
        action: "Pay Plate Fee"
      },
      {
        number: 4,
        title: "Number Plate & Yellow Card Issuance",
        explanation: "Collect your physical metallic Rwandan registration plates (e.g. RAD ... X) and official Yellow Card vehicle ownership logbook from RRA Motor Vehicle Department.",
        documents: ["Payment Receipts", "Inspection Certificate"],
        action: "Collect Plates at RRA"
      }
    ],
    fees: [
      { name: "Motor Vehicle Number Plates Pair (Cars/Trucks)", amountRwf: 45000, description: "Official physical metallic number plates fee" },
      { name: "Motorcycle Number Plate", amountRwf: 15000, description: "Official plate fee for two-wheelers" },
      { name: "Motor Vehicle Registration & Yellow Card", amountRwf: 50000, description: "Vehicle ownership logbook issuance fee" }
    ],
    processing_time: "2 to 3 working days after customs clearance and physical vehicle inspection",
    application_method: "Online via RRA E-Tax + Physical inspection at RNP Technical Control Center",
    official_url: "https://etax.rra.gov.rw",
    related_services: ["rra_tin_registration", "rnp_definitive_driving_licence"],
    common_questions: [
      {
        question: "Can I drive an imported car before receiving Rwandan number plates?",
        answer: "You may only drive on a valid Temporary Transit Plate (IT) with valid temporary insurance until permanent plates are affixed."
      },
      {
        question: "What is the difference between imported vehicle registration and local transfer?",
        answer: "Imported vehicles require full customs clearance, import duty settlement, and initial plate assignment. Local transfers mutate ownership on the existing plate number and issue a new Yellow Card in the buyer's name."
      }
    ],
    warnings: [
      "Operating a motor vehicle without registered number plates or valid inspection sticker is strictly illegal under Rwandan traffic law."
    ],
    source_name: "RRA Customs & RNP Traffic Department Vehicle Guidelines",
    source_url: "https://www.rra.gov.rw",
    last_verified: "2026-08-01",
    status: "active",
    intents: ["vehicle_registration", "get_number_plates", "car_plates", "yellow_card_mutation"],
    goals: ["obtain_vehicle_plates", "register_car", "transfer_vehicle_ownership"],
    problem_types: ["procedure_execution"],
    risks_addressed: ["unregistered_vehicle_impoundment", "fake_logbooks"]
  },
  {
    service_id: "rnp_provisional_driving_licence",
    title: "Provisional Driving Licence Exam & Certificate (Permi y'agateganyo)",
    institution: "Rwanda National Police (RNP) & IremboGov",
    category: "Provisional Driving Licence",
    description: "Registration for the computer-based theory driving exam on Rwandan Highway Code (Amategeko y'Umuhanda) and issuance of the official Provisional Driving Licence certificate.",
    eligibility: [
      "Rwandan citizens or legal foreign residents aged 18 and above",
      "Possession of a valid Rwandan National ID or Foreigner ID card"
    ],
    required_documents: [
      "Valid Rwandan National ID Card Number",
      "Active telephone number for exam scheduling and result SMS"
    ],
    requirements: [
      "Score at least 12 out of 20 points on the official 20-question computer-based exam."
    ],
    steps: [
      {
        number: 1,
        title: "Register for Provisional Exam on IremboGov",
        explanation: "Go to IremboGov > Police Services > Registration for Provisional Driving License Test. Select your preferred test center and available exam date.",
        documents: ["National ID"],
        action: "Select Test Date on Irembo"
      },
      {
        number: 2,
        title: "Pay Exam Registration Fee",
        explanation: "Pay 5,000 RWF registration fee using Mobile Money or Bank before slot expiration.",
        documents: ["Billing Number"],
        action: "Pay 5,000 RWF"
      },
      {
        number: 3,
        title: "Sit for Computer-Based Exam",
        explanation: "Attend your chosen testing center with your original National ID. Take the 20-minute multiple-choice test on road safety and traffic signs.",
        documents: ["Original National ID"],
        action: "Take Exam at Center"
      },
      {
        number: 4,
        title: "Instant Results & Provisional Certificate Issuance",
        explanation: "If you pass (12+/20), receive immediate result SMS. Pay 5,000 RWF certificate issuance fee on Irembo to download your official Provisional Certificate (valid for 1 year).",
        documents: ["Passing SMS Code"],
        action: "Download Certificate"
      }
    ],
    fees: [
      { name: "Theory Exam Registration Fee", amountRwf: 5000, description: "Fee to book computer-based driving theory test" },
      { name: "Provisional License Certificate Fee", amountRwf: 5000, description: "Issuance fee for 1-year valid provisional certificate" }
    ],
    processing_time: "Instant result upon completing exam; certificate downloadable immediately after fee payment",
    application_method: "Online booking on IremboGov + In-person computer exam at designated RNP center",
    official_url: "https://irembo.gov.rw/home/citizen/all_services",
    related_services: ["rnp_definitive_driving_licence", "nida_national_id"],
    common_questions: [
      {
        question: "How long is the Rwandan Provisional Driving Licence valid?",
        answer: "The Provisional Driving Licence certificate is valid for exactly 1 year from the date of issue, during which you must pass your practical definitive driving exam."
      }
    ],
    warnings: [
      "Arrive at the testing center at least 30 minutes before your scheduled exam slot; late arrivals forfeit their test fee."
    ],
    source_name: "Rwanda National Police (RNP) Department of Traffic & Road Safety",
    source_url: "https://police.gov.rw",
    last_verified: "2026-08-01",
    status: "active",
    intents: ["provisional_driving_license", "traffic_rules_exam", "permi_yagateganyo"],
    goals: ["pass_driving_theory", "obtain_provisional_permit"],
    problem_types: ["procedure_execution", "qualification_eligibility"]
  },
  {
    service_id: "rnp_definitive_driving_licence",
    title: "Definitive Driving Licence Practical Exam & Smart Card (Permi ya burundu)",
    institution: "Rwanda National Police (RNP) & IremboGov",
    category: "Definitive Driving Licence",
    description: "Registration for the practical driving road test for categories (A, B, C, D, E, F) and issuance of the biometric Smart Driving Licence card upon passing.",
    eligibility: [
      "Holder of a valid Provisional Driving Licence certificate (for Category B and above)",
      "Age 18+ for Category A and B; Age 20+ for Category C, D, E",
      "Passed mandatory medical / physical suitability criteria"
    ],
    required_documents: [
      "Valid Rwandan National ID",
      "Active Provisional Driving Licence Registration Code",
      "Existing Driving Licence (if applying for category extension e.g. B to C/D)"
    ],
    requirements: [
      "Candidate must provide a roadworthy, insured vehicle with valid technical inspection certificate for the practical road test."
    ],
    steps: [
      {
        number: 1,
        title: "Book Practical Driving Test on IremboGov",
        explanation: "Go to IremboGov > Police Services > Registration for Practical Driving License. Enter National ID and provisional license number, then select test location and category (e.g. Category B for cars).",
        documents: ["National ID", "Provisional License Code"],
        action: "Book Practical Test"
      },
      {
        number: 2,
        title: "Pay Practical Test Registration Fee",
        explanation: "Pay 10,000 RWF practical test registration fee via Mobile Money or Bank.",
        documents: ["Billing Number"],
        action: "Pay 10,000 RWF"
      },
      {
        number: 3,
        title: "Complete Practical Driving Test",
        explanation: "Attend the designated RNP testing ground with your test vehicle for maneuvering, parking, hill starts, and highway driving assessments with RNP examiners.",
        documents: ["Original National ID", "Vehicle Insurance & Control Technique"],
        action: "Take Practical Road Test"
      },
      {
        number: 4,
        title: "Apply for Smart Card Driving Licence",
        explanation: "Upon receiving your passing result SMS, apply on IremboGov for Definitive License Smart Card issuance (50,000 RWF). Collect your biometric plastic smart card at your selected District Police Unit.",
        documents: ["Result SMS", "National ID"],
        action: "Collect Smart Card"
      }
    ],
    fees: [
      { name: "Practical Exam Booking Fee", amountRwf: 10000, description: "Official test registration fee per category" },
      { name: "Biometric Smart Card License Issuance", amountRwf: 50000, description: "Production fee for permanent biometric driving license card" }
    ],
    processing_time: "21 working days for physical smart card production after passing practical test",
    application_method: "Online booking on IremboGov + Practical road exam with RNP examiners",
    official_url: "https://irembo.gov.rw/home/citizen/all_services",
    related_services: ["rnp_provisional_driving_licence", "nida_national_id"],
    common_questions: [
      {
        question: "What happens if I fail the practical driving test?",
        answer: "If you do not pass, you may re-register on IremboGov for another practical test slot after payment of the standard 10,000 RWF exam fee."
      }
    ],
    warnings: [
      "Driving without a valid definitive licence after your provisional licence expires carries heavy traffic fines and vehicle impoundment."
    ],
    source_name: "Rwanda National Police (RNP) Traffic Guidelines & IremboGov",
    source_url: "https://police.gov.rw",
    last_verified: "2026-08-01",
    status: "active",
    intents: ["definitive_driving_license", "practical_driving_exam", "smart_driving_card", "passed_driving_test"],
    goals: ["get_permanent_driving_licence", "drive_legally_in_rwanda"],
    problem_types: ["procedure_execution", "qualification_eligibility"]
  },
  {
    service_id: "minijust_criminal_record",
    title: "Criminal Record Certificate (Icyemezo cy'ubutabera / Extrait de Casier Judiciaire)",
    institution: "National Public Prosecution Authority (NPPA) & Ministry of Justice",
    category: "Criminal Record Certificate",
    description: "Official legal document stating whether an individual has any prior criminal convictions or judicial records in Rwanda. Required for employment, visas, and public tenders.",
    eligibility: [
      "Rwandan citizens holding a National ID",
      "Foreign residents who have resided in Rwanda holding a valid Foreigner ID or Passport"
    ],
    required_documents: [
      "Valid National ID Number or Passport Number",
      "Active email and phone number to receive digital e-certificate"
    ],
    requirements: [
      "Clear identity match in the national prosecution database."
    ],
    steps: [
      {
        number: 1,
        title: "Apply on IremboGov Portal",
        explanation: "Navigate to IremboGov > Justice & Legal Services > Criminal Record Certificate. Enter your National ID number.",
        documents: ["National ID"],
        action: "Enter ID Details"
      },
      {
        number: 2,
        title: "Select Purpose of Certificate",
        explanation: "Indicate if the certificate is for employment, visa application, education abroad, or business bidding.",
        documents: [],
        action: "Select Reason"
      },
      {
        number: 3,
        title: "Pay Processing Fee",
        explanation: "Pay 1,200 RWF via Mobile Money or Bank.",
        documents: ["Billing Number"],
        action: "Pay 1,200 RWF"
      },
      {
        number: 4,
        title: "Receive and Download Certificate",
        explanation: "Following NPPA database verification, receive an SMS/email within 1 to 3 days containing the cryptographic QR-verified PDF certificate.",
        documents: ["SMS Confirmation Link"],
        action: "Download PDF Certificate"
      }
    ],
    fees: [
      { name: "Criminal Record Certificate Fee", amountRwf: 1200, description: "Official statutory processing fee" }
    ],
    processing_time: "1 to 3 working days",
    application_method: "100% Digital via IremboGov portal with instant digital verification",
    official_url: "https://irembo.gov.rw/home/citizen/all_services",
    related_services: ["nida_national_id", "dgie_first_epassport", "rdb_business_registration"],
    common_questions: [
      {
        question: "How long is a Criminal Record Certificate valid in Rwanda?",
        answer: "Criminal Record Certificates issued in Rwanda are generally valid for 6 months from the date of issue."
      }
    ],
    warnings: [
      "The certificate is verifiable internationally via its embedded QR code; do not alter the PDF document."
    ],
    source_name: "National Public Prosecution Authority (NPPA) & IremboGov",
    source_url: "https://irembo.gov.rw",
    last_verified: "2026-08-01",
    status: "active",
    intents: ["criminal_record_certificate", "police_clearance", "casier_judiciaire", "job_background_check"],
    goals: ["obtain_criminal_clearance", "employment_compliance", "visa_application_requirement"],
    problem_types: ["qualification_eligibility", "procedure_execution"]
  },
  {
    service_id: "rnp_driving_licence_replacement",
    title: "Duplicate / Replacement of Definitive Driving Licence (Gusimbuza Permi ya Burundu)",
    institution: "Rwanda National Police (RNP) & IremboGov",
    category: "Driving Licence Replacement",
    description: "Official reissuance of a lost, damaged, stolen, or expired definitive driving license smart card for Rwandan drivers.",
    eligibility: [
      "Holder of a valid definitive driving license previously issued by Rwanda National Police",
      "Driver whose license was lost, stolen, mutilated, or expired"
    ],
    required_documents: [
      "Valid Rwandan National ID Card",
      "Certificate of Loss (Icyemezo cyo gutakaza) issued by Rwanda National Police (for lost/stolen licenses)",
      "Damaged license card (if applying for mutilated replacement)"
    ],
    requirements: [
      "Applicant must already be recorded in the RNP Traffic Driving Registry as having passed the definitive practical exam.",
      "Police Certificate of Loss is strictly mandatory if the card was lost."
    ],
    steps: [
      {
        number: 1,
        title: "Obtain Police Certificate of Loss (If Lost/Stolen)",
        explanation: "Report the loss of your driving license at the nearest Rwanda National Police (RNP) station to obtain an official Certificate of Loss (Icyemezo cyo gutakaza).",
        documents: ["National ID"],
        action: "Get Police Loss Certificate"
      },
      {
        number: 2,
        title: "Apply on IremboGov for Duplicate Driving License",
        explanation: "Go to IremboGov > Police Services > Duplicate of Definitive Driving License. Enter your National ID number and select your replacement reason (Lost, Damaged, or Expired).",
        documents: ["National ID", "Police Certificate Number"],
        action: "Apply on Irembo"
      },
      {
        number: 3,
        title: "Pay Official Replacement Fee",
        explanation: "Pay the statutory 25,000 RWF replacement fee via Mobile Money (MTN/Airtel) or Bank using the 9-digit Irembo payment reference.",
        documents: ["Irembo Billing ID"],
        action: "Pay 25,000 RWF"
      },
      {
        number: 4,
        title: "Collect Replaced Smart Card",
        explanation: "Receive SMS notification from RNP when the smart card is printed. Collect your duplicate card from your chosen District Police Unit.",
        documents: ["National ID", "SMS Notification", "Original Certificate of Loss"],
        action: "Collect Card at District Police"
      }
    ],
    fees: [
      { name: "Replacement of Definitive Driving License", amountRwf: 25000, description: "Official statutory fee for duplicate smart card reissuance" }
    ],
    processing_time: "7 to 14 working days for smart card printing and distribution to District Police Units",
    application_method: "100% Digital application via IremboGov + Card collection at District Police Unit",
    official_url: "https://irembo.gov.rw/home/citizen/all_services",
    related_services: ["rnp_definitive_driving_licence", "nida_national_id"],
    common_questions: [
      {
        question: "Do I need to retake the driving test if I lose my driving license in Rwanda?",
        answer: "No. You do not need to retake the driving test. Your license records are stored in the RNP central database, and you only apply for a duplicate replacement (25,000 RWF)."
      },
      {
        question: "Can I drive while waiting for my replacement smart card?",
        answer: "You should carry your Irembo payment receipt and Police Certificate of Loss as temporary proof while your smart card is being printed."
      }
    ],
    warnings: [
      "Never pay informal fixers or unofficial brokers; all payments must strictly use official Irembo billing codes.",
      "Driving without a valid physical license or temporary receipt may lead to traffic penalties under Law N° 02/08/2021."
    ],
    source_name: "Rwanda National Police (RNP) Department of Traffic & Road Safety & IremboGov",
    source_url: "https://police.gov.rw",
    last_verified: "2026-08-01",
    status: "active",
    intents: ["lost_driving_license", "replace_driving_license", "duplicate_driving_license", "permi_yatakaye", "damaged_driving_license", "renew_driving_license"],
    goals: ["replace_lost_driving_license", "restore_driving_credentials", "obtain_duplicate_license"],
    problem_types: ["recovery_replacement", "procedure_execution"],
    risks_addressed: ["traffic_fines_without_license", "identity_impersonation"],
    preventative_measures: [
      "Obtain an official Police Certificate of Loss immediately to prevent misuse of your lost driving credentials.",
      "Apply directly on IremboGov to get a verifiable tracking code."
    ]
  },
  {
    service_id: "rssb_cbhi_mutuelle_sante",
    title: "Community Based Health Insurance Payment / Ubudehe Check (Mutuelle de Santé / CBHI)",
    institution: "Rwanda Social Security Board (RSSB) & MINALOC",
    category: "Community Based Health Insurance (CBHI)",
    description: "Annual payment and household enrollment for Community Based Health Insurance (Mutuelle de Santé), verifying Ubudehe socio-economic category, and activating healthcare coverage.",
    eligibility: [
      "All Rwandan citizens and resident households not covered by private or RAMA/MMI civil servant schemes",
      "Households registered in the National Ubudehe socio-economic database"
    ],
    required_documents: [
      "Head of Household or Member National ID Number / NIN",
      "Household Ubudehe category verification"
    ],
    requirements: [
      "All household members must be paid for under the same household profile according to their registered Ubudehe category."
    ],
    steps: [
      {
        number: 1,
        title: "Check Household Ubudehe & Contribution Amount",
        explanation: "Access IremboGov > Health Services > Mutuelle de Santé (CBHI) or dial USSD *909# on your phone. Enter the Household Head National ID to view registered family members and calculated contribution.",
        documents: ["Household Head National ID"],
        action: "Query Household on Irembo"
      },
      {
        number: 2,
        title: "Confirm Family Members & Arrears",
        explanation: "Review the list of family members for the current fiscal year (July to June). Ensure all dependents are included.",
        documents: [],
        action: "Confirm Family List"
      },
      {
        number: 3,
        title: "Pay Annual CBHI Contribution",
        explanation: "Pay the required statutory amount (3,000 RWF per person for Category 2 & 3; 7,000 RWF for Category 4; 0 RWF fully subsidized by Government for Category 1) via MTN Mobile Money (*182*3*7#), Airtel Money, or Bank.",
        documents: ["Irembo Billing Reference"],
        action: "Pay CBHI Contribution"
      },
      {
        number: 4,
        title: "Instant Coverage Activation",
        explanation: "Receive instant SMS confirmation. Healthcare coverage is updated immediately in the national RSSB health center database; present your National ID at any health center (Centre de Santé) or District Hospital.",
        documents: ["SMS Confirmation", "National ID"],
        action: "Access Healthcare"
      }
    ],
    fees: [
      { name: "Ubudehe Category 1 (Vulnerable)", amountRwf: 0, description: "100% Fully subsidized by Government of Rwanda" },
      { name: "Ubudehe Category 2 & 3", amountRwf: 3000, description: "3,000 RWF per person per fiscal year" },
      { name: "Ubudehe Category 4 (Highest Income)", amountRwf: 7000, description: "7,000 RWF per person per fiscal year" }
    ],
    processing_time: "Instant digital activation upon payment; immediate access at all public health facilities",
    application_method: "100% Digital via IremboGov, USSD (*909# / *182#), or direct Mobile Money",
    official_url: "https://irembo.gov.rw/home/citizen/all_services",
    related_services: ["nida_national_id", "irembo_birth_certificate"],
    common_questions: [
      {
        question: "When does the Mutuelle de Santé (CBHI) coverage start and expire?",
        answer: "The CBHI fiscal coverage year runs annually from July 1st to June 30th of the following year. Paying in advance (before July) guarantees uninterrupted access to medical care."
      },
      {
        question: "Can I pay for only one person in a household?",
        answer: "Under RSSB regulations, CBHI contributions must cover all registered members of the household to activate full family coverage."
      }
    ],
    warnings: [
      "Pay your CBHI contribution before the June 30 deadline to avoid the mandatory 30-day waiting period penalty for late renewal.",
      "Always ensure your household members are accurately registered in the Sector Ubudehe list before paying."
    ],
    source_name: "Rwanda Social Security Board (RSSB) & Ministry of Local Government (MINALOC)",
    source_url: "https://www.rssb.rw",
    last_verified: "2026-08-01",
    status: "active",
    intents: ["mutuelle_de_sante", "cbhi_payment", "health_insurance", "ubudehe_health", "mituweli"],
    goals: ["pay_health_insurance", "activate_cbhi_coverage", "check_ubudehe_category"],
    problem_types: ["procedure_execution", "life_event_planning"],
    risks_addressed: ["uninsured_medical_expenses", "late_payment_waiting_penalty"],
    preventative_measures: [
      "Pay before July 1st to avoid the statutory 30-day grace period delay before medical benefits activate.",
      "Check that newborn children and new spouses have been added to your civil household registry at the Sector."
    ]
  }
];
