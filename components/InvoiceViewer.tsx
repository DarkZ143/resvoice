"use client";

import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";
import { ArrowLeft, Download, Share2, Check } from "lucide-react";
import confetti from "canvas-confetti";

import type { InvoiceData } from "@/types";

interface InvoiceViewerProps {
  invoiceData: InvoiceData;
  onBack: () => void;
  onEdit: () => void;
}

/* ==========================================================
   COMPANY DETAILS
========================================================== */

const COMPANY_NAME = "Restore Health Services";

const COMPANY_ADDRESS =
  "A-1, Ground Floor, Sector 59, Noida, Gautam Buddha Nagar, UttarPradesh, 201301";

const COMPANY_GSTIN = "09AAQCR1885F1ZU";

const COMPANY_CIN = "U86909UW2026OPC257013";

const COMPANY_PHONE = "9289250468";

const COMPANY_WEBSITE = "restorehealthservices.in";

/* ==========================================================
   TAX
========================================================== */

const GST_RATE = 5;

const GST_LABEL = `GST (${GST_RATE}%)`;

/* ==========================================================
   FAMILY DESCRIPTIONS
========================================================== */

const FAMILY_DESCRIPTIONS: Record<string, string> = {
  "1A": "Annual health plan membership for individual coverage.",

  "2A": "Annual family health plan membership for 2 adults.",

  "2A + 2C":
    "Annual family health plan membership for 2 adults and 2 children.",
};

/* ==========================================================
   FORMATTERS
========================================================== */

const formatINR = (value: number) =>
  value.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

const formatInvoiceDate = (value: string) => {
  if (!value) return "-";

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (match) {
    const [, year, month, day] = match;

    return `${day}/${month}/${year}`;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/* ==========================================================
   MASKING

   Mobile: 9999999999 -> +9199XXXXXX99
   Email:  example123@gmail.com -> exXXXXX123@gmail.com
   (domain is kept exactly as entered by admin)
========================================================== */

const maskPhone = (value: string) => {
  let digits = String(value ?? "").replace(/\D/g, "");

  if (!digits) return "-";

  if (digits.length > 10 && digits.startsWith("91")) {
    digits = digits.slice(2);
  }

  if (digits.length <= 4) return `+91${digits}`;

  return `+91${digits.slice(0, 2)}${"X".repeat(digits.length - 4)}${digits.slice(-2)}`;
};

const maskEmail = (value: string) => {
  const trimmed = String(value ?? "").trim();

  const atIndex = trimmed.lastIndexOf("@");

  if (atIndex <= 0) return trimmed || "-";

  const local = trimmed.slice(0, atIndex);

  const domain = trimmed.slice(atIndex);

  if (local.length > 5) {
    return `${local.slice(0, 2)}${"X".repeat(local.length - 5)}${local.slice(-3)}${domain}`;
  }

  if (local.length > 2) {
    return `${local.slice(0, 2)}${"X".repeat(local.length - 2)}${domain}`;
  }

  return `${local}${domain}`;
};

/* ==========================================================
   TRANSACTION DATE + TIME FORMATTER

   Keeps both date and time from datetime-local input.
========================================================== */

const formatTransactionDateTime = (value: string) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value.replace("T", " ");
  }

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

/* ==========================================================
   INVOICE LOGO
========================================================== */

function InvoiceLogo({ className = "" }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt={COMPANY_NAME}
      draggable={false}
      className={`block object-contain ${className}`}
    />
  );
}

/* ==========================================================
   WAIT FOR IMAGES
========================================================== */

const waitForImages = async (root: HTMLElement) => {
  const images = Array.from(root.querySelectorAll("img"));

  await Promise.all(
    images.map(
      (image) =>
        new Promise<void>((resolve) => {
          if (image.complete && image.naturalWidth > 0) {
            resolve();
            return;
          }

          const finish = () => resolve();

          image.addEventListener("load", finish, { once: true });

          image.addEventListener("error", finish, { once: true });
        }),
    ),
  );
};

/* ==========================================================
   INFO CELL
========================================================== */

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 border-r border-[#dbe8df] p-4 last:border-r-0">
      <div className="mb-2 text-[9px] font-bold uppercase tracking-wider text-[#8a9a93]">
        {label}
      </div>

      <div className="break-words text-sm font-bold text-[#18352c]">
        {value || "-"}
      </div>
    </div>
  );
}

/* ==========================================================
   BENEFIT ROW
========================================================== */

function BenefitRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-3 border-b border-[#e5ece8] px-3 py-3 last:border-b-0">
      <div className="whitespace-pre-line break-words text-[10px] leading-relaxed text-[#33463f]">
        {label}
      </div>

      <div className="min-w-[42px] text-right text-[10px] font-bold text-[#146746]">
        {value}
      </div>
    </div>
  );
}

/* ==========================================================
   DECLARATION POINT
========================================================== */

