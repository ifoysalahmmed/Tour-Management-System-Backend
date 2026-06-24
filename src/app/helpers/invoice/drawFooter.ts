import { FOOTER_BG } from "./constants.js";
import type { Doc } from "./types.js";

export const drawFooter = (
  doc: Doc,
  pageWidth: number,
  pageHeight: number,
  contentWidth: number,
  margin: number,
): void => {
  const fH = 35;
  const fY = pageHeight - fH;

  doc.rect(0, fY, pageWidth, fH).fill(FOOTER_BG);

  const oldBottomMargin = doc.page.margins.bottom;
  doc.page.margins.bottom = 0;

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#999999")
    .text(
      `Thank you for your booking! © ${new Date().getFullYear()} Tour Management System`,
      margin,
      fY + 14,
      { width: contentWidth, align: "center", lineBreak: false },
    );

  doc.page.margins.bottom = oldBottomMargin;
};
