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

  /*
   * Product selected for this transaction.
   * Example:
   * 1A
   * 2A
   * 2A + 2C
   * Custom Plan (2A)
   */
  productName: string;

  /*
   * Transaction / payment reference ID.
   */
  transactionId: string;

  /*
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

  basePrice: number;

  /*
   * GST is displayed as a fixed/reference rate of 5%.
   * GST amount is NOT calculated automatically.
   */
  gstRate: number;

  /*
   * Actual GST amount entered manually by admin.
   */
  gstAmount: number;

  currency: string;

  // =========================================================
  // Payment
  // =========================================================

  /*
   * Supported values:
   * PAID IN FULL
   * PENDING
   * PARTIALLY PAID
   * OVERDUE
   * CUSTOM
   */
  paymentStatus: string;

  /*
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
