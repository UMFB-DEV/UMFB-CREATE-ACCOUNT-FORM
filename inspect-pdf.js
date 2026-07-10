const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function inspectPdf() {
  const pdfPath = path.join(__dirname, 'public', 'BUSINESS LOAN FORM.pdf');
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  
  console.log('=== PDF INFO ===');
  console.log('Pages:', pdfDoc.getPageCount());
  
  // Get first page and try to get content
  const pages = pdfDoc.getPages();
  const page = pages[0];
  console.log('\n=== PAGE SIZE ===');
  console.log(page.getSize());
  
  // Check if there are any form fields
  const form = pdfDoc.getForm();
  const fields = form.getFields();
  
  console.log('\n=== FORM FIELDS ===');
  fields.forEach((field, index) => {
    console.log(`Field ${index + 1}:`, field.getName());
    console.log('  Type:', field.constructor.name);
  });
  
  // Write a copy of the PDF with dummy fields to test
  const textField = form.createTextField('dummyTest');
  textField.setText('Test Value');
  
  const pdfBytesOut = await pdfDoc.save();
  fs.writeFileSync(path.join(__dirname, 'temp-pdf.pdf'), pdfBytesOut);
  console.log('\nWrote temp-pdf.pdf with test field!');
}

inspectPdf().catch(console.error);
