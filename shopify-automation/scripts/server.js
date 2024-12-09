require('dotenv').config();
const { printAndDownloadPackingSlip } = require('./shopifyAutomation');
const { uploadPDFToGoogleDrive } = require('./googleDrive');

// Replace with the actual order number from your Shopify store
const orderNumber = '1009';  // Example order number

async function processOrder(orderNumber) {
    try {
        // Simulate printing and downloading the packing slip PDF
        const pdfLink = await printAndDownloadPackingSlip(orderNumber);

        // Upload the PDF to Google Drive
        const googleDriveLink = await uploadPDFToGoogleDrive(pdfLink, orderNumber);

        console.log(`Packing slip for order #${orderNumber} has been uploaded to Google Drive: ${googleDriveLink}`);
    } catch (error) {
        console.error('Error processing order:', error);
    }
}

processOrder(orderNumber);
