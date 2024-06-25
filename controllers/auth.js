
import User from '../models/user'
import { hashPassword, comparePassword } from '../utils/auth'

import jwt from 'jsonwebtoken'
import AWS from 'aws-sdk'
import { nanoid } from 'nanoid'
import Mailer from '../utils/mailer';
import { mailCustomizer } from '../utils/mailer/mailCustomizer';
// import { generateToken } from '../config/csrf';

const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION
}

const SES = new AWS.SES(awsConfig)

export const register = async (req, res) => {
    console.log(req.body);
    // res.json("register user response from Registration route");

    try {
        const { name, email, password } = req.body
        // validation
        if (!name) return res.status(400).send("Name is required");

        if (!password || password.length < 6) {
            return res
                .status(400)
                .send("password is required and should be min 6 characters long")
        }

        let userExist = await User.findOne({ email }).exec();
        if (userExist) return res.status(400).send("Email is taken");

        // hash password

        const hashedPassword = await hashPassword(password);

        const user = await new User({
            name,
            email,
            password: hashedPassword,
        }).save();

        console.log("saved User", user);
        return res.json({ ok: true });

    } catch (error) {
        console.log(error);
        return res.status(400).send("Error, Try again");
    }
}

export const verifyEmail = async (req, res) => {

}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log(email,password);
        //check if user exist
        const user = await User.findOne({ email }).exec();
        if (!user) return res.status(400).send("No such User");
        const match = await comparePassword(password, user.password);
        console.log(match)
        if (!match) return res.status(400).send("Password is incorrect please try again")
        // create signed jwt
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // return user and token to client , exclude hashed password
        user.password = undefined;

        //send token in cookie using http only flag
        res.cookie("token", token, {
            httpOnly: true,
            // secure:true  //only works with https
        });
        res.json(user);
    } catch (err) {
        console.log(err);
        return res.status(400).send("Error, Try again");
    }
}



export const logout = (req, res) => {
    try {
        res.clearCookie('token');
        return res.json({ message: "Signout success" })
    } catch (error) {
        console.log(error)
    }
};

export const csrfController = (req, res) => {

    res.send({ getCsrfToken: req.csrfToken() });
    // const generatedToken = generateToken(req, res);
    // res.set('Content-Type', 'text/plain');
  
    // if (!generatedToken) {
    //   return res.status(500).send('Cannot generate the requested content.');
    // }
  
    // return res.send(generatedToken);
    //SIGNED
    // const generatedToken = generateToken(req, res, true);

    // res.cookie(csrfTokenCookie, generatedToken, {
    //     ...cookieOptions,
    //     httpOnly: true,
    // });
    // res.end('Request was successful.');
}


export const currentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password').exec();
        console.log('CURRENT_USER', user);
        return res.json({ user, ok: true });
    } catch (error) {
        console.log(err);
    }
}


export const sendTestEmail = async (req, res) => {

    // console.log("send Email using Json");
    // res.json({ok: true});

    // const params = {
    //     Source: process.env.EMAIL_FROM,
    //     Destination: {
    //         ToAddresses: ['ezeonyekachukwu98@gmail.com']
    //     },
    //     ReplyToAddresses: [process.env.EMAIL_FROM],
    //     Message: {
    //         Body: {
    //             Html: {
    //                 Charset: "UTF-8",
    //                 Data:
    //                     ` <html>
    //                         <h1>Ret Password Link</h1>
    //                         <p>Please use the following link to reset your password</p>
    //                     </html>`
    //             }
    //         },
    //         Subject: {
    //             Charset: "UTF-8",
    //             Data: "Password reset link"
    //         }
    //     }
    // }
    // emailSent.then((data) => {
    //     console.log(data);
    //     res.json({ ok: true })
    // }).catch((err) => {
    //     console.log(err);
    // })

    // const emailSent = SES.sendEmail(params).promise();
    const mailer = new Mailer()
    const htmlToSend = await mailCustomizer('./templates/email-verification.html', { url: 'goolge.com' })
    const receiver = 'ezeonyekachukwu98@gmail.com'
    const mailOptions = {
        from: 'ezeonyekachukwu100@gmail.com',
        to: receiver,
        subject: `New Message from THE MESSAGE`,
        html: htmlToSend
    }
    mailer.sendMail(mailOptions)
    res.send("email sent successfully")
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        //    console.log(email)
        const shortCode = nanoid(6).toUpperCase();
        const user = await User.findOneAndUpdate({ email }, { passwordResetCode: shortCode })
        if (!user) return res.status(400).send("User not found")

        // const params = {
        //     Source: process.env.EMAIL_FROM,
        //     Destination: {
        //         ToAddresses: [email]
        //     },
        //     Message: {
        //         Body: {
        //             Html: {
        //                 Charset: 'UTF-8',
        //                 Data: `
        //                     <html>  
        //                         <h1>Reset Password</h1>
        //                         <p>Use this code to reset your password</p>
        //                         <h2 style="color:red;">${shortCode}</h2>
        //                         <i>edemy.com</i>
        //                     </html>
        //                 `
        //             },
        //         },
        //         Subject: {
        //             Charset: 'UTF-8',
        //             Data: "Reset password",
        //         }
        //     }
        // }

        // const emailSent = SES.sendEmail(params).promise();

        // emailSent
        //     .then((data) => {
        //         console.log(data);
        //         res.json({ ok: true })
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     })

        const mailer = new Mailer()
        const htmlToSend = await mailCustomizer('./templates/password/password-code.html', { shortcode })
        const receiver = email
        const mailOptions = {
            from: 'ezeonyekachukwu100@gmail.com',
            to: receiver,
            subject: `New Message from THE MESSAGE`,
            html: htmlToSend
        }
        mailer.sendMail(mailOptions)
        res.send("email sent successfully")

    } catch (error) {
        console.log(error)
    }
}


export const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        // console.log(email, code, newPassword)
        const hashedPassword = await hashPassword(newPassword)

        const user = User.findOneAndUpdate(
            { email, passwordResetCode: code },
            {
                password: hashedPassword,
                passwordResetCode: "",
            }
        ).exec();

        res.json({ ok: true });

    } catch (error) {
        console.log(err)
        return res.status(400).send("error Try again")
    }
}