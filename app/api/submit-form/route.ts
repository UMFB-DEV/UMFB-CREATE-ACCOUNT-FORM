import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { PDFDocument as PDFLibDocument, StandardFonts, rgb } from 'pdf-lib';
import fetch from 'node-fetch';
import { readFileSync } from 'fs';
import { join } from 'path';
import { atmApplicationSchema, fixedDepositSchema } from '@/lib/validation';
import { getFixedDepositRate } from '@/lib/fixedDeposit';

console.log('=== API ROUTE LOADED ===');
console.log('Environment check:');
console.log('- EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
console.log('- EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');
console.log('- EMAIL_TO:', process.env.EMAIL_TO || 'NOT SET');

// Load environment variables
dotenv.config();

const IS_DEV = process.env.NODE_ENV !== 'production';
const EMAIL_SEND_TIMEOUT_MS = 15000;

// Create email transporter with fallback
const createTransporter = () => {
  console.log('Creating email transporter...');
  
  // Try custom SMTP first
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.SMTP_HOST && process.env.SMTP_PORT) {
    console.log('Using custom SMTP settings');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT == "465",
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
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
  }

  // Fall back to Gmail-style if SMTP not set (check if EMAIL_USER and EMAIL_PASS exist)
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    console.log('Using Gmail SMTP fallback');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    return transporter;
  }

  // If no email config, throw error
  throw new Error('Missing email configuration - check EMAIL_USER and EMAIL_PASS environment variables');
};

