import { BLUE } from "./constants.js";
import type { Doc } from "./types.js";

export const drawHeader = (
  doc: Doc,
  pageWidth: number,
  contentWidth: number,
  margin: number,
): number => {
  const H = 135;
  const gap = 12;

  doc.rect(0, 0, pageWidth, H).fill(BLUE);

  doc.font("Helvetica-Bold").fontSize(22);
  const titleH = doc.currentLineHeight();

  doc.font("Helvetica-Bold").fontSize(14);
  const invoiceH = doc.currentLineHeight();

  const badgeW = 155;
  const badgeH = 22;

  const stackH = titleH + gap + invoiceH + gap + badgeH;
  let y = (H - stackH) / 2;

  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(22)
    .text("Tour Management System", margin, y, {
      width: contentWidth,
      align: "center",
    });
  y += titleH + gap;

  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .fillColor("#ffffff")
    .text("INVOICE", margin, y, {
      width: contentWidth,
      align: "center",
    });
  y += invoiceH + gap;

  const badgeX = (pageWidth - badgeW) / 2;
  const badgeY = y;

  doc.save();
  doc
    .fillOpacity(0.2)
    .roundedRect(badgeX, badgeY, badgeW, badgeH, badgeH / 2)
    .fill("#ffffff");
  doc.restore();
  doc.fillOpacity(1);

  doc.font("Helvetica-Bold").fontSize(8);
  const badgeTextH = doc.currentLineHeight();

  doc
    .fillColor("#ffffff")
    .text("BOOKING CONFIRMED", badgeX, badgeY + (badgeH - badgeTextH) / 2, {
      width: badgeW,
      align: "center",
      characterSpacing: 1.5,
    });

  return H;
};
