import status from "http-status";
import PDFDocument from "pdfkit";

import { AppError } from "../errors/app.error.js";
import {
  drawHeader,
  drawSummaryCard,
  drawFooter,
  type IInvoiceData,
} from "../helpers/invoice/index.js";

export const generateInvoicePDF = async (
  invoiceData: IInvoiceData,
): Promise<Buffer> => {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  return new Promise<Buffer>((resolve, reject) => {
    const buffer: Uint8Array[] = [];

    doc.on("data", (chunk) => buffer.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffer)));
    doc.on("error", (err) =>
      reject(
        new AppError(
          status.BAD_REQUEST,
          `Failed to generate invoice PDF: ${err.message}`,
        ),
      ),
    );

    const { width: pageWidth, height: pageHeight } = doc.page;
    const margin = 50;
    const contentWidth = pageWidth - margin * 2;

    const headerBottom = drawHeader(doc, pageWidth, contentWidth, margin);

    let y = headerBottom + 30;
    y = drawSummaryCard(doc, invoiceData, margin, contentWidth, y);
    y += 18;
    drawFooter(doc, pageWidth, pageHeight, contentWidth, margin);

    doc.end();
  });
};
