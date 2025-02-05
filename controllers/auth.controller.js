import db from '../models/index.js';
import bcrypt from 'bcrypt'
import fs from 'fs'
import { passwordResetEmail, sendVerificationEmail } from '../email/email.js';
// import { sendEligibleNotification, sendMessageNotification } from '../notifications/notifications.js';

export const signup = async (req, res) => {

    try {
        const userData = req.body;
        const baseUrl = req.get('host');

        const user = await db.User.findOne({ where: { 'email': userData.email } })

        if (!user) {


            delete userData.confirmPassword;


            userData.lastLogin = Date.now();


            const result = await db.User.create(userData);

            sendVerificationEmail(result.uuid, userData.email, userData.name, userData.gender, `https://${baseUrl}`);

            res.send({ message: "New user created and verification mail send. Please add a profile image from Account setting." });


        }
        else {
            res.send({ error: true, message: "Email already exist." })
        }

    } catch (error) {
        console.log(error.message)
        res.send({ error: true, message: error.message })
    }

}

export const login = async (req, res) => {
    try {


        const body = req.body


        const user = await db.User.findOne({
            where: { email: body.email },
            include: [
            ]
        })

        if (user) {
            user.update({ lastLogin: Date.now() });


            res.send({ error: false, user })

        } else {
            body.lastLogin = Date.now()

            const result = await db.User.create(body);

            res.send({ error: false, user: result })
        }

    } catch (error) {
        console.log(error);
        res.send({ error: true, message: "Internal server error." })
    }
}

export const adminLogin = async (req, res) => {
    try {


        const { email, password } = req.body


        const user = await db.User.findOne({
            where: { email },
            include: [
            ]
        })

        if (user) {
            const isPasswordMatched = await bcrypt.compare(password, user.dataValues.password)

            if (isPasswordMatched) {
                user.update({ lastLogin: Date.now() });


                res.send({ error: false, user })
            }

            else {
                res.send({ error: true, message: "Invalid email or password" })
            }
        } else {
            res.send({ error: true, message: "Invalid email or password" })
        }

    } catch (error) {
        console.log(error);
        res.send({ error: true, message: "Internal server error." })
    }
}

export const updateUser = async (req, res) => {
    try {

        const id = req.params.id;
        const updatedData = req.body;

        const user = await db.User.findByPk(id)

        await user.update(updatedData)

        res.send({ error: false, message: 'Profile edited successfully.' })

    } catch (error) {
        console.log(error)
        res.send({ error: true, message: error.message })

    }
}

export const getUser = async (req, res) => {
    try {

        const id = req.decoded.id;

        const user = await db.User.findByPk(id, {
            include: [

            ]
        });




        delete user.dataValues.password;
        delete user.dataValues.uuid

        res.send({ user, error: false })

    } catch (error) {
        res.send({ error: true })
    }
}

export const changePassword = async (req, res) => {
    try {
        const id = req.params.id;
        const passwordData = req.body;

        const user = await db.User.findByPk(id);

        const pass = await bcrypt.compare(passwordData.oldPassword, user.password);

        if (pass) {

            await user.update({ password: passwordData.newPassword })

            res.send({ error: false, message: "Password changed successfully." })
        }
        else {
            res.send({ error: true, message: 'Password does not match' });
        }
    } catch (error) {
        res.send({ error: true, message: "Internal error occurred. Please, try again later." })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const id = req.params.id;

        const user = await db.User.findByPk(id);

        if (user.isPasswordTemporary) {

            // await User.updateOne({ _id }, { $set: { password: hashedPassword, isPasswordTemporary: false } });

            await user.update({ password: newPassword, isPasswordTemporary: false });

            res.send({ error: false, message: 'Password reset successful.' })
        }
        else {
            res.send({ error: true, message: 'Unauthorized access.' })

        }
    } catch (error) {
        console.log(error);
        res.send({ error: true, message: 'Password reset task failed. Please, try again.' })
    }
}

export const changeProfilePhoto = async (req, res) => {
    try {

        const fileName = req.file.filename;

        const id = req.params.id;

        const result = await db.User.findByPk(id);

        fs.unlink(`images/${result.image}`, async (err) => {
            if (err) {
                console.error(err)
            }

            // await User.updateOne({ _id }, { $set: { image: `users/${fileName}` } })

            await result.update({ image: `users/${fileName}` })

            res.send({ error: false, message: "Image updated successfully", image: `users/${fileName}` })
        });


    } catch (error) {
        console.log(error);
        res.send({ error: true, message: 'Image not updated.' })
    }
}

export const forgetPassword = async (req, res) => {
    try {
        const decrypted = req.body
        const user = await db.User.findOne({ where: decrypted });
        // console.log(user);

        if (user) {
            const password = passwordGenerator()
            // const hashedPassword = await bcrypt.hash(password, 12);

            // await User.updateOne(body, { $set: { password: hashedPassword, isPasswordTemporary: true } })

            await user.update({ password, isPasswordTemporary: true })
            try {
                await passwordResetEmail(user.email, user.name, user.gender, password);



                res.send({ error: false, message: 'A message sent to your email address.' })
            } catch (error) {

                res.send({ error: true, message: 'Password reset process failed. Please try again.' })
            }


        }
        else {
            res.send({ error: true, message: 'Email address not found.' })
        }

    } catch (error) {
        console.log(error)
        res.send({ error: true, message: 'Internal server error.' })

    }
}

const passwordGenerator = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@*!#";
    let password = ''
    for (let i = 0, n = charset.length; i < 10; i++) {
        password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;

}

export const verifyEmail = async (req, res) => {
    try {
        const uuid = req.params.uuid;
        const user = await db.User.findOne({ where: { uuid: uuid } });
        if (user) {
            const result = await user.update({ isEmailVerified: true })

            res.redirect(`${process.env.FRONTEND_URL}/emailVerified`)
        }
    } catch (error) {
        console.log(error)
        res.send("Email verification failed.")
    }
}

export const deletePhoto = async (req, res) => {
    try {
        const id = req.params.id;

        const result = await db.User.findByPk(id)

        fs.unlink(`images/${result.image}`, async (err) => {
            if (err) {
                console.error(err)
                res.send({ error: true, message: 'Image not deleted.' })
            }

            await result.update({ image: '' })

            res.send({ error: false, message: "Image deleted successfully" })
        });
    } catch (error) {
        console.log(error);
        res.send({ error: true, message: 'Image not deleted.' })
    }
}

// export const createEmailVerificationLink = async (req, res) => {
//     try {
//         const id = decryptData(req.params.id);

//         const user = await db.User.findByPk(id);

//         user.uuid = v4();
//         await user.save();

//         sendVerificationEmail(user.uuid, user.email, user.name, user.gender);

//         res.send({ error: false, message: "A verification mail sent to your email. Please check your inbox. If you can't see the verification mail don't forget the spam folder." })

//     } catch (error) {
//         console.log(error)
//         res.send({ error: true, message: "Email verification process failed." })

//     }
// }