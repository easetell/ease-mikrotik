import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'easetellnetworks.com',
  port: 465,
  auth: {
    user: 'info@easetellnetworks.com',
    pass: 'Camara&me@2003hd',
  },
  tls: {
    rejectUnauthorized: false, // Set to true in production to validate certificates
  },
});

export async function sendEmail(to: string, subject: string, text: string) {
  const mailOptions = {
    from: 'info@easetellnetworks.com',
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
}
