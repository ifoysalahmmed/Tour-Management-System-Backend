import PDFDocument from "pdfkit";

export type Doc = InstanceType<typeof PDFDocument>;

export interface IInvoiceData {
  transactionId: string;
  bookingDate: Date;
  username: string;
  tourTitle: string;
  guestCount: number;
  totalAmount: number;
}