function DeclarationPoint({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-[#dccb9a] pb-3">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#075e3d] text-[15px] font-extrabold text-white">
          {number}
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#7f9488] bg-white text-[#075e3d]">
          {icon}
        </div>

        <div className="min-w-0 pt-0.5">
          <h3 className="text-[12px] font-extrabold uppercase leading-tight text-[#174936]">
            {title}
          </h3>
          <p className="mt-1 max-w-[560px] text-[9px] leading-[1.35] text-[#34483f]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================
   TRANSACTION DETAIL
========================================================== */

function TransactionDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg border border-[#d9d3bc] bg-white px-4 py-3">
      <p className="text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#8b877a]">
        {label}
      </p>

      <p className="mt-1 break-words text-[11px] font-extrabold text-[#173f31]">
        {value || "-"}
      </p>
    </div>
  );
}

/* ==========================================================
   VIEWER
========================================================== */

export function InvoiceViewer({
  invoiceData,
  onBack,
  onEdit,
}: InvoiceViewerProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const [copied, setCopied] = useState(false);

  const invoiceDocRef = useRef<HTMLDivElement>(null);

  /* ========================================================
     PRICING
     
     GST IS MANUAL.
     NO 5% FORMULA.
  ======================================================== */

  const basePrice = Number(invoiceData.basePrice) || 0;

  const gstAmount = Number(invoiceData.gstAmount) || 0;

  const totalAmount = Number(invoiceData.totalAmount) || 0;

  /* ========================================================
     INVOICE
  ======================================================== */

  const invoiceDate = formatInvoiceDate(invoiceData.issueDate);

  const invoiceWithFreelook = invoiceData as InvoiceData & {
    freelookTill?: string;
  };

  const freelookDate = formatInvoiceDate(
    invoiceWithFreelook.freelookTill ?? "",
  );

  /* ========================================================
     CUSTOMER
  ======================================================== */

  const email = String(invoiceData.email ?? "").trim() || "-";

  const maskedEmail = maskEmail(invoiceData.email);

  const maskedPhone = maskPhone(invoiceData.phoneNumber);

  const pincode = String(invoiceData.pincode ?? "").trim() || "-";

  /* ========================================================
     TRANSACTION
  ======================================================== */

  const productName =
    String(invoiceData.productName ?? "").trim() ||
    String(invoiceData.planName ?? "").trim() ||
    "Health Plan";

  const transactions = (() => {
    if (Array.isArray(invoiceData.transactions)) {
      return invoiceData.transactions
        .map((transaction) => {
          const typedTransaction = transaction as {
            transactionId?: string | number;
            transactionDate?: string;
            amount?: number | string;
          };

          return {
            transactionId: String(typedTransaction.transactionId ?? "").trim(),
            transactionDate: String(
              typedTransaction.transactionDate ?? "",
            ).trim(),
            amount: typedTransaction.amount ?? 0,
          };
        })
        .filter(
          (transaction) =>
            transaction.transactionId || transaction.transactionDate,
        );
    }

    const legacyId = String(invoiceData.transactionId ?? "").trim();
    const legacyDate = String(invoiceData.transactionDate ?? "").trim();

    return legacyId || legacyDate
      ? [
          {
            transactionId: legacyId,
            transactionDate: legacyDate,
            amount: Number(invoiceData.totalAmount ?? 0),
          },
        ]
      : [];
  })();

  const limitedTransactions = transactions.slice(0, 3);

  const displayTransactions = limitedTransactions.length
    ? limitedTransactions
    : [
        {
          transactionId: "-",
          transactionDate: "",
          amount: 0,
        },
      ];

  /* ========================================================
     PLAN
  ======================================================== */

  const family = String(invoiceData.family ?? "").trim() || "—";

  const planName = String(invoiceData.planName ?? "").trim() || "Plan";

  const planDescription =
    FAMILY_DESCRIPTIONS[family] ||
    String(invoiceData.planDescription ?? "").trim() ||
    "Health plan membership";

  const validity = String(invoiceData.tenure ?? "").trim() || "1 Year";

  const transactionProductName =
    family !== "—" ? `${productName} — ${family}` : productName;

  /* ========================================================
     PAYMENT STATUS
  ======================================================== */

  const paymentStatus = (() => {
    const selectedStatus = String(invoiceData.paymentStatus ?? "").trim();

    const customStatus = String(invoiceData.customPaymentStatus ?? "").trim();

    if (selectedStatus.toUpperCase() === "CUSTOM") {
      return customStatus || "CUSTOM";
    }

    return selectedStatus || "PAID IN FULL";
  })();

  /* ========================================================
     CAPTURE ONE A4 PAGE

     Uses html-to-image instead of html2canvas.
     This avoids html2canvas CSS color parsing issues such as
     unsupported oklab()/oklch() functions while preserving
     the existing invoice layout.
  ======================================================== */

  const capturePage = async (
    element: HTMLElement,
    toCanvas: typeof import("html-to-image").toCanvas,
  ) => {
    await waitForImages(element);

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 300);
    });

    const previousWidth = element.style.width;
    const previousMaxWidth = element.style.maxWidth;
    const previousMinWidth = element.style.minWidth;
    const previousHeight = element.style.height;
    const previousMinHeight = element.style.minHeight;

    /*
     * Keep the exact same A4 CSS dimensions used by the invoice.
     */
    element.style.width = "794px";
    element.style.maxWidth = "794px";
    element.style.minWidth = "794px";
    element.style.height = "1123px";
    element.style.minHeight = "1123px";

    try {
      return await toCanvas(element, {
        width: 794,
        height: 1123,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        cacheBust: true,
        skipFonts: false,
        imagePlaceholder: undefined,
      });
    } finally {
      element.style.width = previousWidth;
      element.style.maxWidth = previousMaxWidth;
      element.style.minWidth = previousMinWidth;
      element.style.height = previousHeight;
      element.style.minHeight = previousMinHeight;
    }
  };

  /* ========================================================
     DOWNLOAD PDF
     
     EXACTLY THREE PAGES:
     1. Invoice Details
     2. Protection Benefits 1–21 + 9 CI
     3. Protection Benefits 22–29 + Invoice Summary + Contacts + Transaction Details
  ======================================================== */

  const handleDownloadPDF = async () => {
    if (isGeneratingPDF) return;

    setIsGeneratingPDF(true);

    try {
      const page1 = document.getElementById("invoice-page-1");

      const page2 = document.getElementById("invoice-page-2");

      const page3 = document.getElementById("invoice-page-3");

      if (!page1 || !page2 || !page3) {
        throw new Error("Invoice pages not found.");
      }

      const [{ toCanvas }, { jsPDF }] = await Promise.all([
        import("html-to-image"),
        import("jspdf"),
      ]);

      /* ==================================================
         CAPTURE PAGE 1
      ================================================== */

      const canvas1 = await capturePage(page1, toCanvas);

      /* ==================================================
         CAPTURE PAGE 2
      ================================================== */

      const canvas2 = await capturePage(page2, toCanvas);

      /* ==================================================
         CAPTURE PAGE 3
      ================================================== */

      const canvas3 = await capturePage(page3, toCanvas);

      /* ==================================================
         CREATE A4 PDF
      ================================================== */

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();

      const pdfHeight = pdf.internal.pageSize.getHeight();

      const margin = 4;

      const printableWidth = pdfWidth - margin * 2;

      const printableHeight = pdfHeight - margin * 2;

      /* ==================================================
         ADD CANVAS WITHOUT CROPPING
      ================================================== */

      const addCanvasToPage = (canvas: HTMLCanvasElement) => {
        const scale = Math.min(
          printableWidth / canvas.width,
          printableHeight / canvas.height,
        );

        const imageWidth = canvas.width * scale;

        const imageHeight = canvas.height * scale;

        const x = (pdfWidth - imageWidth) / 2;

        const y = (pdfHeight - imageHeight) / 2;

        pdf.addImage(
          canvas.toDataURL("image/jpeg", 0.97),
          "JPEG",
          x,
          y,
          imageWidth,
          imageHeight,
          undefined,
          "FAST",
        );
      };

      /* ==================================================
         PAGE 1
      ================================================== */

      addCanvasToPage(canvas1);

      /* ==================================================
         PAGE 2
      ================================================== */

      pdf.addPage();

      addCanvasToPage(canvas2);

      /* ==================================================
         PAGE 3
      ================================================== */

      pdf.addPage();

      addCanvasToPage(canvas3);

      /* ==================================================
         FILE NAME = PHONE NUMBER
      ================================================== */

      const phoneNumber = String(invoiceData.phoneNumber ?? "").replace(
        /\D/g,
        "",
      );

      const fileName = `${phoneNumber || "Customer"}-Invoice.pdf`;

      /* ==================================================
         SAVE
      ================================================== */

      pdf.save(fileName);

      /* ==================================================
         SUCCESS EFFECT
      ================================================== */

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: {
            y: 0.7,
          },
        });
      } catch {
        // Optional effect.
      }
    } catch (error) {
      console.error("PDF generation error:", error);

      window.alert("PDF generate nahi ho paya. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  /* ========================================================
     COPY SUMMARY
  ======================================================== */

  const handleCopySummary = async () => {
    const summary = `Restore Health Services
${COMPANY_ADDRESS}
GSTIN: ${COMPANY_GSTIN}
CIN: ${COMPANY_CIN}
Phone: ${COMPANY_PHONE}
Website: ${COMPANY_WEBSITE}

Invoice No: ${invoiceData.invoiceNumber || "-"}
Invoice Date: ${invoiceDate}

Customer: ${invoiceData.customerName || "-"}
Mobile: ${invoiceData.phoneNumber || "-"}
Email: ${email}
City: ${invoiceData.city || "-"}
State: ${invoiceData.state || "-"}
Pincode: ${pincode}

Product Name: ${transactionProductName}
Transaction ID(s):
${displayTransactions
  .map(
    (transaction, index) =>
      `${index + 1}. ${transaction.transactionId || "-"} — ${formatTransactionDateTime(
        transaction.transactionDate,
      )}`,
  )
  .join("\n")}

Plan: ${planName}
Family: ${family}
Description: ${planDescription}
Validity: ${validity}

Base Price: INR ${formatINR(basePrice)}
${GST_LABEL}: INR ${formatINR(gstAmount)}
Total Payable: INR ${formatINR(totalAmount)}

Payment Status: ${paymentStatus}`;

    try {
      await navigator.clipboard.writeText(summary);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch {
      window.alert("Summary copy nahi ho paya.");
    }
  };

  return (
    <div className="min-h-screen bg-[#eef3ef] text-[#17342b]">
      {/* =====================================================
          TOP NAVIGATION
      ====================================================== */}

      <header className="no-print sticky top-0 z-50 border-b border-[#d7e2dc] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d7e2dc] text-[#14583f] transition hover:bg-[#eef7f0]"
              aria-label="Back to editor"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <Image
              src="/logo.png"
              alt={COMPANY_NAME}
              width={135}
              height={45}
              priority
              className="h-9 w-auto object-contain"
            />

            <div className="hidden sm:block">
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#8a9a93]">
                {COMPANY_NAME}
              </p>

              <p className="text-sm font-bold text-[#173d30]">
                Invoice Preview
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onEdit}
              className="hidden rounded-full border border-[#ccd9d2] bg-white px-4 py-2 text-xs font-bold text-[#14583f] transition hover:bg-[#eef7f0] sm:block"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="flex items-center gap-2 rounded-full bg-[#075e3d] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#064f34] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download className="h-4 w-4" />

              {isGeneratingPDF ? "Generating..." : "Download PDF"}
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          DOCUMENT
      ====================================================== */}

      <main className="px-3 py-8 sm:px-6">
        <div
          ref={invoiceDocRef}
          className="mx-auto w-full max-w-[794px] bg-white text-[#18352c] shadow-xl"
        >
          {/* =================================================
              PAGE 1
          ================================================= */}

          <section
            id="invoice-page-1"
            className="relative box-border h-[1123px] w-full overflow-visible bg-white p-7 sm:p-10"
          >
            {/* HEADER */}

            <div className="flex items-start justify-between gap-6 border-b border-[#dce7df] pb-6">
              {/* COMPANY */}

              <div className="flex min-w-0 flex-1 items-start gap-5">
                <div className="flex h-[82px] w-[105px] shrink-0 items-center justify-center overflow-visible">
                  <InvoiceLogo className="h-auto w-auto max-h-[82px] max-w-[105px]" />
                </div>

                <div className="min-w-0">
                  <p className="text-[12px] font-bold uppercase tracking-[0.09em] text-[#176746]">
                    Health Plan Invoice
                  </p>

                  <h1 className="mt-1 text-[27px] font-extrabold leading-none text-[#19372e]">
                    {COMPANY_NAME}
                  </h1>

                  <p className="mt-2 max-w-[390px] text-[10px] leading-relaxed text-[#63776e]">
                    {COMPANY_ADDRESS}
                  </p>

                  <div className="mt-2 space-y-0.5 text-[9px] font-bold tracking-wide text-[#536c61]">
                    <p>
                      GSTIN :{" "}
                      <span className="text-[#176746]">{COMPANY_GSTIN}</span>
                    </p>

                    <p>
                      CIN :{" "}
                      <span className="text-[#176746]">{COMPANY_CIN}</span>
                    </p>
                  </div>

                  <p className="mt-2 text-[10px] text-[#7c8d86]">
                    Customer plan invoice &amp; benefit summary
                  </p>
                </div>
              </div>

              {/* INVOICE META */}

              <div className="w-[145px] shrink-0 pt-1 text-right">
                <p className="text-[9px] font-bold uppercase tracking-wide text-[#8a9a93]">
                  Invoice No.
                </p>

                <p className="mt-1 break-all text-[12px] font-extrabold text-[#18352c]">
                  {invoiceData.invoiceNumber || "-"}
                </p>

                <p className="mt-4 text-[9px] font-bold uppercase tracking-wide text-[#8a9a93]">
                  Date of Issue of Membership
                </p>

                <p className="mt-1 text-[12px] font-extrabold text-[#18352c]">
                  {invoiceDate}
                </p>
              </div>
            </div>

            {/* CUSTOMER */}

            <div className="mt-6 grid grid-cols-2 border border-[#d8e5db] bg-[#f4faf4] sm:grid-cols-5">
              <InfoCell label="Customer" value={invoiceData.customerName} />

              <InfoCell label="Mobile" value={maskedPhone} />

              <InfoCell label="Email" value={maskedEmail} />

              <InfoCell label="City" value={invoiceData.city} />

              <InfoCell label="Pincode" value={pincode} />
            </div>

            {/* PLAN */}

            <div className="mt-6 border border-[#b9d9ab] bg-white">
              <div className="grid grid-cols-[65px_1fr_auto] items-center gap-4 p-4 sm:grid-cols-[70px_1fr_auto] sm:p-5">
                <div className="flex h-14 w-14 items-center justify-center bg-[#edf8e7] text-[11px] font-extrabold text-[#176e46]">
                  {family}
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-[23px] font-extrabold text-[#16362d]">
                    {planName}
                  </h2>

                  <p className="mt-1 break-words text-[11px] leading-relaxed text-[#59726a]">
                    {planDescription}
                  </p>

                  <p className="mt-2 text-[10px] font-extrabold text-red-600">
                    Freelook Period till {freelookDate}
                  </p>

                  <p className="mt-0.5 text-[9px] font-semibold text-red-600">
                    (You can cancel this on or before {freelookDate})
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <div className="text-[22px] font-extrabold text-[#075e3d]">
                    INR {formatINR(basePrice)}
                  </div>

                  <div className="mt-1 text-[9px] font-semibold text-[#77857f]">
                    + GST ({GST_RATE}%)
                  </div>
                </div>
              </div>
            </div>

            {/* ANNUAL MEMBERSHIP + PAYMENT SUMMARY */}
            <div className="mt-5 border-t border-[#dce7df] pt-4">
              <h3 className="mb-3 text-[11px] font-extrabold uppercase tracking-wide text-[#176746]">
                Annual Membership and Payment Summary
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="pt-2">
                  <p className="text-[9px] font-extrabold uppercase tracking-wide text-[#91a19a]">
                    Annual Membership
                  </p>

                  <div className="mt-1 text-[23px] font-extrabold text-[#075e3d]">
                    INR {formatINR(basePrice)}
                  </div>

                  <p className="mt-1 text-[9px] font-semibold text-[#71817a]">
                    + GST ({GST_RATE}%)
                  </p>

                  <div className="mt-3">
                    <p className="text-[8px] font-extrabold uppercase tracking-wide text-[#91a19a]">
                      Payment Status
                    </p>

                    <div className="mt-1 flex min-h-[27px] min-w-[115px] max-w-full items-center justify-center rounded-full bg-[#edf7ea] px-3 py-1.25">
                      <span className="block whitespace-normal break-words text-center text-[9px] font-extrabold uppercase leading-tight text-[#176746]">
                        {paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border border-[#d8e5db]">
                  <div className="bg-[#f3faf4] px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-wide text-[#176746]">
                    Payment Summary
                  </div>

                  <div className="px-4 py-2">
                    <div className="flex justify-between py-1.5">
                      <span className="text-[10px] text-[#81908a]">
                        Base Price
                      </span>
                      <strong className="text-[10px] text-[#264338]">
                        INR {formatINR(basePrice)}
                      </strong>
                    </div>

                    <div className="flex justify-between border-b border-[#e2e9e4] py-1.5">
                      <span className="text-[10px] text-[#81908a]">
                        {GST_LABEL}
                      </span>
                      <strong className="text-[10px] text-[#264338]">
                        INR {formatINR(gstAmount)}
                      </strong>
                    </div>

                    <div className="flex justify-between pt-2">
                      <span className="text-[10px] font-extrabold uppercase text-[#176746]">
                        Total Payable
                      </span>
                      <strong className="text-[12px] font-extrabold text-[#176746]">
                        INR {formatINR(totalAmount)}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BENEFITS */}

            <div className="mt-7 grid grid-cols-3 gap-3">
              {/* HEALTH */}

              <div className="overflow-hidden border border-[#d7e5d7]">
                <div className="bg-[#eaf4d9] px-3 py-3 text-[10px] font-extrabold uppercase tracking-wide text-[#356449]">
                  Health &amp; Wellness Services
                </div>

                <BenefitRow
                  label={"Health Risk Assessment\nDigital"}
                  value="2 Credit"
                />

                <BenefitRow
                  label="Tele DM Consultation GP + SP"
                  value="4 Credit"
                />

                <BenefitRow label="CBC Test" value="2 Credit" />

                <BenefitRow label="CBC Report Review" value="2 Credit" />

                <BenefitRow
                  label={"Executive Centre Visit\nHealth Check-up @500"}
                  value="-"
                />
              </div>

              {/* DISCOUNTS */}

              <div className="overflow-hidden border border-[#d7e5d7]">
                <div className="bg-[#eaf4d9] px-3 py-3 text-[10px] font-extrabold uppercase tracking-wide text-[#356449]">
                  Discounts &amp; Benefits
                </div>

                <BenefitRow
                  label="Upto 40% Discount on Fitness Management"
                  value="Yes"
                />

                <BenefitRow
                  label="Upto 20% Discount on Home Care Management (Nurse at)"
                  value="Yes"
                />

                <BenefitRow
                  label="Emergency Ambulance with upto 20% Discount"
                  value="Yes"
                />

                <BenefitRow
                  label="Upto 40% Discount on Tests and Scans"
                  value="Yes"
                />

                <BenefitRow
                  label="Upto 15% Discount on Medicines"
                  value="Yes"
                />

                <BenefitRow label="10% Off on OPD Consultations" value="Yes" />
              </div>

              {/* ADDITIONAL */}

              <div className="overflow-hidden border border-[#d7e5d7]">
                <div className="bg-[#eaf4d9] px-3 py-3 text-[10px] font-extrabold uppercase tracking-wide text-[#356449]">
                  Additional Services
                </div>

                <BenefitRow label="Health Coach" value="-" />

                <BenefitRow label="Diabetologist-60C" value="-" />

                <BenefitRow label="Disease Management" value="-" />

                <BenefitRow label="Tele Cardio Consultation" value="1 Credit" />

                <BenefitRow label="HA Exclusive Gold Membership" value="-" />

                <BenefitRow
                  label="Online Fitness and Zumba Session"
                  value="Yes"
                />
              </div>
            </div>

            {/* PAGE 1 FOOTER */}

            <div className="absolute bottom-7 left-7 right-7 flex items-center justify-between border-t border-[#e3e9e5] pt-3 text-[8px] text-[#778780] sm:left-10 sm:right-10">
              <span>Continued on page 2</span>

              <span>Page 1 of 3</span>
            </div>
          </section>

          {/* =================================================
              PAGE 2
          ================================================= */}

          <section
            id="invoice-page-2"
            className="relative box-border h-[1123px] w-full overflow-hidden border-t border-[#e1e8e3] bg-white p-5 sm:p-6"
          >
            {/* PAGE HEADER */}

            <div className="flex items-center justify-between border-b border-[#dce7df] pb-3">
              <div>
                <h2 className="text-[14px] font-extrabold uppercase tracking-[0.06em] text-[#176746]">
                  Protection Benefits
                </h2>

                <p className="mt-0.5 text-[7px] font-semibold text-[#87958f]">
                  {COMPANY_NAME}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[8px] font-semibold text-[#87958f]">
                  GSTIN :{" "}
                  <span className="font-bold text-[#176746]">
                    {COMPANY_GSTIN}
                  </span>
                </p>

                <p className="mt-0.5 text-[7px] font-semibold text-[#87958f]">
                  CIN :{" "}
                  <span className="font-bold text-[#176746]">
                    {COMPANY_CIN}
                  </span>
                </p>
              </div>
            </div>

            {/* PROTECTION BENEFITS 1–21 + 9 CI */}

            <div className="mt-2 overflow-hidden border border-[#aeca9b]">
              {/* PERSONAL ACCIDENT COVER */}

              <div className="bg-[#075e3d] px-3 py-2 text-center text-[9px] font-extrabold uppercase tracking-wide text-white">
                Personal Accident Cover
              </div>

              <div className="grid grid-cols-[32px_1fr_145px] bg-[#edf5d9] text-[7px] font-extrabold uppercase tracking-wide text-[#356449]">
                <div className="border-r border-[#d5dfc8] px-2 py-1.5">
                  S No.
                </div>
                <div className="border-r border-[#d5dfc8] px-2 py-1.5">
                  Particulars
                </div>
                <div className="px-2 py-1.5">Basis of Offering</div>
              </div>

              {[
                ["1", "Personal Accident Cover Benefit", "5 Lac"],
                ["2", "Accidental Death Benefit", "100% of SI"],
                [
                  "3",
                  "Permanent Partial Disablement",
                  "Up to SI; As per PPD table of Group Care 360",
                ],
                [
                  "4",
                  "Permanent Total Disablement",
                  "Up to SI; As per PTD table of Group Care 360",
                ],
                [
                  "5",
                  "Claims payout - Personal Accident Medical Benefit",
                  "Re-imbursement",
                ],
              ].map(([serial, particular, offering]) => (
                <div
                  key={serial}
                  className="grid grid-cols-[32px_1fr_145px] border-t border-[#d9e4d4] text-[7.5px] font-semibold leading-[1.1] text-[#354941]"
                >
                  <div className="border-r border-[#d9e4d4] px-2 py-1.5 font-bold text-[#176746]">
                    {serial}
                  </div>
                  <div className="border-r border-[#d9e4d4] px-2 py-1.5">
                    {particular}
                  </div>
                  <div className="px-2 py-1.5">{offering}</div>
                </div>
              ))}

              {/* DAILY CASH ALLOWANCE */}

              <div className="border-t border-[#d9e4d4] bg-[#075e3d] px-3 py-2 text-center text-[9px] font-extrabold uppercase tracking-wide text-white">
                Daily Cash Allowance
              </div>

              {[
                [
                  "6",
                  "Covered Amount- Daily Cash",
                  "Rs. 1000 /- Per day max 30 days",
                ],
                [
                  "7",
                  "Daily Cash Benefits (ICU)",
                  "Per day hospitalization with maximum limit upto 30 days in a year with 1 days deductible on Per claim.",
                ],
                [
                  "8",
                  "Daily Cash Benefits (ICU)",
                  "Payout double in case of ICU Hospitalization with max.limit upto 15 days in a Year with 1 days deductible on Per claim.",
                ],
                [
                  "9",
                  "Daily Cash Benefits (ICU)",
                  "Customers Can Avail This Benefit Only For 30 days in a Membership Year Collectively For Normal & 15 days in a Membership",
                ],
                [
                  "10",
                  "Daily Cash Benefit",
                  "Year collectively for ICU Hospitalization",
                ],
                [
                  "11",
                  "Wait Period-30 Days",
                  "Yes(except for Injuries/Accident)",
                ],
                ["12", "Pre-existing diseases", "12 Months"],
                ["13", "Maternity", "Not Covered"],
                ["14", "Claims payout-DC", "Re-imbursement"],
              ].map(([serial, particular, offering]) => (
                <div
                  key={serial}
                  className="grid grid-cols-[32px_1fr_145px] border-t border-[#d9e4d4] text-[7.5px] font-semibold leading-[1.1] text-[#354941]"
                >
                  <div className="border-r border-[#d9e4d4] px-2 py-1.5 font-bold text-[#176746]">
                    {serial}
                  </div>
                  <div className="border-r border-[#d9e4d4] px-2 py-1.5">
                    {particular}
                  </div>
                  <div className="px-2 py-1.5">{offering}</div>
                </div>
              ))}

              {/* CRITICAL ILLNESS BENEFIT */}

              <div className="border-t border-[#d9e4d4] bg-[#075e3d] px-3 py-2 text-center text-[9px] font-extrabold uppercase tracking-wide text-white">
                Critical Illness Benefit
              </div>

              {[
                ["16", "Benefit Amount", "1 Lac"],
                ["17", "Critical Illness Benefit", "100% of SI"],
                ["18", "Number of Critical Illness", "9 CI"],
              ].map(([serial, particular, offering]) => (
                <div
                  key={serial}
                  className="grid grid-cols-[32px_1fr_145px] border-t border-[#d9e4d4] text-[7.5px] font-semibold leading-[1.1] text-[#354941]"
                >
                  <div className="border-r border-[#d9e4d4] px-2 py-1.5 font-bold text-[#176746]">
                    {serial}
                  </div>
                  <div className="border-r border-[#d9e4d4] px-2 py-1.5">
                    {particular}
                  </div>
                  <div className="px-2 py-1.5">{offering}</div>
                </div>
              ))}

              {/* 9 CI CONDITIONS */}

              <div className="border-t border-[#d9e4d4] bg-[#fef2f2] px-3 py-2">
                <div className="mb-1.5 text-center text-[8px] font-extrabold uppercase tracking-wide text-[#b91c1c]">
                  9 CI (Critical Illness Conditions)
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                  {[
                    "Cancer Of Specified Severity",
                    "Myocardial Infarction",
                    "Open Chest CABG",
                    "Stroke Resulting in Permanent Symptoms",
                    "Open Heart Replacement Or Repair Of Heart Valves",
                    "Multiple Sclerosis with Persisting Symptoms",
                    "Major Organ / Bone Marrow Transplant",
                    "Permanent Paralysis Of Limbs",
                    "Kidney Failure Requiring Regular Dialysis",
                  ].map((condition, index) => (
                    <div
                      key={condition}
                      className="min-w-0 text-[6.8px] font-semibold leading-[1.12] text-[#354941]"
                    >
                      <span className="mr-1 font-extrabold text-[#b91c1c]">
                        {index + 1}.
                      </span>
                      {condition}
                    </div>
                  ))}
                </div>
              </div>

              {/* WAIT PERIODS */}

              <div className="border-t border-[#d9e4d4] bg-[#f4f7ea] px-3 py-1.5 text-center text-[7px] font-extrabold uppercase tracking-wider text-[#356449]">
                Wait Periods / Conditions
              </div>

              {[
                ["19", "Initial Wait Period", "90 Days"],
                ["20", "Survival Period", "0 days"],
                ["21", "Pre-existing diseases", "Not Covered"],
              ].map(([serial, particular, offering]) => (
                <div
                  key={serial}
                  className="grid grid-cols-[32px_1fr_145px] border-t border-[#d9e4d4] text-[7.5px] font-semibold leading-[1.1] text-[#354941]"
                >
                  <div className="border-r border-[#d9e4d4] px-2 py-1.5 font-bold text-[#176746]">
                    {serial}
                  </div>
                  <div className="border-r border-[#d9e4d4] px-2 py-1.5">
                    {particular}
                  </div>
                  <div className="px-2 py-1.5">{offering}</div>
                </div>
              ))}
            </div>

            {/* PAGE 2 FOOTER */}

            <div className="absolute bottom-7 left-7 right-7 flex items-center justify-between border-t border-[#e3e9e5] pt-3 text-[8px] text-[#778780] sm:left-10 sm:right-10">
              <span>Continued on page 3</span>
              <span>Page 2 of 3</span>
            </div>
          </section>

          {/* =================================================
              PAGE 3 — BENEFITS CONTINUED + INVOICE SUMMARY
          ================================================= */}

          <section
            id="invoice-page-3"
            className="relative box-border h-[1123px] w-full overflow-hidden border-t border-[#e1e8e3] bg-white p-4 sm:p-5"
          >
            <div className="flex items-center justify-between border-b border-[#dce7df] pb-2">
              <div>
                <h2 className="text-[12px] font-extrabold uppercase tracking-wide text-[#176746]">
                  Protection Benefits — Continued
                </h2>

                <p className="mt-1 text-[7px] font-semibold text-[#87958f]">
                  {COMPANY_NAME}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[7px] font-semibold text-[#87958f]">
                  GSTIN :{" "}
                  <span className="font-bold text-[#176746]">
                    {COMPANY_GSTIN}
                  </span>
                </p>

                <p className="mt-1 text-[7px] font-semibold text-[#87958f]">
                  CIN :{" "}
                  <span className="font-bold text-[#176746]">
                    {COMPANY_CIN}
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-2 overflow-hidden border border-[#aeca9b]">
              {/* VECTOR BORNE DISEASES */}

              <div className="border-t border-[#d9e4d4] bg-[#075e3d] px-3 py-1.5 text-center text-[8px] font-extrabold uppercase tracking-wide text-white">
                Vector Borne Diseases
              </div>

              <div className="grid grid-cols-[32px_1fr_145px] border-t border-[#d9e4d4] text-[7.5px] font-semibold leading-[1.1] text-[#354941]">
                <div className="border-r border-[#d9e4d4] px-2 py-[3px] font-bold text-[#176746]">
                  22
                </div>
                <div className="border-r border-[#d9e4d4] px-2 py-[3px]">
                  Covered Amount
                </div>
                <div className="px-2 py-[3px]">
                  Coverage amount – Rs 10,000, One time fixed payment due to
                  below mentioned listed conditions.
                </div>
              </div>

              <div className="border-t border-[#d9e4d4] bg-[#f4f7ea] px-3 py-1 text-center text-[6.5px] font-extrabold uppercase tracking-wider text-[#356449]">
                Wait Periods / Conditions
              </div>

              {[
                ["23", "30 Days", "Yes"],
                ["24", "Pre-existing diseases", "Not Covered"],
                ["25", "Maternity", "Not Covered"],
              ].map(([serial, particular, offering]) => (
                <div
                  key={serial}
                  className="grid grid-cols-[32px_1fr_145px] border-t border-[#d9e4d4] text-[7.5px] font-semibold leading-[1.1] text-[#354941]"
                >
                  <div className="border-r border-[#d9e4d4] px-2 py-[3px] font-bold text-[#176746]">
                    {serial}
                  </div>
                  <div className="border-r border-[#d9e4d4] px-2 py-[3px]">
                    {particular}
                  </div>
                  <div className="px-2 py-[3px]">{offering}</div>
                </div>
              ))}

              {/* CONVALESCENCE BENEFIT */}

              <div className="border-t border-[#d9e4d4] bg-[#075e3d] px-3 py-1.5 text-center text-[8px] font-extrabold uppercase tracking-wide text-white">
                Convalescence Benefit
              </div>

              <div className="grid grid-cols-[32px_1fr_145px] border-t border-[#d9e4d4] text-[7.5px] font-semibold leading-[1.1] text-[#354941]">
                <div className="border-r border-[#d9e4d4] px-2 py-[3px] font-bold text-[#176746]">
                  26
                </div>
                <div className="border-r border-[#d9e4d4] px-2 py-[3px]">
                  Convalescence Benefit:- (provided only in case of
                  Comprehensive hospitalization)
                </div>
                <div className="px-2 py-[3px]">
                  Coverage amount – Rs 5000, Minimum hospitalization Duration –
                  3 days This Benefit will be allowed for maximum 2 times in
                  cover year and maximum 3 payments per hospitalization Payment
                  Periodicity – Once in 3 days
                </div>
              </div>

              <div className="border-t border-[#d9e4d4] bg-[#f4f7ea] px-3 py-1 text-center text-[6.5px] font-extrabold uppercase tracking-wider text-[#356449]">
                Wait Periods / Conditions
              </div>

              {[
                ["27", "30 Days", "Yes (except for Injuries/Accident)"],
                ["28", "Pre-existing diseases", "12 Months"],
                ["29", "Maternity", "Not Covered"],
              ].map(([serial, particular, offering]) => (
                <div
                  key={serial}
                  className="grid grid-cols-[32px_1fr_145px] border-t border-[#d9e4d4] text-[7.5px] font-semibold leading-[1.1] text-[#354941]"
                >
                  <div className="border-r border-[#d9e4d4] px-2 py-[3px] font-bold text-[#176746]">
                    {serial}
                  </div>
                  <div className="border-r border-[#d9e4d4] px-2 py-[3px]">
                    {particular}
                  </div>
                  <div className="px-2 py-[3px]">{offering}</div>
                </div>
              ))}
            </div>

            <div className="mt-2 border-t border-[#dce7df] pt-2">
              {/* INVOICE SUMMARY */}

              <div className="mt-2">
                <h3 className="mb-2 text-[10px] font-extrabold uppercase tracking-wide text-[#176746]">
                  Invoice Summary
                </h3>

                <div className="grid grid-cols-2 border border-[#d8e5db]">
                  {/* LEFT */}

                  <div className="border-r border-[#d8e5db]">
                    <div className="grid grid-cols-[1fr_auto] border-b border-[#e1e8e3] px-3 py-1">
                      <span className="text-[9px] text-[#81908a]">
                        Customer Name
                      </span>

                      <strong className="max-w-[150px] break-words text-right text-[9px] text-[#264338]">
                        {invoiceData.customerName || "-"}
                      </strong>
                    </div>

                    <div className="grid grid-cols-[1fr_auto] border-b border-[#e1e8e3] px-3 py-1">
                      <span className="text-[9px] text-[#81908a]">
                        Mobile Number
                      </span>

                      <strong className="max-w-[150px] break-words text-right text-[9px] text-[#264338]">
                        {maskedPhone}
                      </strong>
                    </div>

                    <div className="grid grid-cols-[1fr_auto] border-b border-[#e1e8e3] px-3 py-1">
                      <span className="text-[9px] text-[#81908a]">Email</span>

                      <strong className="max-w-[175px] break-words text-right text-[10px] font-bold leading-tight text-[#264338]">
                        {maskedEmail}
                      </strong>
                    </div>

                    <div className="grid grid-cols-[1fr_auto] border-b border-[#e1e8e3] px-3 py-1">
                      <span className="text-[9px] text-[#81908a]">City</span>

                      <strong className="max-w-[150px] break-words text-right text-[9px] text-[#264338]">
                        {invoiceData.city || "-"}
                      </strong>
                    </div>

                    <div className="grid grid-cols-[1fr_auto] border-b border-[#e1e8e3] px-3 py-1">
                      <span className="text-[9px] text-[#81908a]">State</span>

                      <strong className="max-w-[150px] break-words text-right text-[9px] text-[#264338]">
                        {invoiceData.state || "-"}
                      </strong>
                    </div>

                    <div className="grid grid-cols-[1fr_auto] px-3 py-1">
                      <span className="text-[9px] text-[#81908a]">Pincode</span>

                      <strong className="max-w-[150px] break-words text-right text-[9px] text-[#264338]">
                        {pincode}
                      </strong>
                    </div>
                  </div>

                  {/* RIGHT */}

                  <div>
                    <div className="grid grid-cols-[1fr_auto] border-b border-[#e1e8e3] px-3 py-1">
                      <span className="text-[9px] text-[#81908a]">
                        Product / Plan
                      </span>

                      <strong className="max-w-[150px] break-words text-right text-[9px] text-[#264338]">
                        {planName}
                      </strong>
                    </div>

                    <div className="grid grid-cols-[1fr_auto] border-b border-[#e1e8e3] px-3 py-1">
                      <span className="text-[9px] text-[#81908a]">Family</span>

                      <strong className="text-right text-[9px] text-[#264338]">
                        {family}
                      </strong>
                    </div>

                    <div className="grid grid-cols-[1fr_auto] border-b border-[#e1e8e3] px-3 py-1">
                      <span className="text-[9px] text-[#81908a]">
                        Validity
                      </span>

                      <strong className="text-right text-[9px] text-[#264338]">
                        {validity}
                      </strong>
                    </div>

                    <div className="grid grid-cols-[1fr_auto] border-b border-[#e1e8e3] px-3 py-1">
                      <span className="text-[9px] text-[#81908a]">
                        Invoice Date
                      </span>

                      <strong className="text-right text-[9px] text-[#264338]">
                        {invoiceDate}
                      </strong>
                    </div>

                    <div className="grid grid-cols-[1fr_auto] border-b border-[#e1e8e3] px-3 py-1">
                      <span className="text-[9px] text-[#81908a]">
                        Invoice No.
                      </span>

                      <strong className="max-w-[150px] break-all text-right text-[9px] text-[#264338]">
                        {invoiceData.invoiceNumber || "-"}
                      </strong>
                    </div>

                    <div className="grid grid-cols-[1fr_auto] px-3 py-1">
                      <span className="text-[9px] text-[#81908a]">
                        Payment Status
                      </span>

                      <strong className="max-w-[150px] break-words text-right text-[10px] font-extrabold uppercase leading-tight text-[#176746]">
                        {paymentStatus}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* PAYMENT SUMMARY MOVED TO PAGE 1 */}

              {/* QUERY / COMPLAINT CONTACTS */}
              <div className="mt-3 border-t border-[#d5c18c] pt-3 text-left">
                <p className="text-[9px] font-extrabold leading-tight text-[#173f31]">
                  For any queries or complaints, please contact us at:
                </p>

                <div className="mt-2 grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-[#d8e2dc] bg-[#f7faf7] px-3 py-2.5">
                    <p className="text-[8.5px] font-extrabold uppercase tracking-wide text-[#075e3d]">
                      Contact 1
                    </p>
                    <p className="mt-1 break-all text-[8.5px] leading-tight text-[#173f31]">
                      <span className="font-bold">Email:</span>{" "}
                      <span className="font-semibold">
                        helpline@restorehealthservices.in
                      </span>
                    </p>
                    <p className="mt-1 text-[8.5px] leading-tight text-[#173f31]">
                      <span className="font-bold">Phone:</span>{" "}
                      <span className="font-bold">+91 92054 56671</span>
                    </p>
                  </div>

                  <div className="rounded-lg border border-[#d8e2dc] bg-[#f7faf7] px-3 py-2.5">
                    <p className="text-[8.5px] font-extrabold uppercase tracking-wide text-[#075e3d]">
                      Contact 2
                    </p>
                    <p className="mt-1 break-all text-[8.5px] leading-tight text-[#173f31]">
                      <span className="font-bold">Email:</span>{" "}
                      <span className="font-semibold">
                        issuance@restorehealthservices.in
                      </span>
                    </p>
                    <p className="mt-1 text-[8.5px] leading-tight text-[#173f31]">
                      <span className="font-bold">Phone:</span>{" "}
                      <span className="font-bold">+91 8448507406</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* TRANSACTION DETAILS */}
              <div className="mt-2 rounded-lg border border-[#d0c6a5] bg-[#f7f4e9] p-2.5">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <h3 className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#174936]">
                    Transaction Details
                  </h3>
                  <span className="text-[6.5px] font-bold uppercase tracking-wide text-[#8b877a]">
                    Payment Details
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <TransactionDetail
                    label="Customer Name"
                    value={invoiceData.customerName || "-"}
                  />
                  <TransactionDetail
                    label="Product Name / Family"
                    value={transactionProductName}
                  />
                </div>

                <div className="mt-1.5 rounded-md border border-[#d9d3bc] bg-white px-2 py-1.5">
                  <div className="space-y-1">
                    {displayTransactions.map((transaction, index) => (
                      <div
                        key={`transaction-detail-${index}`}
                        className="flex items-center justify-between gap-2 rounded bg-[#f8f7f1] px-2 py-1"
                      >
                        <div className="flex min-w-0 items-center gap-1.5">
                          <span className="shrink-0 text-[7.5px] font-extrabold text-[#173f31]">
                            Amount {index + 1}.
                          </span>
                          <span className="text-[7.5px] font-bold text-[#075e3d]">
                            ₹ {transaction.amount || "0"}
                          </span>
                        </div>
                        <span className="min-w-0 break-all text-right text-[7.5px] font-extrabold leading-tight text-[#173f31]">
                          <span>Transaction ID : </span>
                          {transaction.transactionId || "-"}
                          <div>
                           Time:{" "}
                            {formatTransactionDateTime(
                              transaction.transactionDate,
                            )}
                          </div>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* COMPANY DETAILS */}
            </div>

            {/* PAGE 3 FOOTER */}

            <div className="absolute bottom-4 left-7 right-7 border-t border-[#e3e9e5] pt-2 sm:left-10 sm:right-10">
              <p className="text-[8px] font-bold text-[#176746]">
                Thank you for choosing {COMPANY_NAME}.
              </p>

              <div className="mt-0.5 flex items-center justify-between text-[7px] text-[#87958f]">
                <span>
                  This invoice is system generated. No signature is required.
                </span>

                <span>Page 3 of 3</span>
              </div>
            </div>
          </section>
        </div>

        {/* =====================================================
            ACTION BUTTONS
        ====================================================== */}

        <div className="no-print mx-auto mt-5 flex max-w-[794px] flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="flex items-center gap-2 rounded-full bg-[#075e3d] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#064f34] disabled:opacity-60"
          >
            <Download className="h-4 w-4" />

            {isGeneratingPDF ? "Generating PDF..." : "Download Invoice PDF"}
          </button>

          <button
            type="button"
            onClick={handleCopySummary}
            className="flex items-center gap-2 rounded-full border border-[#cbdad2] bg-white px-6 py-3 text-sm font-bold text-[#14583f] transition hover:bg-[#f4f9f5]"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Share2 className="h-4 w-4" />
            )}

            {copied ? "Copied!" : "Copy Summary"}
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="rounded-full border border-[#cbdad2] bg-white px-6 py-3 text-sm font-bold text-[#14583f] transition hover:bg-[#f4f9f5]"
          >
            Edit Invoice
          </button>
        </div>
      </main>
    </div>
  );
}
