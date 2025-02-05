import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    },
    tls: {
        ciphers: 'SSLv3',
    }
});

export const sendVerificationEmail = (uuid, userEmail, name, gender, baseUrl) => {
    // console.log(process.env.BASE_URL);

    

    const mailConfigurations = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: 'Email Verification for Site name',
        html: `
            <html>
            <head>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                    }
                    .container {
                        width: 80%;
                        margin: 20px auto;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 10px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    .button {
                        display: inline-block;
                        padding: 15px 32px;
                        background-color: #0666cc;
                        color: #ffffff;
                        text-align: center;
                        text-decoration: none;
                        font-size: 16px;
                        border-radius: 10px;
                        margin: 20px 0;
                        cursor: pointer;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <p>Dear ${gender === 'Male' ? 'Mr.' : 'Ms.'} ${name},</p>
                    <p>Thank you for registering as a blood donor in Blood Match Maker. We are pleased to see your interest in Blood Donation.</p>
                    <p>Please click the button below to verify your email:</p>
                    <a href="${baseUrl}/api/auth/verify/${uuid}" class="button">Verify Email</a>
                    <p>We are happy to be with you in this great work. We hope that we can bring a smile to the faces of people in need of blood and create a better tomorrow.</p>
                    <p>With Best Regards,<br>Blood Match Maker</p>
                </div>
            </body>
            </html>
        `
    };

    transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) {
            console.error(error);
        } else {
            console.log('Email sent successfully: ' + info.response);
        }
    });


}

export const sendMessage = (req, res) => {

    const body = req.body;

    const mailConfigurations = {

        // It should be a string of sender/server email 
        from: process.env.EMAIL,

        to: process.env.EMAIL,

        // Subject of Email 
        subject: `Message from ${body.name} on Blood Match Maker`,

        // This would be the text of email body 
        text: `
            From: ${body.name}

            Email: ${body.email}

            Message: ${body.message}
        `

    };

    transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) {
            console.error(error);
        }
        else {
            res.send({ error: false })
        }
    });

}


export const passwordResetEmail = (email, name, gender, password) => {
    // console.log('sending reset mail')
    const mailConfigurations = {

        // It should be a string of sender/server email 
        from: process.env.EMAIL,

        to: email,

        // Subject of Email 
        subject: 'Password Reset for Blood Match Maker',

        // This would be the text of email body 
        html: `<html>
            <head>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                    }
                    .container {
                        width: 80%;
                        margin: 20px auto;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 10px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    .password {
                        font-weight: 700;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <p>Dear ${gender === 'Male' ? 'Mr.' : 'Ms.'} ${name},</p>
                    <p>Recently you have requested to reset your password on Blood Match Maker.</p>
                    <p>Your temporary password is given below.</p>
                    <p><span class="password">Password:</span> ${password}</p>
                    <p>After login with temporary password. Please reset your password.</p>
                    <p>With Best Regards,<br>Blood Match Maker</p>
                </div>
            </body>
            </html>`

    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailConfigurations, function (error, info) {
            if (error) {
                console.error(error);
                reject(error);
            }
            else {
                console.log(info);
                resolve(info);
            }
        })
    })
}
