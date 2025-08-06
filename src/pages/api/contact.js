import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { 
      name, 
      email, 
      subject, 
      message, 
      formType = "general",
      companyName,
      partnerAgencyName,
      partnerAgencyContact,
      projectValue,
      servicesCombined,
      outsourcingScope,
      whiteLabelRequired,
      deliveryTimeline,
      projectType,
      freelancerSkills,
      freelancerLocation,
      projectDuration,
      budgetRange
    } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Required fields are missing' });
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

    // Generate email content based on form type
    const generateEmailContent = () => {
      const baseContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #172840 0%, #1e3a5f 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">PAAN Member Portal - ${formType.toUpperCase()} Request</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">New request from member portal</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="margin-bottom: 20px;">
              <h2 style="color: #172840; margin: 0 0 10px 0; font-size: 18px;">Contact Information</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #172840;">
                <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 0 0 10px 0;"><strong>Company:</strong> ${companyName || 'Not provided'}</p>
              </div>
            </div>`;

      let specificContent = '';
      
      switch (formType) {
        case 'co-bidding':
          specificContent = `
            <div style="margin-bottom: 20px;">
              <h2 style="color: #172840; margin: 0 0 10px 0; font-size: 18px;">Co-Bidding Details</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #172840;">
                <p style="margin: 0 0 10px 0;"><strong>Partner Agency:</strong> ${partnerAgencyName || 'Not specified'}</p>
                <p style="margin: 0 0 10px 0;"><strong>Partner Contact:</strong> ${partnerAgencyContact || 'Not specified'}</p>
                <p style="margin: 0 0 10px 0;"><strong>Project Value:</strong> ${projectValue || 'Not specified'}</p>
                <p style="margin: 0 0 10px 0;"><strong>Services to Combine:</strong></p>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px; white-space: pre-wrap;">${servicesCombined || 'Not specified'}</div>
              </div>
            </div>`;
          break;
          
        case 'outsource':
          specificContent = `
            <div style="margin-bottom: 20px;">
              <h2 style="color: #172840; margin: 0 0 10px 0; font-size: 18px;">Outsourcing Details</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #172840;">
                <p style="margin: 0 0 10px 0;"><strong>Scope to Outsource:</strong> ${outsourcingScope || 'Not specified'}</p>
                <p style="margin: 0 0 10px 0;"><strong>Project Budget:</strong> ${projectValue || 'Not specified'}</p>
                <p style="margin: 0 0 10px 0;"><strong>Delivery Timeline:</strong> ${deliveryTimeline || 'Not specified'}</p>
                <p style="margin: 0 0 10px 0;"><strong>White-label Required:</strong> ${whiteLabelRequired ? 'Yes' : 'No'}</p>
              </div>
            </div>`;
          break;
          
        default:
          specificContent = `
            <div style="margin-bottom: 20px;">
              <h2 style="color: #172840; margin: 0 0 10px 0; font-size: 18px;">Message Details</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #172840;">
                <p style="margin: 0 0 10px 0;"><strong>Subject:</strong> ${subject || 'Not specified'}</p>
              </div>
            </div>`;
      }

      const messageContent = `
        <div style="margin-bottom: 20px;">
          <h2 style="color: #172840; margin: 0 0 10px 0; font-size: 18px;">Message</h2>
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #172840;">
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${message}</div>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
          <p style="color: #6c757d; font-size: 14px; margin: 0;">
            This request was submitted from the PAAN Member Portal.
          </p>
        </div>
      </div>
    </div>`;

      return baseContent + specificContent + messageContent;
    };

    // Email content
    const mailOptions = {
      from: `"PAAN Member Portal" <${process.env.EMAIL_USER}>`,
      to: process.env.SUPPORT_EMAIL,
      replyTo: email,
      subject: `${formType.charAt(0).toUpperCase() + formType.slice(1)} Request - ${subject || 'New Request'}`,
      html: generateEmailContent(),
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send confirmation email to the user
    const generateConfirmationContent = () => {
      const baseContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #172840 0%, #1e3a5f 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Request Received</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for your ${formType} request</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="color: #172840; font-size: 16px; margin: 0 0 20px 0;">
              Dear ${name},
            </p>
            
            <p style="color: #495057; line-height: 1.6; margin: 0 0 20px 0;">
              Thank you for submitting your ${formType} request to PAAN. We have received your details and our team will review your requirements and get back to you within 24-48 hours.
            </p>`;

      let specificMessage = '';
      
      switch (formType) {
        case 'co-bidding':
          specificMessage = `
            <p style="color: #495057; line-height: 1.6; margin: 0 0 20px 0;">
              We'll help you find the perfect agency partner for your co-bidding opportunity and guide you through the partnership process.
            </p>`;
          break;
          
        case 'outsource':
          specificMessage = `
            <p style="color: #495057; line-height: 1.6; margin: 0 0 20px 0;">
              We'll connect you with vetted PAAN agencies that can help deliver your project requirements efficiently and professionally.
            </p>`;
          break;
          
        default:
          specificMessage = `
            <p style="color: #495057; line-height: 1.6; margin: 0 0 20px 0;">
              We'll review your request and provide you with the best possible solution for your needs.
            </p>`;
      }

      const footerContent = `
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #172840; margin: 20px 0;">
              <p style="margin: 0 0 10px 0;"><strong>Your Request Type:</strong> ${formType.charAt(0).toUpperCase() + formType.slice(1)}</p>
              <p style="margin: 0 0 10px 0;"><strong>Company:</strong> ${companyName || 'Not provided'}</p>
            </div>
            
            <p style="color: #495057; line-height: 1.6; margin: 20px 0 0 0;">
              If you have any urgent questions, please don't hesitate to reach out to us directly at 
              <a href="mailto:${process.env.SUPPORT_EMAIL}" style="color: #172840;">${process.env.SUPPORT_EMAIL}</a>
            </p>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
              <p style="color: #6c757d; font-size: 14px; margin: 0;">
                Best regards,<br>
                The PAAN Team
              </p>
            </div>
          </div>
        </div>`;

      return baseContent + specificMessage + footerContent;
    };

    const confirmationMailOptions = {
      from: `"PAAN Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your ${formType} request has been received`,
      html: generateConfirmationContent(),
    };

    await transporter.sendMail(confirmationMailOptions);

    res.status(200).json({ message: 'Request submitted successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send request. Please try again later.' });
  }
} 