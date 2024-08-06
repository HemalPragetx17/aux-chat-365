export type InvoiceStatus = 'Paid' | string;

export type InvoiceLayoutProps = {
  id: string;
  invoiceData?: InvoiceType;
};

export type InvoiceClientType = {
  name: string;
  address: string;
  company: string;
  country: string;
  contact: string;
  companyEmail: string;
};

export type InvoiceType = {
  invoiceNumber?: string;
  id: string;
  ownerId: string;
  payment_id: string;
  payment_url: string;
  file: string;
  status: string;
  companyName: string;
  companyPhoneNumber: string;
  companyEmail: string;
  companyAddress: string;
  customerName: string;
  customerEmail: string;
  customerPhoneNumber: string;
  customerAddress: string;
  items: any;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  signature?: string;
  message?: string;
};

export type NewInvoiceType = {
  invoiceNumber?: string;
  id: string;
  message: string;
  customerCompany: string;
  ownerId: string;
  payment_id: string;
  payment_url: string;
  file: string;
  status: string;
  companyName: string;
  companyPhoneNumber: string;
  orderDetails: any;
  companyEmail: string;
  companyAddress: string;
  description: string;
  customerName: string;
  customerEmail: string;
  customerPhoneNumber: string;
  customerAddress: string;
  items: any;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  dueDate: string;
  signature?: string;
};

export type InvoicePaymentType = {
  iban: string;
  totalDue: string;
  bankName: string;
  country: string;
  swiftCode: string;
};

export type SingleInvoiceType = {
  invoice: InvoiceType;
  paymentDetails: InvoicePaymentType;
};

export type InvoiceTabType = {
  address: string;
  phoneNumber: number | string;
  mobileNumber: number | string;
  bankName?: string;
  country?: string;
  iban?: string;
  swiftCode?: string;
  authorizedPersonName: string;
  authorizedPersonSign: string;
  note: string;
};
