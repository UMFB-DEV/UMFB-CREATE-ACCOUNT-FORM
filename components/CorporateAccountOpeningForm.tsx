'use client';

import { memo, useState, useCallback, type FormEvent } from 'react';
import { SignatureInput } from './SignatureInput';

const createItemId = () => Math.random().toString(36).slice(2, 10);

const initialFormData = {
  // BANK USE ONLY FIELDS
  verifiedAddress1: '',
  addressDescription1: '',
  comments1: '',
  verificationDate1: '',
  verifiedBy1: '',
  verifiedBySignature1: '',
  verifiedAddress2: '',
  addressDescription2: '',
  comments2: '',
  verificationDate2: '',
  verifiedBy2: '',
  verifiedBySignature2: '',
  hasSociallyFinanciallyDisadvantagedDirector: '',
  disadvantagedCustomerDocuments: '',
  enjoysTieredKyc: '',
  tieredKycRiskCategory: '',
  isApplicantPoliticallyExposed: '',
  isApplicantFinanciallyExposed: '',
  tierLevel: '',
  hasBvn: false,
  bvnNumber: '',
  bvnVerified: false,
  bvnVerificationDate: '',
  accountCategory: '',
  accountPurpose: '',
  estimatedMonthlyTransactions: '',
  estimatedMonthlyVolume: '',
  authOfficerName: '',
  authOfficerSignature: '',
  authOfficerDate: '',
  isPep: false,
  pepCategory: '',
  pepName: '',
  pepPosition: '',
  pepInstitution: '',
  pepRelationship: '',
  pepCountry: '',
  hasPepRelative: false,
  pepRelativeName: '',
  pepRelativeRelationship: '',
  pepRelativePosition: '',
  pepRelativeInstitution: '',
  isFep: false,
  fepCategory: '',
  fepName: '',
  fepPosition: '',
  fepInstitution: '',
  fepRelationship: '',
  sourceOfFunds: '',
  sourceOfWealth: '',
  additionalInfo: '',
  pepOfficerName: '',
  pepOfficerSignature: '',
  pepOfficerDate: '',
  introducerName: '',
  introducerAddress: '',
  introducerPhone: '',
  introducerOccupation: '',
  introducerRelationship: '',
  introducerBankName: '',
  introducerAccountNumber: '',
  introducerAccountName: '',
  introducerBranch: '',
  introductionDate: '',
  yearsKnown: '',
  introducerComments: '',
  isVerified: false,
  introducerVerificationDate: '',
  introducerVerifiedBy: '',
  staffName: '',
  staffSignature: '',
  staffDate: '',

  // EXISTING FIELDS
  companyName: '',
  accountOfficer: '',
  registrationNumber: '',
  dateOfIncorporation: '',
  registeredOfficeAddress: '',
  natureOfBusiness: '',
  phoneNumber: '',
  emailAddress: '',
  website: '',
  taxIdentificationNumber: '',
  businessAddress: '',
  businessPhone: '',
  businessEmail: '',
  companyType: '',
  annualTurnover: '',
  annualCurrency: '',
  servicesRequired: [] as string[],
  chequeConfirmation: '',
  chequeThreshold: '',
  withdrawalLimit: '',
  transactionLimit: '',
  dualAuthorisation: false,
  accountType: '',
  boardResolutionMeetingDate: '',
  boardResolutionCompanyName: '',
  boardResolutionCompanySecretary: '',
  boardResolutionMandate: '',
  boardResolutionDirectors: Array.from({ length: 6 }, () => ({ id: createItemId(), name: '', position: '' })),
  boardResolutionSignatories: Array.from({ length: 5 }, () => ({ id: createItemId(), name: '', category: '', specimenSignature: null as File | null })),
  accountSignatories: [
    {
      id: createItemId(),
      name: '',
      dateOfBirth: '',
      nationality: '',
      occupation: '',
      address: '',
      phone: '',
      email: '',
      idType: '',
      idNumber: '',
      idExpiryDate: '',
      relationshipToCompany: '',
      specimenSignature: null as File | null,
      actualSignature: null as File | null,
      passportPhoto: null as File | null,
      idCard: null as File | null,
    },
  ],
  directorsDetails: [
    {
      id: createItemId(),
      name: '',
      position: '',
      dateOfBirth: '',
      nationality: '',
      address: '',
      phone: '',
      email: '',
      idType: '',
      idNumber: '',
      idExpiryDate: '',
      passportPhoto: null as File | null,
      idCard: null as File | null,
    },
  ],
  otherBankAccounts: [
    {
      id: createItemId(),
      bankName: '',
      branch: '',
      accountName: '',
      accountNumber: '',
      status: 'active',
    },
  ],
  setOffCompanyName: '',
  setOffDate: '',
  setOffDirectorName: '',
  setOffDirectorSignature: '',
  setOffWitnessName: '',
  setOffWitnessSignature: '',
  soleProprietorName: '',
  soleProprietorDateOfBirth: '',
  soleProprietorNationality: '',
  soleProprietorOccupation: '',
  soleProprietorAddress: '',
  soleProprietorPhone: '',
  soleProprietorEmail: '',
  soleProprietorBusinessName: '',
  soleProprietorBusinessRegistrationNumber: '',
  soleProprietorBusinessAddress: '',
  soleProprietorBusinessPhone: '',
  soleProprietorYearsInBusiness: '',
  soleProprietorIdType: '',
  soleProprietorIdNumber: '',
  soleProprietorIdExpiryDate: '',
  authorizedSignatory1: '',
  authorizedSignatory1Date: '',
  authorizedSignatory1Signature: '',
  authorizedSignatory2: '',
  authorizedSignatory2Date: '',
  authorizedSignatory2Signature: '',
  declarationCompanyName: '',
  declarationDate: '',
  declarationDirectorName: '',
  declarationDirectorSignature: null as File | null,
  declarationSecretaryName: '',
  declarationSecretarySignature: null as File | null,
  declarationAgreeTerms: false,
  referenceForm: null as File | null,
};

const serviceOptions = [
  'Current Account',
  'Savings Account',
  'Domiciliary Account',
  'Internet Banking',
  'Mobile Banking',
  'Cheque Book Facility',
  'Statement of Account',
  'Corporate Card',
  'Payroll Services',
  'Trade Services',
  'Standing Order',
  'Direct Debit',
  'SMS Alert',
  'Email Alert',
];

const accountTypeOptions = [
  { value: 'current', label: 'Current Account' },
  { value: 'savings', label: 'Savings Account' },
  { value: 'domiciliary', label: 'Domiciliary Account' },
];

const companyTypeOptions = [
  { value: 'public', label: 'Public Limited Company' },
  { value: 'private', label: 'Private Limited Company' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'sole', label: 'Sole Proprietorship' },
  { value: 'government', label: 'Government Agency' },
  { value: 'others', label: 'Others' },
];

const idTypeOptions = [
  { value: 'international', label: 'International Passport' },
  { value: 'national', label: 'National ID Card' },
  { value: 'drivers', label: "Driver's License" },
  { value: 'voter', label: "National Voter's Card" },
];

const relationshipOptions = [
  { value: 'director', label: 'Director' },
  { value: 'secretary', label: 'Company Secretary' },
  { value: 'employee', label: 'Employee' },
  { value: 'promoter', label: 'Promoter' },
  { value: 'trustee', label: 'Trustee' },
  { value: 'other', label: 'Other' },
];

const signatoryCategoryOptions = [
  { value: 'sole', label: 'Sole Signatory' },
  { value: 'joint', label: 'Joint Signatory' },
  { value: 'anyone', label: 'Any One to Sign' },
  { value: 'mandate', label: 'Mandate' },
];

const InputRow = memo(function InputRow({
  label,
  name,
  value,
  placeholder,
  required = false,
  type = 'text',
  onChange,
  maxLength,
}: {
  label: string;
  name: string;
  value: string | number | boolean | undefined | null;
  placeholder?: string;
  required?: boolean;
  type?: string;
  onChange: (name: string, value: string) => void;
  maxLength?: number;
}) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold text-gray-700 mb-2">
        {label}
        {required ? <span className="text-[#7B3434] ml-1">*</span> : null}
      </label>
      <input
        type={type}
        name={name}
        value={value != null ? String(value) : ''}
        required={required}
        placeholder={placeholder}
        onChange={(event) => onChange(name, event.target.value)}
        autoComplete="off"
        className="rounded-2xl border border-gray-300 px-4 py-3 text-sm text-black outline-none transition focus:border-[#7B3434] focus:shadow-sm"
        maxLength={maxLength}
      />
    </div>
  );
});

const TextAreaRow = memo(function TextAreaRow({
  label,
  name,
  value,
  placeholder,
  required = false,
  rows = 3,
  onChange,
}: {
  label: string;
  name: string;
  value: string | undefined | null;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  onChange: (name: string, value: string) => void;
}) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold text-gray-700 mb-2">
        {label}
        {required ? <span className="text-[#7B3434] ml-1">*</span> : null}
      </label>
      <textarea
        name={name}
        value={value ?? ''}
        required={required}
        placeholder={placeholder}
        rows={rows}
        onChange={(event) => onChange(name, event.target.value)}
        spellCheck="false"
        className="rounded-2xl border border-gray-300 px-4 py-3 text-sm text-black outline-none transition focus:border-[#7B3434] focus:shadow-sm resize-vertical"
      />
    </div>
  );
});

const SelectRow = memo(function SelectRow({
  label,
  name,
  value,
  options,
  required = false,
  onChange,
}: {
  label: string;
  name: string;
  value: string | undefined | null;
  options: { value: string; label: string }[];
  required?: boolean;
  onChange: (name: string, value: string) => void;
}) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold text-gray-700 mb-2">
        {label}
        {required ? <span className="text-[#7B3434] ml-1">*</span> : null}
      </label>
      <select
        name={name}
        value={value ?? ''}
        required={required}
        onChange={(event) => onChange(name, event.target.value)}
        className="rounded-2xl border border-gray-300 px-4 py-3 text-sm text-black outline-none transition focus:border-[#7B3434] focus:shadow-sm"
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
});

