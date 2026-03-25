import jsPDF from "jspdf";
import "jspdf-autotable";

export const generateReceipt = (payment, citizen) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // 1. Header background
    doc.setFillColor(0, 143, 93); // #065f46
    doc.rect(0, 0, pageWidth, 40, "F");

    // 2. Organization Name
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("Izzathul Islam ICC", pageWidth / 2, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Official Payment Receipt", pageWidth / 2, 28, { align: "center" });

    // 3. Receipt Details (Left) & Date (Right)
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Receipt No:", 20, 60);
    doc.setFont("helvetica", "normal");
    doc.text(payment._id.substring(payment._id.length - 8).toUpperCase(), 50, 60);

    doc.setFont("helvetica", "bold");
    doc.text("Date:", pageWidth - 60, 60);
    doc.setFont("helvetica", "normal");
    const date = new Date(payment.updatedAt || payment.createdAt).toLocaleDateString();
    doc.text(date, pageWidth - 45, 60);

    // 4. Citizen Details
    doc.setFont("helvetica", "bold");
    doc.text("Received From:", 20, 80);
    doc.setFont("helvetica", "normal");
    doc.text(citizen?.name || "Member", 55, 80);

    doc.setFont("helvetica", "bold");
    doc.text("Member ID:", 20, 90);
    doc.setFont("helvetica", "normal");
    doc.text(citizen?.membershipId || "N/A", 55, 90);

    // 5. Payment Details Table
    doc.autoTable({
        startY: 110,
        head: [['Description', 'Month/Year', 'Amount']],
        body: [
            ['Monthly Fee', `${payment.month} ${payment.year}`, `Rs. ${payment.amount}`]
        ],
        theme: 'striped',
        headStyles: { fillColor: [0, 143, 93] },
        styles: { fontSize: 11, cellPadding: 6 },
    });

    // 6. Total
    const finalY = doc.lastAutoTable.finalY || 150;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Paid: Rs. ${payment.amount}`, pageWidth - 20, finalY + 20, { align: "right" });

    // 7. Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for your contribution. May Allah reward you.", pageWidth / 2, finalY + 50, { align: "center" });

    // Download PDF
    const filename = `Receipt_${payment.month}_${payment.year}_${citizen?.membershipId || "Member"}.pdf`;
    doc.save(filename);
};
