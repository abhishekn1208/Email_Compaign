const nodemailer = require("nodemailer")


const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'winnifred10@ethereal.email',
        pass: 'FARf9HuPWwMXk5ezaD'
    }
})

module.exports = transporter