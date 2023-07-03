const nodeMailer = require('../config/nodemailer');

module.exports.joiningEmail = (user) => {
    console.log('user details', user);
    nodeMailer.transporter.sendMail({
        from: 'demo03865@gmail.com',
        to: user.email,
        subject: 'Welcome to Employee Review System',
        html: `
            <h1>Welcome to Employee Review System</h1>
            <p>Dear ${user.name},</p>
            <p>We are thrilled to have you onboard as a new employee at our company.</p>
            <p>Here are your login credentials for accessing our company's employee page:</p>
            <ul>
                <li><strong>Name:</strong> ${user.name}</li>
                <li><strong>Email:</strong> ${user.email}</li>
                <li><strong>Password:</strong> ${user.password}</li>
            </ul>
            <p>Please keep your login credentials confidential and ensure that you change your password after the initial login.</p>
            <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
            <p>Thank you once again, and we look forward to working with you!</p>
            <p>Best regards,</p>
            <p>Designed by</p>
            <p>Lokesh</p>
        `
    }, (err, info) => {
        if (err) {
            console.log('Error in sending the email:', err);
            return;
        }
        console.log('Message sent:', info);
    });
};
