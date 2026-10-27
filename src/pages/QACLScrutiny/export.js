
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import { pdfStyle } from "Utils";
import SQAE from "assets/Images/sqae_logo.png";

const tableData = [
    [{ content: "", rowSpan: 4, styles: { minCellWidth: 30, halign: 'center', valign: 'middle' } },
    { content: "SENIOR QUALITY ASSURANCE ESTABLISHMENT\n(ELECTRONICS)\n BENGALURU", rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
    { content: "SQAE(L)/BG/QMS" }],
    [{ content: "Issue No. : 08" }],
    [{ content: "QUALITY MANAGEMENT SYSTEM MANUAL \n ISO : 2015", rowSpan: 2, styles: { halign: 'center', valign: 'middle' } }, { content: "Rev. No. : 00" }],
    [{ content: `Date : ${moment(new Date()).format("DD MM YYYY")}` }],
];

export const generatePdf = (data = [], responseData) => {
    const firstTable = data?.filter((el) => el.part === 1).map((el) => [el.slNo, el.reference, el.obsSts, el.remarks])
    const secondTable = data?.filter((el) => el.part === 2).map((el) => [el.slNo, el.reference, el.obsSts, el.remarks])
    const [W, H] = [210, 297];
    const margin = 20;
   
    let Y = margin + 20;
    const now = moment().format("DD-MM-YYYY, HH:mm:ss");
    const pdf = new jsPDF("p", "mm", [W, H], true);
    function addHeaderAndFooter(doc) {
        var totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            const str = "Page " + i + " of " + totalPages;
            doc.text(str, W - 40, H - 10);
            doc.autoTable({
                body: tableData,
                startY: 10,
                theme: "grid",

                bodyStyles: {
                    fontStyle: "bold",
                    textColor: 0,
                },
                didDrawCell: (data) => {
                    if (data.row.index === 0 && data.column.index === 0) { // Only draw in first cell
                        const imgWidth = 23;
                        const imgHeight = 25;
                        data.doc.addImage(SQAE, data.cursor.x + 2, data.cursor.y + 2, imgWidth, imgHeight);
                    }
                }
            })
        }
        return doc;
    }

    // --- Set Font to Bold ---
    pdf.setFont('helvetica', 'bold'); // Font name and style
    pdf.setFontSize(12);
    pdf.text("SQAEL/SEC/ANVIII/7.5.3/FRM-32", W / 2, 50, { align: 'center', })
    pdf.text("SCRUTINY OF QACL", W / 2, 58, { align: 'center' })
    pdf.setFont('helvetica', 'normal'); // Font name and style
    pdf.text("(a)  SO No & Date", 10, 70)
    pdf.text("(b)  Item", 10, 80)
    pdf.text("(c)  Qty offered", 10, 90)
    pdf.text("(e)  QACL No & Offer Date", 10, 100)

    //values
    pdf.text(`:  ${responseData?.orderNo} , ${responseData?.orderDate}`, 80, 70)
    pdf.text(`:  ${responseData?.description}`, 80, 80)
    pdf.text(":", 80, 90)
    pdf.text(`:  ${responseData?.olNumber}   ${responseData?.offerDate}`, 80, 100)

    pdf.autoTable({
        body: firstTable,
        head: [["Sl.No", "Aspects to be checked", "Observation", "Remarks"]],
        startY: Y + 68,
        theme: "grid",
        headStyles: {
            ...pdfStyle,
            fontSize: 12,
            fontStyle: "bold",
            fillColor: "#205375",
            textColor: 255,
        },
        bodyStyles: { ...pdfStyle, fontSize: 12, },

    });
    const previousTableHeight = pdf.autoTable.previous
    pdf.text("Receipt of SO/At", 0, previousTableHeight.finalY + 40)

    pdf.autoTable({
        body: secondTable,
        head: [["Sl.No", "Aspects to be checked", "Observation", "Remarks"]],
        theme: "grid",
        headStyles: {
            ...pdfStyle,
            fontSize: 12,
            fontStyle: "bold",
            fillColor: "#205375",
            textColor: 255,
        },
        margin: { top: 50 },
        bodyStyles: { ...pdfStyle, fontSize: 12, },
        didDrawPage: function (data) {
            let afterTablePos = data.cursor.y + 10;
            data.doc.setFontSize(12);
            const parts = data.doc.splitTextToSize("It is certified that scrutiny of QACL done and all sections that are required are initiated. All preparations that are required for undertaking QA are completed, and are available for QA team", 180);
            data.doc.text(parts, 10, afterTablePos)
            data.doc.setFont('helvetica', 'bold');
            data.doc.text("AQAO(Division)", 10, afterTablePos + 15);
            data.doc.setFont('helvetica', 'normal');
            data.doc.text("Signature..............", 10, afterTablePos + 20);
            data.doc.text("Name...................", 10, afterTablePos + 25);
            data.doc.text("Designation............", 10, afterTablePos + 30);
            data.doc.text("Date...................", 10, afterTablePos + 35);
            data.doc.text("Vetted by", W - 50, afterTablePos + 15);
            data.doc.setFont('helvetica', 'normal');
            data.doc.text("Signature..............", W - 50, afterTablePos + 20);
            data.doc.text("Name...................", W - 50, afterTablePos + 25);
            data.doc.text("Designation............", W - 50, afterTablePos + 30);
            data.doc.text("Date...................", W - 50, afterTablePos + 35);
        },
    });

    let PDF = addHeaderAndFooter(pdf);

    PDF.save(`qacl-scrutiny-${responseData?.orderNo}-${now}.pdf`);
};