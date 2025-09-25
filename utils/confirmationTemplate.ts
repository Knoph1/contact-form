export function confirmationEmailTemplate({
  name,
}: {
  name: string;
}) {
  return `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #2563eb;">Hi ${name},</h2>
    <p>✅ Thanks for reaching out! Your message has been received successfully.</p>
    <p>I’ll get back to you as soon as possible. Meanwhile, feel free to check out my portfolio:</p>
    <p>
      <a href="https://knoph.dev" style="color:#2563eb; text-decoration:none;">🌐 knoph.dev</a>
    </p>
    <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
    <p style="font-size: 12px; color: #6b7280;">
      This is an automated confirmation email from Knoph Ayieko’s portfolio contact form.
    </p>
  </div>
  `;
}
