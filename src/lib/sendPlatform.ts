import nodemailer from 'nodemailer';
import doteve from 'dotenv';
doteve.config();

interface Mail {
  to: string;
  from: string;
  subject: string;
  html: string;
}

const { EMAIL, PASS } = process.env;

export const sendMail = ({ to, from, subject, html }: Mail) => {
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: EMAIL,
      pass: PASS
    }
  });

  let mailoptions: nodemailer.SendMailOptions = {
    to,
    from,
    subject,
    html
  };

  transporter.sendMail(
    mailoptions,
    (err: Error, data: any): void => {
      if (err) {
        console.log(err);
      } else {
        console.log('Message sent: %s', data.messageId);
      }
    }
  );
};
