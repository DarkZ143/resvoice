"use client";

import { useEffect, useState } from "react";

import type { InvoiceData } from "@/types";
import { initialInvoiceData } from "@/data/defaultInvoice";
import { InvoiceGeneratorForm } from "@/components/InvoiceGeneratorForm";
import { InvoiceViewer } from "@/components/InvoiceViewer";

const STORAGE_KEY = "vitality_invoice_data_v1";

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"form" | "viewer">("form");

  // IMPORTANT:
  // Start with the exact same data on server and client.
  const [invoiceData, setInvoiceData] =
    useState<InvoiceData>(initialInvoiceData);

  const [isHydrated, setIsHydrated] = useState(false);

  // Load saved invoice only after the component mounts in browser.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved) as InvoiceData;

        setInvoiceData({
          ...initialInvoiceData,
          ...parsed,
        });
      }
    } catch (error) {
      console.warn("Failed to load saved invoice:", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save changes after browser hydration.
  useEffect(() => {
    if (!isHydrated) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(invoiceData));
    } catch (error) {
      console.warn("Failed to save invoice:", error);
    }
  }, [invoiceData, isHydrated]);

  const handleReset = () => {
    setInvoiceData({
      ...initialInvoiceData,
      issueDate: initialInvoiceData.issueDate,
    });

    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn("Failed to clear saved invoice:", error);
    }

    setCurrentScreen("form");
  };

  return (
    <div className="min-h-screen bg-[#f4f7f4] text-[#18352c]">
      {currentScreen === "form" ? (
        <InvoiceGeneratorForm
          invoiceData={invoiceData}
          onChange={setInvoiceData}
          onGenerate={() => setCurrentScreen("viewer")}
          onReset={handleReset}
        />
      ) : (
        <InvoiceViewer
          invoiceData={invoiceData}
          onBack={() => setCurrentScreen("form")}
          onEdit={() => setCurrentScreen("form")}
        />
      )}
    </div>
  );
}
