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
  console.log('Creating email transporter with Gmail service...');

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Missing EMAIL_USER or EMAIL_PASS environment variables');
  }

  console.log('EMAIL_USER set:', !!process.env.EMAIL_USER);
  console.log('EMAIL_PASS set:', !!process.env.EMAIL_PASS);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
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

// Function to create PDF from form data
async function createApplicationPDF(formData: FormData): Promise<Buffer> {
  console.log('Starting PDF generation with pdf-lib...');

  const pdfDoc = await PDFLibDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();
  let y = height - 50;

  const drawLine = (text: string, opts?: { bold?: boolean; size?: number }) => {
    const size = opts?.size ?? 11;
    const usedFont = opts?.bold ? fontBold : font;
    page.drawText(text, { x: 50, y, size, font: usedFont, color: rgb(0, 0, 0) });
    y -= size + 6;
    if (y < 60) {
      page = pdfDoc.addPage([595.28, 841.89]);
      y = height - 50;
    }
  };

  const drawKeyValue = (label: string, value: string) => {
    const size = 11;
    const uppercaseLabel = label.toUpperCase();
    const labelWidth = fontBold.widthOfTextAtSize(uppercaseLabel + ': ', size);
    page.drawText(uppercaseLabel + ': ', { x: 50, y, size, font: fontBold, color: rgb(0, 0, 0) });
    page.drawText(value, { x: 50 + labelWidth, y, size, font, color: rgb(0, 0, 0) });
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

  drawLine('From: Unilag Microfinance Bank <info@unilagmfbank.com>', { bold: true });
  drawLine(`Sent: ${new Date().toLocaleString()}`, { size: 10 });
  drawLine('To: Unilag Microfinance Bank <accountopening@unilagmfbank.com>', { size: 10 });
  drawLine('Subject: New Customer Registration', { size: 10 });
  y -= 10;

  drawLine('Account Opening Application', { bold: true, size: 18 });
  y -= 6;

  const files: { key: string; name: string; size: number; type: string }[] = [];

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      files.push({ key, name: value.name, size: value.size, type: value.type });
      continue;
    }
    if (key === 'honeypot') continue;
    const fieldName = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
    drawKeyValue(fieldName, String(value));
  }

  if (files.length) {
    y -= 6;
    drawLine('Attached Documents:', { bold: true, size: 13 });
    for (const f of files) {
      drawLine(`- ${f.key}: ${f.name} (${(f.size / 1024).toFixed(1)} KB, ${f.type})`);
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

    // Log all form data (excluding files)
    console.log('3. Form data received:');
    for (const [key, value] of formData.entries()) {
      if (!(value instanceof File)) {
        console.log(`   ${key}: ${value}`);
      }
    }

    // Count files
    let fileCount = 0;
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        fileCount++;
        console.log(`   File ${fileCount}: ${key} - ${value.name} (${value.size} bytes, type: ${value.type})`);
      }
    }
    console.log(`Total files: ${fileCount}`);

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
    let emailContent = '';
    const uploadedFileAttachments: Array<{
      filename: string;
      content: Buffer;
      contentType?: string;
    }> = [];

    for (const [key, value] of formData.entries()) {
      if (key === 'honeypot') continue;

      if (value instanceof File) {
        const buffer = Buffer.from(await value.arrayBuffer());
        uploadedFileAttachments.push({
          filename: `${key}-${value.name}`,
          content: buffer,
          contentType: value.type || undefined,
        });
        const label = key.replace(/([A-Z])/g, ' $1').trim().toUpperCase();
        emailContent += `${label}: ${value.name} (${value.size} bytes, ${value.type})\n`;
      } else {
        const label = key.replace(/([A-Z])/g, ' $1').trim().toUpperCase();
        emailContent += `${label}: ${value}\n`;
      }
    }

    // Parse multiple email addresses (comma-separated)
    console.log('6. Parsing email recipients...');
    const recipients = process.env.EMAIL_TO
      ? process.env.EMAIL_TO.split(',').map(email => email.trim()).filter(email => email && email.includes('@'))
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

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipients,
      subject: 'New Account Opening Application - PDF',
      text:
        'Please find attached the complete account opening application as a PDF document.\n\n' +
        '--- FORM DETAILS ---\n' +
        emailContent +
        '\n--- END ---\n',
      attachments: [
        {
          filename: `account_application_${Date.now()}.pdf`,
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

