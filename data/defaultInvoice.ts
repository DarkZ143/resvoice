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

  /**
   * Product selected for the transaction.
   *
   * Examples:
   * 1A
   * 2A
   * 2A + 2C
   * Custom Plan (2A)
   */
  productName: "",

  /**
   * Payment / transaction reference ID.
   */
  transactionId: "",

  /**
   * yyyy-mm-ddTHH:mm format for HTML datetime-local input.
   */
  transactionDate: "",

  /**
   * Multiple payment transactions.
   *
   * Maximum supported by the form: 3.
   */
  transactions: [],

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
  // GST amount is entered manually by admin.
  // Final payable amount is ALSO entered manually.
  //
  // There is NO automatic calculation between
  // Base Price, GST Amount and Total Payable.
  // =====================================================

  basePrice: 0,

  gstRate: 5,

  gstAmount: 0,

  // Final payable amount entered manually by admin.
  totalAmount: 0,

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
      id: "personal-accident-cover",
      title: "Personal Accident Cover-Sum Insured",
      category: "PROTECTION BENEFITS",
      badgeText: "5 Lac",
      shortDesc: "Personal Accident Cover-Sum Insured.",
      details: ["5 Lac"],
      iconName: "shield-check",
      included: true,
    },

    {
      id: "accidental-death",
      title: "Accidental Death",
      category: "PROTECTION BENEFITS",
      badgeText: "100% of SI",
      shortDesc: "Accidental Death benefit.",
      details: ["100% of SI"],
      iconName: "shield-check",
      included: true,
    },

    {
      id: "ppd",
      title: "PPD",
      category: "PROTECTION BENEFITS",
      badgeText: "Up to SI",
      shortDesc: "Permanent Partial Disability benefit.",
      details: ["Up to SI", "As per PPD table of Group Care 360"],
      iconName: "shield-check",
      included: true,
    },

    {
      id: "ptd",
      title: "PTD",
      category: "PROTECTION BENEFITS",
      badgeText: "Up to SI",
      shortDesc: "Permanent Total Disability benefit.",
      details: ["Up to SI", "As per PTD table of Group Care 360"],
      iconName: "shield-check",
      included: true,
    },

    {
      id: "claims-payout-pa",
      title: "Claims payout-PA",
      category: "PROTECTION BENEFITS",
      badgeText: "Re-imbursement",
      shortDesc: "Claims payout for Personal Accident.",
      details: ["Re-imbursement"],
      iconName: "file-text",
      included: true,
    },

    {
      id: "covered-amount-daily-cash",
      title: "Covered Amount- Daily Cash",
      category: "PROTECTION BENEFITS",
      badgeText: "Rs. 1000",
      shortDesc: "Daily Cash covered amount.",
      details: ["Rs. 1000"],
      iconName: "badge-indian-rupee",
      included: true,
    },

    {
      id: "daily-cash-benefit-normal",
      title: "Daily Cash Benefit",
      category: "PROTECTION BENEFITS",
      badgeText: "30 Days",
      shortDesc:
        "Per day hospitalization with maximum limit upto 30 days in a year with 1 day deductible on Per claim.",
      details: [
        "Per day hospitalization.",
        "Maximum limit upto 30 days in a year.",
        "1 day deductible on Per claim.",
      ],
      iconName: "hospital",
      included: true,
    },

    {
      id: "daily-cash-benefit-icu",
      title: "Daily Cash Benefit",
      category: "PROTECTION BENEFITS",
      badgeText: "ICU",
      shortDesc:
        "Payout double in case of ICU hospitalization with maximum limit upto 15 days in a Year with 1 days deductible on Per claim.",
      details: [
        "Payout double in case of ICU hospitalization.",
        "Maximum limit upto 15 days in a Year.",
        "1 days deductible on Per claim.",
      ],
      iconName: "hospital",
      included: true,
    },

    {
      id: "daily-cash-benefit-policy-year",
      title: "Daily Cash Benefit",
      category: "PROTECTION BENEFITS",
      badgeText: "Policy Year",
      shortDesc:
        "Customers can avail this benefit only for 30 days in a Policy Year collectively for Normal & 15 days in a Policy.",
      details: [
        "30 days in a Policy Year collectively for Normal.",
        "15 days in a Policy for ICU hospitalization.",
      ],
      iconName: "calendar-days",
      included: true,
    },

    {
      id: "daily-cash-benefit-icu-year",
      title: "Daily Cash Benefit",
      category: "PROTECTION BENEFITS",
      badgeText: "ICU",
      shortDesc: "Year collectively for ICU Hospitalization.",
      details: ["Year collectively for ICU Hospitalization"],
      iconName: "hospital",
      included: true,
    },

    {
      id: "wait-period-30-days",
      title: "Wait Period-30 Days",
      category: "PROTECTION BENEFITS",
      badgeText: "Yes",
      shortDesc: "Wait period of 30 days except for injuries or accidents.",
      details: ["Yes (except for Injuries/Accident)"],
      iconName: "clock-3",
      included: true,
    },

    {
      id: "named-alimant",
      title: "Named Alimant (as defined in Group Care 360 Product)",
      category: "PROTECTION BENEFITS",
      badgeText: "12 Months",
      shortDesc: "Named Alimant as defined in Group Care 360 Product.",
      details: ["12 Months"],
      iconName: "file-text",
      included: true,
    },

    {
      id: "pre-existing-diseases",
      title: "Pre-existing diseases",
      category: "PROTECTION BENEFITS",
      badgeText: "12 Months",
      shortDesc: "Waiting period applicable to pre-existing diseases.",
      details: ["12 Months"],
      iconName: "file-text",
      included: true,
    },

    {
      id: "maternity",
      title: "Maternity",
      category: "PROTECTION BENEFITS",
      badgeText: "Not Covered",
      shortDesc: "Maternity benefit is not covered.",
      details: ["Not Covered"],
      iconName: "x-circle",
      included: true,
    },

    {
      id: "claims-payout-dc",
      title: "Claims payout-DC",
      category: "PROTECTION BENEFITS",
      badgeText: "Re-imbursement",
      shortDesc: "Claims payout for Daily Cash.",
      details: ["Re-imbursement"],
      iconName: "file-text",
      included: true,
    },
  ],
};
