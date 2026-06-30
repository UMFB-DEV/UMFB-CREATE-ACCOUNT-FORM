import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { PDFDocument as PDFLibDocument, StandardFonts, rgb } from 'pdf-lib';
import fetch from 'node-fetch';
import { readFileSync } from 'fs';
import { join } from 'path';

console.log('=== API ROUTE LOADED ===');
console.log('Environment check:');
console.log('- EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
console.log('- EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');
console.log('- EMAIL_TO:', process.env.EMAIL_TO || 'NOT SET');

// Load environment variables
dotenv.config();

const IS_DEV = process.env.NODE_ENV !== 'production';

// Create email transporter
const createTransporter = () => {
  console.log('Creating email transporter with custom SMTP...');

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.SMTP_HOST || !process.env.SMTP_PORT) {
    throw new Error('Missing EMAIL_USER, EMAIL_PASS, SMTP_HOST, or SMTP_PORT environment variables');
  }

  console.log('EMAIL_USER set:', !!process.env.EMAIL_USER);
  console.log('EMAIL_PASS set:', !!process.env.EMAIL_PASS);
  console.log('SMTP_HOST set:', !!process.env.SMTP_HOST);
  console.log('SMTP_PORT set:', !!process.env.SMTP_PORT);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_PORT == "465",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Test the transporter connection
  transporter.verify((error, success) => {
    if (error) {
      console.error('Email transporter verification failed:', error);
    } else {
      console.log('Email transporter verified successfully');
    }
  });

  return transporter;
};

// Helper to parse form data into a nested object
function parseFormData(formData: FormData) {
  const result: any = {};
  const files: { key: string; value: File }[] = [];

  for (const [key, value] of formData.entries()) {
    if (key === 'honeypot') continue;
    
    // Parse nested keys like accountSignatories[0][name]
    const keys = key.match(/([^\[\]]+)/g) || [key];
    let current = result;
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      const nextK = keys[i + 1];
      if (!current[k]) {
        current[k] = /^\d+$/.test(nextK) ? [] : {};
      }
      current = current[k];
    }
    
    // Store value whether it's File or string
    current[keys[keys.length - 1]] = value;
    
    // Also keep track of files for attachments
    if (value instanceof File) {
      files.push({ key, value });
    }
  }

  return { data: result, files };
}

// Field name formatting
function formatFieldName(key: string): string {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
}

// Corporate form sections
const corporateSections = [
  { name: '1. COMPANY DETAILS', fields: ['companyName', 'accountOfficer', 'accountType', 'registrationNumber', 'dateOfIncorporation', 'registeredOfficeAddress', 'natureOfBusiness', 'phoneNumber', 'emailAddress', 'website', 'taxIdentificationNumber', 'businessAddress', 'businessPhone', 'businessEmail', 'companyType'] },
  { name: '2. BOARD RESOLUTION', fields: ['boardResolutionMeetingDate', 'boardResolutionCompanyName', 'boardResolutionCompanySecretary', 'boardResolutionMandate', 'boardResolutionDirectors', 'boardResolutionSignatories'] },
  { name: '3. ACCOUNT SIGNATORY DETAILS', fields: ['accountSignatories'] },
  { name: '4. DIRECTORS/EXECUTIVES DETAILS', fields: ['directorsDetails'] },
  { name: '5. OTHER BANK ACCOUNTS', fields: ['otherBankAccounts'] },
  { name: '6. DECLARATION', fields: ['declarationCompanyName', 'declarationDate', 'declarationDirectorName', 'declarationDirectorSignature', 'declarationSecretaryName', 'declarationSecretarySignature', 'declarationAgreeTerms'] },
  { name: '7. REFERENCE FORM', fields: ['referenceForm'] },
];

