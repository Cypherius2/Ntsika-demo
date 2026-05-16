import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email, orderNumber, status, customerName } = await req.json();

    if (!email || !orderNumber || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Insika Kitchen <orders@insika.kitchen>', // This might need a verified domain in production, using a placeholder
      to: [email],
      subject: `Order Update: #${orderNumber}`,
      html: `
        <div style="font-family: serif; color: #3E2723; padding: 40px; background-color: #FDFBF7;">
          <h1 style="font-size: 32px; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">Insika Kitchen.</h1>
          <p style="font-size: 18px; margin-top: 30px;">Hello ${customerName || 'Customer'},</p>
          <p style="font-size: 16px; line-height: 1.6;">Your order <strong>#${orderNumber}</strong> has been updated to: <span style="color: #D4AF37; font-weight: bold; text-transform: uppercase;">${status}</span>.</p>
          <p style="font-size: 14px; color: #3E2723; opacity: 0.6; margin-top: 40px;">
            Thank you for choosing Insika Kitchen. We are crafting your treats with passion.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('Notification API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
