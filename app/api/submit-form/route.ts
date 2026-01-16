import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
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

    // For now, just return success
    // TODO: Add email sending and file storage logic

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully!'
    });

  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while processing your submission.' },
      { status: 500 }
    );
  }
}
