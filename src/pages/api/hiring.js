import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { 
      name, 
      email, 
      companyName, 
      projectType, 
      budgetRange, 
      timeline, 
      skillsNeeded, 
      message, 
      subject,
      terms 
    } = req.body;

    // Validation
    if (!name || !email || !projectType || !budgetRange || !timeline || !message || !terms) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // Terms acceptance validation
    if (!terms) {
      return res.status(400).json({ message: 'You must accept the terms & conditions and privacy policy' });
    }

    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content for freelancing team
    const mailOptions = {
      from: `"PAAN Hiring Request" <${process.env.EMAIL_USER}>`,
      to: process.env.FREELANCER_EMAIL,
      replyTo: email,
      subject: `Hiring Request - ${projectType}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #172840 0%, #1e3a5f 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">PAAN Hiring Request</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">New hiring request from member portal</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="margin-bottom: 20px;">
              <h2 style="color: #172840; margin: 0 0 10px 0; font-size: 18px;">Client Information</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #172840;">
                <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 0 0 10px 0;"><strong>Company:</strong> ${companyName || 'Not provided'}</p>
              </div>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h2 style="color: #172840; margin: 0 0 10px 0; font-size: 18px;">Project Details</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #172840;">
                <p style="margin: 0 0 10px 0;"><strong>Project Type:</strong> ${projectType}</p>
                <p style="margin: 0 0 10px 0;"><strong>Budget Range:</strong> ${budgetRange}</p>
                <p style="margin: 0 0 10px 0;"><strong>Timeline:</strong> ${timeline}</p>
                <p style="margin: 0 0 10px 0;"><strong>Skills Needed:</strong> ${skillsNeeded || 'Not specified'}</p>
              </div>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h2 style="color: #172840; margin: 0 0 10px 0; font-size: 18px;">Project Description</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #172840;">
                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${message}</div>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
              <p style="color: #6c757d; font-size: 14px; margin: 0;">
                This hiring request was submitted from the PAAN Member Portal.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    // Send email to freelancing team
    await transporter.sendMail(mailOptions);

    // Send confirmation email to the client
    const confirmationMailOptions = {
      from: `"PAAN Freelancing Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your hiring request has been received',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #172840 0%, #1e3a5f 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Hiring Request Received</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for choosing PAAN for your hiring needs</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="color: #172840; font-size: 16px; margin: 0 0 20px 0;">
              Dear ${name},
            </p>
            
            <p style="color: #495057; line-height: 1.6; margin: 0 0 20px 0;">
              Thank you for submitting your hiring request to PAAN. We have received your project details and our freelancing team will review your requirements and connect you with the perfect talent for your project.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #172840; margin: 20px 0;">
              <p style="margin: 0 0 10px 0;"><strong>Your Project:</strong></p>
              <p style="margin: 0 0 10px 0;"><strong>Type:</strong> ${projectType}</p>
              <p style="margin: 0 0 10px 0;"><strong>Budget:</strong> ${budgetRange}</p>
              <p style="margin: 0 0 10px 0;"><strong>Timeline:</strong> ${timeline}</p>
            </div>
            
            <p style="color: #495057; line-height: 1.6; margin: 20px 0 0 0;">
              You can expect to hear from our team within 24-48 hours with recommendations and next steps. If you have any urgent questions, please don't hesitate to reach out to us at 
              <a href="mailto:${process.env.FREELANCER_EMAIL}" style="color: #172840;">${process.env.FREELANCER_EMAIL}</a>
            </p>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
              <p style="color: #6c757d; font-size: 14px; margin: 0;">
                Best regards,<br>
                The PAAN Freelancing Team
              </p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(confirmationMailOptions);

    res.status(200).json({ message: 'Hiring request submitted successfully' });
  } catch (error) {
    console.error('Error sending hiring request:', error);
    res.status(500).json({ message: 'Failed to submit hiring request. Please try again later.' });
  }
} 