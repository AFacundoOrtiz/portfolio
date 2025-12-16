"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  try {
    const data = await resend.emails.send({
      from: "Portfolio<onboarding@resend.dev>", // Al inicio usa este remitente de prueba
      to: ["urban12the@gmail.com"], // Tu correo donde recibirás los mensajes
      subject: `Nuevo mensaje de contacto: ${name}`,
      replyTo: email,
      text: `Nombre: ${name}\nEmail: ${email}\nMensaje: ${message}`,
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}
