require('dotenv').config();
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');  // Ensure 'node-fetch' is installed

const DRIVE_FOLDER_ID = '1hS7Po6apyNQwW1G0nT8IaOs-VCSsQ9ca';  // Google Drive Folder ID

// OAuth2 client setup from environment variables
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const client_id = process.env.GOOGLE_CLIENT_ID;  // From GitHub Secrets
const client_secret = process.env.GOOGLE_CLIENT_SECRET;  // From GitHub Secrets
const redirect_uri = process.env.GOOGLE_REDIRECT_URI;  // From GitHub Secrets

const auth = new google.auth.OAuth2(client_id, client_secret, redirect_uri);

// Load OAuth credentials from the token file
const token = fs.readFileSync('token.json', 'utf-8');
auth.setCredentials(JSON.parse(token));

const drive = google.drive({ version: 'v3', auth });

// Upload the PDF file to Google Drive
async function uploadPDFToGoogleDrive(pdfUrl, orderNumber) {
    const res = await fetch(pdfUrl);
    const buffer = await res.buffer();
    
    // Create the file in Google Drive
    const fileMetadata = {
        name: `${orderNumber}_PackingSlip.pdf`,
        parents: [DRIVE_FOLDER_ID],
    };

    const media = {
        mimeType: 'application/pdf',
        body: buffer,
    };

    const file = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id',
    });

    return `https://drive.google.com/file/d/${file.data.id}/view?usp=sharing`;
}

module.exports = { uploadPDFToGoogleDrive };