const CheckboxRow = memo(function CheckboxRow({
  label,
  name,
  checked,
  onChange,
}: {
  label: string;
  name: string;
  checked: boolean | undefined | null;
  onChange: (name: string, value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 font-semibold text-sm text-gray-700 cursor-pointer">
      <input
        type="checkbox"
        name={name}
        checked={!!checked}
        onChange={(event) => onChange(name, event.target.checked)}
        className="h-4 w-4 cursor-pointer accent-[#7B3434]"
      />
      {label}
    </label>
  );
});

const AddressVerificationSection = memo(function AddressVerificationSection({
  formData,
  updateField,
}: any) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#7B3434]">A. ADDRESS VERIFICATION / VISITATION DETAILS</h2>
      </div>

      <div className="space-y-6">
        <h3 className="font-semibold text-sm text-gray-700">First Verification</h3>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <TextAreaRow
              label="Verified Business/Company Address"
              name="verifiedAddress1"
              value={formData.verifiedAddress1}
              required
              placeholder="Enter the verified business/company address"
              onChange={updateField}
              rows={2}
            />
          </div>
          <div className="lg:col-span-2">
            <TextAreaRow
              label="Address Description and Findings"
              name="addressDescription1"
              value={formData.addressDescription1}
              required
              placeholder="Describe the address and findings during visitation"
              onChange={updateField}
              rows={3}
            />
          </div>
          <div className="lg:col-span-2">
            <TextAreaRow
              label="Comments"
              name="comments1"
              value={formData.comments1}
              required
              placeholder="Enter any additional comments or observations"
              onChange={updateField}
              rows={2}
            />
          </div>
          <InputRow
            label="Verification Date"
            name="verificationDate1"
            value={formData.verificationDate1}
            type="date"
            required
            onChange={updateField}
          />
          <InputRow
            label="Verified By"
            name="verifiedBy1"
            value={formData.verifiedBy1}
            placeholder="Enter name of verifier"
            required
            onChange={updateField}
          />
          <div className="lg:col-span-2">
            <SignatureInput
              label="Verifier Signature"
              value={formData.verifiedBySignature1}
              onChange={(value) => updateField('verifiedBySignature1', value)}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 pt-6 space-y-6">
        <h3 className="font-semibold text-sm text-gray-700">Second Verification (Confirmation)</h3>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <TextAreaRow
              label="I hereby confirm the existence of the prospective customer's Business office/company address at"
              name="verifiedAddress2"
              value={formData.verifiedAddress2}
              placeholder="Enter the confirmed business/company address"
              onChange={updateField}
              rows={2}
            />
          </div>
          <div className="lg:col-span-2">
            <TextAreaRow
              label="Address Description and Findings"
              name="addressDescription2"
              value={formData.addressDescription2}
              placeholder="Describe the address and findings during confirmation visitation"
              onChange={updateField}
              rows={3}
            />
          </div>
          <div className="lg:col-span-2">
            <TextAreaRow
              label="Comments"
              name="comments2"
              value={formData.comments2}
              placeholder="Enter any additional comments or observations"
              onChange={updateField}
              rows={2}
            />
          </div>
          <InputRow
            label="Verification Date"
            name="verificationDate2"
            value={formData.verificationDate2}
            type="date"
            onChange={updateField}
          />
          <InputRow
            label="Verified By"
            name="verifiedBy2"
            value={formData.verifiedBy2}
            placeholder="Enter name of verifier"
            onChange={updateField}
          />
          <div className="lg:col-span-2">
            <SignatureInput
              label="Verifier Signature"
              value={formData.verifiedBySignature2}
              onChange={(value) => updateField('verifiedBySignature2', value)}
            />
          </div>
        </div>
      </div>
    </section>
  );
});

const FinancialInclusionAuthenticationSection = memo(function FinancialInclusionAuthenticationSection({
  formData,
  updateField,
}: any) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#7B3434]">B. AUTHENTICATION FOR FINANCIAL INCLUSION</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <SelectRow
            label="i. Is any director/signatory to the account socially or financially disadvantaged?"
            name="hasSociallyFinanciallyDisadvantagedDirector"
            value={formData.hasSociallyFinanciallyDisadvantagedDirector}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
            required
            onChange={updateField}
          />
        </div>

        {formData.hasSociallyFinanciallyDisadvantagedDirector === 'yes' && (
          <div className="lg:col-span-2">
            <TextAreaRow
              label="ii. If the answer to i above is YES, state other documents obtained in line with the Bank's policy on socially/financially disadvantaged customer in compliance with regulation 77 (4) of AML/CFT Regulation 2013."
              name="disadvantagedCustomerDocuments"
              value={formData.disadvantagedCustomerDocuments}
              placeholder="State documents obtained"
              onChange={updateField}
              rows={3}
              required
            />
          </div>
        )}

        <div className="lg:col-span-2">
          <SelectRow
            label="iii. Does the customer enjoy tiered KYC requirements?"
            name="enjoysTieredKyc"
            value={formData.enjoysTieredKyc}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
            required
            onChange={updateField}
          />
        </div>

        {formData.enjoysTieredKyc === 'yes' && (
          <div className="lg:col-span-2">
            <SelectRow
              label="iv. If answer to question iii above is YES, identify the customer risk category."
              name="tieredKycRiskCategory"
              value={formData.tieredKycRiskCategory}
              options={[
                { value: 'low_risk', label: 'LOW RISK' },
                { value: 'medium_risk', label: 'MEDIUM RISK' },
                { value: 'high_risk', label: 'HIGH RISK' },
              ]}
              required
              onChange={updateField}
            />
          </div>
        )}
      </div>
    </section>
  );
});

const PoliticallyExposedPersonsSection = memo(function PoliticallyExposedPersonsSection({
  formData,
  updateField,
}: any) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#7B3434]">C. AUTHENTICATION FOR POLITICALLY / FINANCIALLY EXPOSED PERSONS</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SelectRow
          label="Is the applicant a politically exposed person?"
          name="isApplicantPoliticallyExposed"
          value={formData.isApplicantPoliticallyExposed}
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          required
          onChange={updateField}
        />
        <SelectRow
          label="Is the applicant a financially exposed person?"
          name="isApplicantFinanciallyExposed"
          value={formData.isApplicantFinanciallyExposed}
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          required
          onChange={updateField}
        />
      </div>
    </section>
  );
});

/*
        <div className="lg:col-span-2">
          <TextAreaRow
            label="Account Purpose"
            name="accountPurpose"
            value={formData.accountPurpose}
            required
            placeholder="Describe the purpose of the account"
            onChange={updateField}
            rows={2}
          />
        </div>

        <InputRow
          label="Estimated Monthly Transactions"
          name="estimatedMonthlyTransactions"
          value={formData.estimatedMonthlyTransactions}
          type="number"
          placeholder="Number of transactions"
          onChange={updateField}
        />

        <InputRow
          label="Estimated Monthly Volume (₦)"
          name="estimatedMonthlyVolume"
          value={formData.estimatedMonthlyVolume}
          type="number"
          placeholder="Enter estimated monthly volume"
          onChange={updateField}
        />

        <div className="lg:col-span-2 border-t border-gray-300 pt-6 space-y-6">
          <h3 className="font-semibold text-sm text-gray-700">Authentication Officer Details</h3>
          <div className="grid gap-6 lg:grid-cols-2">
            <InputRow
              label="Officer Name"
              name="authOfficerName"
              value={formData.authOfficerName}
              required
              placeholder="Enter officer name"
              onChange={updateField}
            />
            <div className="lg:col-span-2">
              <SignatureInput
                label="Officer Signature"
                value={formData.authOfficerSignature}
                onChange={(value) => updateField('authOfficerSignature', value)}
              />
            </div>
            <InputRow
              label="Date"
              name="authOfficerDate"
              value={formData.authOfficerDate}
              type="date"
              required
              onChange={updateField}
            />
          </div>
        </div>
      </div>
    </section>
  );
});
*/

