const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse').default || require('pdf-parse');

const pdfPath = path.join(__dirname, 'public', 'BUSINESS LOAN FORM.pdf');
const dataBuffer = fs.readFileSync(pdfPath);

pdfParse(dataBuffer).then(function(data) {
    // number of pages
    console.log("Number of pages:", data.numpages);
    // number of rendered pages
    console.log("Number of rendered pages:", data.numrender);
    // PDF info
    console.log("\nPDF Info:");
    console.log(data.info);
    // PDF metadata
    console.log("\nPDF Metadata:");
    console.log(data.metadata);
    // all text
    console.log("\nExtracted Text:");
    console.log(data.text);
}).catch(function(error) {
    console.error("Error parsing PDF:", error);
});
