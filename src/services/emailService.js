// src/services/emailService.js
const transporter = require("../config/mail");
const { formatCurrency } = require("../utils/formatters");

exports.sendSuspensionNotification = async (business) => {
  await transporter.sendMail({
    from: process.env.MAIL_FROM || '"The Gold Star" <noreply@mailtrap.io>',
    to: business.email,
    subject: "Account Suspended - Action Required",
    html: `
      <h1>Account Suspended</h1>
      <p>Your The Gold Star account has been suspended due to payment issues.</p>
      <p>Please contact support to resolve this issue.</p>
    `,
  });
};

exports.sendInvoice = async (business, payment) => {
  // Generate invoice HTML
  const invoiceHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Invoice for ${business.business_name}</h2>
      <p>Date: ${new Date().toLocaleDateString()}</p>
      <hr>
      <div style="margin: 20px 0;">
        <h3>Subscription Details:</h3>
        <p>Status: ${business.subscription_status || "Inactive"}</p>
        <p>Amount: ${formatCurrency(payment?.amount || 0)}</p>
        <p>Last Payment: ${
          payment?.created_at
            ? new Date(payment.created_at).toLocaleDateString()
            : "N/A"
        }</p>
      </div>
      <hr>
      <div style="margin: 20px 0;">
        <h3>Business Details:</h3>
        <p>Name: ${business.business_name}</p>
        <p>Address: ${business.address || "Not provided"}</p>
      </div>
      <hr>
      <p style="color: #666; font-size: 14px;">Please process your payment to continue enjoying our services.</p>
      <p style="color: #666; font-size: 14px;">Thank you for your business!</p>
    </div>
  `;

  // Send email
  await transporter.sendMail({
    from:
      process.env.MAIL_FROM || '"The Gold Star" <noreply@reputationrocket.com>',
    to: business.email,
    subject: `Invoice for ${business.business_name}`,
    html: invoiceHtml,
  });
};
