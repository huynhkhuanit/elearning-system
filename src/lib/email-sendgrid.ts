export async function sendEmailViaSendGrid(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<void> {
  try {
    const moduleName = '@sendgrid/mail';
    const sgMail = eval(`require('${moduleName}')`);

    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY is not configured');
    }

    sgMail.setApiKey(apiKey);

    const msg = {
      to: options.to,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@yourdomain.com',
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''),
    };

    await sgMail.send(msg);
    console.log('✅ Email sent via SendGrid');
  } catch (error: any) {
    if (error.code === 'MODULE_NOT_FOUND' || error.message?.includes('Cannot find module')) {
      throw new Error('SendGrid package not installed. Run: npm install @sendgrid/mail');
    }
    console.error('❌ SendGrid email error:', error);
    throw error;
  }
}

