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
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: text,
        });
        // console.log(sent)

        // console.log('email sent sucessfully');
        if (sent) {
            return true
        }
    } catch (error) {
        // console.log(error, 'email not sent');
        return false
    }
};

const pathKVP = {
    registration: 'src/templates/registration.html',
    reset: 'src/templates/reset.html',
    welcome: 'src/templates/welcome.html',
    subscription: 'src/templates/subscription.html',
    submittedForm: 'src/templates/submitted-form.html',
    formReminder: 'src/templates/form-reminder.html'
}
interface HTMLEmailProps {
    email: string,
    subject: string,
    params: any,
    emailType: 'registration' | 'welcome' | 'reset' | 'subscription' | 'submittedForm' | 'formReminder'
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
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            html: filledTemplate,
        });
        // console.log(sent)
        if (sent) {
            console.log('[email]: Email sent sucessfully!');
            return true
        }
    } catch (error) {
        console.log('[email]: Email not sent!', error);
        return false
    }
};

