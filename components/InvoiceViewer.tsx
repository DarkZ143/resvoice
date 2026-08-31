"use client";

import Image from "next/image";
import { useRef, useState } from "react";
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

/* ==========================================================
   TAX
========================================================== */

const GST_RATE = 5;

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
    maximumFractionDigits: 0,
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
   INVOICE LOGO
   Normal img is used inside the PDF document because it
   is more reliable with html2canvas.
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
  ======================================================== */

  const basePrice = Number(invoiceData.basePrice) || 0;

  const gstAmount = (basePrice * GST_RATE) / 100;

  const totalAmount = basePrice + gstAmount;

  /* ========================================================
     INVOICE
  ======================================================== */

  const invoiceDate = formatInvoiceDate(invoiceData.issueDate);

  /* ========================================================
     PLAN
  ======================================================== */

  const family = invoiceData.family?.trim() || "—";

  const planName = invoiceData.planName?.trim() || "Plan";

  /*
   * Description is determined from family.
   * This protects the final invoice from stale
   * description data.
   */
  const planDescription =
    FAMILY_DESCRIPTIONS[family] ||
    invoiceData.planDescription?.trim() ||
    "Health plan membership";

  const validity = invoiceData.tenure?.trim() || "1 Year";

  /* ========================================================
     PAYMENT STATUS
  ======================================================== */

  const paymentStatus =
    invoiceData.paymentStatus === "CUSTOM"
      ? invoiceData.customPaymentStatus?.trim() || "CUSTOM"
      : invoiceData.paymentStatus?.trim() || "PAID IN FULL";

  /* ========================================================
     CAPTURE ONE A4 PAGE
  ======================================================== */

  const capturePage = async (
    element: HTMLElement,
    html2canvas: typeof import("html2canvas").default,
  ) => {
    /*
     * Wait until every image inside the page
     * has either loaded successfully or failed.
     */
    await waitForImages(element);

    /*
     * Allow layout/fonts/image rendering to settle.
     */
    await new Promise<void>((resolve) => setTimeout(resolve, 300));

    /*
     * Force a fixed A4 CSS width while capturing.
     */
    const previousWidth = element.style.width;

    const previousMaxWidth = element.style.maxWidth;

    const previousMinWidth = element.style.minWidth;

    const previousHeight = element.style.height;

    const previousMinHeight = element.style.minHeight;

    element.style.width = "794px";

    element.style.maxWidth = "794px";

    element.style.minWidth = "794px";

    element.style.height = "1123px";

    element.style.minHeight = "1123px";

    try {
      return await html2canvas(element, {
        scale: 2,

        useCORS: true,

        allowTaint: false,

        backgroundColor: "#ffffff",

        logging: false,

        x: 0,
        y: 0,

        scrollX: 0,
        scrollY: 0,

        width: 794,

        height: 1123,

        windowWidth: 794,

        windowHeight: 1123,

        imageTimeout: 15000,
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
     
     EXACTLY:
     Page 1 -> PDF Page 1
     Page 2 -> PDF Page 2
  ======================================================== */

  const handleDownloadPDF = async () => {
    if (isGeneratingPDF) return;

    setIsGeneratingPDF(true);

    try {
      const page1 = document.getElementById("invoice-page-1");

      const page2 = document.getElementById("invoice-page-2");

      if (!page1 || !page2) {
        throw new Error("Invoice pages not found.");
      }

      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      /* ================================================
           CAPTURE PAGE 1
        ================================================= */

      const canvas1 = await capturePage(page1, html2canvas);

      /* ================================================
           CAPTURE PAGE 2
        ================================================= */

      const canvas2 = await capturePage(page2, html2canvas);

      /* ================================================
           CREATE EXACT A4 PDF
        ================================================= */

      const pdf = new jsPDF({
        orientation: "portrait",

        unit: "mm",

        format: "a4",

        compress: true,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();

      const pdfHeight = pdf.internal.pageSize.getHeight();

      /*
       * Keep a very small safe border.
       */
      const margin = 4;

      const printableWidth = pdfWidth - margin * 2;

      const printableHeight = pdfHeight - margin * 2;

      /* ================================================
           ADD CANVAS TO PAGE
        ================================================= */

      const addCanvasToPage = (canvas: HTMLCanvasElement) => {
        /*
         * Fit entire canvas into A4.
         *
         * This uses MIN so nothing can be
         * cropped from any side.
         */
        const scale = Math.min(
          printableWidth / canvas.width,

          printableHeight / canvas.height,
        );

        const imageWidth = canvas.width * scale;

        const imageHeight = canvas.height * scale;

        /*
         * Center the entire image.
         */
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

      /* ================================================
           PDF PAGE 1
        ================================================= */

      addCanvasToPage(canvas1);

      /* ================================================
           PDF PAGE 2
        ================================================= */

      pdf.addPage();

      addCanvasToPage(canvas2);

      /* ================================================
           PHONE NUMBER FILE NAME
        ================================================= */

      /*
       * Only numeric characters are kept.
       *
       * Example:
       * +91 98765 43210
       * ->
       * 919876543210-Invoice.pdf
       */
      const phoneNumber = (invoiceData.phoneNumber || "").replace(/\D/g, "");

      const fileName = `${phoneNumber || "Customer"}-Invoice.pdf`;

      /*
       * Exactly TWO PDF pages.
       */
      pdf.save(fileName);

      /* ================================================
           SUCCESS EFFECT
        ================================================= */

      try {
        confetti({
          particleCount: 60,
          spread: 55,
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

Invoice No: ${invoiceData.invoiceNumber}
Invoice Date: ${invoiceDate}

Customer: ${invoiceData.customerName}
Mobile: ${invoiceData.phoneNumber}
City: ${invoiceData.city}
State: ${invoiceData.state}

Plan: ${planName}
Family: ${family}
Description: ${planDescription}
Validity: ${validity}

Base Price: INR ${formatINR(basePrice)}
GST (5%): INR ${formatINR(gstAmount)}
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
          VIEWER NAVIGATION
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
                {/* LOGO */}

                <div className="flex h-[82px] w-[105px] shrink-0 items-center justify-center overflow-visible">
                  <InvoiceLogo className="h-auto w-auto max-h-[82px] max-w-[105px]" />
                </div>

                {/* COMPANY TEXT */}

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
                  Date
                </p>

                <p className="mt-1 text-[12px] font-extrabold text-[#18352c]">
                  {invoiceDate}
                </p>
              </div>
            </div>

            {/* CUSTOMER */}

            <div className="mt-6 grid grid-cols-3 border border-[#d8e5db] bg-[#f4faf4]">
              <InfoCell label="Customer" value={invoiceData.customerName} />

              <InfoCell label="Mobile" value={invoiceData.phoneNumber} />

              <InfoCell label="City" value={invoiceData.city} />
            </div>

            {/* PLAN */}

            <div className="mt-6 border border-[#b9d9ab] bg-white">
              <div className="grid grid-cols-[65px_1fr_auto] items-center gap-4 p-4 sm:grid-cols-[70px_1fr_auto] sm:p-5">
                <div className="flex h-14 w-14 items-center justify-center bg-[#edf8e7] text-[11px] font-extrabold text-[#176746]">
                  {family}
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-[23px] font-extrabold text-[#16362d]">
                    {planName}
                  </h2>

                  <p className="mt-1 break-words text-[11px] leading-relaxed text-[#59726a]">
                    {planDescription}
                  </p>

                  <span className="mt-1.5 inline-block border border-[#e4c77f] bg-[#fffaf0] px-2 py-1 text-[8px] font-medium text-[#967013]">
                    Once the plan is issued, it can not be cancelled or
                    refunded.
                  </span>
                </div>

                <div className="shrink-0 text-right">
                  <div className="text-[22px] font-extrabold text-[#075e3d]">
                    INR {formatINR(basePrice)}
                  </div>

                  <div className="mt-1 text-[9px] font-semibold text-[#77857f]">
                    + GST (5%)
                  </div>
                </div>
              </div>
            </div>

            {/* PLAN FACTS */}

            <div className="mt-6 grid grid-cols-2 border border-[#d8e5db]">
              <InfoCell label="Family" value={family} />

              <InfoCell label="Validity" value={validity} />
            </div>

            {/* THREE COLUMNS */}

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

                <div className="grid grid-cols-[1fr_auto] gap-3 bg-[#eefaf1] px-3 py-3">
                  <div className="text-[10px] font-semibold leading-relaxed text-[#233e34]">
                    Personal Accident Covered -
                    <br />5 Lacs
                  </div>

                  <div className="text-[10px] font-bold text-[#146746]">
                    Yes
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_auto] gap-3 bg-[#eefaf1] px-3 py-3">
                  <div className="text-[10px] font-semibold text-[#233e34]">
                    Hospicash
                  </div>

                  <div className="text-[10px] font-bold text-[#146746]">
                    Yes
                  </div>
                </div>
              </div>
            </div>

            {/* PAGE 1 FOOTER */}

            <div className="absolute bottom-7 left-7 right-7 flex items-center justify-between border-t border-[#e3e9e5] pt-3 text-[8px] text-[#778780] sm:left-10 sm:right-10">
              <span>Continued on page 2</span>

              <span>Page 1 of 2</span>
            </div>
          </section>

          {/* =================================================
              PAGE 2
          ================================================= */}

          <section
            id="invoice-page-2"
            className="relative box-border h-[1123px] w-full overflow-visible border-t border-[#e1e8e3] bg-white p-7 sm:p-10"
          >
            {/* PAGE HEADER */}

            <div className="flex items-center justify-between border-b border-[#dce7df] pb-4">
              <div>
                <h2 className="text-[13px] font-extrabold uppercase tracking-wide text-[#176746]">
                  Protection Benefits
                </h2>

                <p className="mt-1 text-[8px] font-semibold text-[#87958f]">
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

                <p className="mt-1 text-[8px] font-semibold text-[#87958f]">
                  CIN :{" "}
                  <span className="font-bold text-[#176746]">
                    {COMPANY_CIN}
                  </span>
                </p>
              </div>
            </div>

            {/* HOSPICASH */}

            <div className="mt-6 border border-[#aeca9b]">
              <div className="bg-[#075e3d] px-4 py-3 text-[11px] font-extrabold text-white">
                INCLUDING PROTECTION BENEFIT
                <span className="mx-2 opacity-50">|</span>
                Hospicash Benefit
              </div>

              <div className="space-y-2 bg-white px-4 py-4 text-[9.5px] leading-relaxed text-[#354941]">
                <p>
                  Covered Amount - INR 1000 per day hospitalization with maximum
                  limit upto 30 days in a year with 1 day deductible per claim.
                </p>

                <p>
                  Payout will be double in case of ICU hospitalization with
                  maximum limit upto 15 days in a year with 1 day deductible per
                  claim.
                </p>

                <p>
                  Customers can avail this benefit only for 30 days in a policy
                  year collectively for normal hospitalization and 15 days in a
                  policy year collectively for ICU hospitalization.
                </p>
              </div>
            </div>

            {/* PERSONAL ACCIDENT */}

            <div className="mt-6 border border-[#aeca9b]">
              <div className="bg-[#075e3d] px-4 py-3 text-[11px] font-extrabold text-white">
                INCLUDING PROTECTION BENEFIT
                <span className="mx-2 opacity-50">|</span>
                Personal Accident Cover - 5 Lacs
              </div>

              <div className="px-4 py-5 text-[10px] text-[#354941]">
                Inclusive of accidental death and total disability.
              </div>
            </div>

            {/* INVOICE SUMMARY */}

            <div className="mt-8">
              <h3 className="mb-4 text-[12px] font-extrabold uppercase tracking-wide text-[#176746]">
                Invoice Summary
              </h3>

              <div className="grid grid-cols-2 border border-[#d8e5db]">
                {/* LEFT */}

                <div className="border-r border-[#d8e5db]">
                  <div className="grid grid-cols-[1fr_auto] border-b border-[#e1e8e3] px-5 py-2.5">
                    <span className="text-[10px] text-[#81908a]">
                      Customer Name
                    </span>

                    <strong className="max-w-[150px] break-words text-right text-[10px] text-[#264338]">
                      {invoiceData.customerName || "-"}
                    </strong>
                  </div>

                  <div className="grid grid-cols-[1fr_auto] border-b border-[#e1e8e3] px-5 py-2.5">
                    <span className="text-[10px] text-[#81908a]">
                      Mobile Number
                    </span>

                    <strong className="max-w-[150px] break-words text-right text-[10px] text-[#264338]">
                      {invoiceData.phoneNumber || "-"}
                    </strong>
                  </div>

                  <div className="grid grid-cols-[1fr_auto] border-b border-[#e1e8e3] px-5 py-2.5">
                    <span className="text-[10px] text-[#81908a]">City</span>

                    <strong className="max-w-[150px] break-words text-right text-[10px] text-[#264338]">
                      {invoiceData.city || "-"}
                    </strong>
                  </div>

                  <div className="grid grid-cols-[1fr_auto] px-5 py-2.5">
                    <span className="text-[10px] text-[#81908a]">State</span>

                    <strong className="max-w-[150px] break-words text-right text-[10px] text-[#264338]">
                      {invoiceData.state || "-"}
                    </strong>
                  </div>
                </div>

                {/* RIGHT */}

                <div>
                  <div className="grid grid-cols-[1fr_auto] border-b border-[#e1e8e3] px-5 py-2.5">
                    <span className="text-[10px] text-[#81908a]">
                      Product / Plan
                    </span>

                    <strong className="max-w-[150px] break-words text-right text-[10px] text-[#264338]">
                      {planName}
                    </strong>
                  </div>

                  <div className="grid grid-cols-[1fr_auto] border-b border-[#e1e8e3] px-5 py-2.5">
                    <span className="text-[10px] text-[#81908a]">Family</span>

                    <strong className="text-right text-[10px] text-[#264338]">
                      {family}
                    </strong>
                  </div>

                  <div className="grid grid-cols-[1fr_auto] border-b border-[#e1e8e3] px-5 py-2.5">
                    <span className="text-[10px] text-[#81908a]">Validity</span>

                    <strong className="text-right text-[10px] text-[#264338]">
                      {validity}
                    </strong>
                  </div>

                  <div className="grid grid-cols-[1fr_auto] border-b border-[#e1e8e3] px-5 py-2.5">
                    <span className="text-[10px] text-[#81908a]">
                      Invoice Date
                    </span>

                    <strong className="text-right text-[10px] text-[#264338]">
                      {invoiceDate}
                    </strong>
                  </div>

                  <div className="grid grid-cols-[1fr_auto] border-b border-[#e1e8e3] px-5 py-2.5">
                    <span className="text-[10px] text-[#81908a]">
                      Invoice No.
                    </span>

                    <strong className="max-w-[150px] break-all text-right text-[10px] text-[#264338]">
                      {invoiceData.invoiceNumber || "-"}
                    </strong>
                  </div>

                  <div className="grid grid-cols-[1fr_auto] px-5 py-2.5">
                    <span className="text-[10px] text-[#81908a]">
                      Payment Status
                    </span>

                    <strong className="max-w-[150px] break-words text-right text-[10px] uppercase text-[#176746]">
                      {paymentStatus}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* PAYMENT */}

            <div className="mt-7 grid grid-cols-2 gap-8">
              {/* MEMBERSHIP */}

              <div className="pt-4">
                <p className="text-[9px] font-extrabold uppercase tracking-wide text-[#91a19a]">
                  Annual Membership
                </p>

                <div className="mt-1 text-[25px] font-extrabold text-[#075e3d]">
                  INR {formatINR(basePrice)}
                </div>

                <p className="mt-1 text-[9px] font-semibold text-[#71817a]">
                  + GST (5%)
                </p>

                <div className="mt-5">
                  <p className="text-[9px] font-extrabold uppercase tracking-wide text-[#91a19a]">
                    Payment Status
                  </p>

                  <div className="mt-1 inline-flex max-w-full rounded-full bg-[#edf7ea] px-3 py-1.5">
                    <span className="break-words text-[9px] font-extrabold uppercase text-[#176746]">
                      {paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* PAYMENT SUMMARY */}

              <div className="border border-[#d8e5db]">
                <div className="bg-[#f3faf4] px-5 py-3 text-[11px] font-extrabold uppercase tracking-wide text-[#176746]">
                  Payment Summary
                </div>

                <div className="px-5 py-3">
                  <div className="flex justify-between py-2">
                    <span className="text-[10px] text-[#81908a]">
                      Base Price
                    </span>

                    <strong className="text-[10px] text-[#264338]">
                      INR {formatINR(basePrice)}
                    </strong>
                  </div>

                  <div className="flex justify-between border-b border-[#e2e9e4] py-2">
                    <span className="text-[10px] text-[#81908a]">GST (5%)</span>

                    <strong className="text-[10px] text-[#264338]">
                      INR {formatINR(gstAmount)}
                    </strong>
                  </div>

                  <div className="flex justify-between pt-3">
                    <span className="text-[11px] font-extrabold uppercase text-[#176746]">
                      Total Payable
                    </span>

                    <strong className="text-[13px] font-extrabold text-[#176746]">
                      INR {formatINR(totalAmount)}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* IMPORTANT NOTE */}

            <div className="mt-8 border border-[#d0dfd3] bg-[#f5faf5] p-4">
              <h4 className="text-[10px] font-extrabold uppercase tracking-wide text-[#176746]">
                Important Note
              </h4>

              <p className="mt-2 text-[9.5px] leading-relaxed text-[#3e5049]">
                Once the plan is issued, it can not be cancelled or refunded.
                This invoice is system generated and is intended as a customer
                plan and benefit summary.
              </p>
            </div>

            {/* COMPANY DETAILS */}

            <div className="mt-5 text-center">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-[#81908a]">
                GSTIN :{" "}
                <span className="font-bold text-[#176746]">
                  {COMPANY_GSTIN}
                </span>
              </p>

              <p className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-[#81908a]">
                CIN :{" "}
                <span className="font-bold text-[#176746]">{COMPANY_CIN}</span>
              </p>

              <p className="mx-auto mt-2 max-w-[650px] text-[8px] leading-relaxed text-[#7d8d86]">
                {COMPANY_ADDRESS}
              </p>
            </div>

            {/* PAGE 2 FOOTER */}

            <div className="absolute bottom-8 left-7 right-7 border-t border-[#e3e9e5] pt-4 sm:left-10 sm:right-10">
              <p className="text-[10px] font-bold text-[#176746]">
                Thank you for choosing {COMPANY_NAME}.
              </p>

              <div className="mt-2 flex items-center justify-between text-[8px] text-[#87958f]">
                <span>
                  This invoice is system generated. No signature is required.
                </span>

                <span>Page 2 of 2</span>
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