// Personal form sections
const personalSections = [
  { name: '1. PERSONAL INFORMATION', fields: ['accountType', 'referrer', 'branch', 'gender', 'title', 'maritalStatus', 'lastName', 'otherNames', 'dateOfBirth', 'address', 'placeOfBirth', 'stateOfOrigin', 'lga', 'bvn', 'nin', 'mothersName', 'email', 'phone'] },
  { name: '2. EMPLOYMENT INFORMATION', fields: ['employersName', 'employersCountry', 'businessSector', 'meansOfIdentification', 'politicallyExposed'] },
  { name: '3. NEXT OF KIN', fields: ['nextOfKinName', 'nextOfKinPhone', 'nextOfKinEmail', 'nextOfKinRelationship'] },
  { name: '4. SPOUSE INFORMATION', fields: ['spouseSurname', 'spouseOtherNames', 'spouseAddress'] },
  { name: '5. FILE UPLOADS', fields: ['idDocument', 'passportPhoto', 'signature', 'utilityBill'] },
];

// Business loan form sections
const businessLoanSections = [
  { name: '1. PERSONAL INFORMATION', fields: ['applicantFirstName', 'applicantMiddleName', 'applicantLastName', 'applicantDOB', 'idType', 'idNumber', 'sex', 'bvn', 'nationality', 'telephone1', 'telephone2', 'maritalStatus', 'houseAddress', 'town', 'lga', 'state'] },
  { name: '2. SPOUSE INFORMATION', fields: ['spouseFirstName', 'spouseMiddleName', 'spouseLastName', 'spouseDOB', 'spouseTelephone1', 'spouseTelephone2'] },
  { name: '3. NEXT OF KIN', fields: ['nextOfKinName', 'nextOfKinSex', 'nextOfKinRelationship', 'nextOfKinTel'] },
  { name: '4. BUSINESS INFORMATION', fields: ['businessName', 'businessType', 'businessAddress', 'businessActivity', 'locationSince', 'businessSince', 'tinNo'] },
  { name: '5. LOAN INFORMATION', fields: ['loanAmount', 'loanMonths', 'monthlyRepaymentCapacity', 'loanPurpose', 'investmentPlanDetails', 'otherLoan', 'howHeard'] },
  { name: '6. AUTHORIZATION', fields: ['applicantSignature', 'supervisorName', 'supervisorSignature'] },
];

// Determine form type
function getFormType(data: any) {
  if (data.formType === 'corporate') return 'corporate';
  if (data.formType === 'business-loan') return 'quick-loan';
  if (data.formType === 'quick-loan') return 'quick-loan';
  if (data.formType === 'personal') return 'personal';
  
  // Fallback to field detection if formType not available
  if (data.companyName || data.registrationNumber) return 'corporate';
  if (data.businessName && data.loanAmount) return 'quick-loan';
  return 'personal';
}

