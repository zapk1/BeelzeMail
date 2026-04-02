const nodemailer = require('nodemailer');
const fs = require('fs');
require('dotenv').config();

// 1. Setup the Machine (SMTP)
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// 2. The Mafia Execution Function
async function sendMassEmails() {
    // Load your 100 targets from the list
    const targets = JSON.parse(fs.readFileSync('./targets.json', 'utf-8'));
    const messageHtml = fs.readFileSync('./message.html', 'utf-8');

    console.log(`🏗️ Starting outreach to ${targets.length} leads...`);

    for (let i = 0; i < targets.length; i++) {
        let mailOptions = {
            from: `"Mafia Architect" <${process.env.EMAIL_USER}>`,
            to: targets[i],
            subject: 'The 2026 Calculation: Your Professional Edge',
            html: messageHtml,
            attachments: [
                {
                    filename: 'business-chart.jpg',
                    path: './images/business-chart.jpg',
                    cid: 'unique-chart-id'
                }
            ]
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`✅ [${i + 1}/${targets.length}] Delivered to: ${targets[i]}`);
        } catch (error) {
            console.log(`❌ [${i + 1}/${targets.length}] Failed: ${targets[i]}`);
        }

        // THE "SAFE ZONE" DELAY (120 seconds)
        // This keeps your domain "Healthy" and avoids the spam folder
        if (i < targets.length - 1) {
            console.log("⏳ Cooling down for 2 minutes...");
            await new Promise(resolve => setTimeout(resolve, 120000));
        }
    }
    console.log("🏁 Mission Accomplished. 100% Neutralized.");
}

// Start the system
sendMassEmails();