/*
const PoliticallyExposedPersonsSection = memo(function PoliticallyExposedPersonsSection({
  formData,
  updateField,
}: any) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#7B3434]">C. AUTHENTICATION FOR POLITICALLY / FINANCIALLY EXPOSED PERSONS</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <CheckboxRow
            label="Is the customer a Politically Exposed Person (PEP)?"
            name="isPep"
            checked={formData.isPep}
            onChange={updateField}
          />
        </div>

        {formData.isPep && (
          <>
            <SelectRow
              label="PEP Category"
              name="pepCategory"
              value={formData.pepCategory}
              options={[
                { value: 'head_of_state', label: 'Head of State/Government' },
                { value: 'government_official', label: 'Senior Government Official' },
                { value: 'judicial', label: 'Judicial Official' },
                { value: 'military', label: 'Senior Military Officer' },
                { value: 'diplomat', label: 'Diplomat' },
                { value: 'state_owned', label: 'State-Owned Enterprise Official' },
                { value: 'political_party', label: 'Political Party Official' },
                { value: 'others', label: 'Others' },
              ]}
              required
              onChange={updateField}
            />
            <InputRow
              label="Country"
              name="pepCountry"
              value={formData.pepCountry}
              required
              placeholder="Enter country"
              onChange={updateField}
            />
            <InputRow
              label="PEP Full Name"
              name="pepName"
              value={formData.pepName}
              required
              placeholder="Enter full name"
              onChange={updateField}
            />
            <InputRow
              label="Position/Title"
              name="pepPosition"
              value={formData.pepPosition}
              required
              placeholder="Enter position"
              onChange={updateField}
            />
            <InputRow
              label="Institution/Organization"
              name="pepInstitution"
              value={formData.pepInstitution}
              required
              placeholder="Enter institution name"
              onChange={updateField}
            />
            <InputRow
              label="Relationship to Customer"
              name="pepRelationship"
              value={formData.pepRelationship}
              required
              placeholder="e.g., Director, Shareholder, Family"
              onChange={updateField}
            />
          </>
        )}

        <div className="lg:col-span-2 border-t border-gray-300 pt-6">
          <CheckboxRow
            label="Does the customer have any PEP relatives or close associates?"
            name="hasPepRelative"
            checked={formData.hasPepRelative}
            onChange={updateField}
          />
        </div>

        {formData.hasPepRelative && (
          <>
            <InputRow
              label="Relative/Associate Name"
              name="pepRelativeName"
              value={formData.pepRelativeName}
              placeholder="Enter full name"
              onChange={updateField}
            />
            <InputRow
              label="Relationship"
              name="pepRelativeRelationship"
              value={formData.pepRelativeRelationship}
              placeholder="e.g., Spouse, Child, Business Partner"
              onChange={updateField}
            />
            <InputRow
              label="Position/Title"
              name="pepRelativePosition"
              value={formData.pepRelativePosition}
              placeholder="Enter position"
              onChange={updateField}
            />
            <InputRow
              label="Institution/Organization"
              name="pepRelativeInstitution"
              value={formData.pepRelativeInstitution}
              placeholder="Enter institution name"
              onChange={updateField}
            />
          </>
        )}

        <div className="lg:col-span-2 border-t border-gray-300 pt-6">
          <CheckboxRow
            label="Is the customer a Financially Exposed Person (FEP)?"
            name="isFep"
            checked={formData.isFep}
            onChange={updateField}
          />
        </div>

        {formData.isFep && (
          <>
            <SelectRow
              label="FEP Category"
              name="fepCategory"
              value={formData.fepCategory}
              options={[
                { value: 'high_net_worth', label: 'High Net Worth Individual' },
                { value: 'business_magnate', label: 'Business Magnate' },
                { value: 'industry_leader', label: 'Industry Leader' },
                { value: 'others', label: 'Others' },
              ]}
              onChange={updateField}
            />
            <InputRow
              label="FEP Full Name"
              name="fepName"
              value={formData.fepName}
              placeholder="Enter full name"
              onChange={updateField}
            />
            <InputRow
              label="Position/Title"
              name="fepPosition"
              value={formData.fepPosition}
              placeholder="Enter position"
              onChange={updateField}
            />
            <InputRow
              label="Institution/Organization"
              name="fepInstitution"
              value={formData.fepInstitution}
              placeholder="Enter institution name"
              onChange={updateField}
            />
            <InputRow
              label="Relationship to Customer"
              name="fepRelationship"
              value={formData.fepRelationship}
              placeholder="e.g., Director, Shareholder"
              onChange={updateField}
            />
          </>
        )}

        <div className="lg:col-span-2">
          <TextAreaRow
            label="Source of Funds"
            name="sourceOfFunds"
            value={formData.sourceOfFunds}
            required
            placeholder="Describe the source of funds for the account"
            onChange={updateField}
            rows={2}
          />
        </div>
        <div className="lg:col-span-2">
          <TextAreaRow
            label="Source of Wealth"
            name="sourceOfWealth"
            value={formData.sourceOfWealth}
            placeholder="Describe the source of wealth"
            onChange={updateField}
            rows={2}
          />
        </div>
        <div className="lg:col-span-2">
          <TextAreaRow
            label="Additional Information"
            name="additionalInfo"
            value={formData.additionalInfo}
            placeholder="Any additional relevant information"
            onChange={updateField}
            rows={2}
          />
        </div>

        <div className="lg:col-span-2 border-t border-gray-300 pt-6 space-y-6">
          <h3 className="font-semibold text-sm text-gray-700">Authentication Officer Details</h3>
          <div className="grid gap-6 lg:grid-cols-2">
            <InputRow
              label="Officer Name"
              name="pepOfficerName"
              value={formData.pepOfficerName}
              required
              placeholder="Enter officer name"
              onChange={updateField}
            />
            <div className="lg:col-span-2">
              <SignatureInput
                label="Officer Signature"
                value={formData.pepOfficerSignature}
                onChange={(value) => updateField('pepOfficerSignature', value)}
              />
            </div>
            <InputRow
              label="Date"
              name="pepOfficerDate"
              value={formData.pepOfficerDate}
              type="date"
              required
              onChange={updateField}
            />
          </div>
        </div>
      </div>
    </section>
  );
});

*/
const CorporateVerificationAuthenticationStep = memo(function CorporateVerificationAuthenticationStep({
  formData,
  updateField,
}: any) {
  return (
    <div className="space-y-10">
      <div className="rounded-2xl border border-[#ACD23C] bg-[#f9fce8] px-4 py-3 text-sm text-gray-700">
        <strong className="text-[#7B3434]">For Bank Use Only:</strong> Contact your Relationship Officer or leave blank.
      </div>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-[#7B3434]">A. ADDRESS VERIFICATION</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <InputRow
            label="Name of Account Officer"
            name="accountOfficer"
            value={formData.accountOfficer}
            required
            placeholder="Enter account officer name"
            onChange={updateField}
          />
          <div className="lg:col-span-2">
            <TextAreaRow
              label="I hereby confirm the existence of the Business office/company address at"
              name="verifiedAddress2"
              value={formData.verifiedAddress2}
              required
              placeholder="Enter the confirmed business/company address"
              onChange={updateField}
              rows={3}
            />
          </div>
        </div>
      </section>

      <FinancialInclusionAuthenticationSection formData={formData} updateField={updateField} />
      <PoliticallyExposedPersonsSection formData={formData} updateField={updateField} />
    </div>
  );
});

const CustomerIntroducedBySection = memo(function CustomerIntroducedBySection({
  formData,
  updateField,
}: any) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#7B3434]">D. CUSTOMER INTRODUCED BY</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <h3 className="font-semibold text-sm text-gray-700 lg:col-span-2">Introducer Details</h3>

        <div className="lg:col-span-2">
          <InputRow
            label="Introducer Full Name"
            name="introducerName"
            value={formData.introducerName}
            required
            placeholder="Enter introducer's full name"
            onChange={updateField}
          />
        </div>
        <div className="lg:col-span-2">
          <TextAreaRow
            label="Introducer Address"
            name="introducerAddress"
            value={formData.introducerAddress}
            required
            placeholder="Enter introducer's full address"
            onChange={updateField}
            rows={2}
          />
        </div>
        <InputRow
          label="Introducer Phone"
          name="introducerPhone"
          value={formData.introducerPhone}
          type="tel"
          required
          placeholder="Enter phone number"
          onChange={updateField}
        />
        <InputRow
          label="Introducer Occupation"
          name="introducerOccupation"
          value={formData.introducerOccupation}
          required
          placeholder="Enter occupation"
          onChange={updateField}
        />
        <InputRow
          label="Relationship to Customer"
          name="introducerRelationship"
          value={formData.introducerRelationship}
          required
          placeholder="e.g., Business Partner, Friend, Family"
          onChange={updateField}
        />
        <InputRow
          label="How long known?"
          name="yearsKnown"
          value={formData.yearsKnown}
          required
          placeholder="e.g., 5 years, 3 months"
          onChange={updateField}
        />
        <InputRow
          label="Introduction Date"
          name="introductionDate"
          value={formData.introductionDate}
          type="date"
          onChange={updateField}
        />

        <div className="lg:col-span-2 border-t border-gray-300 pt-6">
          <h3 className="font-semibold text-sm text-gray-700 mb-6">Introducer's Bank Details (Optional)</h3>
        </div>
        <InputRow
          label="Bank Name"
          name="introducerBankName"
          value={formData.introducerBankName}
          placeholder="Enter bank name"
          onChange={updateField}
        />
        <InputRow
          label="Account Name"
          name="introducerAccountName"
          value={formData.introducerAccountName}
          placeholder="Enter account name"
          onChange={updateField}
        />
        <InputRow
          label="Account Number"
          name="introducerAccountNumber"
          value={formData.introducerAccountNumber}
          placeholder="Enter account number"
          onChange={updateField}
        />
        <InputRow
          label="Branch"
          name="introducerBranch"
          value={formData.introducerBranch}
          placeholder="Enter branch"
          onChange={updateField}
        />

        <div className="lg:col-span-2">
          <TextAreaRow
            label="Comments"
            name="introducerComments"
            value={formData.introducerComments}
            placeholder="Additional comments about the introduction"
            onChange={updateField}
            rows={2}
          />
        </div>

        <div className="lg:col-span-2 border-t border-gray-300 pt-6">
          <h3 className="font-semibold text-sm text-gray-700 mb-6">Verification & Authentication</h3>
          <CheckboxRow
            label="Introduction has been verified"
            name="isVerified"
            checked={formData.isVerified}
            onChange={updateField}
          />
        </div>

        {formData.isVerified && (
          <>
            <InputRow
              label="Verification Date"
              name="introducerVerificationDate"
              value={formData.introducerVerificationDate}
              type="date"
              onChange={updateField}
            />
            <InputRow
              label="Verified By"
              name="introducerVerifiedBy"
              value={formData.introducerVerifiedBy}
              placeholder="Enter verifier name"
              onChange={updateField}
            />
          </>
        )}

        <div className="lg:col-span-2 border-t border-gray-300 pt-6">
          <h3 className="font-semibold text-sm text-gray-700 mb-6">Staff Authentication</h3>
          <div className="grid gap-6 lg:grid-cols-2">
            <InputRow
              label="Staff Name"
              name="staffName"
              value={formData.staffName}
              required
              placeholder="Enter staff name"
              onChange={updateField}
            />
            <div className="lg:col-span-2">
              <SignatureInput
                label="Staff Signature"
                value={formData.staffSignature}
                onChange={(value) => updateField('staffSignature', value)}
              />
            </div>
            <InputRow
              label="Date"
              name="staffDate"
              value={formData.staffDate}
              type="date"
              required
              onChange={updateField}
            />
          </div>
        </div>
      </div>
    </section>
  );
});

