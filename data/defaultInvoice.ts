import type { InvoiceData } from "@/types";

export const initialInvoiceData: InvoiceData = {
  // =====================================================
  // INVOICE DETAILS
  // =====================================================

  invoiceNumber: "",

  // yyyy-mm-dd format for HTML date input
  issueDate: "",

  // =====================================================
  // TRANSACTION DETAILS
  // =====================================================

  /*
   * Product selected for the transaction.
   *
   * Examples:
   * 1A
   * 2A
   * 2A + 2C
   * Custom Plan (2A)
   */
  productName: "",

  /*
   * Payment / transaction reference ID.
   */
  transactionId: "",

  /*
   * yyyy-mm-ddTHH:mm format for HTML datetime-local input.
   */
  transactionDate: "",

  // =====================================================
  // CUSTOMER DETAILS
  // =====================================================

  customerName: "",
  phoneNumber: "",
  email: "",
  city: "",
  state: "",
  pincode: "",

  // =====================================================
  // PLAN DETAILS
  // =====================================================

  planName: "",
  planDescription: "",
  family: "",
  tenure: "1 Year",

  // =====================================================
  // PRICING
  //
  // GST rate is fixed/reference at 5%.
  // Actual GST amount is entered manually by admin.
  // =====================================================

  basePrice: 0,
  gstRate: 5,
  gstAmount: 0,
  currency: "₹",

  // =====================================================
  // PAYMENT STATUS
  // =====================================================

  paymentStatus: "PAID IN FULL",
  customPaymentStatus: "",

  // =====================================================
  // COMPANY DETAILS
  // =====================================================

  companyName: "Restore Health Services",

  companyAddress:
    "A-1, Ground Floor, Sector 59, Noida, Gautam Buddha Nagar, UttarPradesh, 201301",

  companyGstin: "09AAQCR1885F1ZU",

  companyCin: "U86909UW2026OPC257013",

  companySupportPhone: "9289250468",

  companyWebsite: "restorehealthservices.in",

  // =====================================================
  // BENEFITS
  // =====================================================

  benefits: [
    // ===================================================
    // HEALTH & WELLNESS SERVICES
    // ===================================================

    {
      id: "health-risk-assessment",
      title: "Health Risk Assessment",
      category: "HEALTH & WELLNESS SERVICES",
      badgeText: "2 Credit",
      shortDesc: "Digital Health Risk Assessment",
      details: ["Digital"],
      iconName: "activity",
      included: true,
    },

    {
      id: "tele-dm",
      title: "Tele DM Consultation GP + SP",
      category: "HEALTH & WELLNESS SERVICES",
      badgeText: "4 Credit",
      shortDesc: "Tele DM consultation with General Physician and Specialist.",
      details: ["4 Credit"],
      iconName: "stethoscope",
      included: true,
    },

    {
      id: "cbc-test",
      title: "CBC Test",
      category: "HEALTH & WELLNESS SERVICES",
      badgeText: "2 Credit",
      shortDesc: "Complete Blood Count test.",
      details: ["2 Credit"],
      iconName: "test-tube",
      included: true,
    },

    {
      id: "cbc-review",
      title: "CBC Report Review",
      category: "HEALTH & WELLNESS SERVICES",
      badgeText: "2 Credit",
      shortDesc: "CBC report review service.",
      details: ["2 Credit"],
      iconName: "file-check",
      included: true,
    },

    {
      id: "executive-centre",
      title: "Executive Centre Visit",
      category: "HEALTH & WELLNESS SERVICES",
      badgeText: "-",
      shortDesc: "Executive Centre Visit.",
      details: ["Health Check-up @500"],
      iconName: "building",
      included: true,
    },

    // ===================================================
    // DISCOUNTS & BENEFITS
    // ===================================================

    {
      id: "fitness-management",
      title: "Upto 40% Discount on Fitness Management",
      category: "DISCOUNTS & BENEFITS",
      badgeText: "Yes",
      shortDesc: "Discount on fitness management services.",
      details: ["Upto 40% Discount"],
      iconName: "dumbbell",
      included: true,
    },

    {
      id: "home-care",
      title: "Upto 20% Discount on Home Care Management (Nurse at)",
      category: "DISCOUNTS & BENEFITS",
      badgeText: "Yes",
      shortDesc: "Discount on home care management and nursing services.",
      details: ["Upto 20% Discount"],
      iconName: "house",
      included: true,
    },

    {
      id: "ambulance",
      title: "Emergency Ambulance with upto 20% Discount",
      category: "DISCOUNTS & BENEFITS",
      badgeText: "Yes",
      shortDesc: "Emergency ambulance service with discount.",
      details: ["Upto 20% Discount"],
      iconName: "ambulance",
      included: true,
    },

    {
      id: "tests-scans",
      title: "Upto 40% Discount on Tests and Scans",
      category: "DISCOUNTS & BENEFITS",
      badgeText: "Yes",
      shortDesc: "Discounts on diagnostic tests and scans.",
      details: ["Upto 40% Discount"],
      iconName: "scan",
      included: true,
    },

    {
      id: "medicines",
      title: "Upto 15% Discount on Medicines",
      category: "DISCOUNTS & BENEFITS",
      badgeText: "Yes",
      shortDesc: "Discount on medicines.",
      details: ["Upto 15% Discount"],
      iconName: "pill",
      included: true,
    },

    {
      id: "opd",
      title: "10% Off on OPD Consultations",
      category: "DISCOUNTS & BENEFITS",
      badgeText: "Yes",
      shortDesc: "Discount on OPD consultations.",
      details: ["10% Discount"],
      iconName: "user-round",
      included: true,
    },

    // ===================================================
    // ADDITIONAL SERVICES
    // ===================================================

    {
      id: "health-coach",
      title: "Health Coach",
      category: "ADDITIONAL SERVICES",
      badgeText: "-",
      shortDesc: "Health coaching service.",
      details: [],
      iconName: "heart-pulse",
      included: true,
    },

    {
      id: "diabetologist",
      title: "Diabetologist-60C",
      category: "ADDITIONAL SERVICES",
      badgeText: "-",
      shortDesc: "Diabetologist consultation.",
      details: [],
      iconName: "stethoscope",
      included: true,
    },

    {
      id: "disease-management",
      title: "Disease Management",
      category: "ADDITIONAL SERVICES",
      badgeText: "-",
      shortDesc: "Disease management service.",
      details: [],
      iconName: "heart-pulse",
      included: true,
    },

    {
      id: "tele-cardio",
      title: "Tele Cardio Consultation",
      category: "ADDITIONAL SERVICES",
      badgeText: "1 Credit",
      shortDesc: "Tele consultation with a cardiology specialist.",
      details: ["1 Credit"],
      iconName: "heart",
      included: true,
    },

    {
      id: "gold-membership",
      title: "HA Exclusive Gold Membership",
      category: "ADDITIONAL SERVICES",
      badgeText: "-",
      shortDesc: "HA Exclusive Gold Membership.",
      details: [],
      iconName: "crown",
      included: true,
    },

    {
      id: "fitness-zumba",
      title: "Online Fitness and Zumba Session",
      category: "ADDITIONAL SERVICES",
      badgeText: "Yes",
      shortDesc: "Online fitness and Zumba sessions.",
      details: ["Yes"],
      iconName: "activity",
      included: true,
    },

    // ===================================================
    // PROTECTION BENEFITS
    // ===================================================

    {
      id: "personal-accident",
      title: "Personal Accident Covered - 5 Lacs",
      category: "PROTECTION BENEFITS",
      badgeText: "Yes",
      shortDesc: "Personal accident cover of 5 Lacs.",
      details: ["Inclusive of accidental death and total disability."],
      iconName: "shield-check",
      included: true,
    },

    {
      id: "hospicash",
      title: "Hospicash",
      category: "PROTECTION BENEFITS",
      badgeText: "Yes",
      shortDesc: "Daily hospitalization cash benefit.",
      details: [
        "INR 1000 per day for normal hospitalization.",
        "Double payout in case of ICU hospitalization.",
        "Maximum 30 days normal hospitalization.",
        "Maximum 15 days ICU hospitalization.",
        "1 day deductible per claim.",
      ],
      iconName: "hospital",
      included: true,
    },
  ],
};
