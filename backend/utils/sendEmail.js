const nodemailer = require('nodemailer');
const asyncHandler = require('./asyncHandler');
const CustomErrorHandler = require('./CustomErrorHandler');

const sendEmail = async ( options, retries = 5) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log("Verification url:", options);
      //It creates a transporter object using the nodemailer library. This transporter is configured with SMTP settings such as host, port, and authentication details (user and pass) which are retrieved from environment variables.    
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      })

      const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: `
         <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #8B6F47 0%, #6B5437 100%); color: white; padding: 40px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
          .content { padding: 40px 30px; }
          .content h2 { color: #8B6F47; margin-bottom: 20px; font-size: 24px; }
          .content p { margin-bottom: 15px; color: #555; font-size: 16px; }
          .button-container { text-align: center; margin: 30px 0; }
          .button { display: inline-block; padding: 15px 40px; background: #8B6F47; color: white !important; text-decoration: none; border-radius: 5px; font-weight: 600; font-size: 16px; transition: background 0.3s; }
          .button:hover { background: #6B5437; }
          .link-box { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; word-break: break-all; }
          .link-box p { margin: 0; color: #8B6F47; font-size: 14px; }
          .info-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 3px; }
          .info-box p { margin: 0; color: #856404; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
          .footer p { margin: 5px 0; }
          .social-links { margin: 15px 0; }
          .social-links a { display: inline-block; margin: 0 10px; color: #8B6F47; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🪑 Aura Vista Furniture</h1>
          </div>
          
          <div class="content">
            <h2>Verify Your Email Address</h2>
            <p>Hello <strong>${options.data.name}</strong>,</p>
            <p>Thank you for registering with Aura Vista Furniture! We're excited to have you join our community.</p>
            <p>To complete your registration and start shopping, please verify your email address by clicking the button below:</p>
            
            <div class="button-container">
              <a href="${options.data.verificationUrl}" class="button">Verify Email Address</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <div class="link-box">
              <p>${options.data.verificationUrl}</p>
            </div>
            
            <div class="info-box">
              <p><strong>⏰ Important:</strong> This verification link will expire in 24 hours. If you didn't create an account, please ignore this email.</p>
            </div>
            
            <p>Once verified, you'll be able to:</p>
            <ul style="margin-left: 20px; color: #555;">
              <li>Browse our exclusive furniture collections</li>
              <li>Save items to your wishlist</li>
              <li>Track your orders</li>
              <li>Receive personalized recommendations</li>
            </ul>
          </div>
          
          <div class="footer">
            <p><strong>Need Help?</strong></p>
            <p>Contact us at <a href="mailto:support@auravistafurniture.com" style="color: #8B6F47;">support@auravistafurniture.com</a></p>
            <div class="social-links">
              <a href="#">Facebook</a> | 
              <a href="#">Instagram</a> | 
              <a href="#">Twitter</a>
            </div>
            <p style="margin-top: 15px;">&copy; 2024 Aura Vista Furniture. All rights reserved.</p>
            <p style="font-size: 12px; color: #999;">123 Savaliya Circle, Yogichowk, Surat, Gujarat</p>
          </div>
        </div>
      </body>
      </html>
              `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: %s', info.messageId);

      return {
        success: true,
        messageId: info.messageId
      }

    } catch (err) {
      console.error('Error sending email:', err);

      if (attempt === retries) {
        throw new CustomErrorHandler('Email could not be sent after multiple attempts');
      }

      // Wait before retry (exponential backoff)
      await new Promise(res => setTimeout(res, 1000 * Math.pow(2, attempt)));
    }



  }

};

module.exports = sendEmail;
