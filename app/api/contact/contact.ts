import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";
import { contactEmailTemplate } from "@/utils/emailTemplate";
import { confirmationEmailTemplate } from "@/utils/confirmationTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    // 1️⃣ Save to Database
    const { error: dbError } = await supabase.from("contact_messages").insert([
      { name, email, message },
    ]);

    if (dbError) {
      console.error("DB Error:", dbError);
    }

    // 2️⃣ Send email to YOU
    await resend.emails.send({
      from: "Portfolio Contact <contact@knoph.dev>",
      to: "knophayieko@gmail.com",
      subject: `📬 New Message from ${name}`,
      reply_to: email,
      html: contactEmailTemplate({ name, email, message }),
      text: message,
    });

    // 3️⃣ Auto-reply to SENDER
    await resend.emails.send({
      from: "Knoph Ayieko <contact@knoph.dev>",
      to: email,
      subject: "✅ Thanks for contacting me!",
      html: confirmationEmailTemplate({ name }),
      text: `Hi ${name}, thanks for reaching out! I’ll get back to you soon. - Knoph`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
