import { supabase } from '@/lib/supabase';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { bookingData, email, name, subject, message } = req.body;

    // Validation
    if (!bookingData || !email || !name) {
      return res.status(400).json({ message: 'Required booking data is missing' });
    }

    // Get user from auth
    const authHeader = req.headers.authorization;
    let userId = null;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      
      if (!authError && user) {
        // Find user in candidates table
        const { data: candidateData } = await supabase
          .from("candidates")
          .select("id")
          .eq("auth_user_id", user.id)
          .single();
        
        if (candidateData) {
          userId = candidateData.id;
        }
      }
    }

    // If no user found from auth, try to find by email
    if (!userId) {
      const { data: candidateData } = await supabase
        .from("candidates")
        .select("id")
        .eq("primaryContactEmail", email)
        .single();
      
      if (candidateData) {
        userId = candidateData.id;
      }
    }

    // Save booking to database
    const bookingRecord = {
      user_id: userId,
      access_hub_id: bookingData.accessHub?.id || null,
      access_hub_title: bookingData.accessHub?.title || 'Unknown Hub',
      name: bookingData.name,
      email: bookingData.email,
      company: bookingData.company,
      phone: bookingData.phone,
      space_type: bookingData.spaceType,
      booking_date: bookingData.date,
      start_time: bookingData.startTime,
      end_time: bookingData.endTime,
      duration: bookingData.duration,
      attendees: bookingData.attendees,
      purpose: bookingData.purpose,
      budget_range: bookingData.budget,
      requirements: bookingData.requirements,
      is_recurring: bookingData.recurring || false,
      recurring_type: bookingData.recurringType,
      recurring_end_date: bookingData.recurringEnd,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    const { data: savedBooking, error: dbError } = await supabase
      .from('access_hub_bookings')
      .insert(bookingRecord)
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // Continue with email sending even if DB save fails
    }

    // Send email notification (existing email logic)
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email to support team
    const mailOptions = {
      from: `"PAAN Member Portal" <${process.env.EMAIL_USER}>`,
      to: process.env.SUPPORT_EMAIL,
      replyTo: email,
      subject: subject,
      html: message,
    };

    await transporter.sendMail(mailOptions);

    // Send confirmation email to user
    const confirmationMailOptions = {
      from: `"PAAN Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your space booking request has been received`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #172840 0%, #1e3a5f 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Booking Request Received</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for your space booking request</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="color: #172840; font-size: 16px; margin: 0 0 20px 0;">
              Dear ${name},
            </p>
            
            <p style="color: #495057; line-height: 1.6; margin: 0 0 20px 0;">
              We've received your space booking request and will confirm availability and pricing details within 24 hours. Our team will contact you to finalize the booking and provide any additional information you may need.
            </p>

            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #172840; margin: 20px 0;">
              <p style="margin: 0 0 10px 0;"><strong>Booking Reference:</strong> ${savedBooking?.id || 'N/A'}</p>
              <p style="margin: 0 0 10px 0;"><strong>Space:</strong> ${bookingData.spaceType}</p>
              <p style="margin: 0 0 10px 0;"><strong>Date:</strong> ${new Date(bookingData.date).toLocaleDateString()}</p>
              <p style="margin: 0 0 10px 0;"><strong>Time:</strong> ${bookingData.startTime} - ${bookingData.endTime}</p>
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
        </div>
      `,
    };

    await transporter.sendMail(confirmationMailOptions);

    res.status(200).json({ 
      message: 'Booking request submitted successfully',
      bookingId: savedBooking?.id
    });
  } catch (error) {
    console.error('Error processing booking:', error);
    res.status(500).json({ message: 'Failed to process booking. Please try again later.' });
  }
}