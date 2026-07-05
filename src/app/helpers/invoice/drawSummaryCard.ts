import {
  BLUE,
  CARD_BG,
  CARD_BORDER,
  DARK,
  GREY,
  ROW_DIVIDER,
  TOTAL_ROW_BG,
} from "./constants.js";
import type { Doc, IInvoiceData } from "./types.js";

export const drawSummaryCard = (
  doc: Doc,
  data: IInvoiceData,
  margin: number,
  contentWidth: number,
  y: number,
): number => {
  const cx = margin;
  const cw = contentWidth;
  const hbarH = 32;
  const rowH = 38;
  const labelW = cw * 0.45;
  const valX = cx + labelW;
  const valW = cw - labelW;

  doc.font("Helvetica-Bold").fontSize(10);
  const tourLineH = doc.heightOfString(data.tourTitle, { width: valW - 28 });
  const tourRowH = Math.max(rowH, tourLineH + 20);

  const rows: { label: string; value: string; h: number; isTotal?: boolean }[] =
    [
      { label: "Transaction ID", value: data.transactionId, h: rowH },
      {
        label: "Booking Date",
        value: new Date(data.bookingDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        h: rowH,
      },
      { label: "Tour", value: data.tourTitle, h: tourRowH },
      { label: "Guests", value: String(data.guestCount), h: rowH },
      {
        label: "Total Paid",
        value: data.totalAmount.toFixed(2),
        h: rowH,
        isTotal: true,
      },
    ];

  const cardH = hbarH + rows.reduce((s, r) => s + r.h, 0);

  doc.rect(cx, y, cw, cardH).fill(CARD_BG);
  doc.rect(cx, y, cw, hbarH).fill(BLUE);

  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor("#ffffff")
    .text("BOOKING SUMMARY", cx, y + 11, {
      width: cw,
      align: "center",
      characterSpacing: 1,
    });

  let ry = y + hbarH;

  for (const row of rows) {
    if (row.isTotal) {
      doc.rect(cx, ry, cw, row.h).fill(TOTAL_ROW_BG);
    }

    doc
      .moveTo(cx, ry)
      .lineTo(cx + cw, ry)
      .strokeColor(ROW_DIVIDER)
      .lineWidth(0.5)
      .stroke();

    const ty = ry + (row.h - 12) / 2;

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(GREY)
      .text(row.label, cx + 16, ty, { width: labelW - 20 });

    if (row.isTotal) {
      doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .fillColor(BLUE)
        .text(row.value, valX, ry + (row.h - 16) / 2, { width: valW - 16 });
    } else {
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor(DARK)
        .text(row.value, valX, ty, { width: valW - 16 });
    }

    ry += row.h;
  }

  doc.rect(cx, y, cw, cardH).strokeColor(CARD_BORDER).lineWidth(1).stroke();

  return ry + 20;
};
