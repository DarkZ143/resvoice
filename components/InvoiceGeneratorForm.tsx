"use client";

import Image from "next/image";
import { motion } from "motion/react";
import {
  User,
  Phone,
  MapPin,
  ShieldCheck,
  Hospital,
  ChevronRight,
  RotateCcw,
  FileText,
  CalendarDays,
  CreditCard,
  BadgeIndianRupee,
  MapPinned,
  Package,
  Hash,
  Clock3,
} from "lucide-react";
import { useEffect, useState } from "react";

import type { InvoiceData } from "@/types";

/* =========================================================
   COMPANY DETAILS
========================================================= */

const GST_RATE = 5;

const COMPANY_GSTIN = "09AAQCR1885F1ZU";

const COMPANY_CIN = "U86909UW2026OPC257013";

const COMPANY_NAME = "Restore Health Services";

const COMPANY_ADDRESS =
  "A-1, Ground Floor, Sector 59, Noida, Gautam Buddha Nagar, UttarPradesh, 201301";

/* =========================================================
   INDIAN STATES + UNION TERRITORIES
========================================================= */

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

/* =========================================================
   FAMILY OPTIONS
========================================================= */

const FAMILY_OPTIONS = [
  {
    value: "1A",
    description: "Annual health plan membership for individual coverage.",
  },
  {
    value: "2A",
    description: "Annual family health plan membership for 2 adults.",
  },
  {
    value: "2A + 2C",
    description:
      "Annual family health plan membership for 2 adults and 2 children.",
  },
] as const;

/* =========================================================
   PREDEFINED PLANS
========================================================= */

const PLAN_OPTIONS = [
  {
    id: "individual-10000",
    name: "Individual",
    coverage: "Family Coverage: 1A",
    price: 10000,
    planName: "Individual",
    family: "1A",
  },
  {
    id: "floater-20000",
    name: "Floater",
    coverage: "Family Coverage: 2A",
    price: 20000,
    planName: "Floater",
    family: "2A",
  },
  {
    id: "floater-30000",
    name: "Floater",
    coverage: "Family Coverage: 2A",
    price: 30000,
    planName: "Floater",
    family: "2A",
  },
  {
    id: "floater-50000",
    name: "Floater",
    coverage: "Family Coverage: 2A + 2C",
    price: 50000,
    planName: "Floater",
    family: "2A + 2C",
  },
  {
    id: "exec-100000",
    name: "Exec Floater",
    coverage: "Family Coverage: 2A + 2C",
    price: 100000,
    planName: "Exec Floater",
    family: "2A + 2C",
    featured: true,
  },
];

/* =========================================================
   PAYMENT STATUS
========================================================= */

const PAYMENT_STATUS_OPTIONS = [
  "PAID IN FULL",
  "PENDING",
  "PARTIALLY PAID",
  "OVERDUE",
  "CUSTOM",
];

/* =========================================================
   HELPERS
========================================================= */

const formatINR = (value: number) =>
  value.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });

const getFamilyDescription = (family: string) => {
  return (
    FAMILY_OPTIONS.find((item) => item.value === family)?.description || ""
  );
};

/* =========================================================
   PROPS
========================================================= */

interface InvoiceGeneratorFormProps {
  invoiceData: InvoiceData;
  onChange: (updated: InvoiceData) => void;
  onGenerate: () => void;
  onReset: () => void;
}

/* =========================================================
   COMPONENT
========================================================= */

