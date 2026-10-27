import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import to enable table generation

export function generatePdf(data) {
  const doc = new jsPDF();
  let y = 10; // Starting y position

  // Helper function to add key-value pairs
  function addKeyValue(key, value, x, y) {
    doc.setFontSize(10);
    doc.text(x, y, `${key}:`, {bold: true, marginRight: 8});
    doc.text(x + 40, y, value || '');
    y += 8;
    return y;
  }

  // A Section
  doc.setFontSize(12);
  doc.text(10, y, 'PART A - INSPECTION NOTE', {align: 'left'});
  y += 10;

  y = addKeyValue('A.1', "some value", 10, y);
  y = addKeyValue('A.2', data?.a2, 10, y);
  y = addKeyValue('A.3', data?.a3, 10, y);
  y = addKeyValue('A.4', data?.a4, 10, y);
  y = addKeyValue('A.5', data?.a5, 10, y);
  y = addKeyValue('A.6', data?.a6, 10, y);
  y = addKeyValue('A.7', data?.a7, 10, y);
  y = addKeyValue('A.8', data?.a8, 10, y);
  y = addKeyValue('A.9.a', data?.a9a, 10, y);
  y = addKeyValue('A.9.b', data?.a9b, 10, y);

  y += 10;

  doc.setFontSize(10);
  doc.text(10, y, 'Notes:', {bold: true});
  y += 8;  
  doc.text(20, y, '1. In case of any specified mode of payment i.e. for 80% or 98% payment same should be mentioned on top portion of the Inspection Note.');
  y += 6;
  doc.text(20, y, '2. Delivery / Extended Delivery date valid up to ' + (data?.notes2a || ''));
  y += 6;
  doc.text(20, y, '3. QA Call letter received on ' + (data?.notes3a || '') + '. In view of this Fag End Notice not issued / issued to firm vide encl ' + (data?.notes3b || ''));
  y += 6;
  doc.text(20, y, '4. Inspection Note should be / should not be affixed with a stamp for franking clause.');
  y += 6;
  doc.text(20, y, '5. Percentage to be with held for non supply of literature should be shown on top of portion of Inspection Note.');
  y += 10;

  // B Section
  doc.setFontSize(12);
  doc.text(10, y, 'PART B - QUALITY ASSURANCE RECORDS', {align: 'left'});
  y += 10;

  y = addKeyValue('B.1 Paper particulars', '', 10, y);
  y = addKeyValue('(a) Specification', "testimg the value" || '', 30, y);
  y = addKeyValue('(b) Drawing', data?.b1b || '', 30, y);
  y = addKeyValue('(c) Test Schedule', data?.b1c || '', 30, y);

  y = addKeyValue('B.2 Accepted Stores cost:', data?.b2 || '', 10, y);
  y = addKeyValue('B.3 Pre-inspection report of firm received  verified, found acceptable / comments are as per enclosure', data?.b3 || '', 10, y);
  y = addKeyValue('B.4 It is verified that previously quality assured but not accepted and rejected stores kept in BondRoom were verified and found available before commencing the QA of present lot', data?.b4 || '', 10, y);
  y = addKeyValue('B.5 It is certified that true Xerox copy of Railway Receipt for dispatch of previous lot / lots have been –', data?.b5a || '', 10, y);
  y = addKeyValue(' (a) already received from firm vide L/No', data?.b5a || '', 10, y);
  y = addKeyValue(' (b) not received reasons given by firm attached at encl', data?.b5b || '', 10, y);
  y = addKeyValue('B.6 Details of sampling of raw material, finished stores, test samples the manner in which drawn and their acceptance is attached at encl', data?.b5b || '', 10, y);
  y = addKeyValue('B.7 Draft literature copies have been submitted to AHSP for approval as per letter referred at encl', data?.b5b || '', 10, y);

  doc.save('inspection_note.pdf');
}
