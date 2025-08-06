import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: `"PAAN Member Portal Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.SUPPORT_EMAIL,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #172840 0%, #1e3a5f 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">PAAN Member Portal Contact Form</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">New message from member portal</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="margin-bottom: 20px;">
              <h2 style="color: #172840; margin: 0 0 10px 0; font-size: 18px;">Message Details</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #172840;">
                <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${name} (${email})</p>
                <p style="margin: 0 0 10px 0;"><strong>Subject:</strong> ${subject}</p>
                <p style="margin: 0;"><strong>Message:</strong></p>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px; white-space: pre-wrap;">${message}</div>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
              <p style="color: #6c757d; font-size: 14px; margin: 0;">
                This message was sent from the PAAN Member Portal contact form.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send confirmation email to the user
    const confirmationMailOptions = {
      from: `"PAAN Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank you for contacting PAAN',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #172840 0%, #1e3a5f 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Message Received</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for reaching out to PAAN</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="color: #172840; font-size: 16px; margin: 0 0 20px 0;">
              Dear ${name},
            </p>
            
            <p style="color: #495057; line-height: 1.6; margin: 0 0 20px 0;">
              Thank you for contacting PAAN. We have received your message and our support team will get back to you as soon as possible.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #172840; margin: 20px 0;">
              <p style="margin: 0 0 10px 0;"><strong>Your Message:</strong></p>
              <p style="margin: 0 0 10px 0;"><strong>Subject:</strong> ${subject}</p>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${message}</div>
            </div>
            
            <p style="color: #495057; line-height: 1.6; margin: 20px 0 0 0;">
              If you have any urgent inquiries, please don't hesitate to reach out to us directly at 
              <a href="mailto:${process.env.SUPPORT_EMAIL}" style="color: #172840;">${process.env.SUPPORT_EMAIL}</a>
            </p>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
              <p style="color: #6c757d; font-size: 14px; margin: 0;">
                Best regards,<br>
                The PAAN Team
              </p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(confirmationMailOptions);

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
} 