export function InvoiceGeneratorForm({
  invoiceData,
  onChange,
  onGenerate,
  onReset,
}: InvoiceGeneratorFormProps) {
  /* =======================================================
     BASE PRICE INPUT
  ======================================================== */

  const [basePriceInput, setBasePriceInput] = useState(
    invoiceData.basePrice > 0 ? String(invoiceData.basePrice) : "",
  );

  /* =======================================================
     GST INPUT
  ======================================================== */

  const [gstAmountInput, setGstAmountInput] = useState(
    invoiceData.gstAmount > 0 ? String(invoiceData.gstAmount) : "",
  );

  /* =======================================================
     SYNC BASE PRICE
  ======================================================== */

  useEffect(() => {
    setBasePriceInput(
      invoiceData.basePrice > 0 ? String(invoiceData.basePrice) : "",
    );
  }, [invoiceData.basePrice]);

  /* =======================================================
     SYNC GST
  ======================================================== */

  useEffect(() => {
    setGstAmountInput(
      invoiceData.gstAmount > 0 ? String(invoiceData.gstAmount) : "",
    );
  }, [invoiceData.gstAmount]);

  /* =======================================================
     PRICING
  ======================================================== */

  const basePrice = Number(invoiceData.basePrice) || 0;

  const gstAmount = Number(invoiceData.gstAmount) || 0;

  const totalAmount = basePrice + gstAmount;

  /* =======================================================
     SELECTED PLAN
  ======================================================== */

  const isCustomPlan = invoiceData.planName === "Custom Plan";

  const selectedPlan =
    PLAN_OPTIONS.find(
      (plan) =>
        plan.price === basePrice &&
        plan.planName === invoiceData.planName &&
        plan.family === invoiceData.family,
    ) ||
    PLAN_OPTIONS.find(
      (plan) =>
        plan.price === basePrice && plan.planName === invoiceData.planName,
    );

  /* =======================================================
     GENERIC INPUT
  ======================================================== */

  const handleInputChange = (
    field: keyof InvoiceData,
    value: string | number,
  ) => {
    onChange({
      ...invoiceData,
      [field]: value,
    });
  };

  /* =======================================================
     PREDEFINED PLAN
  ======================================================== */

  const handleSelectPlan = (plan: (typeof PLAN_OPTIONS)[number]) => {
    const description = getFamilyDescription(plan.family);

    /*
     * GST amount is manually entered.
     * Selecting a plan must NOT calculate GST.
     */
    setBasePriceInput(String(plan.price));
    setGstAmountInput("");

    onChange({
      ...invoiceData,
      productName: `${plan.planName} (${plan.family})`,
      planName: plan.planName,
      family: plan.family,
      planDescription: description,
      basePrice: plan.price,
      gstRate: GST_RATE,
      gstAmount: 0,
      tenure: "1 Year",
    });
  };

  /* =======================================================
     CUSTOM PLAN
  ======================================================== */

  const handleCustomPlan = () => {
    const defaultFamily = "2A";

    setBasePriceInput("");
    setGstAmountInput("");

    onChange({
      ...invoiceData,
      productName: `Custom Plan (${defaultFamily})`,
      planName: "Custom Plan",
      family: defaultFamily,
      planDescription: getFamilyDescription(defaultFamily),
      basePrice: 0,
      gstRate: GST_RATE,
      gstAmount: 0,
      tenure: "1 Year",
    });
  };

  /* =======================================================
     FAMILY CHANGE
  ======================================================== */

  const handleFamilyChange = (family: string) => {
    const description = getFamilyDescription(family);

    const updatedProductName =
      invoiceData.planName === "Custom Plan"
        ? `Custom Plan (${family})`
        : invoiceData.productName;

    onChange({
      ...invoiceData,
      family,
      planDescription: description,
      productName: updatedProductName,
    });
  };

  /* =======================================================
     PAYMENT STATUS
  ======================================================== */

  const handlePaymentStatusChange = (value: string) => {
    onChange({
      ...invoiceData,
      paymentStatus: value,
      customPaymentStatus:
        value === "CUSTOM" ? invoiceData.customPaymentStatus : "",
    });
  };

  /* =======================================================
     BASE PRICE
     NUMBERS ONLY
  ======================================================== */

  const handleBasePriceChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");

    setBasePriceInput(numericValue);

    onChange({
      ...invoiceData,
      basePrice: numericValue === "" ? 0 : Number(numericValue),
    });
  };

  /* =======================================================
     GST AMOUNT
     NUMBERS ONLY
  ======================================================== */

  const handleGSTAmountChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");

    setGstAmountInput(numericValue);

    onChange({
      ...invoiceData,
      gstAmount: numericValue === "" ? 0 : Number(numericValue),
    });
  };

  /* =======================================================
     PINCODE
     NUMBERS ONLY
     EXACTLY 6 DIGITS
  ======================================================== */

  const handlePincodeChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 6);

    onChange({
      ...invoiceData,
      pincode: numericValue,
    });
  };

  /* =======================================================
     GENERATE
  ======================================================== */

  const handleGenerate = () => {
    const pincode = invoiceData.pincode?.trim() || "";

    if (pincode && pincode.length !== 6) {
      window.alert("Please enter a valid 6-digit pincode.");
      return;
    }

    onGenerate();
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
      }}
      className="min-h-screen bg-[#f4f7f4] pb-16 text-[#18352c]"
    >
      {/* =====================================================
          TOP NAVIGATION
      ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-[#d9e4dc] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[920px] items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt={COMPANY_NAME}
              width={145}
              height={48}
              priority
              className="h-9 w-auto object-contain"
            />

            <div className="hidden h-6 w-px bg-[#d8e3dc] sm:block" />

            <div className="hidden sm:block">
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#7e9087]">
                HEALTH PLAN
              </p>

              <p className="text-sm font-bold text-[#174a37]">
                Invoice Generator
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-full border border-[#ceddd4] bg-white px-3.5 py-2 text-xs font-bold text-[#196044] transition hover:bg-[#eef7f0]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[920px] px-4 pt-7">
        {/* =====================================================
            PAGE TITLE
        ====================================================== */}

        <div className="mb-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#176746]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#7c9086]">
                  {COMPANY_NAME}
                </span>
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-[#17362c] sm:text-3xl">
                Create Health Plan Invoice
              </h1>

              <p className="mt-1 text-sm text-[#6b7d75]">
                Enter invoice, customer and membership details.
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-[#d5e3da] bg-white px-3 py-1.5 sm:flex">
              <ShieldCheck className="h-4 w-4 text-[#176746]" />

              <span className="text-[10px] font-bold uppercase tracking-wider text-[#45665a]">
                GST 5%
              </span>
            </div>
          </div>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleGenerate();
          }}
          className="space-y-5"
        >
          {/* =====================================================
              COMPANY INFORMATION
          ====================================================== */}

          <section className="overflow-hidden rounded-2xl border border-[#d8e4dc] bg-white shadow-[0_4px_16px_rgba(31,73,55,0.05)]">
            <div className="border-b border-[#e3ebe6] bg-[#f8fbf8] px-5 py-4 sm:px-6">
              <h2 className="text-base font-bold text-[#18352c]">
                Company Information
              </h2>
            </div>

            <div className="px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <Image
                  src="/logo.png"
                  alt={COMPANY_NAME}
                  width={110}
                  height={70}
                  priority
                  className="h-[65px] w-auto object-contain"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-extrabold text-[#17362c]">
                    {COMPANY_NAME}
                  </h3>

                  <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#64766e]">
                    {COMPANY_ADDRESS}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-md bg-[#edf7ea] px-2.5 py-1 text-[9px] font-bold text-[#176746]">
                      GSTIN : {COMPANY_GSTIN}
                    </span>

                    <span className="rounded-md bg-[#edf7ea] px-2.5 py-1 text-[9px] font-bold text-[#176746]">
                      CIN : {COMPANY_CIN}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              INVOICE DETAILS
          ====================================================== */}

          <section className="rounded-2xl border border-[#d8e4dc] bg-white shadow-[0_4px_16px_rgba(31,73,55,0.05)]">
            <div className="border-b border-[#e3ebe6] px-5 py-4 sm:px-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#edf6ea] text-[#176746]">
                  <FileText className="h-4 w-4" />
                </div>

                <div>
                  <h2 className="text-base font-bold text-[#18352c]">
                    Invoice Details
                  </h2>

                  <p className="text-[10px] text-[#819189]">
                    Invoice number, issue date and payment status.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-2 sm:px-6">
              {/* INVOICE NUMBER */}

              <div>
                <label
                  htmlFor="invoice-number-input"
                  className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#74877e]"
                >
                  Invoice Number
                </label>

                <div className="relative">
                  <FileText className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#83958d]" />

                  <input
                    id="invoice-number-input"
                    required
                    type="text"
                    value={invoiceData.invoiceNumber}
                    onChange={(event) =>
                      handleInputChange("invoiceNumber", event.target.value)
                    }
                    placeholder="RHS-260831-S"
                    className="w-full rounded-xl border border-[#ccd9d2] bg-[#fbfdfb] py-3 pl-10 pr-4 text-sm font-medium text-[#18352c] outline-none transition focus:border-[#4f8b6c] focus:ring-2 focus:ring-[#4f8b6c]/10"
                  />
                </div>
              </div>

              {/* ISSUE DATE */}

              <div>
                <label
                  htmlFor="issue-date-input"
                  className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#74877e]"
                >
                  Invoice Date
                </label>

                <div className="relative">
                  <CalendarDays className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#83958d]" />

                  <input
                    id="issue-date-input"
                    required
                    type="date"
                    value={invoiceData.issueDate}
                    onChange={(event) =>
                      handleInputChange("issueDate", event.target.value)
                    }
                    className="w-full rounded-xl border border-[#ccd9d2] bg-[#fbfdfb] py-3 pl-10 pr-4 text-sm font-medium text-[#18352c] outline-none transition focus:border-[#4f8b6c] focus:ring-2 focus:ring-[#4f8b6c]/10"
                  />
                </div>
              </div>

              {/* PAYMENT STATUS */}

              <div>
                <label
                  htmlFor="payment-status-input"
                  className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#74877e]"
                >
                  Payment Status
                </label>

                <div className="relative">
                  <CreditCard className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#83958d]" />

                  <select
                    id="payment-status-input"
                    value={invoiceData.paymentStatus}
                    onChange={(event) =>
                      handlePaymentStatusChange(event.target.value)
                    }
                    className="w-full appearance-none rounded-xl border border-[#ccd9d2] bg-[#fbfdfb] px-4 py-3 pl-10 pr-4 text-sm font-medium text-[#18352c] outline-none transition focus:border-[#4f8b6c] focus:ring-2 focus:ring-[#4f8b6c]/10"
                  >
                    {PAYMENT_STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* CUSTOM PAYMENT STATUS */}

              {invoiceData.paymentStatus === "CUSTOM" && (
                <div>
                  <label
                    htmlFor="custom-payment-status-input"
                    className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#74877e]"
                  >
                    Custom Payment Status
                  </label>

                  <input
                    id="custom-payment-status-input"
                    required
                    type="text"
                    value={invoiceData.customPaymentStatus}
                    onChange={(event) =>
                      handleInputChange(
                        "customPaymentStatus",
                        event.target.value,
                      )
                    }
                    placeholder="e.g. PAYMENT RECEIVED"
                    className="w-full rounded-xl border border-[#d9bf80] bg-[#fffaf0] px-4 py-3 text-sm font-semibold text-[#624c19] outline-none transition focus:border-[#bf911d] focus:ring-2 focus:ring-[#bf911d]/10"
                  />
                </div>
              )}
            </div>
          </section>

          {/* =====================================================
              TRANSACTION DETAILS
          ====================================================== */}

          <section className="rounded-2xl border border-[#d8e4dc] bg-white shadow-[0_4px_16px_rgba(31,73,55,0.05)]">
            <div className="border-b border-[#e3ebe6] px-5 py-4 sm:px-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#edf6ea] text-[#176746]">
                  <CreditCard className="h-4 w-4" />
                </div>

                <div>
                  <h2 className="text-base font-bold text-[#18352c]">
                    Transaction Details
                  </h2>

                  <p className="text-[10px] text-[#819189]">
                    Enter the transaction reference and transaction date &amp;
                    time.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-3 sm:px-6">
              {/* PRODUCT NAME */}

              <div>
                <label
                  htmlFor="product-name-input"
                  className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#74877e]"
                >
                  Product Name
                </label>

                <div className="relative">
                  <Package className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#83958d]" />

                  <input
                    id="product-name-input"
                    type="text"
                    value={
                      invoiceData.productName ||
                      (invoiceData.planName
                        ? `${invoiceData.planName} (${invoiceData.family || "—"})`
                        : "")
                    }
                    readOnly
                    placeholder="Select a plan first"
                    className="w-full cursor-not-allowed rounded-xl border border-[#d8e4dc] bg-[#f3f8f4] py-3 pl-10 pr-4 text-sm font-bold text-[#315447] outline-none"
                  />
                </div>

                <p className="mt-1.5 text-[9px] text-[#819189]">
                  Automatically filled from the selected plan/family.
                </p>
              </div>

              {/* TRANSACTION ID */}

              <div>
                <label
                  htmlFor="transaction-id-input"
                  className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#74877e]"
                >
                  Transaction ID
                </label>

                <div className="relative">
                  <Hash className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#83958d]" />

                  <input
                    id="transaction-id-input"
                    required
                    type="text"
                    value={invoiceData.transactionId}
                    onChange={(event) =>
                      handleInputChange("transactionId", event.target.value)
                    }
                    placeholder="Enter transaction ID"
                    className="w-full rounded-xl border border-[#ccd9d2] bg-[#fbfdfb] py-3 pl-10 pr-4 text-sm font-medium text-[#18352c] outline-none transition focus:border-[#4f8b6c] focus:ring-2 focus:ring-[#4f8b6c]/10"
                  />
                </div>

                <p className="mt-1.5 text-[9px] text-[#819189]">
                  Enter the payment / transaction reference exactly as received.
                </p>
              </div>

              {/* TRANSACTION DATE + TIME */}

              <div>
                <label
                  htmlFor="transaction-date-input"
                  className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#74877e]"
                >
                  Transaction Date &amp; Time
                </label>

                <div className="relative">
                  <Clock3 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#83958d]" />

                  <input
                    id="transaction-date-input"
                    required
                    type="datetime-local"
                    value={invoiceData.transactionDate}
                    onChange={(event) =>
                      handleInputChange("transactionDate", event.target.value)
                    }
                    className="w-full rounded-xl border border-[#ccd9d2] bg-[#fbfdfb] py-3 pl-10 pr-4 text-sm font-medium text-[#18352c] outline-none transition focus:border-[#4f8b6c] focus:ring-2 focus:ring-[#4f8b6c]/10"
                  />
                </div>

                <p className="mt-1.5 text-[9px] text-[#819189]">
                  Select the exact date and time of the transaction.
                </p>
              </div>
            </div>
          </section>

          {/* =====================================================
              CUSTOMER DETAILS
          ====================================================== */}

          <section className="rounded-2xl border border-[#d8e4dc] bg-white shadow-[0_4px_16px_rgba(31,73,55,0.05)]">
            <div className="border-b border-[#e3ebe6] px-5 py-4 sm:px-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#edf6ea] text-[#176746]">
                  <User className="h-4 w-4" />
                </div>

                <div>
                  <h2 className="text-base font-bold text-[#18352c]">
                    Customer Details
                  </h2>

                  <p className="text-[10px] text-[#819189]">
                    Enter customer information for the invoice.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 px-5 py-5 sm:px-6">
              {/* CUSTOMER NAME */}

              <div>
                <label
                  htmlFor="customer-name-input"
                  className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#74877e]"
                >
                  Customer Name
                </label>

                <input
                  id="customer-name-input"
                  required
                  type="text"
                  value={invoiceData.customerName}
                  onChange={(event) =>
                    handleInputChange("customerName", event.target.value)
                  }
                  placeholder="Enter customer name"
                  className="w-full rounded-xl border border-[#ccd9d2] bg-[#fbfdfb] px-4 py-3 text-sm font-medium text-[#18352c] outline-none transition focus:border-[#4f8b6c] focus:ring-2 focus:ring-[#4f8b6c]/10"
                />
              </div>

              {/* MOBILE / EMAIL */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* MOBILE */}

                <div>
                  <label
                    htmlFor="phone-input"
                    className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#74877e]"
                  >
                    Mobile Number
                  </label>

                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#83958d]" />

                    <input
                      id="phone-input"
                      required
                      type="tel"
                      inputMode="tel"
                      value={invoiceData.phoneNumber}
                      onChange={(event) =>
                        handleInputChange("phoneNumber", event.target.value)
                      }
                      placeholder="9876543210"
                      className="w-full rounded-xl border border-[#ccd9d2] bg-[#fbfdfb] py-3 pl-10 pr-4 text-sm font-medium text-[#18352c] outline-none transition focus:border-[#4f8b6c] focus:ring-2 focus:ring-[#4f8b6c]/10"
                    />
                  </div>
                </div>

                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="email-input"
                    className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#74877e]"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <svg
                      className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#83958d]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 7 9 6 9-6" />
                    </svg>

                    <input
                      id="email-input"
                      required
                      type="email"
                      autoComplete="email"
                      value={invoiceData.email}
                      onChange={(event) =>
                        handleInputChange("email", event.target.value)
                      }
                      placeholder="customer@example.com"
                      className="w-full rounded-xl border border-[#ccd9d2] bg-[#fbfdfb] py-3 pl-10 pr-4 text-sm font-medium text-[#18352c] outline-none transition focus:border-[#4f8b6c] focus:ring-2 focus:ring-[#4f8b6c]/10"
                    />
                  </div>
                </div>
              </div>

              {/* CITY */}

              <div>
                <label
                  htmlFor="city-input"
                  className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#74877e]"
                >
                  City
                </label>

                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#83958d]" />

                  <input
                    id="city-input"
                    required
                    type="text"
                    value={invoiceData.city}
                    onChange={(event) =>
                      handleInputChange("city", event.target.value)
                    }
                    placeholder="Enter city"
                    className="w-full rounded-xl border border-[#ccd9d2] bg-[#fbfdfb] py-3 pl-10 pr-4 text-sm font-medium text-[#18352c] outline-none transition focus:border-[#4f8b6c] focus:ring-2 focus:ring-[#4f8b6c]/10"
                  />
                </div>
              </div>

              {/* STATE / PINCODE */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* STATE */}

                <div>
                  <label
                    htmlFor="state-input"
                    className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#74877e]"
                  >
                    State
                  </label>

                  <div className="relative">
                    <MapPinned className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#83958d]" />

                    <select
                      id="state-input"
                      required
                      value={invoiceData.state}
                      onChange={(event) =>
                        handleInputChange("state", event.target.value)
                      }
                      className="w-full appearance-none rounded-xl border border-[#ccd9d2] bg-[#fbfdfb] px-4 py-3 pl-10 pr-4 text-sm font-medium text-[#18352c] outline-none transition focus:border-[#4f8b6c] focus:ring-2 focus:ring-[#4f8b6c]/10"
                    >
                      <option value="">Select State</option>

                      {INDIAN_STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* PINCODE */}

                <div>
                  <label
                    htmlFor="pincode-input"
                    className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#74877e]"
                  >
                    Pincode
                  </label>

                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#83958d]" />

                    <input
                      id="pincode-input"
                      required
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      value={invoiceData.pincode}
                      onChange={(event) =>
                        handlePincodeChange(event.target.value)
                      }
                      onKeyDown={(event) => {
                        const allowedKeys = [
                          "Backspace",
                          "Delete",
                          "Tab",
                          "ArrowLeft",
                          "ArrowRight",
                          "Home",
                          "End",
                        ];

                        if (allowedKeys.includes(event.key)) {
                          return;
                        }

                        if (!/^\d$/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      onPaste={(event) => {
                        event.preventDefault();

                        const pasted = event.clipboardData
                          .getData("text")
                          .replace(/\D/g, "")
                          .slice(0, 6);

                        handlePincodeChange(pasted);
                      }}
                      placeholder="6-digit pincode"
                      className="w-full rounded-xl border border-[#ccd9d2] bg-[#fbfdfb] py-3 pl-10 pr-4 text-sm font-medium text-[#18352c] outline-none transition focus:border-[#4f8b6c] focus:ring-2 focus:ring-[#4f8b6c]/10"
                    />
                  </div>

                  <p className="mt-1.5 text-[9px] text-[#819189]">
                    Enter exactly 6 digits.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              PLAN SELECTION
          ====================================================== */}

          <section className="rounded-2xl border border-[#d8e4dc] bg-white shadow-[0_4px_16px_rgba(31,73,55,0.05)]">
            <div className="border-b border-[#e3ebe6] px-5 py-4 sm:px-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#edf6ea] text-[#176746]">
                    <FileText className="h-4 w-4" />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-[#18352c]">
                      Select Plan
                    </h2>

                    <p className="text-[10px] text-[#819189]">
                      Choose a predefined plan or create a custom one.
                    </p>
                  </div>
                </div>

                <div className="rounded-full bg-[#eef7ef] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-wider text-[#176746]">
                  5% GST
                </div>
              </div>
            </div>

            <div className="space-y-2.5 px-5 py-5 sm:px-6">
              {PLAN_OPTIONS.map((plan) => {
                const isSelected = selectedPlan?.id === plan.id;

                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => handleSelectPlan(plan)}
                    className={`group w-full rounded-xl border text-left transition-all ${
                      plan.featured
                        ? isSelected
                          ? "border-[#d99221] bg-[#fff9ef] shadow-sm ring-1 ring-[#d99221]/20"
                          : "border-[#ecd6ad] bg-[#fffdf8] hover:border-[#d99221]"
                        : isSelected
                          ? "border-[#5c9574] bg-[#f3faf4] shadow-sm ring-1 ring-[#5c9574]/15"
                          : "border-[#dae4df] bg-white hover:border-[#9db9aa] hover:bg-[#fbfdfb]"
                    }`}
                  >
                    <div className="flex items-center gap-3 p-3.5 sm:p-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                          plan.featured
                            ? "bg-[#fff0d2] text-[#d98200]"
                            : "bg-[#edf7ea] text-[#176746]"
                        }`}
                      >
                        {plan.featured ? (
                          <ShieldCheck className="h-5 w-5" />
                        ) : plan.family === "1A" ? (
                          <User className="h-5 w-5" />
                        ) : (
                          <Hospital className="h-5 w-5" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-extrabold text-[#17362c] sm:text-base">
                            {plan.name}
                          </h3>

                          {plan.featured && (
                            <span className="rounded-full bg-[#d98200] px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wide text-white">
                              Executive
                            </span>
                          )}

                          {isSelected && (
                            <span className="rounded-full bg-[#dff0e4] px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wide text-[#176746]">
                              Selected
                            </span>
                          )}
                        </div>

                        <p className="mt-0.5 text-xs font-medium text-[#587067]">
                          {plan.coverage}
                        </p>

                        <span className="mt-1.5 inline-block rounded border border-[#e7ca82] bg-[#fff9eb] px-2 py-0.5 text-[8px] font-medium leading-relaxed text-[#8b6510]">
                          Once the plan is issued, it can not be cancelled or
                          refunded.
                        </span>
                      </div>

                      <div className="shrink-0 text-right">
                        <p
                          className={`text-base font-extrabold sm:text-xl ${
                            plan.featured ? "text-[#cf7900]" : "text-[#075e3d]"
                          }`}
                        >
                          ₹{formatINR(plan.price)}
                        </p>

                        <p className="text-[8px] font-semibold text-[#7c8d86]">
                          GST 5% · Enter amount below
                        </p>

                        <p className="mt-0.5 text-[8px] font-bold text-[#597269]">
                          GST is entered manually
                        </p>
                      </div>

                      <div className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eff5f1] text-[#376151] sm:flex">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* CUSTOM PLAN */}

              <button
                type="button"
                onClick={handleCustomPlan}
                className={`group w-full rounded-xl border text-left transition-all ${
                  isCustomPlan
                    ? "border-[#176746] bg-[#f2faf4] shadow-sm ring-1 ring-[#176746]/15"
                    : "border-dashed border-[#99b6a7] bg-[#fbfdfb] hover:border-[#176746] hover:bg-[#f6fbf7]"
                }`}
              >
                <div className="flex items-center gap-3 p-3.5 sm:p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf7ea] text-[#176746]">
                    <BadgeIndianRupee className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-extrabold text-[#17362c] sm:text-base">
                        Custom Plan
                      </h3>

                      {isCustomPlan && (
                        <span className="rounded-full bg-[#dff0e4] px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wide text-[#176746]">
                          Selected
                        </span>
                      )}
                    </div>

                    <p className="mt-0.5 text-xs font-medium text-[#587067]">
                      Choose family, validity, base price and manually entered
                      GST amount.
                    </p>
                  </div>

                  <div className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eff5f1] text-[#376151] sm:flex">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </button>
            </div>
          </section>

          {/* =====================================================
              PLAN DETAILS
          ====================================================== */}

          <section className="rounded-2xl border border-[#d8e4dc] bg-white shadow-[0_4px_16px_rgba(31,73,55,0.05)]">
            <div className="border-b border-[#e3ebe6] px-5 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#18352c]">
                    Plan Details
                  </h2>

                  <p className="mt-0.5 text-[10px] text-[#819189]">
                    Family controls the description automatically.
                  </p>
                </div>

                <span className="rounded-full bg-[#edf7ea] px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-[#176746]">
                  GST 5%
                </span>
              </div>
            </div>

            <div className="space-y-4 px-5 py-5 sm:px-6">
              {/* FAMILY */}

              <div>
                <label
                  htmlFor="family-input"
                  className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#74877e]"
                >
                  Family
                </label>

                <select
                  id="family-input"
                  required
                  value={invoiceData.family}
                  onChange={(event) => handleFamilyChange(event.target.value)}
                  className="w-full rounded-xl border border-[#ccd9d2] bg-[#fbfdfb] px-4 py-3 text-sm font-bold text-[#18352c] outline-none transition focus:border-[#4f8b6c] focus:ring-2 focus:ring-[#4f8b6c]/10"
                >
                  <option value="">Select Family</option>

                  <option value="1A">1A</option>

                  <option value="2A">2A</option>

                  <option value="2A + 2C">2A + 2C</option>
                </select>
              </div>

              {/* DESCRIPTION */}

              <div>
                <label
                  htmlFor="plan-description-input"
                  className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#74877e]"
                >
                  Plan Description
                </label>

                <textarea
                  id="plan-description-input"
                  rows={3}
                  value={
                    getFamilyDescription(invoiceData.family) ||
                    invoiceData.planDescription
                  }
                  readOnly
                  className="w-full resize-none cursor-not-allowed rounded-xl border border-[#d8e4dc] bg-[#f3f8f4] px-4 py-3 text-sm font-medium leading-relaxed text-[#315447] outline-none"
                />

                <p className="mt-1.5 text-[9px] text-[#819189]">
                  Automatically assigned based on family.
                </p>
              </div>

              {/* VALIDITY / BASE PRICE */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* VALIDITY */}

                <div>
                  <label
                    htmlFor="tenure-input"
                    className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#74877e]"
                  >
                    Validity
                  </label>

                  <input
                    id="tenure-input"
                    required
                    type="text"
                    value={invoiceData.tenure}
                    onChange={(event) =>
                      handleInputChange("tenure", event.target.value)
                    }
                    placeholder="1 Year"
                    className="w-full rounded-xl border border-[#ccd9d2] bg-[#fbfdfb] px-4 py-3 text-sm font-medium text-[#18352c] outline-none transition focus:border-[#4f8b6c] focus:ring-2 focus:ring-[#4f8b6c]/10"
                  />
                </div>

                {/* BASE PRICE */}

                <div>
                  <label
                    htmlFor="base-price-input"
                    className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#74877e]"
                  >
                    Base Price
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-[#667c73]">
                      ₹
                    </span>

                    <input
                      id="base-price-input"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      required
                      value={basePriceInput}
                      onChange={(event) =>
                        handleBasePriceChange(event.target.value)
                      }
                      onKeyDown={(event) => {
                        const allowedKeys = [
                          "Backspace",
                          "Delete",
                          "Tab",
                          "ArrowLeft",
                          "ArrowRight",
                          "Home",
                          "End",
                        ];

                        if (allowedKeys.includes(event.key)) {
                          return;
                        }

                        if (!/^\d$/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      onPaste={(event) => {
                        event.preventDefault();

                        handleBasePriceChange(
                          event.clipboardData.getData("text"),
                        );
                      }}
                      placeholder="Enter amount"
                      className="w-full rounded-xl border border-[#ccd9d2] bg-[#fbfdfb] py-3 pl-9 pr-4 text-sm font-bold text-[#18352c] outline-none transition focus:border-[#4f8b6c] focus:ring-2 focus:ring-[#4f8b6c]/10"
                    />
                  </div>

                  <p className="mt-1.5 text-[9px] text-[#819189]">
                    Numbers only.
                  </p>
                </div>
              </div>

              {/* GST AMOUNT */}

              <div>
                <label
                  htmlFor="gst-amount-input"
                  className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#74877e]"
                >
                  GST Amount
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-[#667c73]">
                    ₹
                  </span>

                  <input
                    id="gst-amount-input"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required
                    value={gstAmountInput}
                    onChange={(event) =>
                      handleGSTAmountChange(event.target.value)
                    }
                    onKeyDown={(event) => {
                      const allowedKeys = [
                        "Backspace",
                        "Delete",
                        "Tab",
                        "ArrowLeft",
                        "ArrowRight",
                        "Home",
                        "End",
                      ];

                      if (allowedKeys.includes(event.key)) {
                        return;
                      }

                      if (!/^\d$/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault();

                      handleGSTAmountChange(
                        event.clipboardData.getData("text"),
                      );
                    }}
                    placeholder="Enter GST amount"
                    className="w-full rounded-xl border border-[#ccd9d2] bg-[#fbfdfb] py-3 pl-9 pr-4 text-sm font-bold text-[#18352c] outline-none transition focus:border-[#4f8b6c] focus:ring-2 focus:ring-[#4f8b6c]/10"
                  />
                </div>

                <p className="mt-1.5 text-[9px] text-[#819189]">
                  GST rate remains fixed at 5%. Enter the actual GST amount.
                </p>
              </div>

              {/* GST RATE */}

              <div className="flex items-center justify-between rounded-xl border border-[#d4e5d9] bg-[#f4faf4] px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-[#24493b]">GST Rate</p>

                  <p className="text-[9px] text-[#75887f]">
                    Reference rate shown on the invoice.
                  </p>
                </div>

                <span className="rounded-full bg-[#075e3d] px-3 py-1 text-sm font-extrabold text-white">
                  5%
                </span>
              </div>
            </div>
          </section>

          {/* =====================================================
              PAYMENT SUMMARY
          ====================================================== */}

          <section className="rounded-2xl border border-[#d8e4dc] bg-white shadow-[0_4px_16px_rgba(31,73,55,0.05)]">
            <div className="border-b border-[#e3ebe6] px-5 py-4 sm:px-6">
              <h2 className="text-base font-bold text-[#18352c]">
                Payment Summary
              </h2>
            </div>

            <div className="p-5 sm:p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#e3ebe6] pb-3">
                  <span className="text-sm text-[#61756c]">Base Price</span>

                  <span className="text-base font-semibold text-[#18352c]">
                    ₹{formatINR(basePrice)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-[#e3ebe6] pb-3">
                  <span className="text-sm text-[#61756c]">GST (5%)</span>

                  <span className="text-base font-semibold text-[#176746]">
                    ₹{formatINR(gstAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="text-sm font-extrabold uppercase text-[#176746]">
                      Total Payable
                    </p>

                    <p className="mt-0.5 text-[9px] text-[#7b8d85]">
                      Base Price + GST Amount
                    </p>
                  </div>

                  <p className="text-2xl font-extrabold text-[#075e3d]">
                    ₹{formatINR(totalAmount)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              BENEFITS
          ====================================================== */}

          <section className="rounded-2xl border border-[#d8e4dc] bg-white shadow-[0_4px_16px_rgba(31,73,55,0.05)]">
            <div className="border-b border-[#e3ebe6] px-5 py-4 sm:px-6">
              <h2 className="text-base font-bold text-[#18352c]">
                Included Benefits
              </h2>

              <p className="mt-0.5 text-[10px] text-[#819189]">
                Benefits included with the membership plan.
              </p>
            </div>

            <div className="space-y-3 p-5 sm:p-6">
              {/* HOSPICASH */}

              <div className="overflow-hidden rounded-xl border border-[#d6e2d9]">
                <div className="flex items-center gap-3 bg-[#075e3d] px-4 py-3">
                  <Hospital className="h-4 w-4 text-white" />

                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-wider text-[#b9e6c9]">
                      Including Protection Benefit
                    </p>

                    <p className="text-sm font-bold text-white">
                      Hospicash Benefit
                    </p>
                  </div>
                </div>

                <div className="space-y-2 bg-[#f7fbf7] p-4 text-[10px] leading-relaxed text-[#42544d]">
                  <p>
                    Covered Amount - <strong>INR 1000 per day</strong>{" "}
                    hospitalization with maximum limit upto{" "}
                    <strong>30 days in a year</strong> with 1 day deductible per
                    claim.
                  </p>

                  <p>
                    Payout will be{" "}
                    <strong className="text-[#176746]">
                      double in case of ICU hospitalization
                    </strong>{" "}
                    with maximum limit upto <strong>15 days in a year</strong>{" "}
                    with 1 day deductible per claim.
                  </p>

                  <p>
                    Customers can avail this benefit only for{" "}
                    <strong>30 days in a policy year</strong> collectively for
                    normal hospitalization and{" "}
                    <strong>15 days in a policy year</strong> collectively for
                    ICU hospitalization.
                  </p>
                </div>
              </div>

              {/* PERSONAL ACCIDENT */}

              <div className="overflow-hidden rounded-xl border border-[#d6e2d9]">
                <div className="flex items-center gap-3 bg-[#075e3d] px-4 py-3">
                  <ShieldCheck className="h-4 w-4 text-white" />

                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-wider text-[#b9e6c9]">
                      Including Protection Benefit
                    </p>

                    <p className="text-sm font-bold text-white">
                      Personal Accident Cover - 5 Lacs
                    </p>
                  </div>
                </div>

                <div className="bg-[#f7fbf7] p-4 text-[10px] leading-relaxed text-[#42544d]">
                  Inclusive of <strong>accidental death</strong> and{" "}
                  <strong>total disability.</strong>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              GENERATE
          ====================================================== */}

          <section className="rounded-2xl border border-[#c9ddcf] bg-[#f1f8f2] p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#779087]">
                  Ready to Generate
                </p>

                <p className="mt-1 text-sm font-bold text-[#214a39]">
                  {invoiceData.customerName || "Customer"} •{" "}
                  {invoiceData.planName || "Plan"}
                </p>

                <p className="mt-0.5 text-[10px] text-[#6f8179]">
                  Total payable:{" "}
                  <strong className="text-[#176746]">
                    ₹{formatINR(totalAmount)}
                  </strong>{" "}
                  including entered GST
                </p>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-full bg-[#075e3d] px-6 py-3.5 text-sm font-extrabold text-white shadow-md transition hover:bg-[#064f34] hover:shadow-lg active:scale-[0.99]"
              >
                <FileText className="h-4 w-4" />
                Generate Invoice
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        </form>

        {/* =====================================================
            COMPANY REGISTRATION DETAILS
        ====================================================== */}

        <div className="mt-5 border-t border-[#d9e4dc] pt-4 text-center">
          <div className="flex flex-col items-center justify-center gap-1 sm:flex-row sm:gap-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#667b72]">
              GSTIN :
              <span className="ml-1 text-[#176746]">{COMPANY_GSTIN}</span>
            </p>

            <span className="hidden h-3 w-px bg-[#cbd9d1] sm:block" />

            <p className="text-[10px] font-bold uppercase tracking-wider text-[#667b72]">
              CIN :<span className="ml-1 text-[#176746]">{COMPANY_CIN}</span>
            </p>
          </div>

          <p className="mt-2 text-[9px] leading-relaxed text-[#86968f]">
            {COMPANY_NAME} · {COMPANY_ADDRESS}
          </p>
        </div>
      </main>
    </motion.div>
  );
}
