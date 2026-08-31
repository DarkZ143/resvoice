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

  city: string;

  state: string;

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
   * Actual GST amount is entered manually
   * by the admin.
   */
  gstRate: number;

  /*
   * Manually entered GST amount.
   */
  gstAmount: number;

  currency: string;

  // =========================================================
  // Payment
  // =========================================================

  paymentStatus: string;

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
