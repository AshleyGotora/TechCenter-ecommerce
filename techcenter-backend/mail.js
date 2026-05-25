import nodemailer from "nodemailer";
import 'dotenv/config';
import { success } from "zod";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


transporter.verify((error, success) => {
    if (error) {
        console.log("EMAIL ERROR: ", error)
    } else {
        console.log("EMAIL READY!")
    }
}
)

export default transporter;