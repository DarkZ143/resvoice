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
   * GST rate is fixed/reference at 5%.
   * GST is NOT calculated automatically.
   */
  gstRate: number;

  /*
   * Actual GST amount is entered manually
   * by the admin.
   */
  gstAmount: number;

  currency: string;

  // =========================================================
  // Payment
  // =========================================================

  /*
   * Supported values include:
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
