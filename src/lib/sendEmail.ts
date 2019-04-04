import nodemailer from 'nodemailer';
import doteve from 'dotenv';
doteve.config();

interface Mail {
  to: string;
  from: string;
  subject: string;
  body: string;
}

const { EMAIL, PASS } = process.env;
if (!EMAIL || !PASS) {
  const error = new Error('Invalid EMAIL & PASS Error');
  error.message = 'EMAIL,PASS is missing.';
  throw error;
}

export const sendMail = ({
  to,
  from,
  subject,
  body
}: Mail): Promise<nodemailer.SendMailOptions> => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: EMAIL,
        pass: PASS
      }
    });
    const mailoptions: nodemailer.SendMailOptions = {
      to,
      from,
      subject,
      html: body
    };
    transporter.sendMail(mailoptions, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
