import nodemailer from 'nodemailer';
import { IComplaint } from '../models/Complaint';

// Create reusable transporter object using SMTP transport (fail-safe)
const createTransporter = () => {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD } = process.env as Record<string, string | undefined>;
  if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASSWORD) {
    return null;
  }
  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: parseInt(EMAIL_PORT || '587'),
    secure: EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });
};

export const sendNewComplaintEmail = async (complaint: IComplaint) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.warn('[email] SMTP not configured. Skipping admin notification.');
      return { success: true, skipped: true } as any;
    }
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `New Complaint Submitted: ${complaint.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Complaint Received
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">Complaint Details</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 120px;">Title:</td>
                <td style="padding: 8px 0;">${complaint.title}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Category:</td>
                <td style="padding: 8px 0;">${complaint.category}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Priority:</td>
                <td style="padding: 8px 0;">
                  <span style="background-color: ${
                    complaint.priority === 'High' ? '#dc3545' : 
                    complaint.priority === 'Medium' ? '#ffc107' : '#28a745'
                  }; color: white; padding: 2px 8px; border-radius: 3px; font-size: 12px;">
                    ${complaint.priority}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Status:</td>
                <td style="padding: 8px 0;">${complaint.status}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Date:</td>
                <td style="padding: 8px 0;">${new Date(complaint.dateSubmitted).toLocaleDateString()}</td>
              </tr>
              ${complaint.customerName ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Customer:</td>
                <td style="padding: 8px 0;">${complaint.customerName}</td>
              </tr>
              ` : ''}
              ${complaint.email ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                <td style="padding: 8px 0;">${complaint.email}</td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px;">
            <h4 style="color: #333; margin-top: 0;">Description:</h4>
            <p style="line-height: 1.6; color: #555;">${complaint.description}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #e9ecef; border-radius: 5px;">
            <p style="margin: 0; font-size: 14px; color: #666;">
              Please log in to the admin dashboard to manage this complaint.
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('New complaint email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending new complaint email:', error);
    return { success: false, error: (error as Error).message };
  }
};

export const sendStatusUpdateEmail = async (complaint: IComplaint) => {
  try {
    // Only send status update emails if customer email is provided
    if (!complaint.email) {
      console.log('No customer email provided, skipping status update email');
      return { success: true, message: 'No customer email provided' };
    }
    const transporter = createTransporter();
    if (!transporter) {
      console.warn('[email] SMTP not configured. Skipping status update email.');
      return { success: true, skipped: true } as any;
    }
    
    const statusColors = {
      'Pending': '#6c757d',
      'In Progress': '#007bff',
      'Resolved': '#28a745',
      'Closed': '#343a40'
    };

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: complaint.email,
      subject: `Complaint Status Update: ${complaint.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Complaint Status Update
          </h2>
          
          ${complaint.customerName ? `
          <p style="font-size: 16px; color: #333;">Dear ${complaint.customerName},</p>
          ` : '<p style="font-size: 16px; color: #333;">Dear Customer,</p>'}
          
          <p style="line-height: 1.6; color: #555;">
            We wanted to update you on the status of your complaint. Here are the current details:
          </p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 120px;">Complaint:</td>
                <td style="padding: 8px 0;">${complaint.title}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Status:</td>
                <td style="padding: 8px 0;">
                  <span style="background-color: ${statusColors[complaint.status]}; color: white; padding: 4px 12px; border-radius: 15px; font-size: 14px;">
                    ${complaint.status}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Category:</td>
                <td style="padding: 8px 0;">${complaint.category}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Priority:</td>
                <td style="padding: 8px 0;">
                  <span style="background-color: ${
                    complaint.priority === 'High' ? '#dc3545' : 
                    complaint.priority === 'Medium' ? '#ffc107' : '#28a745'
                  }; color: white; padding: 2px 8px; border-radius: 3px; font-size: 12px;">
                    ${complaint.priority}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Last Updated:</td>
                <td style="padding: 8px 0;">${new Date().toLocaleDateString()}</td>
              </tr>
            </table>
          </div>
          
          ${complaint.status === 'Resolved' ? `
          <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="color: #155724; margin-top: 0;">✅ Great News!</h4>
            <p style="color: #155724; margin: 0;">
              Your complaint has been resolved. If you have any questions or concerns about the resolution, 
              please don't hesitate to contact us.
            </p>
          </div>
          ` : complaint.status === 'In Progress' ? `
          <div style="background-color: #cce7ff; border: 1px solid #99d6ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="color: #004085; margin-top: 0;">🔄 In Progress</h4>
            <p style="color: #004085; margin: 0;">
              We are actively working on your complaint. We'll keep you updated as we make progress.
            </p>
          </div>
          ` : ''}
          
          <div style="margin-top: 20px; padding: 15px; background-color: #e9ecef; border-radius: 5px;">
            <p style="margin: 0; font-size: 14px; color: #666;">
              Thank you for your patience. If you have any questions, please reply to this email.
            </p>
          </div>
          
          <p style="margin-top: 20px; color: #666; font-size: 14px;">
            Best regards,<br>
            Customer Support Team
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Status update email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending status update email:', error);
    return { success: false, error: (error as Error).message };
  }
};
