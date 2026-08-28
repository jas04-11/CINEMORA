import PDFDocument from "pdfkit";

// Streams a movie-ticket-style receipt PDF directly to the HTTP response.
// booking: { bookingCode, seatNumbers, amount, movieTitle, theaterName, screenName, showDate, showTime, userName }
export const streamReceiptPDF = (res, booking) => {
  const doc = new PDFDocument({ size: [400, 550], margin: 0 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=receipt-${booking.bookingCode}.pdf`
  );

  doc.pipe(res);

  // Header band
  doc.rect(0, 0, 400, 90).fill("#12141c");
  doc
    .fillColor("#F2B705")
    .font("Helvetica-Bold")
    .fontSize(22)
    .text("CINEMORA", 30, 28);
  doc
    .fillColor("#ffffff")
    .font("Helvetica")
    .fontSize(10)
    .text("Movie Ticket Receipt", 30, 58);

  let y = 115;
  doc.fillColor("#111111").font("Helvetica-Bold").fontSize(16);
  doc.text(booking.movieTitle, 30, y, { width: 340 });
  y += 30;

  doc.font("Helvetica").fontSize(11).fillColor("#333333");
  const line = (label, value) => {
    doc.font("Helvetica-Bold").text(label, 30, y, { continued: true, width: 340 });
    doc.font("Helvetica").text(`  ${value}`);
    y += 20;
  };

  line("Theater:", `${booking.theaterName} - ${booking.screenName}`);
  line("Date & Time:", `${booking.showDate}  ${booking.showTime}`);
  line("Seats:", booking.seatNumbers.join(", "));
  line("Booked by:", booking.userName);
  line("Amount Due:", `Rs. ${booking.amount}`);

  y += 10;
  doc
    .moveTo(30, y)
    .lineTo(370, y)
    .dash(4, { space: 4 })
    .strokeColor("#aaaaaa")
    .stroke();
  doc.undash();
  y += 20;

  doc
    .font("Helvetica-Bold")
    .fontSize(13)
    .fillColor("#12141c")
    .text("Show this receipt at the counter to pay and get the ticket.", 30, y, {
      width: 340,
    });
  y += 45;

  doc.rect(30, y, 340, 70).fill("#f4f1ea");
  doc
    .fillColor("#12141c")
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("BOOKING CODE", 45, y + 12);
  doc
    .fillColor("#c1121f")
    .font("Helvetica-Bold")
    .fontSize(24)
    .text(booking.bookingCode, 45, y + 30);

  doc.end();
};