const CompanyDetailsSection = memo(function CompanyDetailsSection({ formData, updateField }: any) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#7B3434]">1. COMPANY DETAILS</h2>
        <p className="text-sm text-gray-600 mt-2">Please complete in BLOCK LETTERS and tick where necessary.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <InputRow label="Company Name / Account Name" name="companyName" value={formData.companyName} required placeholder="Enter company name / account name" onChange={updateField} />
        <SelectRow label="Account Type" name="accountType" value={formData.accountType} options={accountTypeOptions} required onChange={updateField} />
        <InputRow label="RC/Business Registration Number" name="registrationNumber" value={formData.registrationNumber} required placeholder="Enter registration number" onChange={updateField} />
        <InputRow label="Date of Incorporation" name="dateOfIncorporation" value={formData.dateOfIncorporation} type="date" onChange={updateField} />
        <TextAreaRow label="Registered Office Address" name="registeredOfficeAddress" value={formData.registeredOfficeAddress} required placeholder="Enter registered office address" onChange={updateField} rows={4} />
        <TextAreaRow label="Business/Office Address" name="businessAddress" value={formData.businessAddress} required placeholder="Enter business address" onChange={updateField} rows={4} />
        <InputRow label="Nature of Business" name="natureOfBusiness" value={formData.natureOfBusiness} required placeholder="Describe nature of business" onChange={updateField} />
        <InputRow label="Phone Number" name="phoneNumber" value={formData.phoneNumber} required placeholder="Enter phone number" type="tel" onChange={updateField} />
        <InputRow label="Business Phone" name="businessPhone" value={formData.businessPhone} placeholder="Enter business phone" type="tel" onChange={updateField} />
        <InputRow label="Email Address" name="emailAddress" value={formData.emailAddress} required placeholder="Enter email address" type="email" onChange={updateField} />
        <InputRow label="Business Email" name="businessEmail" value={formData.businessEmail} placeholder="Enter business email" type="email" onChange={updateField} />
        <InputRow label="Website (if any)" name="website" value={formData.website} placeholder="Enter website URL" type="url" onChange={updateField} />
        <InputRow label="Tax Identification Number (TIN)" name="taxIdentificationNumber" value={formData.taxIdentificationNumber} placeholder="Enter TIN" onChange={updateField} />
        <SelectRow label="Type of Company" name="companyType" value={formData.companyType} options={companyTypeOptions} required onChange={updateField} />
      </div>
    </section>
  );
});

const AnnualTurnoverSection = memo(function AnnualTurnoverSection({ formData, updateField }: any) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#7B3434]">2. ANNUAL TURNOVER</h2>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <InputRow label="Estimated Annual Turnover" name="annualTurnover" value={formData.annualTurnover} required type="number" placeholder="Enter estimated annual turnover" onChange={updateField} />
        <SelectRow label="Currency" name="annualCurrency" value={formData.annualCurrency} options={[{ value: 'NGN', label: 'NGN - Nigerian Naira' }, { value: 'USD', label: 'USD - US Dollar' }, { value: 'GBP', label: 'GBP - British Pound' }, { value: 'EUR', label: 'EUR - Euro' }]} onChange={updateField} />
      </div>
    </section>
  );
});

