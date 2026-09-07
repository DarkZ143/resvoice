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

export interface InvoiceData {
  // =========================================================
  // Invoice
  // =========================================================

  invoiceNumber: string;

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
   * Transaction / payment reference ID.
   */
  transactionId: string;

  /**
   * Transaction date and time.
   * Stored as a datetime-local compatible string.
   */
  transactionDate: string;

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
   * Examples: 70000, 70000.50
   */
  basePrice: number;

  /**
   * GST is displayed as a fixed/reference rate of 5%.
   *
   * GST amount is entered manually.
   * It is NOT calculated automatically.
   */
  gstRate: number;

  /**
   * Actual GST amount entered manually.
   *
   * Decimal values are supported.
   */
  gstAmount: number;

  /**
   * Final payable amount entered manually.
   *
   * IMPORTANT:
   * This is NOT calculated from basePrice + gstAmount.
   *
   * Decimal values are supported.
   */
  totalAmount: number;

  currency: string;

  // =========================================================
  // Payment
  // =========================================================

  /**
   * Supported values:
   * PAID IN FULL
   * PENDING
   * PARTIALLY PAID
   * OVERDUE
   * CUSTOM
   */
  paymentStatus: string;

  /**
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
