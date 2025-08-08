import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

// Create a service role client for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { bookingData, email, name, subject, message, userId: frontendUserId } = req.body;

    // Validation
    if (!bookingData || !email || !name) {
      return res.status(400).json({ message: 'Required booking data is missing' });
    }

    // Get user from auth token
    const authHeader = req.headers.authorization;
    let userId = null;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      
      // Verify the token and get user
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
      
      if (!authError && user) {
        // Find user in candidates table
        const { data: candidateData, error: candidateError } = await supabaseAdmin
          .from("candidates")
          .select("id, primaryContactEmail")
          .eq("auth_user_id", user.id)
          .single();
        
        if (candidateData) {
          userId = candidateData.id;
        }
      }
    }

    // If no user found from auth, try to find by email
    if (!userId) {
      const { data: candidateData, error: emailError } = await supabaseAdmin
        .from("candidates")
        .select("id")
        .eq("primaryContactEmail", email)
        .single();
      
      if (candidateData) {
        userId = candidateData.id;
      }
    }

    // If still no user ID, try using the frontend user ID and look it up
    if (!userId && frontendUserId) {
      const { data: candidateData, error: frontendError } = await supabaseAdmin
        .from("candidates")
        .select("id")
        .eq("auth_user_id", frontendUserId)
        .single();
      
      if (candidateData) {
        userId = candidateData.id;
      }
    }

    // Save booking to database
    let savedBooking = null;
    
    if (userId) {
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

      const { data: insertedBooking, error: dbError } = await supabaseAdmin
        .from('access_hub_bookings')
        .insert(bookingRecord)
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        // Continue with email sending even if DB save fails
      } else {
        savedBooking = insertedBooking;
      }
    } else {
      console.warn('No user ID found, booking will not be saved to database');
    }

    // Send email notification (existing email logic)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Create formatted HTML message for admin
    const spaceTypeLabel = bookingData.spaceType || 'Not specified';
    const budgetLabel = bookingData.budget || 'Not specified';
    
    const adminHtmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #172840 0%, #1e3a5f 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🏢 SPACE BOOKING REQUEST</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">New booking request from member portal</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <div style="margin-bottom: 20px;">
            <h2 style="color: #172840; margin: 0 0 10px 0; font-size: 18px;">👤 Contact Information</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #172840;">
              <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${bookingData.name}</p>
              <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${bookingData.email}</p>
              <p style="margin: 0 0 10px 0;"><strong>Company:</strong> ${bookingData.company || 'Not provided'}</p>
              <p style="margin: 0 0 10px 0;"><strong>Phone:</strong> ${bookingData.phone}</p>
            </div>
          </div>

          <div style="margin-bottom: 20px;">
            <h2 style="color: #172840; margin: 0 0 10px 0; font-size: 18px;">📅 Booking Details</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #172840;">
              <p style="margin: 0 0 10px 0;"><strong>Space Type:</strong> ${spaceTypeLabel}</p>
              <p style="margin: 0 0 10px 0;"><strong>Date:</strong> ${new Date(bookingData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p style="margin: 0 0 10px 0;"><strong>Time:</strong> ${bookingData.startTime} - ${bookingData.endTime} (${bookingData.duration} hours)</p>
              <p style="margin: 0 0 10px 0;"><strong>Number of Attendees:</strong> ${bookingData.attendees}</p>
              <p style="margin: 0 0 10px 0;"><strong>Purpose:</strong> ${bookingData.purpose || 'Not specified'}</p>
              <p style="margin: 0 0 10px 0;"><strong>Budget Range:</strong> ${budgetLabel}</p>
              ${bookingData.recurring ? `
              <p style="margin: 0 0 10px 0;"><strong>Recurring:</strong> ${bookingData.recurringType} ${bookingData.recurringEnd ? `until ${new Date(bookingData.recurringEnd).toLocaleDateString()}` : ''}</p>
              ` : ''}
            </div>
          </div>

          ${bookingData.requirements ? `
          <div style="margin-bottom: 20px;">
            <h2 style="color: #172840; margin: 0 0 10px 0; font-size: 18px;">📝 Additional Requirements</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #172840;">
              <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${bookingData.requirements}</div>
            </div>
          </div>
          ` : ''}

          ${bookingData.accessHub ? `
          <div style="margin-bottom: 20px;">
            <h2 style="color: #172840; margin: 0 0 10px 0; font-size: 18px;">🏢 Access Hub Information</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #172840;">
              <p style="margin: 0 0 10px 0;"><strong>Hub:</strong> ${bookingData.accessHub.title}</p>
              ${bookingData.accessHub.city ? `<p style="margin: 0 0 10px 0;"><strong>Location:</strong> ${bookingData.accessHub.city}</p>` : ''}
            </div>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
            <p style="color: #6c757d; font-size: 14px; margin: 0;">
              This booking request was submitted from the PAAN Member Portal.
            </p>
            ${savedBooking ? `<p style="color: #6c757d; font-size: 12px; margin: 5px 0 0 0;">Booking ID: ${savedBooking.id}</p>` : ''}
          </div>
        </div>
      </div>
    `;

    // Send email to support team
    const mailOptions = {
      from: `"PAAN Member Portal" <${process.env.EMAIL_USER}>`,
      to: process.env.SUPPORT_EMAIL,
      replyTo: email,
      subject: subject,
      html: adminHtmlMessage,
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