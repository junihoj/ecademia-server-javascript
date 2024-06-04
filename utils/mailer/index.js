import nodemailer from 'nodemailer';

export default class Mailer {
    transporter() {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
            //disable certificate verification
            tls: {
                rejectUnauthorized: false
            }
        })
    }

    async sendMail(mailOptions) {
        try {
            const transporter = this.transporter();
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.log(error);
        }
    }
}