const puppeteer = require('puppeteer-core')
 const chromium = require('@sparticuz/chromium-min');

module.exports = async (req, res) => {
  let browser;

  try {
    const executablePath = await chromium.executablePath(
      `https://github.com/Sparticuz/chromium/releases/download/v123.0.1/chromium-v123.0.1-pack.tar`
    );

    browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        '--hide-scrollbars',
        '--disable-web-security'
      ],
      executablePath: executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
      dumpio: true
    });

    const page = await browser.newPage();
     
    await page.goto('https://hotelscan.com/combiner?pos=zz&locale=en&checkin=2024-07-23&checkout=2024-07-28&rooms=2&mobile=0&loop=3&country=MV&ef=1&geoid=xmmmamtksdxx&deviceNetwork=4g&deviceCpu=20&deviceMemory=8&limit=25&offset=0z', { waitUntil: 'networkidle2' });
    let body = await page.waitForSelector('body');
    let json = await body?.evaluate(el => el.textContent);
    res.status(200).send(json);
  } catch (error) {
    console.error('Error occurred:', error.message);
    res.status(500).json({ error: error.message });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
