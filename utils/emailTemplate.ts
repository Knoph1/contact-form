export function contactEmailTemplate({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  return `
  <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
    <h2 style="color: #2563eb;">📩 New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
    <p><strong>Message:</strong></p>
    <div style="padding: 12px; background: #f9fafb; border-left: 4px solid #2563eb; margin: 10px 0;">
      ${message.replace(/\n/g, "<br/>")}
    </div>
    <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
    <p style="font-size: 12px; color: #6b7280;">
      This email was sent from your portfolio contact form at <a href="https://knoph.dev" style="color:#2563eb; text-decoration:none;">knoph.dev</a>
    </p>
  </div>
  `;
}
