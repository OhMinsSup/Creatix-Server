import nodemailer from 'nodemailer';
import doteve from 'dotenv';
import { Mail } from 'CommonTyping';
doteve.config();

const { EMAIL, PASS } = process.env;
/**
 * @description 메일을 보내는 함수
 * @param {string} to
 * @param {string} from
 * @param {string} subject
 * @param {string} html
 * @returns {void}
 */
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
