import { Resend } from 'resend'

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY)

export const emailService = {
  // Send welcome email
  sendWelcomeEmail: async (to, name) => {
    try {
      const { data, error } = await resend.emails.send({
        from: 'Matrix Marketplace <noreply@matrixmarketplace.com>',
        to: [to],
        subject: 'Welcome to Matrix Marketplace!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Matrix Marketplace!</h1>
            </div>
            <div style="padding: 40px 20px; background: #f9fafb;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">Hi ${name},</h2>
              <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                Thank you for joining Matrix Marketplace! We're excited to have you as part of our community.
              </p>
              <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
                You can now start buying and selling items with confidence. Our platform offers:
              </p>
              <ul style="color: #4b5563; line-height: 1.8; margin-bottom: 30px;">
                <li>Secure payment processing</li>
                <li>Verified seller profiles</li>
                <li>24/7 customer support</li>
                <li>Buyer protection guarantee</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${import.meta.env.VITE_FRONTEND_URL || 'http://localhost:3000'}/marketplace" 
                   style="background: linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Start Exploring
                </a>
              </div>
              <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 40px;">
                If you have any questions, feel free to contact our support team.
              </p>
            </div>
          </div>
        `,
      })

      if (error) {
        console.error('Email sending error:', error)
        return { success: false, error }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Email service error:', error)
      return { success: false, error: error.message }
    }
  },

  // Send item inquiry notification
  sendItemInquiry: async (sellerEmail, sellerName, itemName, buyerName, message) => {
    try {
      const { data, error } = await resend.emails.send({
        from: 'Matrix Marketplace <noreply@matrixmarketplace.com>',
        to: [sellerEmail],
        subject: `New inquiry about your item: ${itemName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%); padding: 30px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">New Item Inquiry</h1>
            </div>
            <div style="padding: 30px 20px; background: #f9fafb;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">Hi ${sellerName},</h2>
              <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                You have received a new inquiry about your item: <strong>${itemName}</strong>
              </p>
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9; margin: 20px 0;">
                <p style="color: #1f2937; margin: 0;"><strong>From:</strong> ${buyerName}</p>
                <p style="color: #4b5563; margin: 10px 0 0 0;"><strong>Message:</strong></p>
                <p style="color: #4b5563; margin: 10px 0 0 0; font-style: italic;">"${message}"</p>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${import.meta.env.VITE_FRONTEND_URL || 'http://localhost:3000'}/inbox" 
                   style="background: linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Reply to Inquiry
                </a>
              </div>
            </div>
          </div>
        `,
      })

      if (error) {
        console.error('Email sending error:', error)
        return { success: false, error }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Email service error:', error)
      return { success: false, error: error.message }
    }
  },

  // Send contact form submission
  sendContactForm: async (formData) => {
    try {
      const { data, error } = await resend.emails.send({
        from: 'Matrix Marketplace <noreply@matrixmarketplace.com>',
        to: ['support@matrixmarketplace.com'],
        subject: `Contact Form: ${formData.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%); padding: 30px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
            </div>
            <div style="padding: 30px 20px; background: #f9fafb;">
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #1f2937; margin: 0 0 15px 0;">Contact Details</h3>
                <p style="color: #4b5563; margin: 5px 0;"><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
                <p style="color: #4b5563; margin: 5px 0;"><strong>Email:</strong> ${formData.email}</p>
                <p style="color: #4b5563; margin: 5px 0;"><strong>Subject:</strong> ${formData.subject}</p>
              </div>
              <div style="background: white; padding: 20px; border-radius: 8px;">
                <h3 style="color: #1f2937; margin: 0 0 15px 0;">Message</h3>
                <p style="color: #4b5563; line-height: 1.6; margin: 0;">${formData.message}</p>
              </div>
            </div>
          </div>
        `,
      })

      if (error) {
        console.error('Email sending error:', error)
        return { success: false, error }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Email service error:', error)
      return { success: false, error: error.message }
    }
  }
}

export default emailService