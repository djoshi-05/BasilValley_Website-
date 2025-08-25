const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/contact", async (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Transporter setup
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com", // Or another SMTP host
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,   // your email
                pass: process.env.EMAIL_PASS    // Gmail App Password
            },
        });

        // Send email
        await transporter.sendMail({
            from: `"${name}" <${email}>`,
            to: process.env.EMAIL_USER, // Where you receive the message
            subject: "New Contact Form Message",
            html: `
                <h3>Contact Form Submission</h3>
                <p><b>Name:</b> ${name}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Phone:</b> ${phone}</p>
                <p><b>Message:</b> ${message}</p>
            `
        });

        res.json({ success: true, message: "Your message has been sent successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to send message" });
    }
});


app.post("/booktable", async (req, res) => {
    const { name, phone, persons, date, time, message } = req.body;

    if (!name || !phone || !persons || !date || !time) {
        return res.status(400).json({ error: "Please fill all required fields" });
    }

    try {
        // Transporter setup (example using Gmail)
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,   // your email
                pass: process.env.EMAIL_PASS    // Gmail App Password
            },
        });

        // Send email
        await transporter.sendMail({
            from: `"${name}" <${phone}>`,
            to: process.env.EMAIL_USER, // where you want to receive bookings
            subject: "New Table Reservation Request",
            html: `
                <h3>New Table Reservation</h3>
                <p><b>Name:</b> ${name}</p>
                <p><b>Phone:</b> ${phone}</p>
                <p><b>Persons:</b> ${persons}</p>
                <p><b>Date:</b> ${date}</p>
                <p><b>Time:</b> ${time}</p>
                <p><b>Message:</b> ${message || "No special request"}</p>
            `
        });

        res.json({ success: true, message: "Reservation request sent successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to send reservation" });
    }
});






const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
