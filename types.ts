export interface BenefitItem {
  id: string;
  title: string;
  category: string;
  badgeText: string;
  shortDesc: string;
  details: string[];
  imageUrl?: string;
  iconName: string;
  included: boolean;
}

/* =========================================================
   TRANSACTION
========================================================= */

export interface InvoiceTransaction {
  /**
   * Payment / transaction reference ID.
   */
  transactionId: string;

  /**
   * Transaction date and time.
   *
   * Expected format:
   * yyyy-mm-ddTHH:mm
   *
   * Compatible with HTML datetime-local input.
   */
  transactionDate: string;
}

/* =========================================================
   INVOICE DATA
========================================================= */

export interface InvoiceData {
  // =========================================================
  // Invoice
  // =========================================================

  invoiceNumber: string;

  /**
   * Invoice issue date.
   *
   * Expected format:
   * yyyy-mm-dd
   */
  issueDate: string;

  // =========================================================
  // Transaction
  // =========================================================

  /**
   * Product selected for this transaction.
   *
   * Examples:
   * 1A
   * 2A
   * 2A + 2C
   * Custom Plan (2A)
   */
  productName: string;

  /**
   * Legacy / primary transaction ID.
   *
   * Kept for backward compatibility with older invoices.
   *
   * For current invoices, use `transactions`.
   */
  transactionId: string;

  /**
   * Legacy / primary transaction date and time.
   *
   * Kept for backward compatibility with older invoices.
   *
   * For current invoices, use `transactions`.
   */
  transactionDate: string;

  /**
   * Payment transactions for the invoice.
   *
   * Maximum supported: 3 transactions.
   *
   * Each transaction contains its own:
   * - Transaction ID
   * - Transaction Date & Time
   */
  transactions: InvoiceTransaction[];

  // =========================================================
  // Customer
  // =========================================================

  customerName: string;

  phoneNumber: string;

  email: string;

  city: string;

  state: string;

  pincode: string;

  // =========================================================
  // Plan
  // =========================================================

  planName: string;

  planDescription: string;

  family: string;

  tenure: string;

  // =========================================================
  // Pricing
  // =========================================================

  /**
   * Base price entered manually.
   *
   * Decimal values are supported.
   *
   * Examples:
   * 70000
   * 70000.50
   * 3125.75
   */
  basePrice: number;

  /**
   * GST is displayed as a fixed/reference rate of 5%.
   *
   * GST amount is entered manually.
   *
   * It is NOT calculated automatically from basePrice.
   */
  gstRate: number;

  /**
   * Actual GST amount entered manually.
   *
   * Decimal values are supported.
   *
   * Example:
   * 3500
   * 3500.50
   */
  gstAmount: number;

  /**
   * Final payable amount entered manually.
   *
   * IMPORTANT:
   *
   * This value is NOT calculated from:
   *
   * basePrice + gstAmount
   *
   * The invoice maker enters the final amount directly.
   *
   * Decimal values are supported.
   */
  totalAmount: number;

  currency: string;

  // =========================================================
  // Payment Status
  // =========================================================

  /**
   * Supported values:
   *
   * PAID IN FULL
   * PENDING
   * PARTIALLY PAID
   * OVERDUE
   * CUSTOM
   */
  paymentStatus: string;

  /**
   * Custom payment status text.
   *
   * Used only when paymentStatus === "CUSTOM".
   */
  customPaymentStatus: string;

  // =========================================================
  // Company
  // =========================================================

  companyName: string;

  companyAddress: string;

  companyGstin: string;

  companyCin: string;

  companySupportPhone: string;

  companyWebsite: string;

  // =========================================================
  // Benefits
  // =========================================================

  benefits: BenefitItem[];
}
