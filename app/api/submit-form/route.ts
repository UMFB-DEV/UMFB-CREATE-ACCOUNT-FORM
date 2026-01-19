import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Simple in-memory rate limiter (in production, use Redis or database)
const submissionCounts = new Map<string, { count: number; lastSubmission: number }>();

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours

function checkRateLimit(ip: string): { allowed: boolean; message?: string } {
  const now = Date.now();
  const userData = submissionCounts.get(ip);

  if (!userData) {
    submissionCounts.set(ip, { count: 1, lastSubmission: now });
    return { allowed: true };
  }

  // Reset count if window has passed
  if (now - userData.lastSubmission > RATE_LIMIT_WINDOW) {
    submissionCounts.set(ip, { count: 1, lastSubmission: now });
    return { allowed: true };
  }

  // Check if under limit
  if (userData.count >= RATE_LIMIT_MAX) {
    const timeUntilReset = RATE_LIMIT_WINDOW - (now - userData.lastSubmission);
    const hoursLeft = Math.ceil(timeUntilReset / (60 * 60 * 1000));
    return {
      allowed: false,
      message: `Rate limit exceeded. You can submit again in ${hoursLeft} hours.`
    };
  }

  // Increment count
  userData.count++;
  return { allowed: true };
}

function updateRateLimit(ip: string) {
  const now = Date.now();
  const userData = submissionCounts.get(ip);

  if (userData) {
    userData.count++;
    userData.lastSubmission = now;
  } else {
    submissionCounts.set(ip, { count: 1, lastSubmission: now });
  }
}

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Check rate limit
    const rateLimitResult = checkRateLimit(ip);
    if (!rateLimitResult.allowed) {
      console.log(`Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        { success: false, message: rateLimitResult.message },
        { status: 429 }
      );
    }

    const formData = await request.formData();

    // Check honeypot field
    const honeypot = formData.get('honeypot');
    if (honeypot && honeypot.toString().trim() !== '') {
      // Likely spam - silently reject
      return NextResponse.json(
        { success: false, message: 'Form submission rejected.' },
        { status: 400 }
      );
    }

    // Prepare email content
    let emailContent = 'New Account Opening Form Submission\n\n';

    // Add form fields to email
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const attachments: any[] = [];
    let fileCount = 0;

    console.log('Processing form data...');
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        // Handle file attachments
        console.log(`Processing file: ${key} - ${value.name} (${value.size} bytes, type: ${value.type})`);
        const buffer = Buffer.from(await value.arrayBuffer());
        attachments.push({
          filename: value.name,
          content: buffer,
          contentType: value.type,
        });
        emailContent += `${key}: ${value.name} (${value.size} bytes)\n`;
        fileCount++;
      } else {
        emailContent += `${key}: ${value}\n`;
      }
    }

    console.log(`Total files attached: ${fileCount}`);
    console.log('Attachments array length:', attachments.length);

    // Send email
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: 'New Account Opening Form Submission',
      text: emailContent,
      attachments: attachments,
    };

    await transporter.sendMail(mailOptions);

    // Update rate limit after successful submission
    updateRateLimit(ip);

    console.log('Email sent successfully');

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully! Email sent.'
    });

  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while processing your submission.' },
      { status: 500 }
    );
  }
}