// Function to create PDF from form data
async function createApplicationPDF(formData: FormData): Promise<Buffer> {
  console.log('Starting PDF generation with pdf-lib...');
  const { data: parsedData, files: parsedFiles } = parseFormData(formData);
  const formType = getFormType(parsedData);
  console.log('=== PDF GENERATION FORM TYPE ===', formType);
  let sections;
  if (formType === 'corporate') sections = corporateSections;
  else if (formType === 'quick-loan') sections = businessLoanSections;
  else sections = personalSections;

  const pdfDoc = await PDFLibDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();
  let y = height - 50;

  const drawLine = (text: string, opts?: { bold?: boolean; size?: number; indent?: number }) => {
    const size = opts?.size ?? 11;
    const usedFont = opts?.bold ? fontBold : font;
    const indent = opts?.indent ?? 0;
    page.drawText(text, { x: 50 + indent, y, size, font: usedFont, color: rgb(0, 0, 0) });
    y -= size + 6;
    if (y < 60) {
      page = pdfDoc.addPage([595.28, 841.89]);
      y = height - 50;
    }
  };

  const drawKeyValue = (label: string, value: string, indent: number = 10) => {
    const size = 11;
    const uppercaseLabel = label.toUpperCase();
    const labelWidth = fontBold.widthOfTextAtSize(uppercaseLabel + ': ', size);
    page.drawText(uppercaseLabel + ': ', { x: 50 + indent, y, size, font: fontBold, color: rgb(0, 0, 0) });
    page.drawText(value, { x: 50 + indent + labelWidth, y, size, font, color: rgb(0, 0, 0) });
    y -= size + 10; // extra space to avoid clustering
    if (y < 60) {
      page = pdfDoc.addPage([595.28, 841.89]);
      y = height - 50;
    }
  };

  // Optional logo at top (supports both URL and local file path)
  const logoUrl = process.env.PDF_LOGO_URL;
  if (logoUrl) {
    try {
      let logoArray: ArrayBuffer;
      
      // Check if it's a URL (starts with http) or local file path
      if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://')) {
        // Remote URL - fetch it
        console.log('Loading logo from URL:', logoUrl);
        const logoRes = await fetch(logoUrl);
        logoArray = await logoRes.arrayBuffer();
      } else {
        // Local file path - read from public folder or absolute path
        console.log('Loading logo from local file:', logoUrl);
        const logoPath = logoUrl.startsWith('/') 
          ? join(process.cwd(), 'public', logoUrl) // If starts with /, it's relative to public
          : join(process.cwd(), logoUrl); // Otherwise use as-is (absolute or relative to project root)
        const logoBuffer = readFileSync(logoPath);
        logoArray = logoBuffer.buffer.slice(logoBuffer.byteOffset, logoBuffer.byteOffset + logoBuffer.byteLength);
      }
      
      // Determine image type and embed accordingly
      const logoUint8 = new Uint8Array(logoArray);
      let logoImage;
      
      // Try PNG first, then JPEG
      try {
        logoImage = await pdfDoc.embedPng(logoUint8);
      } catch {
        logoImage = await pdfDoc.embedJpg(logoUint8);
      }
      
      const logoDims = logoImage.scale(0.4);
      page.drawImage(logoImage, {
        x: (width - logoDims.width) / 2, // Center the logo
        y: y - logoDims.height,
        width: logoDims.width,
        height: logoDims.height,
      });
      y -= logoDims.height + 12;
      console.log('Logo embedded successfully');
    } catch (e) {
      console.warn('Logo load failed, continuing without logo:', e);
    }
  }

  let subjectLine;
  let formTitle;
  if (formType === 'quick-loan') {
    subjectLine = 'New Quick Loan Application';
    formTitle = 'Quick Loan Application';
  } else if (formType === 'corporate') {
    subjectLine = 'New Corporate Account Opening Application';
    formTitle = 'Corporate Account Opening Application';
  } else {
    subjectLine = 'New Personal Account Creation Application';
    formTitle = 'Personal Account Opening Application';
  }

  drawLine('From: Unilag Microfinance Bank <info@unilagmfbank.com>', { bold: true });
  drawLine(`Sent: ${new Date().toLocaleString()}`, { size: 10 });
  drawLine('To: Unilag Microfinance Bank <accountopening@unilagmfbank.com>', { size: 10 });
  drawLine(`Subject: ${subjectLine}`, { size: 10 });
  y -= 10;

  drawLine(formTitle, { bold: true, size: 18 });
  y -= 10;

  // Helper to draw an image in the PDF
  const drawImage = async (file: File, label: string, indent: number = 10) => {
    try {
      // Get file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      let image;
      try {
        // Try to embed as PNG first
        image = await pdfDoc.embedPng(uint8Array);
      } catch {
        // If that fails, try JPEG
        try {
          image = await pdfDoc.embedJpg(uint8Array);
        } catch {
          // If neither works, just show file name
          drawKeyValue(label, `${file.name} (${(file.size / 1024).toFixed(1)} KB)`, indent);
          return;
        }
      }
      
      // Calculate image dimensions to fit in the page
      const maxWidth = width - 100 - indent;
      const maxHeight = 200; // Max height per image
      let scale = 1;
      
      if (image.width > maxWidth) {
        scale = maxWidth / image.width;
      }
      
      let scaledWidth = image.width * scale;
      let scaledHeight = image.height * scale;
      
      if (scaledHeight > maxHeight) {
        scale = maxHeight / image.height;
        scaledWidth = image.width * scale;
        scaledHeight = image.height * scale;
      }
      
      // Check if we need a new page
      if (y - scaledHeight - 20 < 60) {
        page = pdfDoc.addPage([595.28, 841.89]);
        y = height - 50;
      }
      
      // Draw label
      drawLine(`${formatFieldName(label)}:`, { size: 10, bold: true, indent });
      
      // Draw the image
      page.drawImage(image, {
        x: 50 + indent,
        y: y - scaledHeight,
        width: scaledWidth,
        height: scaledHeight,
      });
      
      // Update y position
      y = y - scaledHeight - 20;
    } catch (err) {
      console.error(`Failed to embed image ${file.name}:`, err);
      // Fallback to showing file name
      drawKeyValue(label, `${file.name} (${(file.size / 1024).toFixed(1)} KB)`, indent);
    }
  };

  // Render sections (async now because image embedding is async)
  const renderSection = async (sectionName: string, sectionData: any, indent: number = 0) => {
    drawLine(sectionName, { bold: true, size: 14, indent });
    y -= 5;
    
    for (const [key, value] of Object.entries(sectionData)) {
      if (Array.isArray(value)) {
        // Check if it's an array of primitive values (strings/numbers/booleans)
        const isPrimitiveArray = value.every(item => 
          typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean'
        );
        
        if (isPrimitiveArray) {
          // Treat as a list of values, not nested sections
          drawKeyValue(key, value.join(', '), indent);
        } else {
          // Treat as array of objects
          for (let index = 0; index < value.length; index++) {
            await renderSection(`${formatFieldName(key)} ${index + 1}`, value[index], indent + 20);
          }
        }
      } else if (value && typeof value === 'object' && !(value instanceof File)) {
        await renderSection(formatFieldName(key), value, indent + 20);
      } else if (value !== null && value !== undefined && value !== '') {
        if (value instanceof File) {
          // It's a file - try to draw it as image
          await drawImage(value, key, indent);
        } else {
          // Regular text value
          drawKeyValue(key, String(value), indent);
        }
      }
    }
    y -= 10;
  };

  // Process each section
  for (const section of sections) {
    const sectionData: any = {};
    section.fields.forEach(field => {
      if (parsedData[field] !== undefined) {
        sectionData[field] = parsedData[field];
      }
    });
    if (Object.keys(sectionData).length > 0) {
      await renderSection(section.name, sectionData);
    }
  }

  // Add files section
  if (parsedFiles.length > 0) {
    y -= 6;
    drawLine('ATTACHED DOCUMENTS:', { bold: true, size: 14 });
    for (const { key, value } of parsedFiles) {
      await drawImage(value, key);
    }
  }

  y -= 16;
  drawLine('This application is confidential and for bank use only.', { size: 9 });

  const pdfBytes = await pdfDoc.save();
  console.log('PDF generated successfully (pdf-lib), size:', pdfBytes.length, 'bytes');
  return Buffer.from(pdfBytes);
}