async function sendMailWithTimeout(transporter: nodemailer.Transporter, mailOptions: nodemailer.SendMailOptions) {
  return Promise.race([
    transporter.sendMail(mailOptions),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Email send timed out after ${EMAIL_SEND_TIMEOUT_MS}ms`)), EMAIL_SEND_TIMEOUT_MS);
    }),
  ]);
}

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
    let parsedValue: any = value;
    if (!(value instanceof File)) {
      const lowerValue = String(value).toLowerCase().trim();
      if (lowerValue === 'true' || lowerValue === 'on' || lowerValue === 'yes') {
        parsedValue = true;
      } else if (lowerValue === 'false' || lowerValue === 'off' || lowerValue === 'no') {
        parsedValue = false;
      }
    }
    current[keys[keys.length - 1]] = parsedValue;
    
    // Also keep track of files for attachments
    if (value instanceof File) {
      files.push({ key, value });
    }
  }

  return { data: result, files };
}

// Labels used in the corporate form.  Keeping these in one place makes the PDF
// and email as clear to a reader as the form the customer completed.
const fieldLabels: Record<string, string> = {
  accountOfficer: 'Name of Account Officer',
  verifiedAddress2: 'Confirmed Business/Company Address',
  hasSociallyFinanciallyDisadvantagedDirector: 'Is any director/signatory socially or financially disadvantaged?',
  disadvantagedCustomerDocuments: 'Documents obtained for a socially/financially disadvantaged customer',
  enjoysTieredKyc: 'Does the customer enjoy tiered KYC requirements?',
  tieredKycRiskCategory: 'Customer Risk Category',
  isApplicantPoliticallyExposed: 'Is the applicant a politically exposed person?',
  isApplicantFinanciallyExposed: 'Is the applicant a financially exposed person?',
  companyName: 'Company Name / Account Name',
  registrationNumber: 'RC/Business Registration Number',
  dateOfIncorporation: 'Date of Incorporation',
  registeredOfficeAddress: 'Registered Office Address',
  businessAddress: 'Business/Office Address',
  phoneNumber: 'Phone Number',
  emailAddress: 'Email Address',
  website: 'Website (if any)',
  taxIdentificationNumber: 'Tax Identification Number (TIN)',
  companyType: 'Type of Company',
  boardResolutionMeetingDate: 'Meeting Date',
  boardResolutionCompanyName: 'Company Name',
  boardResolutionCompanySecretary: 'Company Secretary',
  boardResolutionMandate: 'Mandate of the Company',
  boardResolutionDirectors: 'List of Directors Present',
  boardResolutionSignatories: 'Signatories to the Account',
  accountSignatories: 'Account Signatories',
  directorsDetails: 'Directors / Executives',
  otherBankAccounts: 'Other Bank Accounts',
  declarationCompanyName: 'Company Name',
  declarationDate: 'Date',
  declarationDirectorName: 'Director Name',
  declarationDirectorSignature: 'Director Signature',
  declarationSecretaryName: 'Secretary Name',
  declarationSecretarySignature: 'Secretary Signature',
  declarationAgreeTerms: 'Agreement to Terms and Conditions',
  referenceForm: 'Reference Form',
  name: 'Full Name',
  dateOfBirth: 'Date of Birth',
  address: 'Residential Address',
  phone: 'Phone Number',
  email: 'Email Address',
  idType: 'Identification Type',
  idNumber: 'ID Number',
  idExpiryDate: 'ID Expiry Date',
  passportPhoto: 'Passport Photo',
  idCard: 'ID Card',
  position: 'Position/Title',
  bankName: 'Name and Address of Bank/Branch',
  accountName: 'Account Name',
  accountNumber: 'Account Number',
  fullName: 'Full Name',
  status: 'Status',
};

function readableKey(key: string): string {
  return fieldLabels[key] ?? key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
}

// Convert technical multipart keys such as accountSignatories[0][passportPhoto]
// into a label a non-technical reader can understand.
function formatFieldName(key: string): string {
  const parts = key.match(/[^\[\]]+/g) || [key];
  if (parts.length >= 3 && /^\d+$/.test(parts[1])) {
    const collection = parts[0];
    const itemNumber = Number(parts[1]) + 1;
    const itemLabel = collection === 'accountSignatories'
      ? `Account Signatory ${itemNumber}`
      : collection === 'directorsDetails'
        ? `Director/Executive ${itemNumber}`
        : `${readableKey(collection).replace(/s$/, '')} ${itemNumber}`;
    return `${itemLabel} — ${readableKey(parts[parts.length - 1])}`;
  }
  return readableKey(parts[parts.length - 1]);
}

// Corporate form sections
const corporateSections = [
  { name: '1. ADDRESS VERIFICATION', fields: ['accountOfficer', 'verifiedAddress2'] },
  { name: '2. FINANCIAL INCLUSION', fields: ['hasSociallyFinanciallyDisadvantagedDirector', 'disadvantagedCustomerDocuments', 'enjoysTieredKyc', 'tieredKycRiskCategory'] },
  { name: '3. PEP/FEP CHECK', fields: ['isApplicantPoliticallyExposed', 'isApplicantFinanciallyExposed'] },
  { name: '4. COMPANY DETAILS', fields: ['companyName', 'accountType', 'registrationNumber', 'dateOfIncorporation', 'registeredOfficeAddress', 'natureOfBusiness', 'phoneNumber', 'emailAddress', 'website', 'taxIdentificationNumber', 'businessAddress', 'businessPhone', 'businessEmail', 'companyType'] },
  { name: '5. BOARD RESOLUTION', fields: ['boardResolutionMeetingDate', 'boardResolutionCompanyName', 'boardResolutionCompanySecretary', 'boardResolutionMandate', 'boardResolutionDirectors', 'boardResolutionSignatories'] },
  { name: '6. ACCOUNT SIGNATORY DETAILS', fields: ['accountSignatories'] },
  { name: '7. DIRECTORS/EXECUTIVES DETAILS', fields: ['directorsDetails'] },
  { name: '8. OTHER BANK ACCOUNTS', fields: ['otherBankAccounts'] },
  { name: '9. DECLARATION', fields: ['declarationCompanyName', 'declarationDate', 'declarationDirectorName', 'declarationDirectorSignature', 'declarationSecretaryName', 'declarationSecretarySignature', 'declarationAgreeTerms'] },
  { name: '10. REFERENCE FORM', fields: ['referenceForm'] },
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

// ATM card application sections
const atmApplicationSections = [
  { name: 'APPLICANT DETAILS', fields: ['fullName', 'accountNumber', 'phoneNumber'] },
];

const fixedDepositSections = [
  { name: '', fields: ['name', 'accountNumber', 'amount', 'tenor', 'interestRate'] },
];

// Determine form type
function getFormType(data: any) {
  if (data.formType === 'corporate') return 'corporate';
  if (data.formType === 'business-loan') return 'quick-loan';
  if (data.formType === 'quick-loan') return 'quick-loan';
  if (data.formType === 'atm-application') return 'atm-application';
  if (data.formType === 'fixed-deposit') return 'fixed-deposit';
  if (data.formType === 'personal') return 'personal';
  
  // Fallback to field detection if formType not available
  if (data.companyName || data.registrationNumber) return 'corporate';
  if (data.business_name && data.loan_amount) return 'quick-loan';
  if (data.name && data.accountNumber && data.amount && data.tenor) return 'fixed-deposit';
  return 'personal';
}

// Function to create PDF from form data
async function createApplicationPDF(formData: FormData): Promise<Buffer> {
  console.log('Starting PDF generation with pdf-lib...');
  const { data: parsedData, files: parsedFiles } = parseFormData(formData);
  const formType = getFormType(parsedData);
  if (formType === 'atm-application') {
    parsedData.fullName = `${String(parsedData.firstName ?? '').trim()} ${String(parsedData.lastName ?? '').trim()}`.trim();
  }
  console.log('=== PDF GENERATION FORM TYPE ===', formType);

  if (formType === 'quick-loan') {
    // Load the business loan PDF template
    const templatePath = join(process.cwd(), 'public', 'BUSINESS_LOAN_FORM.pdf');
    const templateBytes = readFileSync(templatePath);
    const pdfDoc = await PDFLibDocument.load(templateBytes);

    // Get first page
    const [firstPage] = pdfDoc.getPages();
    const form = pdfDoc.getForm();

    // ------------------------------
    // Step 1: Fill all PDF fields on page 1
    // ------------------------------
    // Helper functions to set fields
    const setTextField = (name: string, value: any) => {
      if (value) {
        try {
          const field = form.getTextField(name);
          field.setText(String(value));
        } catch (e) {
          console.warn(`Could not set text field ${name}:`, e);
        }
      }
    };

    const setCheckBox = (name: string, checked: any) => {
      if (checked) {
        try {
          const field = form.getCheckBox(name);
          field.check();
        } catch (e) {
          console.warn(`Could not set checkbox ${name}:`, e);
        }
      }
    };

    // Client Information
    setCheckBox('new_client', parsedData.isNewClient);
    setCheckBox('recurrent_client', parsedData.isRecurringClient);
    setTextField('client_id_no', parsedData.clientIdNo);

    // Personal Information
    setTextField('first_name', parsedData.first_name);
    setTextField('middle_name', parsedData.middle_name);
    setTextField('last_name', parsedData.last_name);
    setTextField('date_of_birth', parsedData.date_of_birth);
    setTextField('type_of_id', parsedData.type_of_id);
    setTextField('id_number', parsedData.id_number);
    setTextField('sex', parsedData.sex);
    setTextField('bvn', parsedData.bvn);
    setTextField('nationality', parsedData.nationality);
    setTextField('telephone_1', parsedData.telephone_1);
    setTextField('telephone_2', parsedData.telephone_2);

    // Marital Status
    setCheckBox('marital_married', parsedData.marital_married);
    setCheckBox('marital_single', parsedData.marital_single);
    setCheckBox('marital_separated', parsedData.marital_separated);
    setCheckBox('marital_widow', parsedData.marital_widow);

    // Address
    setTextField('house_address', parsedData.house_address);
    setTextField('town', parsedData.town);
    setTextField('lga', parsedData.lga);
    setTextField('state', parsedData.state);

    // Spouse Information
    setTextField('spouse_first_name', parsedData.spouse_first_name);
    setTextField('spouse_middle_name', parsedData.spouse_middle_name);
    setTextField('spouse_last_name', parsedData.spouse_last_name);
    setTextField('spouse_date_of_birth', parsedData.spouse_date_of_birth);
    setTextField('spouse_telephone_1', parsedData.spouse_telephone_1);
    setTextField('spouse_telephone_2', parsedData.spouse_telephone_2);

    // Next of Kin
    setTextField('next_of_kin_name', parsedData.next_of_kin_name);
    setTextField('next_of_kin_sex', parsedData.next_of_kin_sex);
    setTextField('next_of_kin_relationship', parsedData.next_of_kin_relationship);
    setTextField('next_of_kin_tel', parsedData.next_of_kin_tel);

    // Business Information
    setTextField('business_name', parsedData.business_name);
    setCheckBox('biztype_no_registration', parsedData.biztype_no_registration);
    setCheckBox('biztype_sole_proprietor', parsedData.biztype_sole_proprietor);
    setCheckBox('biztype_ltd', parsedData.biztype_ltd);
    setCheckBox('biztype_partnership', parsedData.biztype_partnership);
    setTextField('business_address', parsedData.business_address);
    setTextField('business_activity', parsedData.business_activity);
    setTextField('location_since', parsedData.location_since);
    setTextField('business_since', parsedData.business_since);
    setTextField('tin_no', parsedData.tin_no);

    // Loan Information
    setTextField('loan_amount', parsedData.loan_amount);
    setTextField('loan_months', parsedData.loan_months);
    setTextField('monthly_repayment_capacity', parsedData.monthly_repayment_capacity);
    setCheckBox('purpose_working_capital', parsedData.purpose_working_capital);
    setCheckBox('purpose_fixed_asset', parsedData.purpose_fixed_asset);
    setCheckBox('purpose_new_activity', parsedData.purpose_new_activity);
    setTextField('investment_plan_detail', parsedData.investment_plan_detail);
    setCheckBox('existing_loan_yes', parsedData.existing_loan_yes);
    setCheckBox('existing_loan_no', parsedData.existing_loan_no);
    setCheckBox('heard_friend', parsedData.heard_friend);
    setCheckBox('heard_online_advertisement', parsedData.heard_online_advertisement);
    setCheckBox('heard_relationship_officer', parsedData.heard_relationship_officer);
    setCheckBox('heard_handbill', parsedData.heard_handbill);
    setCheckBox('heard_others', parsedData.heard_others);

    // Authorization (text fields)
    setTextField('applicant_signature_date', parsedData.applicant_signature_date);
    setTextField('ro_ca', parsedData.ro_ca);
    setTextField('official_date', parsedData.official_date);
    setTextField('assigned_ro', parsedData.assigned_ro);

    console.log('=== DEBUG: Filled page 1 fields ===');

    // ------------------------------
    // Step 2: Add logo to the FIRST PAGE of the PDF template (RIGHT SIDE)!
    // ------------------------------
    try {
      const logoPath = join(process.cwd(), 'public', 'Untitled-design-28.png');
      const logoBuffer = readFileSync(logoPath);
      const logoImage = await pdfDoc.embedPng(logoBuffer);
      // Clear the full top-right placeholder area, then fit the logo inside it.
      const logoBox = {
        x: 390,
        y: 770,
        width: 170,
        height: 62,
        padding: 8,
      };
      const maxLogoWidth = logoBox.width - logoBox.padding * 2;
      const maxLogoHeight = logoBox.height - logoBox.padding * 2;
      const logoScale = Math.min(
        maxLogoWidth / logoImage.width,
        maxLogoHeight / logoImage.height
      );
      const logoWidth = logoImage.width * logoScale;
      const logoHeight = logoImage.height * logoScale;

      firstPage.drawRectangle({
        x: logoBox.x,
        y: logoBox.y,
        width: logoBox.width,
        height: logoBox.height,
        color: rgb(1, 1, 1),
        borderColor: rgb(1, 1, 1),
        borderWidth: 1,
      });

      firstPage.drawImage(logoImage, {
        x: logoBox.x + (logoBox.width - logoWidth) / 2,
        y: logoBox.y + (logoBox.height - logoHeight) / 2,
        width: logoWidth,
        height: logoHeight,
      });
      console.log('Logo embedded in loan PDF placeholder box');
    } catch (logoError) {
      console.error('Failed to embed logo:', logoError);
    }

    // ------------------------------
    // Step 3: Add SECOND PAGE with the same branded field style as page 1
    // ------------------------------
    const secondPage = pdfDoc.addPage([595.28, 841.89]); // A4
    const { width: pageWidth, height: pageHeight } = secondPage.getSize();
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const brandBrown = rgb(0.482, 0.204, 0.204);
    const brandGreen = rgb(0.675, 0.824, 0.235);
    const paleGreen = rgb(0.96, 0.99, 0.9);
    const lightGray = rgb(0.95, 0.95, 0.95);
    const darkText = rgb(0.08, 0.08, 0.08);

    // Page header
    secondPage.drawRectangle({
      x: 0,
      y: pageHeight - 82,
      width: pageWidth,
      height: 82,
      color: brandBrown,
    });
    secondPage.drawRectangle({
      x: 0,
      y: pageHeight - 88,
      width: pageWidth,
      height: 6,
      color: brandGreen,
    });
    secondPage.drawText('LOAN APPLICATION APPROVALS', {
      x: 35,
      y: pageHeight - 39,
      size: 18,
      font: fontBold,
      color: rgb(1, 1, 1),
    });
    secondPage.drawText('For bank use only', {
      x: 35,
      y: pageHeight - 58,
      size: 10,
      font,
      color: rgb(1, 1, 1),
    });

    const approvalSections = [
      { title: 'TEAM LEAD', key: 'team_lead', fullApproval: true },
      { title: 'HEAD OF MARKETING', key: 'head_of_marketing', fullApproval: true },
      { title: 'COMPLIANCE', key: 'compliance', fullApproval: true },
      { title: "MD'S APPROVAL", key: 'md', fullApproval: false }
    ];
    const sectionInfo: Array<{title: string, key: string, startY: number, fullApproval: boolean}> = [];
    const sectionX = 35;
    const sectionWidth = pageWidth - 70;
    const sectionHeight = 152;
    const fieldHeight = 18;
    const signatureHeight = 34;
    const commentHeight = 34;
    let nextSectionStartY = pageHeight - 118;

    const drawFieldLabel = (label: string, x: number, y: number) => {
      secondPage.drawText(label, {
        x,
        y,
        size: 8,
        font: fontBold,
        color: brandBrown,
      });
    };

    const drawInputBox = (x: number, y: number, width: number, height: number) => {
      secondPage.drawRectangle({
        x,
        y,
        width,
        height,
        color: rgb(1, 1, 1),
        borderColor: brandBrown,
        borderWidth: 0.8,
      });
    };

    for (const section of approvalSections) {
      sectionInfo.push({ title: section.title, key: section.key, startY: nextSectionStartY, fullApproval: section.fullApproval });
      const sectionBottomY = nextSectionStartY - sectionHeight;

      secondPage.drawRectangle({
        x: sectionX,
        y: sectionBottomY,
        width: sectionWidth,
        height: sectionHeight,
        color: paleGreen,
        borderColor: brandBrown,
        borderWidth: 1,
      });
      secondPage.drawRectangle({
        x: sectionX,
        y: nextSectionStartY - 25,
        width: sectionWidth,
        height: 25,
        color: brandBrown,
      });
      secondPage.drawText(section.title, {
        x: sectionX + 12,
        y: nextSectionStartY - 17,
        size: 11,
        font: fontBold,
        color: rgb(1, 1, 1),
      });

      const rowOneY = nextSectionStartY - 62;
      const rowTwoY = nextSectionStartY - 94;
      const rowThreeY = nextSectionStartY - 130;

      if (section.fullApproval) {
        drawFieldLabel('Approved Amount', sectionX + 12, rowOneY + 22);
        drawInputBox(sectionX + 112, rowOneY + 16, 155, fieldHeight);

        drawFieldLabel('Approved Date', sectionX + 285, rowOneY + 22);
        drawInputBox(sectionX + 370, rowOneY + 16, 142, fieldHeight);

        drawFieldLabel('Name', sectionX + 12, rowTwoY + 22);
        drawInputBox(sectionX + 58, rowTwoY + 16, 454, fieldHeight);
      }

      drawFieldLabel('Signature', sectionX + 12, rowThreeY + 36);
      drawInputBox(sectionX + 12, rowThreeY - 2, 220, signatureHeight);

      drawFieldLabel('Comment', sectionX + 252, rowThreeY + 36);
      drawInputBox(sectionX + 252, rowThreeY - 2, 260, commentHeight);

      secondPage.drawRectangle({
        x: sectionX,
        y: sectionBottomY,
        width: sectionWidth,
        height: 5,
        color: brandGreen,
      });

      nextSectionStartY -= sectionHeight + 18;
    }

    // ------------------------------
    // Step 3: Flatten all original form fields so they become static!
    // ------------------------------
    console.log('=== DEBUG: Flattening form fields ===');
    form.flatten();
    // ------------------------------
    // Step 4: Save PDF and reload!
    // ------------------------------
    console.log('=== DEBUG: Saving PDF ===');
    const intermediatePdfBytes = await pdfDoc.save();
    const flattenedDoc = await PDFLibDocument.load(intermediatePdfBytes);
    const [flattenedFirstPage, flattenedSecondPage] = flattenedDoc.getPages();
    const flattenedForm = flattenedDoc.getForm();

    // ------------------------------
    // Step 4: ADD SIGNATURES FIRST on TOP of flattened PDF!
    // ------------------------------
    console.log('=== DEBUG: Adding signatures on top of flattened PDF ===');
    console.log('=== DEBUG: PARSED FILES ===', parsedFiles);

    // Helper function to embed signature image (supports PNG and JPG)
    const embedSignature = async (file: File | null, x1: number, y1: number, x2: number, y2: number, targetPage = flattenedFirstPage) => {
      console.log('=== DEBUG: EMBED SIGNATURE ===', { hasFile: !!file, x1, y1, x2, y2 });
      if (file) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          let image;
          
          if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
            image = await flattenedDoc.embedJpg(arrayBuffer);
          } else {
            image = await flattenedDoc.embedPng(arrayBuffer);
          }
          
          // Calculate exact width and height from field rect
          const fieldWidth = x2 - x1;
          const fieldHeight = y2 - y1;
          
          // Use the signature's original aspect ratio
          const imgAspectRatio = image.width / image.height;
          
          // Scale to fit the field height, but don't exceed field width
          let sigHeight = fieldHeight * 3; // Make it taller
          let sigWidth = sigHeight * imgAspectRatio;
          
          // If it's too wide, scale down to fit the field width
          if (sigWidth > fieldWidth * 2) {
            sigWidth = fieldWidth * 2;
            sigHeight = sigWidth / imgAspectRatio;
          }
          
          // Center the signature in the field
          const sigX = x1 + (fieldWidth - sigWidth) / 2;
          const sigY = y1 + (fieldHeight - sigHeight) / 2;
          
          targetPage.drawImage(image, {
            x: sigX,
            y: sigY,
            width: sigWidth,
            height: sigHeight,
          });
          
          console.log('=== DEBUG: SIGNATURE EMBEDDED ===');
        } catch (e) {
          console.error(`=== ERROR: Could not embed signature at (${x1}, ${y1}):`, e);
        }
      } else {
        console.log('=== DEBUG: NO SIGNATURE FILE ===');
      }
    };

    // Get the file uploads from formData
    const applicantSigFile = parsedFiles.find((f) => f.key === 'applicant_signature')?.value || null;
    const supervisorSigFile = parsedFiles.find((f) => f.key === 'supervisor_signature')?.value || null;

    // Signature positions from PDF field rects, adjusted for visibility:
    // Field rects are [x1, y1, x2, y2] in PDF coordinates (bottom-left origin)
    // Applicant signature: [141, 117.3898, 276, 128.3898]
    // Supervisor signature shifted further right: [250, 75.38976, 413.4309, 85.38976]
    await Promise.all([
      embedSignature(applicantSigFile, 141, 117.3898, 276, 128.3898),
      embedSignature(supervisorSigFile, 250, 75.38976, 413.4309, 85.38976),
    ]);

    // ------------------------------
    // Step 5: Add EDITABLE approval form fields on TOP of flattened second page
    // ------------------------------
    for (const info of sectionInfo) {
      const fieldKey = info.key;
      const startY = info.startY;
      const fullApproval = info.fullApproval;
      const rowOneY = startY - 62;
      const rowTwoY = startY - 94;
      const rowThreeY = startY - 130;

      if (fullApproval) {
        const amountField = flattenedForm.createTextField(`${fieldKey}_approved_amount`);
        amountField.addToPage(flattenedSecondPage, {
          x: sectionX + 116,
          y: rowOneY + 18,
          width: 147,
          height: 14,
          borderWidth: 0,
          backgroundColor: rgb(1, 1, 1),
          textColor: darkText,
        });
        amountField.setFontSize(10);

        const dateField = flattenedForm.createTextField(`${fieldKey}_approved_date`);
        dateField.addToPage(flattenedSecondPage, {
          x: sectionX + 374,
          y: rowOneY + 18,
          width: 134,
          height: 14,
          borderWidth: 0,
          backgroundColor: rgb(1, 1, 1),
          textColor: darkText,
        });
        dateField.setFontSize(10);

        const nameField = flattenedForm.createTextField(`${fieldKey}_name`);
        nameField.addToPage(flattenedSecondPage, {
          x: sectionX + 62,
          y: rowTwoY + 18,
          width: 446,
          height: 14,
          borderWidth: 0,
          backgroundColor: rgb(1, 1, 1),
          textColor: darkText,
        });
        nameField.setFontSize(10);
      }

      const commentField = flattenedForm.createTextField(`${fieldKey}_comment`);
      commentField.addToPage(flattenedSecondPage, {
        x: sectionX + 256,
        y: rowThreeY + 2,
        width: 252,
        height: 26,
        borderWidth: 0,
        backgroundColor: rgb(1, 1, 1),
        textColor: darkText,
      });
      commentField.enableMultiline();
      commentField.setFontSize(10);
    }

    // Save and return the final PDF
    const finalPdfBytes = await flattenedDoc.save();
    console.log('PDF generated successfully, size:', finalPdfBytes.length, 'bytes');
    return Buffer.from(finalPdfBytes);
  } else {
    // Original logic for other forms
    let sections;
    if (formType === 'corporate') sections = corporateSections;
    else if (formType === 'atm-application') sections = atmApplicationSections;
    else if (formType === 'fixed-deposit') sections = fixedDepositSections;
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
      const labelSize = 10;
      const valueSize = 11;
      const x = 50 + indent;
      const maxWidth = width - x - 50;

      if (formType === 'atm-application' || formType === 'fixed-deposit') {
        const formattedLabel = `${formatFieldName(label)}:`;
        const labelWidth = fontBold.widthOfTextAtSize(formattedLabel, labelSize);
        const valueGap = formType === 'fixed-deposit' ? 28 : 7;
        const requiredHeight = valueSize + 16;

        if (y - requiredHeight < 60) {
          page = pdfDoc.addPage([595.28, 841.89]);
          y = height - 50;
        }

        page.drawText(formattedLabel, {
          x,
          y,
          size: labelSize,
          font: fontBold,
          color: rgb(0, 0, 0),
        });
        page.drawText(value, {
          x: x + labelWidth + valueGap,
          y,
          size: valueSize,
          font,
          color: rgb(0, 0, 0),
          maxWidth: maxWidth - labelWidth - valueGap,
        });
        y -= requiredHeight;
        return;
      }

      const words = value.split(/\s+/).filter(Boolean);
      const lines: string[] = [];
      let line = '';

      for (const word of words) {
        const candidate = line ? `${line} ${word}` : word;
        if (line && font.widthOfTextAtSize(candidate, valueSize) > maxWidth) {
          lines.push(line);
          line = word;
        } else {
          line = candidate;
        }
      }
      if (line || lines.length === 0) lines.push(line);

      // Keep each field together where possible, and give the label its own line.
      // This prevents labels and answers from running into one another in email PDFs.
      const requiredHeight = labelSize + 7 + (lines.length * (valueSize + 4)) + 12;
      if (y - requiredHeight < 60) {
        page = pdfDoc.addPage([595.28, 841.89]);
        y = height - 50;
      }

      page.drawText(`${formatFieldName(label)}:`, { x, y, size: labelSize, font: fontBold, color: rgb(0, 0, 0) });
      y -= labelSize + 7;
      for (const valueLine of lines) {
        page.drawText(valueLine, { x: x + 10, y, size: valueSize, font, color: rgb(0, 0, 0) });
        y -= valueSize + 4;
      }
      y -= 8;
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
    if ((formType as any) === 'quick-loan') {
      subjectLine = 'New Quick Loan Application';
      formTitle = 'Quick Loan Application';
    } else if (formType === 'corporate') {
      subjectLine = 'New Corporate Account Opening Application';
      formTitle = 'Corporate Account Opening Application';
    } else if (formType === 'atm-application') {
      subjectLine = 'New ATM Card Application';
      formTitle = 'ATM Card Application';
    } else if (formType === 'fixed-deposit') {
      subjectLine = 'New Fixed Deposit Request';
      formTitle = 'Request for Fixed Deposit';
    } else {
      subjectLine = 'New Personal Account Creation Application';
      formTitle = 'Personal Account Opening Application';
    }

    /* drawLine('From: Unilag Microfinance Bank <info@unilagmfbank.com>', { bold: true }); */
    if (formType !== 'atm-application' && formType !== 'fixed-deposit') {
      drawLine(`Sent: ${new Date().toLocaleString()}`, { size: 10 });
    }
    /* drawLine('To: Unilag Microfinance Bank <accountopening@unilagmfbank.com>', { size: 10 }); */
 /*  drawLine(`Subject: ${subjectLine}`, { size: 10 }); */
 /*  y -= 10; */

    if (formType === 'atm-application') {
      const titleSize = 18;
      const titleWidth = fontBold.widthOfTextAtSize(formTitle, titleSize);
      const titleX = (width - titleWidth) / 2;
      page.drawText(formTitle, {
        x: titleX,
        y,
        size: titleSize,
        font: fontBold,
        color: rgb(0, 0, 0),
      });
      page.drawLine({
        start: { x: titleX, y: y - 3 },
        end: { x: titleX + titleWidth, y: y - 3 },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
      y -= titleSize + 6;
    } else {
      drawLine(formTitle, { bold: true, size: 18 });
    }
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
      if (sectionName) {
        drawLine(sectionName, { bold: true, size: 14, indent });
        y -= 5;
      }
      
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
    drawLine('NB: This application is confidential and for bank use only.', { size: 9 });

    const pdfBytes = await pdfDoc.save();
    console.log('PDF generated successfully (pdf-lib), size:', pdfBytes.length, 'bytes');
    return Buffer.from(pdfBytes);
  }
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
    if (formType === 'atm-application') {
      parsedData.fullName = `${String(parsedData.firstName ?? '').trim()} ${String(parsedData.lastName ?? '').trim()}`.trim();
    }
    console.log('=== FORM TYPE DETECTED ===', formType);
    console.log('Parsed data formType:', parsedData.formType);
    let sections;
    if (formType === 'corporate') sections = corporateSections;
    else if (formType === 'quick-loan') sections = businessLoanSections;
    else if (formType === 'atm-application') sections = atmApplicationSections;
    else if (formType === 'fixed-deposit') sections = fixedDepositSections;
    else sections = personalSections;

    if (formType === 'atm-application') {
      const validationResult = atmApplicationSchema.safeParse(parsedData);
      if (!validationResult.success) {
        return NextResponse.json(
          {
            success: false,
            message: validationResult.error.issues[0]?.message || 'Invalid ATM application details.',
          },
          { status: 400 }
        );
      }
    }

    if (formType === 'fixed-deposit') {
      const validationResult = fixedDepositSchema.safeParse(parsedData);
      if (!validationResult.success) {
        return NextResponse.json(
          {
            success: false,
            message: validationResult.error.issues[0]?.message || 'Invalid fixed deposit request details.',
          },
          { status: 400 }
        );
      }
      const interestRate = getFixedDepositRate(Number(parsedData.amount), String(parsedData.tenor));
      if (interestRate === null) {
        return NextResponse.json({ success: false, message: 'Minimum fixed deposit amount is ₦500,000 and a valid tenor is required.' }, { status: 400 });
      }
      // Always derive the rate on the server; never trust a client-provided value.
      parsedData.interestRate = `${interestRate}%`;
    }

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

    // Build plain text email content
    console.log('5b. Building email text...');
    
    // Build email content with sections
    const buildEmailSection = (sectionName: string, sectionData: any, indent: number = 0) => {
      let content = sectionName ? ' '.repeat(indent) + '## ' + sectionName + '\n' : '';
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
    
    // Prepare file attachments
    const fileAttachments: Array<{ filename: string; content: Buffer; contentType?: string }> = [];
    for (const { key, value } of parsedFiles) {
      const buffer = Buffer.from(await value.arrayBuffer());
      fileAttachments.push({
        filename: `${key}_${value.name}`,
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
        emailContent += `  - ${formatFieldName(key)}: ${value.name} (${(value.size / 1024).toFixed(1)} KB, ${value.type}) - attached\n`;
      }
    }

    // Parse multiple email addresses (comma-separated)
    console.log('6. Parsing email recipients...');
    const recipientsEnv = formType === 'quick-loan'
      ? process.env.LOAN_EMAIL_TO
      : formType === 'atm-application'
        ? process.env.ATM_EMAIL_TO
        : formType === 'fixed-deposit'
          ? (process.env.FIXED_DEPOSIT_EMAIL_TO || process.env.EMAIL_TO)
        : process.env.EMAIL_TO;
    const recipients = recipientsEnv
      ? recipientsEnv.split(',').map(email => email.trim()).filter(email => email && email.includes('@'))
      : [];

    // Fallback to EMAIL_USER if no valid recipients
    if (recipients.length === 0 && process.env.EMAIL_USER && formType !== 'atm-application') {
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
    } else if (formType === 'atm-application') {
      emailSubject = 'New ATM Card Application - PDF';
      pdfFilename = `atm_card_application_${Date.now()}.pdf`;
      formTypeText = 'ATM card';
    } else if (formType === 'fixed-deposit') {
      emailSubject = 'New Fixed Deposit Request - PDF';
      pdfFilename = `fixed_deposit_request_${Date.now()}.pdf`;
      formTypeText = 'fixed deposit request';
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
        },
        ...fileAttachments
      ],
    };

    console.log('8. Sending email...');
    console.log('From:', mailOptions.from);
    console.log('To:', mailOptions.to);
    console.log('Subject:', mailOptions.subject);
    console.log('Attachment size:', pdfBuffer.length, 'bytes');
    console.log('Number of file attachments:', fileAttachments.length);

    try {
      const emailResult = await sendMailWithTimeout(transporter, mailOptions);
      console.log('Email sent successfully!');
      console.log('Message ID:', (emailResult as any).messageId);
      console.log('Recipients:', recipients.join(', '));
    } catch (emailError) {
      console.error('Email delivery failed or timed out:', emailError);
      console.warn('Continuing with success response so the form submission is not blocked by email delivery issues.');
    }

    console.log('=== FORM SUBMISSION COMPLETED SUCCESSFULLY ===');

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully.'
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
