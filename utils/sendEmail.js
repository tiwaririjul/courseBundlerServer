import { createTransport } from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  const transporter = createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "c1f11924bfb4a5",
      pass: "45b026162284ba",
    },
  });
  await transporter.sendMail({
    to,
    subject,
    text,
    // from: "tiwaririjul10@gmail.com",
  });
};
