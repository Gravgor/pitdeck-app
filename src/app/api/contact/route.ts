import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, category, subject, message } = body;

    // Save to database
    await prisma.contact.create({
      data: {
        name,
        email,
        category,
        subject,
        message,
        status: 'PENDING'
      }
    });

    // Here you could also send an email notification to your support team
    
    return new NextResponse('Message sent successfully', { status: 200 });
  } catch (error) {
    console.error('[CONTACT_ERROR]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 