const AccountServicesSection = memo(function AccountServicesSection({ formData, updateField, toggleService }: any) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#7B3434]">3. ACCOUNT SERVICE(S) REQUIRED</h2>
        <p className="text-sm text-gray-600 mt-2">Please tick applicable option below.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <SelectRow label="Account Type" name="accountType" value={formData.accountType} options={accountTypeOptions} required onChange={updateField} />
        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 mb-2">Services Required</label>
          <div className="grid gap-3 sm:grid-cols-2">
            {serviceOptions.map((service) => (
              <label key={service} className="flex items-center gap-3 rounded-2xl border border-gray-300 px-4 py-3 text-sm transition hover:border-[#7B3434]">
                <input
                  type="checkbox"
                  checked={formData.servicesRequired.includes(service)}
                  onChange={() => toggleService(service)}
                  className="h-4 w-4 rounded text-[#7B3434] focus:ring-[#7B3434]"
                />
                {service}
              </label>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

const ChequeConfirmationSection = memo(function ChequeConfirmationSection({ formData, updateField }: any) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#7B3434]">4. CHEQUE CONFIRMATION / THRESHOLD</h2>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <SelectRow label="Cheque Confirmation Required?" name="chequeConfirmation" value={formData.chequeConfirmation} options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} onChange={updateField} />
        <InputRow label="Cheque Threshold Amount" name="chequeThreshold" value={formData.chequeThreshold} type="number" placeholder="Enter threshold amount" onChange={updateField} />
        <InputRow label="Daily Withdrawal Limit" name="withdrawalLimit" value={formData.withdrawalLimit} type="number" placeholder="Enter daily withdrawal limit" onChange={updateField} />
        <InputRow label="Transaction Limit" name="transactionLimit" value={formData.transactionLimit} type="number" placeholder="Enter transaction limit" onChange={updateField} />
        <div className="flex items-center gap-3 rounded-2xl border border-gray-300 px-4 py-3">
          <input type="checkbox" checked={formData.dualAuthorisation} onChange={(event) => updateField('dualAuthorisation', event.target.checked)} className="h-4 w-4 rounded text-[#7B3434] focus:ring-[#7B3434]" />
          <span className="text-sm text-gray-700">Require Dual Authorisation for transactions above threshold</span>
        </div>
      </div>
    </section>
  );
});

const BoardResolutionSection = memo(function BoardResolutionSection({ formData, updateField, updateArrayItem }: any) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#7B3434]">2. BOARD RESOLUTION</h2>
        <p className="text-sm text-gray-600 mt-2">FEDERAL REPUBLIC OF NIGERIA COMPANY AND ALLIED MATTERS ACT, 2004.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <InputRow label="Company Name" name="boardResolutionCompanyName" value={formData.boardResolutionCompanyName} required placeholder="Enter company name" onChange={updateField} />
        <InputRow label="Meeting Date" name="boardResolutionMeetingDate" value={formData.boardResolutionMeetingDate} type="date" required onChange={updateField} />
      </div>
      <div className="space-y-4 rounded-3xl border border-gray-200 bg-[#fafafa] p-4">
        <h3 className="text-lg font-semibold text-[#7B3434]">A. LIST OF DIRECTORS PRESENT</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700">
                <th className="border border-gray-200 px-3 py-2">S/N</th>
                <th className="border border-gray-200 px-3 py-2">NAME</th>
                <th className="border border-gray-200 px-3 py-2">POSITION</th>
              </tr>
            </thead>
            <tbody>
              {formData.boardResolutionDirectors.map((director: any, index: number) => (
                <tr key={director.id}>
                  <td className="border border-gray-200 px-3 py-2">{index + 1}</td>
                  <td className="border border-gray-200 px-3 py-2">
                    <input
                      type="text"
                      value={director.name}
                      onChange={(event) => updateArrayItem('boardResolutionDirectors', index, 'name', event.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-black outline-none focus:border-[#7B3434]"
                      placeholder="Director name"
                    />
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    <input
                      type="text"
                      value={director.position}
                      onChange={(event) => updateArrayItem('boardResolutionDirectors', index, 'position', event.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-black outline-none focus:border-[#7B3434]"
                      placeholder="Position"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="space-y-4 rounded-3xl border border-gray-200 bg-[#fafafa] p-4">
        <h3 className="text-lg font-semibold text-[#7B3434]">B. SIGNATORIES TO THE ACCOUNT</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700">
                <th className="border border-gray-200 px-3 py-2">S/N</th>
                <th className="border border-gray-200 px-3 py-2">NAME</th>
                <th className="border border-gray-200 px-3 py-2">CATEGORY</th>
                <th className="border border-gray-200 px-3 py-2">SPECIMEN SIGNATURE</th>
              </tr>
            </thead>
            <tbody>
              {formData.boardResolutionSignatories.map((signatory: any, index: number) => (
                <tr key={signatory.id}>
                  <td className="border border-gray-200 px-3 py-2">{index + 1}</td>
                  <td className="border border-gray-200 px-3 py-2">
                    <input
                      type="text"
                      value={signatory.name}
                      onChange={(event) => updateArrayItem('boardResolutionSignatories', index, 'name', event.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-black outline-none focus:border-[#7B3434]"
                      placeholder="Signatory name"
                    />
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    <select
                      value={signatory.category}
                      onChange={(event) => updateArrayItem('boardResolutionSignatories', index, 'category', event.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-black outline-none focus:border-[#7B3434]"
                    >
                      <option value="">Select</option>
                      {signatoryCategoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    <SignatureInput
                      label=""
                      value={signatory.specimenSignature}
                      onChange={(value) => updateArrayItem('boardResolutionSignatories', index, 'specimenSignature', value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <TextAreaRow label="Mandate of the Company" name="boardResolutionMandate" value={formData.boardResolutionMandate} required placeholder="Enter mandate details" rows={4} onChange={updateField} />
    </section>
  );
});

const LetterOfSetOffSection = memo(function LetterOfSetOffSection({ formData, updateField }: any) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#7B3434]">6. LETTER OF SET-OFF</h2>
      </div>
      <div className="rounded-3xl border border-gray-200 bg-[#fafafa] p-6 text-sm text-gray-700 leading-7">
        <p>
          In consideration of your providing us financial and/or banking accommodation and other facilities, we agree that in addition to any other general lien or similar right to which you as a bank may be entitled by law, you may at anytime and without notice to us combine or consolidate all or any of the company's accounts with the liabilities to you and set off or transfer any sums standing to the credit of anyone or more of such accounts or any other credit, be it cash, cheques, valuables, deposits securities, negotiable instruments or towards satisfaction of our liability to you or any other account or in any other respect, whether such liabilities be actual or contingent, primary or collateral or several or joint.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <InputRow label="Company Name" name="setOffCompanyName" value={formData.setOffCompanyName} required placeholder="Enter company name" onChange={updateField} />
        <InputRow label="Date" name="setOffDate" value={formData.setOffDate} type="date" required onChange={updateField} />
        <InputRow label="Director Name" name="setOffDirectorName" value={formData.setOffDirectorName} required placeholder="Enter director name" onChange={updateField} />
        <div className="lg:col-span-2">
          <SignatureInput
            label="Director Signature"
            value={formData.setOffDirectorSignature}
            onChange={(value) => updateField('setOffDirectorSignature', value)}
          />
        </div>
        <InputRow label="Witness Name" name="setOffWitnessName" value={formData.setOffWitnessName} placeholder="Enter witness name" onChange={updateField} />
        <div className="lg:col-span-2">
          <SignatureInput
            label="Witness Signature"
            value={formData.setOffWitnessSignature}
            onChange={(value) => updateField('setOffWitnessSignature', value)}
          />
        </div>
      </div>
    </section>
  );
});

const AccountSignatoryDetailsSection = memo(function AccountSignatoryDetailsSection({
  formData, updateArrayItem, addArrayItem, removeArrayItem }: any) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#7B3434]">3. ACCOUNT SIGNATORY'S DETAILS</h2>
      </div>
      {formData.accountSignatories.map((signatory: any, index: number) => (
        <div key={signatory.id} className="rounded-3xl border border-gray-200 bg-[#fafafa] p-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-[#7B3434]">Signatory #{index + 1}</h3>
            {formData.accountSignatories.length > 1 ? (
              <button
                type="button"
                onClick={() => removeArrayItem('accountSignatories', index)}
                className="rounded-full bg-[#7B3434] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#6a2d2d]"
              >
                Remove
              </button>
            ) : null}
          </div>
          <div className="grid gap-6 lg:grid-cols-2 mt-6">
            <InputRow label="Full Name" name="name" value={signatory.name} required placeholder="Enter full name" onChange={(name, value) => updateArrayItem('accountSignatories', index, 'name', value)} />
            <InputRow label="Date of Birth" name="dateOfBirth" value={signatory.dateOfBirth} required type="date" onChange={(name, value) => updateArrayItem('accountSignatories', index, 'dateOfBirth', value)} />
            <InputRow label="Nationality" name="nationality" value={signatory.nationality} required placeholder="Enter nationality" onChange={(name, value) => updateArrayItem('accountSignatories', index, 'nationality', value)} />
            <InputRow label="Occupation" name="occupation" value={signatory.occupation} required placeholder="Enter occupation" onChange={(name, value) => updateArrayItem('accountSignatories', index, 'occupation', value)} />
            <div className="lg:col-span-2">
              <TextAreaRow label="Residential Address" name="address" value={signatory.address} required placeholder="Enter residential address" rows={3} onChange={(name, value) => updateArrayItem('accountSignatories', index, 'address', value)} />
            </div>
            <InputRow label="Phone Number" name="phone" value={signatory.phone} required placeholder="Enter phone number" type="tel" onChange={(name, value) => updateArrayItem('accountSignatories', index, 'phone', value)} />
            <InputRow label="Email Address" name="email" value={signatory.email} required placeholder="Enter email address" type="email" onChange={(name, value) => updateArrayItem('accountSignatories', index, 'email', value)} />
            <SelectRow label="Identification Type" name="idType" value={signatory.idType} options={idTypeOptions} required onChange={(name, value) => updateArrayItem('accountSignatories', index, 'idType', value)} />
            <InputRow label="ID Number" name="idNumber" value={signatory.idNumber} required placeholder="Enter ID number" onChange={(name, value) => updateArrayItem('accountSignatories', index, 'idNumber', value)} />
            <InputRow label="ID Expiry Date" name="idExpiryDate" value={signatory.idExpiryDate} required type="date" onChange={(name, value) => updateArrayItem('accountSignatories', index, 'idExpiryDate', value)} />
            <SelectRow label="Relationship to Company" name="relationshipToCompany" value={signatory.relationshipToCompany} options={relationshipOptions} required onChange={(name, value) => updateArrayItem('accountSignatories', index, 'relationshipToCompany', value)} />
            <div className="lg:col-span-2">
              <SignatureInput
                label="Specimen Signature"
                value={signatory.specimenSignature}
                onChange={(value) => updateArrayItem('accountSignatories', index, 'specimenSignature', value)}
              />
            </div>
            <div className="lg:col-span-2">
              <SignatureInput
                label="Actual Signature"
                value={signatory.actualSignature}
                onChange={(value) => updateArrayItem('accountSignatories', index, 'actualSignature', value)}
              />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-800 mb-2">Passport Photo</label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    updateArrayItem('accountSignatories', index, 'passportPhoto', file);
                  }
                }}
                className="w-full px-4 py-4 border-2 border-gray-300 border-dashed rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#7B3434] file:text-white hover:file:bg-[#6a2d2d] transition-all duration-200 cursor-pointer"
              />
              {signatory.passportPhoto ? (
                <div className="mt-3 flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-green-800 font-medium">{signatory.passportPhoto.name} ({(signatory.passportPhoto.size / 1024).toFixed(1)} KB)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateArrayItem('accountSignatories', index, 'passportPhoto', null)}
                    className="text-red-600 hover:text-red-800 text-sm font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : null}
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-800 mb-2">ID Card</label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    updateArrayItem('accountSignatories', index, 'idCard', file);
                  }
                }}
                className="w-full px-4 py-4 border-2 border-gray-300 border-dashed rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#7B3434] file:text-white hover:file:bg-[#6a2d2d] transition-all duration-200 cursor-pointer"
              />
              {signatory.idCard ? (
                <div className="mt-3 flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-green-800 font-medium">{signatory.idCard.name} ({(signatory.idCard.size / 1024).toFixed(1)} KB)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateArrayItem('accountSignatories', index, 'idCard', null)}
                    className="text-red-600 hover:text-red-800 text-sm font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addArrayItem('accountSignatories', {
          id: createItemId(),
          name: '',
          dateOfBirth: '',
          nationality: '',
          occupation: '',
          address: '',
          phone: '',
          email: '',
          idType: '',
          idNumber: '',
          idExpiryDate: '',
          relationshipToCompany: '',
          specimenSignature: null,
          actualSignature: null,
          passportPhoto: null,
          idCard: null,
        })}
        className="rounded-full bg-[#ACD23C] px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-[#9bb82a]"
      >
        + Add Another Signatory
      </button>
    </section>
  );
});

const DirectorsDetailsSection = memo(function DirectorsDetailsSection({
  formData, updateArrayItem, addArrayItem, removeArrayItem }: any) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#7B3434]">4. DETAILS OF DIRECTORS / EXECUTIVES / TRUSTEES / PROMOTERS / ADMINISTRATORS / PRINCIPAL OFFICERS</h2>
      </div>
      {formData.directorsDetails.map((director: any, index: number) => (
        <div key={director.id} className="rounded-3xl border border-gray-200 bg-[#fafafa] p-6">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-[#7B3434]">Director/Executive #{index + 1}</h3>
            {formData.directorsDetails.length > 1 ? (
              <button
                type="button"
                onClick={() => removeArrayItem('directorsDetails', index)}
                className="rounded-full bg-[#7B3434] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#6a2d2d]"
              >
                Remove
              </button>
            ) : null}
          </div>
          <div className="grid gap-6 lg:grid-cols-2 mt-6">
            <InputRow label="Full Name" name="name" value={director.name} required placeholder="Enter full name" onChange={(name, value) => updateArrayItem('directorsDetails', index, 'name', value)} />
            <InputRow label="Position/Title" name="position" value={director.position} required placeholder="Enter position" onChange={(name, value) => updateArrayItem('directorsDetails', index, 'position', value)} />
            <InputRow label="Date of Birth" name="dateOfBirth" value={director.dateOfBirth} type="date" onChange={(name, value) => updateArrayItem('directorsDetails', index, 'dateOfBirth', value)} />
            <InputRow label="Nationality" name="nationality" value={director.nationality} placeholder="Enter nationality" onChange={(name, value) => updateArrayItem('directorsDetails', index, 'nationality', value)} />
            <div className="lg:col-span-2">
              <TextAreaRow label="Residential Address" name="address" value={director.address} placeholder="Enter residential address" rows={3} onChange={(name, value) => updateArrayItem('directorsDetails', index, 'address', value)} />
            </div>
            <InputRow label="Phone Number" name="phone" value={director.phone} placeholder="Enter phone number" type="tel" onChange={(name, value) => updateArrayItem('directorsDetails', index, 'phone', value)} />
            <InputRow label="Email Address" name="email" value={director.email} placeholder="Enter email address" type="email" onChange={(name, value) => updateArrayItem('directorsDetails', index, 'email', value)} />
            <SelectRow label="Identification Type" name="idType" value={director.idType} options={idTypeOptions} onChange={(name, value) => updateArrayItem('directorsDetails', index, 'idType', value)} />
            <InputRow label="ID Number" name="idNumber" value={director.idNumber} placeholder="Enter ID number" onChange={(name, value) => updateArrayItem('directorsDetails', index, 'idNumber', value)} />
            <InputRow label="ID Expiry Date" name="idExpiryDate" value={director.idExpiryDate} type="date" onChange={(name, value) => updateArrayItem('directorsDetails', index, 'idExpiryDate', value)} />
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-800 mb-2">Passport Photo</label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    updateArrayItem('directorsDetails', index, 'passportPhoto', file);
                  }
                }}
                className="w-full px-4 py-4 border-2 border-gray-300 border-dashed rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#7B3434] file:text-white hover:file:bg-[#6a2d2d] transition-all duration-200 cursor-pointer"
              />
              {director.passportPhoto ? (
                <div className="mt-3 flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-green-800 font-medium">{director.passportPhoto.name} ({(director.passportPhoto.size / 1024).toFixed(1)} KB)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateArrayItem('directorsDetails', index, 'passportPhoto', null)}
                    className="text-red-600 hover:text-red-800 text-sm font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : null}
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-800 mb-2">ID Card</label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    updateArrayItem('directorsDetails', index, 'idCard', file);
                  }
                }}
                className="w-full px-4 py-4 border-2 border-gray-300 border-dashed rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#7B3434] file:text-white hover:file:bg-[#6a2d2d] transition-all duration-200 cursor-pointer"
              />
              {director.idCard ? (
                <div className="mt-3 flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-green-800 font-medium">{director.idCard.name} ({(director.idCard.size / 1024).toFixed(1)} KB)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateArrayItem('directorsDetails', index, 'idCard', null)}
                    className="text-red-600 hover:text-red-800 text-sm font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addArrayItem('directorsDetails', {
          id: createItemId(),
          name: '',
          position: '',
          dateOfBirth: '',
          nationality: '',
          address: '',
          phone: '',
          email: '',
          idType: '',
          idNumber: '',
          idExpiryDate: '',
          passportPhoto: null,
          idCard: null,
        })}
        className="rounded-full bg-[#ACD23C] px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-[#9bb82a]"
      >
        + Add Another Director/Executive
      </button>
    </section>
  );
});

const SoleProprietorDetailsSection = memo(function SoleProprietorDetailsSection({ formData, updateField }: any) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#7B3434]">9. DETAILS OF A SOLE PROPRIETOR</h2>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <InputRow label="Full Name" name="soleProprietorName" value={formData.soleProprietorName} required placeholder="Enter full name" onChange={updateField} />
        <InputRow label="Date of Birth" name="soleProprietorDateOfBirth" value={formData.soleProprietorDateOfBirth} required type="date" onChange={updateField} />
        <InputRow label="Nationality" name="soleProprietorNationality" value={formData.soleProprietorNationality} required placeholder="Enter nationality" onChange={updateField} />
        <InputRow label="Occupation" name="soleProprietorOccupation" value={formData.soleProprietorOccupation} required placeholder="Enter occupation" onChange={updateField} />
        <div className="lg:col-span-2">
          <TextAreaRow label="Residential Address" name="soleProprietorAddress" value={formData.soleProprietorAddress} required placeholder="Enter residential address" rows={3} onChange={updateField} />
        </div>
        <InputRow label="Phone Number" name="soleProprietorPhone" value={formData.soleProprietorPhone} required placeholder="Enter phone number" type="tel" onChange={updateField} />
        <InputRow label="Email Address" name="soleProprietorEmail" value={formData.soleProprietorEmail} required placeholder="Enter email address" type="email" onChange={updateField} />
        <InputRow label="Business Name" name="soleProprietorBusinessName" value={formData.soleProprietorBusinessName} required placeholder="Enter business name" onChange={updateField} />
        <InputRow label="Business Registration Number" name="soleProprietorBusinessRegistrationNumber" value={formData.soleProprietorBusinessRegistrationNumber} placeholder="Enter registration number" onChange={updateField} />
        <div className="lg:col-span-2">
          <TextAreaRow label="Business Address" name="soleProprietorBusinessAddress" value={formData.soleProprietorBusinessAddress} placeholder="Enter business address" rows={3} onChange={updateField} />
        </div>
        <InputRow label="Business Phone" name="soleProprietorBusinessPhone" value={formData.soleProprietorBusinessPhone} placeholder="Enter business phone" type="tel" onChange={updateField} />
        <InputRow label="Years in Business" name="soleProprietorYearsInBusiness" value={formData.soleProprietorYearsInBusiness} type="number" placeholder="Enter number of years" onChange={updateField} />
        <SelectRow label="Identification Type" name="soleProprietorIdType" value={formData.soleProprietorIdType} options={idTypeOptions} required onChange={updateField} />
        <InputRow label="ID Number" name="soleProprietorIdNumber" value={formData.soleProprietorIdNumber} required placeholder="Enter ID number" onChange={updateField} />
        <InputRow label="ID Expiry Date" name="soleProprietorIdExpiryDate" value={formData.soleProprietorIdExpiryDate} required type="date" onChange={updateField} />
      </div>
    </section>
  );
});

const OtherBankAccountsSection = memo(function OtherBankAccountsSection({
  formData, updateArrayItem, addArrayItem, removeArrayItem }: any) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#7B3434]">5. DETAILS OF ACCOUNTS HELD WITH OTHER BANKS</h2>
      </div>
      <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-[#fafafa] p-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700">
              <th className="border border-gray-200 px-3 py-2">S/N</th>
              <th className="border border-gray-200 px-3 py-2">NAME & ADDRESS OF BANK/BRANCH</th>
              <th className="border border-gray-200 px-3 py-2">ACCOUNT NAME</th>
              <th className="border border-gray-200 px-3 py-2">ACCOUNT NUMBER</th>
              <th className="border border-gray-200 px-3 py-2">STATUS</th>
              <th className="border border-gray-200 px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {formData.otherBankAccounts.map((account: any, index: number) => (
              <tr key={account.id}>
                <td className="border border-gray-200 px-3 py-2 align-top">{index + 1}</td>
                <td className="border border-gray-200 px-3 py-2 space-y-2">
                  <input
                    type="text"
                    value={account.bankName}
                    onChange={(event) => updateArrayItem('otherBankAccounts', index, 'bankName', event.target.value)}
                    placeholder="Bank name"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-black outline-none focus:border-[#7B3434]"
                  />
                  <input
                    type="text"
                    value={account.branch}
                    onChange={(event) => updateArrayItem('otherBankAccounts', index, 'branch', event.target.value)}
                    placeholder="Branch"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-black outline-none focus:border-[#7B3434]"
                  />
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  <input
                    type="text"
                    value={account.accountName}
                    onChange={(event) => updateArrayItem('otherBankAccounts', index, 'accountName', event.target.value)}
                    placeholder="Account name"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-black outline-none focus:border-[#7B3434]"
                  />
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  <input
                    type="text"
                    value={account.accountNumber}
                    onChange={(event) => updateArrayItem('otherBankAccounts', index, 'accountNumber', event.target.value)}
                    placeholder="Account number"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-black outline-none focus:border-[#7B3434]"
                  />
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  <select
                    value={account.status}
                    onChange={(event) => updateArrayItem('otherBankAccounts', index, 'status', event.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-black outline-none focus:border-[#7B3434]"
                  >
                    <option value="active">Active</option>
                    <option value="dormant">Dormant</option>
                  </select>
                </td>
                <td className="border border-gray-200 px-3 py-2 text-center">
                  {index > 0 ? (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('otherBankAccounts', index)}
                      className="rounded-full bg-[#7B3434] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#6a2d2d]"
                    >
                      ✕
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={() => addArrayItem('otherBankAccounts', { id: createItemId(), bankName: '', branch: '', accountName: '', accountNumber: '', status: 'active' })}
        className="rounded-full bg-[#ACD23C] px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-[#9bb82a]"
      >
        + Add Another Bank Account
      </button>
    </section>
  );
});

const AuthorityToDebitSection = memo(function AuthorityToDebitSection({ formData, updateField }: any) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#7B3434]">11. AUTHORITY TO DEBIT FOR SEARCH FEE</h2>
        <p className="text-sm text-gray-600 mt-2">We hereby authorize the Bank to debit our account with the applicable charges for the legal search conducted on our account at the Corporate Affairs Commission or the relevant agency / authority.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <InputRow label="Authorized Signatory 1" name="authorizedSignatory1" value={formData.authorizedSignatory1} required placeholder="Enter authorized signatory name" onChange={updateField} />
        <InputRow label="Date" name="authorizedSignatory1Date" value={formData.authorizedSignatory1Date} required type="date" onChange={updateField} />
        <div className="lg:col-span-2">
          <SignatureInput
            label="Signature"
            value={formData.authorizedSignatory1Signature}
            onChange={(value) => updateField('authorizedSignatory1Signature', value)}
          />
        </div>
        <InputRow label="Authorized Signatory 2" name="authorizedSignatory2" value={formData.authorizedSignatory2} placeholder="Enter authorized signatory name" onChange={updateField} />
        <InputRow label="Date" name="authorizedSignatory2Date" value={formData.authorizedSignatory2Date} type="date" onChange={updateField} />
        <div className="lg:col-span-2">
          <SignatureInput
            label="Signature"
            value={formData.authorizedSignatory2Signature}
            onChange={(value) => updateField('authorizedSignatory2Signature', value)}
          />
        </div>
      </div>
    </section>
  );
});

const DeclarationSection = memo(function DeclarationSection({ formData, updateField }: any) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#7B3434]">6. DECLARATION</h2>
        <p className="text-sm text-gray-600 mt-2">
          We declare that the information provided in this form is true and correct to the best of our knowledge. We agree to abide by the Bank's terms and conditions.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <InputRow label="Company Name" name="declarationCompanyName" value={formData.declarationCompanyName} required placeholder="Enter company name" onChange={updateField} />
        <InputRow label="Date" name="declarationDate" value={formData.declarationDate} required type="date" onChange={updateField} />
        <InputRow label="Director Name" name="declarationDirectorName" value={formData.declarationDirectorName} required placeholder="Enter director name" onChange={updateField} />
        <div className="lg:col-span-2">
          <SignatureInput
            label="Director Signature"
            value={formData.declarationDirectorSignature}
            onChange={(value) => updateField('declarationDirectorSignature', value)}
          />
        </div>
        <InputRow label="Secretary Name" name="declarationSecretaryName" value={formData.declarationSecretaryName} placeholder="Enter secretary name" onChange={updateField} />
        <div className="lg:col-span-2">
          <SignatureInput
            label="Secretary Signature"
            value={formData.declarationSecretarySignature}
            onChange={(value) => updateField('declarationSecretarySignature', value)}
          />
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-gray-300 px-4 py-3 lg:col-span-2">
          <input type="checkbox" checked={formData.declarationAgreeTerms} onChange={(event) => updateField('declarationAgreeTerms', event.target.checked)} className="h-4 w-4 rounded text-[#7B3434] focus:ring-[#7B3434]" />
          <span className="text-sm text-gray-700">I agree to the terms and conditions</span>
        </div>
      </div>
    </section>
  );
});

const ReferenceFormSection = memo(function ReferenceFormSection({ formData, updateField }: any) {
  const handleDownloadTemplate = () => {
    // Create a simple HTML template for the reference form
    const templateContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>UNILAG Microfinance Bank Reference Form</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #003366; text-align: center; }
    .warning-box { background: #fff3cd; border: 2px solid #ffc107; padding: 15px; border-radius: 6px; color: #856404; text-align: center; font-size: 16px; margin-bottom: 20px; }
    .form-group { margin-bottom: 15px; }
    label { font-weight: bold; display: block; margin-bottom: 5px; }
    input, textarea { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
    textarea { resize: vertical; }
    .checkbox-label { display: flex; align-items: center; gap: 10px; font-weight: 600; padding: 10px; background: #f0f7ff; border-radius: 4px; }
    .declaration-text { background: #f5f5f5; padding: 15px; border-radius: 4px; font-size: 14px; border-left: 4px solid #003366; margin: 15px 0; }
  </style>
</head>
<body>
  <h1>REFERENCE FORM</h1>
  <div class="warning-box">
    <strong>⚠️ PLEASE NOTE THAT IT IS DANGEROUS TO INTRODUCE SOMEONE WHO IS NOT WELL KNOWN TO YOU</strong>
  </div>

  <div class="form-group">
    <p style="font-size: 16px; font-weight: 600; color: #003366; padding: 10px 0; border-bottom: 1px solid #ddd;">To: The Manager, UNILAG Microfinance Bank</p>
  </div>

  <h3 style="color: #003366; font-size: 17px; margin: 20px 0 10px; padding-bottom: 5px; border-bottom: 2px solid #e0e0e0;">Person Being Introduced</h3>
  <div class="form-group">
    <label>NAME of person being introduced *</label>
    <input type="text" placeholder="Enter full name of the person being introduced">
  </div>

  <h3 style="color: #003366; font-size: 17px; margin: 20px 0 10px; padding-bottom: 5px; border-bottom: 2px solid #e0e0e0;">Referee Details</h3>
  <div class="form-group">
    <label>Referee Full Name *</label>
    <input type="text" placeholder="Enter referee's full name">
  </div>
  <div class="form-group">
    <label>Referee Occupation *</label>
    <input type="text" placeholder="Enter referee's occupation">
  </div>
  <div class="form-group">
    <label>Referee Address *</label>
    <textarea rows={3} placeholder="Enter referee's full address"></textarea>
  </div>

  <h3 style="color: #003366; font-size: 17px; margin: 20px 0 10px; padding-bottom: 5px; border-bottom: 2px solid #e0e0e0;">Relationship with the Person</h3>
  <div class="form-group">
    <label>How long have you known this person? *</label>
    <input type="text" placeholder="e.g., 5 years, 2 months">
  </div>
  <div class="form-group">
    <label>Comments about their suitability for maintaining a current account *</label>
    <textarea rows={4} placeholder="Please provide comments about the person's character, financial responsibility, and suitability for a current account"></textarea>
  </div>

  <h3 style="color: #003366; font-size: 17px; margin: 20px 0 10px; padding-bottom: 5px; border-bottom: 2px solid #e0e0e0;">Referee's Bank Account Details</h3>
  <p style="color: #666; font-size: 13px; font-style: italic; margin: -5px 0 15px;">
    Referee must be a corporate account holder with a minimum of six (6) months banking relationship
  </p>
  <div class="form-group">
    <label class="checkbox-label">
      <input type="checkbox"> I/We maintain a corporate account with the bank mentioned below
    </label>
  </div>
  <div class="form-group">
    <label>Bank Name *</label>
    <input type="text" placeholder="Enter bank name">
  </div>
  <div class="form-group">
    <label>Account Name *</label>
    <input type="text" placeholder="Enter account name">
  </div>
  <div class="form-group">
    <label>Account Number *</label>
    <input type="text" placeholder="Enter account number">
  </div>
  <div class="form-group">
    <label>Branch Name *</label>
    <input type="text" placeholder="Enter branch name">
  </div>
  <div class="form-group">
    <label>Branch Address</label>
    <textarea rows={2} placeholder="Enter branch address"></textarea>
  </div>
  <div class="form-group">
    <label>How long have you maintained this account? *</label>
    <input type="text" placeholder="e.g., 6 months, 2 years">
  </div>

  <h3 style="color: #003366; font-size: 17px; margin: 20px 0 10px; padding-bottom: 5px; border-bottom: 2px solid #e0e0e0;">Declaration and Signature</h3>
  <div class="form-group">
    <label>Date *</label>
    <input type="date">
  </div>
  <div class="form-group">
    <label>Referee Signature (Type name) *</label>
    <input type="text" placeholder="Type your full name as signature">
  </div>
  <div class="form-group">
    <label>Referee Actual Signature *</label>
    <div style="border: 1px dashed #ccc; padding: 30px; text-align: center; color: #999;">Please sign here (or add signature image after printing)</div>
  </div>

  <div class="declaration-text">
    I/We confirm that the above information is true and correct. I/We understand that providing false information may constitute an offence.
  </div>
</body>
</html>
`;
    const blob = new Blob([templateContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'UMFB-Reference-Form-Template.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#7B3434]">7. REFERENCE FORM</h2>
        <p className="text-sm text-gray-600 mt-2">
          Download the reference form template, fill it out, and upload the completed form.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap gap-4">
            <a
              href="/Referee_Form.pdf"
              download="Referee_Form.pdf"
              className="flex items-center gap-2 rounded-full bg-[#ACD23C] px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-[#9bb82a]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Reference Form Template
            </a>
          </div>
        </div>
        <div className="lg:col-span-2">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.html"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                updateField('referenceForm', file);
              }
            }}
            className="w-full px-4 py-4 border-2 border-gray-300 border-dashed rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7B3434] focus:border-[#7B3434] text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#7B3434] file:text-white hover:file:bg-[#6a2d2d] transition-all duration-200 cursor-pointer"
          />
          {formData.referenceForm ? (
            <div className="mt-3 flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-2xl">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-green-800 font-medium">{formData.referenceForm.name} ({(formData.referenceForm.size / 1024).toFixed(1)} KB)</span>
              </div>
              <button
                type="button"
                onClick={() => updateField('referenceForm', null)}
                className="text-red-600 hover:text-red-800 text-sm font-semibold"
              >
                Remove
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
});

const BankUseChecklistSection = memo(function BankUseChecklistSection() {
  // Hardcoded checklist items (display only)
  const checklistItems = [
    { id: 1, name: 'Account opening form duly completed' },
    { id: 2, name: 'Specimen signature card duly completed' },
    { id: 3, name: 'Copy of CAC Certificate of Registration' },
    { id: 4, name: 'Board Resolution' },
    { id: 5, name: 'Copy of Memorandum and Article of Association (Certified as true copy by the Registrar of Companies)' },
    { id: 6, name: 'Form C07 - Particulars of Directors (Certified as true copy by the Registrar of Companies and Certification by a Notary public for Foreign Companies)' },
    { id: 7, name: 'Form C02 - Allotment of Shares (Certified as true copy by the Registrar of Companies and Certification by a Notary public for Foreign Companies)' },
    { id: 8, name: 'Partnership Deed (where applicable)' },
    { id: 9, name: 'Approval Letter (for Government Agency)' },
    { id: 10, name: 'Act/Gazette (for Government Agency where applicable)' },
    { id: 11, name: 'Two (2) passport sized photographs of each signatory to the account with name written on the reverse side' },
    { id: 12, name: 'Residence permit (for non-Nigerians)' },
    { id: 13, name: 'Evidence of Registration with Nigerian Investment Promotion Council (NIPC) (where applicable)' },
    { id: 14, name: 'Evidence of Registration with Special Control Unit against Money Laundering (SCUML) (where applicable)' },
    { id: 15, name: 'Search Report' },
    { id: 16, name: 'Power of Attorney (where applicable)' },
    { id: 17, name: 'Proof of Company address' },
    { id: 18, name: 'Business Premises Visitation certificate' },
    { id: 19, name: 'Proof of Identity of all Signatories and Directors/Officers whose names appear on the account opening form/document (Preferred Identity card are International Passport, National Identity Card, National Driver\'s License and Valid Nigerian INEC Voter\'s Card)' },
    { id: 20, name: 'Proof of Address of all Signatories and Directors/Officers whose names appear on the account opening form/document Utility bill (Certified true copy is acceptable if original is held)' },
    { id: 21, name: 'Two (2) completed satisfactory Reference forms' },
    { id: 22, name: 'Others (please specify)' },
  ];

  const approvalRoles = [
    'Customer Service Officer',
    'Head of Operations',
    'Branch Head',
    'Group/Zonal Head (where applicable)',
  ];

  return (
    <section className="space-y-6">
      {/* User Instructions */}
      <div className="bg-white p-6 rounded-2xl border-2 border-[#ACD23C]">
        <h3 className="text-lg font-bold text-[#7B3434] mb-2">IMPORTANT INSTRUCTIONS</h3>
        <p className="text-gray-700 text-sm md:text-base">
          <strong className="text-[#7B3434]">FOR BANK USE ONLY</strong> – Please ignore this section and proceed to the next step (Company Details). This checklist is for internal bank use only. For Bank Use Only: Contact your Relationship Officer or leave blank.
        </p>
      </div>

      {/* Header */}
      <div className="text-center border-b-2 border-[#7B3434] pb-5 mb-8 bg-white p-6 rounded-2xl border border-gray-200">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#7B3434] uppercase tracking-wide">
          BANK USE REQUIREMENT CHECKLIST
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mt-2">
          Document Verification and Compliance Check
        </p>
      </div>

      {/* Documents Table */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md overflow-hidden border border-gray-200">
        <h3 className="text-lg md:text-xl font-bold text-[#7B3434] border-b-2 border-[#7B3434] pb-2 mb-4">DOCUMENTS REQUIRED</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-[#7B3434] text-white">
                <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold">S/N</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold">DOCUMENTS REQUIRED</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-center font-semibold">CHECKED</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-center font-semibold">DEFERRED</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-center font-semibold">WAIVED</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-center font-semibold">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {checklistItems.map((doc, index) => (
                <tr key={doc.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-2 md:px-4 py-2 md:py-3 text-center text-gray-800">{index + 1}</td>
                  <td className="px-2 md:px-4 py-2 md:py-3 min-w-[200px] md:min-w-[300px] text-gray-800">
                    <span className="block">{doc.name}</span>
                  </td>
                  <td className="px-2 md:px-4 py-2 md:py-3 text-center"></td>
                  <td className="px-2 md:px-4 py-2 md:py-3 text-center"></td>
                  <td className="px-2 md:px-4 py-2 md:py-3 text-center"></td>
                  <td className="px-2 md:px-4 py-2 md:py-3 text-center">
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap bg-gray-100 text-gray-500">
                      Pending
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-gray-200">
        <h3 className="text-lg md:text-xl font-bold text-[#7B3434] mb-3">COMMENTS</h3>
        <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-600">
          For Bank Use Only: Contact your Relationship Officer or leave blank.
        </div>
      </div>

      {/* KYC Watchlist */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-gray-200">
        <h3 className="text-lg md:text-xl font-bold text-[#7B3434] border-b-2 border-[#7B3434] pb-2 mb-4">G. AUTHENTICATION FOR KYC WATCH-LIST COMPLIANCE</h3>
        <div className="mb-5">
          <label className="block font-semibold text-base md:text-lg mb-2 text-gray-800">Is the applicant on the KYC Watch-list?</label>
        </div>
      </div>

      {/* Approvals */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md border border-gray-200">
        <h3 className="text-lg md:text-xl font-bold text-[#7B3434] border-b-2 border-[#7B3434] pb-2 mb-4">APPROVALS</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-[#7B3434] text-white">
                <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold">APPROVING OFFICER</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold">NAME</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold">SIGNATURE</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold">DATE</th>
              </tr>
            </thead>
            <tbody>
              {approvalRoles.map((role, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-2 md:px-4 py-2 md:py-3 font-semibold text-gray-800">{role}</td>
                  <td className="px-2 md:px-4 py-2 md:py-3"></td>
                  <td className="px-2 md:px-4 py-2 md:py-3"></td>
                  <td className="px-2 md:px-4 py-2 md:py-3"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
});

export function CorporateAccountOpeningForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback((name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  }, []);

  const updateArrayItem = useCallback((section: string, index: number, field: string, value: any) => {
    setFormData((prev: any) => {
      const updatedItems = [...prev[section]];
      updatedItems[index] = { ...updatedItems[index], [field]: value };
      return { ...prev, [section]: updatedItems };
    });
  }, []);

  const addArrayItem = useCallback((section: string, newItem: any) => {
    setFormData((prev: any) => ({ ...prev, [section]: [...prev[section], newItem] }));
  }, []);

  const removeArrayItem = useCallback((section: string, index: number) => {
    setFormData((prev: any) => ({ ...prev, [section]: prev[section].filter((_: any, idx: number) => idx !== index) }));
  }, []);

  const toggleService = useCallback((service: string) => {
    setFormData((prev: any) => {
      const currentServices = prev.servicesRequired as string[];
      const updatedServices = currentServices.includes(service)
        ? currentServices.filter((item) => item !== service)
        : [...currentServices, service];
      return { ...prev, servicesRequired: updatedServices };
    });
  }, []);

  const steps = [
    { id: 1, title: 'Address Verification & Authentication' },
    { id: 2, title: 'Company Details' },
    { id: 3, title: 'Board Resolution' },
    { id: 4, title: 'Signatory Details' },
    { id: 5, title: 'Directors Details' },
    { id: 6, title: 'Other Bank Accounts' },
    { id: 7, title: 'Declaration' },
    { id: 8, title: 'Reference Form' },
  ];

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep((value) => value + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((value) => value - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('=== Corporate Form SUBMIT ATTEMPTED ===');
    console.log('Event:', event);
    
    setIsSubmitting(true);
    
    try {
      const submitFormData = new FormData();
      
      // Add explicit form type field for reliable detection
      submitFormData.append('formType', 'corporate');
      
      // Helper function to flatten nested data
      const addToFormData = (data: any, prefix: string = '') => {
        for (const [key, value] of Object.entries(data)) {
          // Row IDs only help React render the form; they are not application data.
          if (key === 'id') continue;
          const newKey = prefix ? `${prefix}[${key}]` : key;
          
          if (Array.isArray(value)) {
            value.forEach((item, index) => {
              if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') {
                submitFormData.append(`${newKey}[${index}]`, String(item));
              } else {
                addToFormData(item, `${newKey}[${index}]`);
              }
            });
          } else if (value instanceof File) {
            submitFormData.append(newKey, value);
          } else if (value !== null && value !== undefined) {
            submitFormData.append(newKey, String(value));
          }
        }
      };
      
      addToFormData(formData);
      
      console.log('Sending corporate form data to API...');
      
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        body: submitFormData,
      });
      
      if (response.ok) {
        console.log('Corporate form submitted successfully!');
        setIsSubmitted(true);
      } else {
        console.error('Form submission failed with status:', response.status);
        const errorData = await response.json();
        alert(`Form submission failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <CorporateVerificationAuthenticationStep formData={formData} updateField={updateField} />;
      case 2:
        return <CompanyDetailsSection formData={formData} updateField={updateField} />;
      case 3:
        return <BoardResolutionSection formData={formData} updateField={updateField} updateArrayItem={updateArrayItem} />;
      case 4:
        return <AccountSignatoryDetailsSection formData={formData} updateArrayItem={updateArrayItem} addArrayItem={addArrayItem} removeArrayItem={removeArrayItem} />;
      case 5:
        return <DirectorsDetailsSection formData={formData} updateArrayItem={updateArrayItem} addArrayItem={addArrayItem} removeArrayItem={removeArrayItem} />;
      case 6:
        return <OtherBankAccountsSection formData={formData} updateArrayItem={updateArrayItem} addArrayItem={addArrayItem} removeArrayItem={removeArrayItem} />;
      case 7:
        return <DeclarationSection formData={formData} updateField={updateField} />;
      case 8:
        return <ReferenceFormSection formData={formData} updateField={updateField} />;
      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full border border-gray-200 bg-white py-6 text-center shadow-lg">
        <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#ACD23C] text-3xl text-white">✓</div>
        <div className="w-full px-4">
          <h2 className="text-2xl font-bold text-[#7B3434] mb-4">Application Submitted</h2>
          <p className="text-gray-600">Thank you. Your corporate account opening form has been recorded successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    }} className="space-y-10">
      <div className="w-full border border-gray-200 bg-white py-6 shadow-lg">
        <div className="mb-6 w-full px-4">
          <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#7B3434]">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#7B3434] text-white">{currentStep}</span>
            <span>Step {currentStep} of {steps.length}</span>
          </div>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">{steps[currentStep - 1].title}</h1>
        </div>

        <div className="mb-8 w-full px-4 overflow-hidden rounded-2xl bg-gray-100">
          <div className="h-2 bg-gray-200">
            <div className="h-2 bg-[#7B3434] transition-all duration-300" style={{ width: `${((currentStep - 1) / (steps.length - 1) * 100)}%` }} />
          </div>
        </div>

        <div className="w-full px-4">
          {renderCurrentStep()}
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between w-full px-4">
        <button
          type="button"
          disabled={currentStep === 1}
          onClick={prevStep}
          className="inline-flex items-center justify-center rounded-full bg-[#ACD23C] px-8 py-4 text-sm font-semibold text-gray-900 transition hover:bg-[#9bb82a] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        {currentStep === steps.length ? (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={(e) => handleSubmit(e as any)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#7B3434] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#6a2d2d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={nextStep}
            className="inline-flex items-center justify-center rounded-full bg-[#7B3434] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#6a2d2d]"
          >
            Next
          </button>
        )}
      </div>
    </form>
  );
}
