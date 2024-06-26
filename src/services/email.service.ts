import fs from 'fs';
import nodemailer from 'nodemailer';

export const sendEmail = async (email: string, subject: string, text: string) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const sent = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: subject,
            text: text,
        });

        if (sent) {
            return true
        }
    } catch (error) {
        return false
    }
};

const pathKVP = {
    registration: 'src/templates/registration.html',
    reset: 'src/templates/reset.html',
    welcome: 'src/templates/welcome.html',
    subscription: 'src/templates/subscription.html',
    general: 'src/templates/general.html',
}
interface HTMLEmailProps {
    email: string,
    subject: string,
    params: any,
    emailType: 'registration' | 'welcome' | 'reset' | 'subscription' | 'general'
}

export const sendHTMLEmail = async ({
    email,
    subject,
    params,
    emailType
}: HTMLEmailProps) => {
    const htmlTemplate = fs.readFileSync(pathKVP[emailType], 'utf-8');


    // Replace template placeholders with dynamic data
    const filledTemplate = htmlTemplate.replace(/{{(\w+)}}/g, (match, p1) => {
        return params[p1] || match;
    });
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const sent = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: subject,
            html: filledTemplate,
        });
        if (sent) {
            if (process.env.NODE_ENV === 'development') {
                console.log('[email]: Email sent sucessfully!');
            }
            return true
        }
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.log('[email]: Email not sent!', error);
        }
        return false
    }
};

export default {
    sendEmail,
    sendHTMLEmail
}