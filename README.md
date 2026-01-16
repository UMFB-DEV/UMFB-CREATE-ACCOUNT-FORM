# Account Opening Form

A secure, responsive multi-step contact form built with Next.js, designed for embedding in WordPress via iframe. Features comprehensive validation, file uploads, and anti-spam protection.

## Features

- ✅ **Multi-step Form**: 5-step process for better user experience
- ✅ **Zod Validation**: Client-side validation with user-friendly error messages
- ✅ **File Uploads**: Secure file handling with size and type validation
- ✅ **Responsive Design**: Mobile-first design with Tailwind CSS
- ✅ **Anti-spam Protection**: Hidden honeypot field (no reCAPTCHA)
- ✅ **TypeScript**: Full type safety throughout the application
- ✅ **Form Persistence**: Data retained when navigating between steps

## Form Steps

1. **Personal Information** - Basic details, contact info, identification
2. **Employment Information** - Work details and PEP status
3. **Next of Kin** - Emergency contact information
4. **Spouse Information** - Optional spouse details
5. **File Uploads** - Required documents (ID, passport photo, signature, utility bill)

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Validation**: Zod with react-hook-form
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-form
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## WordPress Integration

### Embedding via Iframe

To embed this form in WordPress, use the following iframe code:

```html
<iframe
  src="https://your-domain.vercel.app"
  width="100%"
  height="800"
  frameborder="0"
  style="border: none; min-height: 600px;"
  title="Account Opening Form">
</iframe>
```

### Responsive Iframe

For better responsiveness, you can use this enhanced version:

```html
<div style="position: relative; width: 100%; height: 0; padding-bottom: 75%; overflow: hidden;">
  <iframe
    src="https://your-domain.vercel.app"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
    title="Account Opening Form">
  </iframe>
</div>
```

## File Upload Specifications

- **Maximum file size**: 5MB per file
- **Accepted formats**:
  - Images: JPEG, JPG, PNG
  - Documents: PDF, JPEG, JPG, PNG
- **Required files**:
  - ID Document
  - Passport Photo
  - Signature
  - Utility Bill

## Validation Rules

- **Email**: Valid email format required
- **Phone**: Minimum 10 digits
- **BVN/NIN**: Exactly 11 digits
- **All required fields**: Must be filled
- **Anti-spam**: Honeypot field (invisible to users)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Manual Deployment

```bash
npm run build
npm start
```

### Environment Variables

For email functionality (future implementation), add these environment variables:

```env
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-password
FROM_EMAIL=noreply@yourdomain.com
TO_EMAIL=admin@yourdomain.com
```

## API Routes

### POST `/api/submit-form`

Accepts FormData with all form fields and files. Returns JSON response:

```json
{
  "success": true,
  "message": "Form submitted successfully!"
}
```

## Project Structure

```
├── app/
│   ├── api/
│   │   └── submit-form/
│   │       └── route.ts          # Form submission API
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main form page
├── components/
│   ├── MultiStepForm.tsx         # Main form component
│   └── steps/
│       ├── PersonalInfoStep.tsx  # Step 1
│       ├── EmploymentInfoStep.tsx # Step 2
│       ├── NextOfKinStep.tsx     # Step 3
│       ├── SpouseInfoStep.tsx    # Step 4
│       └── FileUploadsStep.tsx   # Step 5
├── lib/
│   └── validation.ts             # Zod schemas
└── README.md
```

## Security Features

- **Honeypot Field**: Hidden field to catch spam bots
- **File Validation**: Size and type restrictions
- **Input Sanitization**: Zod validation on all inputs
- **CSRF Protection**: Next.js built-in protection

## Customization

### Styling

The form uses Tailwind CSS classes. Modify `app/globals.css` for global styles or update component classes directly.

### Validation Messages

Update validation messages in `lib/validation.ts` to customize error messages.

### Form Fields

Add or modify form fields by updating the Zod schemas and corresponding step components.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