export async function POST(request: NextRequest) {
  console.log('=== FORM SUBMISSION API CALLED ===');
  console.log('Request method:', request.method);
  console.log('Request URL:', request.url);

  try {
    console.log('=== FORM SUBMISSION STARTED ===');
    console.log('1. Parsing FormData...');
    const formData = await request.formData();
    console.log('FormData parsed successfully');

    // Check honeypot field
    const honeypot = formData.get('honeypot');
    console.log('2. Honeypot check:', honeypot ? 'filled (possible spam)' : 'empty (OK)');

    if (honeypot && honeypot.toString().trim() !== '') {
      console.log('Form rejected due to honeypot');
      return NextResponse.json(
        { success: false, message: 'Form submission rejected.' },
        { status: 400 }
      );
    }

    // Parse form data into nested object
    const { data: parsedData, files: parsedFiles } = parseFormData(formData);
    const formType = getFormType(parsedData);
    console.log('=== FORM TYPE DETECTED ===', formType);
    console.log('Parsed data formType:', parsedData.formType);
    let sections;
    if (formType === 'corporate') sections = corporateSections;
    else if (formType === 'quick-loan') sections = businessLoanSections;
    else sections = personalSections;

    // Log all form data (excluding files)
    console.log('3. Form data received:');
    for (const [key, value] of formData.entries()) {
      if (!(value instanceof File)) {
        console.log(`   ${key}: ${value}`);
      }
    }

    // Count files
    console.log(`Total files: ${parsedFiles.length}`);
    for (const { key, value } of parsedFiles) {
      console.log(`   File: ${key} - ${value.name} (${value.size} bytes, type: ${value.type})`);
    }

    console.log('4. Checking environment variables...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');
    console.log('EMAIL_TO:', process.env.EMAIL_TO || 'NOT SET');

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Missing required environment variables');
      return NextResponse.json(
        { success: false, message: 'Server configuration error. Please contact administrator.' },
        { status: 500 }
      );
    }

    console.log('5. Generating PDF from form data (pdf-lib)...');
    const pdfBuffer = await createApplicationPDF(formData);
    console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes');

    // Build plain text email content + collect original uploaded files as attachments
    console.log('5b. Building email text + collecting uploaded files...');
    
    // Build email content with sections
    const buildEmailSection = (sectionName: string, sectionData: any, indent: number = 0) => {
      let content = ' '.repeat(indent) + '## ' + sectionName + '\n';
      for (const [key, value] of Object.entries(sectionData)) {
        if (Array.isArray(value)) {
          // Check if it's an array of primitive values (strings/numbers/booleans)
          const isPrimitiveArray = value.every(item => 
            typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean'
          );
          
          if (isPrimitiveArray) {
            // Treat as a list of values, not nested sections
            content += ' '.repeat(indent + 2) + `${formatFieldName(key)}: ${value.join(', ')}\n`;
          } else {
            // Treat as array of objects
            value.forEach((item, index) => {
              content += buildEmailSection(`${formatFieldName(key)} ${index + 1}`, item, indent + 2);
            });
          }
        } else if (value && typeof value === 'object' && !(value instanceof File)) {
          content += buildEmailSection(formatFieldName(key), value, indent + 2);
        } else if (value !== null && value !== undefined && value !== '') {
          if (value instanceof File) {
            content += ' '.repeat(indent + 2) + `${formatFieldName(key)}: ${value.name} (${(value.size / 1024).toFixed(1)} KB)\n`;
          } else {
            content += ' '.repeat(indent + 2) + `${formatFieldName(key)}: ${value}\n`;
          }
        }
      }
      return content + '\n';
    };

    let emailContent = '';
    const uploadedFileAttachments: Array<{
      filename: string;
      content: Buffer;
      contentType?: string;
    }> = [];

    // Add files to attachments
    for (const { key, value } of parsedFiles) {
      const buffer = Buffer.from(await value.arrayBuffer());
      uploadedFileAttachments.push({
        filename: `${key}-${value.name}`,
        content: buffer,
        contentType: value.type || undefined,
      });
    }

    // Build email sections
    for (const section of sections) {
      const sectionData: any = {};
      section.fields.forEach(field => {
        if (parsedData[field] !== undefined) {
          sectionData[field] = parsedData[field];
        }
      });
      if (Object.keys(sectionData).length > 0) {
        emailContent += buildEmailSection(section.name, sectionData);
      }
    }

    // Add files section to email
    if (parsedFiles.length > 0) {
      emailContent += '## ATTACHED DOCUMENTS\n';
      for (const { key, value } of parsedFiles) {
        emailContent += `  - ${formatFieldName(key)}: ${value.name} (${(value.size / 1024).toFixed(1)} KB, ${value.type})\n`;
      }
    }

    // Parse multiple email addresses (comma-separated)
    console.log('6. Parsing email recipients...');
    const recipientsEnv = formType === 'quick-loan' ? process.env.LOAN_EMAIL_TO : process.env.EMAIL_TO;
    const recipients = recipientsEnv
      ? recipientsEnv.split(',').map(email => email.trim()).filter(email => email && email.includes('@'))
      : [];

    // Fallback to EMAIL_USER if no valid recipients
    if (recipients.length === 0 && process.env.EMAIL_USER) {
      recipients.push(process.env.EMAIL_USER);
    }

    console.log('Recipients:', recipients);
    console.log('Recipient count:', recipients.length);

    if (recipients.length === 0) {
      console.error('No valid email recipients found');
      return NextResponse.json(
        { success: false, message: 'Server configuration error. No email recipients configured.' },
        { status: 500 }
      );
    }

    console.log('7. Creating email transporter...');
    let transporter;
    try {
      transporter = createTransporter();
      console.log('Transporter created successfully');
    } catch (transporterError) {
      console.error('Transporter creation failed:', transporterError);
      throw new Error('Email service configuration error');
    }

    let emailSubject;
    let pdfFilename;
    let formTypeText;
    if (formType === 'quick-loan') {
      emailSubject = 'New Quick Loan Application - PDF';
      pdfFilename = `quick_loan_application_${Date.now()}.pdf`;
      formTypeText = 'quick loan';
    } else if (formType === 'corporate') {
      emailSubject = 'New Corporate Account Opening Application - PDF';
      pdfFilename = `corporate_account_application_${Date.now()}.pdf`;
      formTypeText = 'corporate account opening';
    } else {
      emailSubject = 'New Personal Account Creation Application - PDF';
      pdfFilename = `personal_account_application_${Date.now()}.pdf`;
      formTypeText = 'personal account opening';
    }
    
    console.log('=== EMAIL & PDF INFO ===');
    console.log('Email Subject:', emailSubject);
    console.log('PDF Filename:', pdfFilename);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipients,
      subject: emailSubject,
      text:
        `Please find attached the complete ${formTypeText} application as a PDF document.\n\n` +
        '--- FORM DETAILS ---\n\n' +
        emailContent +
        '\n--- END ---\n',
      attachments: [
        {
          filename: pdfFilename,
          content: pdfBuffer,
          contentType: 'application/pdf',
        }
        // Attach original uploaded files too
        ,
        ...uploadedFileAttachments,
      ],
    };

    console.log('8. Sending email...');
    console.log('From:', mailOptions.from);
    console.log('To:', mailOptions.to);
    console.log('Subject:', mailOptions.subject);
    console.log('Attachment size:', pdfBuffer.length, 'bytes');
    console.log('Uploaded file attachments:', uploadedFileAttachments.length);

    const emailResult = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
    console.log('Message ID:', emailResult.messageId);
    console.log('Recipients:', recipients.join(', '));

    console.log('=== FORM SUBMISSION COMPLETED SUCCESSFULLY ===');

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully! PDF sent via email.'
    });

  } catch (error) {
    console.error('=== FORM SUBMISSION ERROR ===');
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
        console.error('Network/SMTP connection error');
        return NextResponse.json(
          { success: false, message: 'Email service temporarily unavailable. Please try again later.' },
          { status: 503 }
        );
      }

      if (error.message.includes('Authentication failed')) {
        console.error('Email authentication failed');
        return NextResponse.json(
          { success: false, message: 'Email service configuration error. Please contact administrator.' },
          { status: 500 }
        );
      }

      if (error.message.includes('Invalid login')) {
        console.error('Invalid email credentials');
        return NextResponse.json(
          { success: false, message: 'Email service authentication error. Please contact administrator.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while processing your application. Please try again.',
        ...(IS_DEV
          ? {
              debug: {
                errorType: error instanceof Error ? error.constructor.name : typeof error,
                errorMessage: error instanceof Error ? error.message : String(error),
                errorStack: error instanceof Error ? error.stack : undefined,
              },
            }
          : {}),
      },
      { status: 500 }
    );
  }
}

