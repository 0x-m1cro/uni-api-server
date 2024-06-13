const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium-min');

module.exports = async (req, res) => {
  let browser;

  try {
    const executablePath = await chromium.executablePath(
      `https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar`
    );

    browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        '--hide-scrollbars',
        '--disable-web-security',
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ],
      executablePath: executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
      dumpio: true
    });

    const page = await browser.newPage();
    await page.goto('https://jsonplaceholder.typicode.com/posts', { waitUntil: 'networkidle2', timeout: 60000 });
    const content = await page.content();

    res.status(200).send(content);
  } catch (error) {
    console.error('Error occurred:', error.message);
    res.status(500).json({ error: error.message });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
