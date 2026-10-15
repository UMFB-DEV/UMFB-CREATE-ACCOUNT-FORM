import { z } from 'zod';
import { FIXED_DEPOSIT_TENORS } from './fixedDeposit';

// File validation schema - Make validation more lenient
const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: 'File size must be less than 5MB',
  });
// File type validation helpers
const imageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
const documentTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

const imageFileSchema = fileSchema.refine(
  (file) => imageTypes.includes(file.type),
  { message: 'File must be a valid image (JPEG, JPG, PNG)' }
);

const documentFileSchema = fileSchema.refine(
  (file) => documentTypes.includes(file.type),
  { message: 'File must be a valid document (PDF, JPEG, JPG, PNG)' }
);

// Step 1: Personal Information Schema
export const personalInfoSchema = z.object({
  accountType: z.enum([
    'CORPORATE CURRENT ACCOUNT',
    'DAILY SAVINGS ACCOUNT',
    'GROUP SAVINGS ACCOUNT',
    'JOLLY BOUNTY',
    'JOLLY FLEX',
    'JOLLY SUPER',
    'LOAN EQUITY CONTRIBUTION-MANDATORY ACCOUNT',
    'MUTUAL FUNDS INVESTMENT ACCOUNT',
    'MYGOAL TARGET SAVINGS',
    'MYumbrella TERGET SAVINGS ACCOUNT',
    'PRESTIGE TARGET SAVINGS QR-CODE SAVINGS ACCOUNT',
    'REGULAR SAVINGS ACCOUNT',
    'SME FLEX ACCOUNT',
    'STAFF CURRENT ACCOUNT',
    'STAFF SAVINGS ACCOUNT'
  ], {
    message: 'Please select an account type',
  }),
  referer: z.string().min(1, 'Referer is required'),
  branch: z.string().min(1, 'Branch is required'),
  gender: z.enum(['Male', 'Female', 'Other'], {
    message: 'Please select a gender',
  }),
  title: z.enum(['Mr', 'Mrs', 'Miss', 'Dr', 'Prof'], {
    message: 'Please select a title',
  }),
  maritalStatus: z.enum(['Single', 'Married', 'Other'], {
    message: 'Please select marital status',
  }),
  lastName: z.string().min(1, 'Last name is required'),
  otherNames: z.string().min(1, 'Other names are required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  address: z.string().min(1, 'Address is required'),
  placeOfBirth: z.string().min(1, 'Place of birth is required'),
  stateOfOrigin: z.string().min(1, 'State of origin is required'),
  lga: z.string().min(1, 'LGA is required'),
  bvn: z.string().min(11, 'BVN must be 11 digits').max(11, 'BVN must be 11 digits'),
  nin: z.string().min(11, 'NIN must be 11 digits').max(11, 'NIN must be 11 digits'),
  mothersName: z.string().min(1, "Mother's name is required"),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

// Step 2: Employment Information Schema
export const employmentInfoSchema = z.object({
  employersName: z.string().min(1, "Employer's name is required"),
  employersCountry: z.string().min(1, "Employer's country is required"),
  businessSector: z.string().min(1, 'Business sector is required'),
  meansOfIdentification: z.string().min(1, 'Means of identification is required'),
  politicallyExposed: z.enum(['Yes', 'No'], {
    message: 'Please select if politically exposed',
  }),
});

// Step 3: Next of Kin Schema
export const nextOfKinSchema = z.object({
  nextOfKinName: z.string().min(1, 'Next of kin name is required'),
  nextOfKinPhone: z.string().min(10, 'Next of kin phone must be at least 10 digits'),
  nextOfKinEmail: z.string().email('Please enter a valid email for next of kin').optional().or(z.literal('')),
  nextOfKinRelationship: z.string().min(1, 'Relationship is required'),
});

// Step 4: Spouse Information Schema
export const spouseInfoSchema = z.object({
  spouseSurname: z.string().optional(),
  spouseOtherNames: z.string().optional(),
  spouseAddress: z.string().optional(),
});

// Step 5: File Uploads Schema
export const fileUploadsSchema = z.object({
  idDocument: documentFileSchema,
  passportPhoto: imageFileSchema,
  signature: imageFileSchema,
  utilityBill: documentFileSchema,
});

// Complete form schema
export const contactFormSchema = personalInfoSchema
  .merge(employmentInfoSchema)
  .merge(nextOfKinSchema)
  .merge(spouseInfoSchema)
  .merge(fileUploadsSchema)
  .extend({
    honeypot: z.string().optional(), // Anti-spam honeypot field
  });

export const atmApplicationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .regex(/^[\p{L}\p{M}' -]+$/u, 'First name can only contain letters, spaces, apostrophes, and hyphens'),
  lastName: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .regex(/^[\p{L}\p{M}' -]+$/u, 'Last name can only contain letters, spaces, apostrophes, and hyphens'),
  accountNumber: z.string().trim().regex(/^\d{10}$/, 'Account number must be exactly 10 digits'),
  phoneNumber: z.string().trim().regex(/^\d{11}$/, 'Phone number must be exactly 11 digits'),
  honeypot: z.string().optional(),
});

export const fixedDepositSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  accountNumber: z.string().trim().regex(/^\d{10}$/, 'Account number must be exactly 10 digits'),
  amount: z
    .string()
    .trim()
    .regex(/^\d+(?:\.\d{1,2})?$/, 'Enter a valid amount greater than zero')
    .refine((value) => Number(value) >= 500_000, 'Minimum fixed deposit amount is ₦500,000'),
  tenor: z.enum(FIXED_DEPOSIT_TENORS, {
    message: 'Please select a tenor',
  }),
  honeypot: z.string().optional(),
});

// Type definitions
export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type EmploymentInfo = z.infer<typeof employmentInfoSchema>;
export type NextOfKin = z.infer<typeof nextOfKinSchema>;
export type SpouseInfo = z.infer<typeof spouseInfoSchema>;
export type FileUploads = z.infer<typeof fileUploadsSchema>;
export type ContactForm = z.infer<typeof contactFormSchema>;
export type AtmApplication = z.infer<typeof atmApplicationSchema>;
export type FixedDeposit = z.infer<typeof fixedDepositSchema>;
