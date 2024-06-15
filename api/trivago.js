const puppeteer = require('puppeteer-core')
const chromium = require('@sparticuz/chromium-min');
const fs = require('fs');
export const maxDuration = 60


module.exports = async (req, res) => {
  let browser;
  let data = [];

  try {
    const executablePath = await chromium.executablePath(
      `https://github.com/Sparticuz/chromium/releases/download/v123.0.1/chromium-v123.0.1-pack.tar`
    );
    
    browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        '--hide-scrollbars', 
        '--disable-web-security',
      ],
      executablePath: executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
      dumpio: true
    });

    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36')
     
    await page.goto('https://www.trivago.com/en-US/lm/hotels-maldives?search=200-121;dr-20240819-20240824;rc-1-2', { waitUntil: 'networkidle2' });

     await page.waitForSelector('body');

     await page.waitForTimeout(5000); // Wait for 5 seconds
    // Listen for response events
    page.on('response', async (response) => {
        if (response.request().url() === 'https://www.trivago.com/graphql?accommodationSearchQuery') {
        const url = response.url();
        const status = response.status();
        const headers = response.headers();
        const responseBody = await response.json(); // Get the response body as text

        console.log('XHR Response URL:', url);

        data.push({
            responseBody,
            headers
        });
        fs.writeFileSync('./../public/trivago.json', JSON.stringify(data, null, 2));

        }
    });

    res.status(200).send(data);
  } catch (error) {
    console.error('Error occurred:', error.message);
    res.status(500).json({ error: error.message });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
