require('dotenv').config();
const puppeteer = require('puppeteer');

// Shopify URL and credentials from environment variables
const SHOPIFY_URL = 'https://7r4f3s-11.myshopify.com/admin/orders/';
const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;  // Shopify API Key
const SHOPIFY_API_PASSWORD = process.env.SHOPIFY_API_PASSWORD;  // Shopify API Password

// Function to simulate the Print and Download process
async function printAndDownloadPackingSlip(orderNumber) {
    const browser = await puppeteer.launch({ headless: false }); // Use headless: true for production
    const page = await browser.newPage();
    
    // Log into Shopify Admin Panel
    await page.goto(SHOPIFY_URL, { waitUntil: 'networkidle2' });

    await page.type('input[name="login"]', SHOPIFY_API_KEY);
    await page.type('input[name="password"]', SHOPIFY_API_PASSWORD);
    await page.click('button[type="submit"]');
    
    // Wait for navigation to complete
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    
    // Navigate to the order page
    await page.goto(`${SHOPIFY_URL}${orderNumber}`);
    
    // Click "Print" to trigger the packing slip download
    await page.click('button[aria-label="Print"]');
    await page.waitForTimeout(1000); // Wait for the print dialog to open
    
    // Click on "Print Packing Slips"
    await page.click('button[aria-label="Print Packing Slips"]');
    
    // Wait for the PDF to download (may take some time)
    const pdfLink = await page.$eval('.pdf-download-link', el => el.href);
    
    await browser.close();
    return pdfLink;
}

module.exports = { printAndDownloadPackingSlip };
