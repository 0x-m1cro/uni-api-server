const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium-min');

async function getBrowser() {
  // Ensure the executablePath URL is correct and points to a compatible version
  const executablePath = await chromium.executablePath(
    `https://github.com/Sparticuz/chromium/releases/download/v123.0.1/chromium-v123.0.1-pack.tar`
  );

  // Adjust browser launch configuration
  return puppeteer.launch({
    args: [
      ...chromium.args,
      '--hide-scrollbars',
      '--disable-web-security',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ],
    executablePath: executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
    dumpio: true // Enables more detailed logging
  });
}

module.exports = async (req, res) => {
  let browser;
  let query = req.query;
  // const { adults, child, checkin, checkout } = query;
  // const c = child ? 'f' : ''

  try {
    browser = await getBrowser();
    const page = await browser.newPage();

    // Set a generous timeout and wait for network to be idle
    await page.goto('https://hotelscan.com/', {
      waitUntil: "networkidle2",
      timeout: "2000"
    });
    await page.goto('https://hotelscan.com/combiner?pos=zz&locale=en&checkin=2024-07-23&checkout=2024-07-28&rooms=2&mobile=0&loop=3&country=MV&ef=1&geoid=xmmmamtksdxx&deviceNetwork=4g&deviceCpu=20&deviceMemory=8&limit=25&offset=0', {
      waitUntil: "networkidle2",
      timeout: "2000"
    });

    let body = await page.waitForSelector('body'); // Wait for body selector to ensure the page has loaded
    let json = await body?.evaluate(el => el.textContent);
    await browser.close();   
    res.status(200).json(json);
  } catch (error) {
    console.error('Error occurred:', error);  
    res.status(500).json({ error: error.message });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
