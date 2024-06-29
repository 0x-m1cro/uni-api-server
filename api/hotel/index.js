const puppeteer = require('puppeteer-core')
const chromium = require('@sparticuz/chromium-min');
export const maxDuration = 30
module.exports = async (req, res) => {
  let browser;
  let query = req.query;
  const { hotelid, checkin, checkout } = query;

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
    await page.setRequestInterception(true)

    await page.on ( 'request', async request => {
        if ( request.resourceType () === 'image' || request.resourceType () === 'media' || request.resourceType () === 'font' ) {
            request.abort ()
        } else {
            request.continue ()
        }
    })
     
    await page.goto(`https://hotelscan.com/combiner/${hotelid}?pos=zz&locale=en&checkin=${checkin}&checkout=${checkout}&rooms=2&mobile=0&loop=1&country=MV&ef=1&geoid=xmmmamtksdxx&toas=hotel%2Cbed_and_breakfast%2Cguest_house%2Cresort&availability=1&deviceNetwork=4g&deviceCpu=20&deviceMemory=8&limit=25&offset=0`, { waitUntil: 'networkidle2' });
    
    await page.goto(`https://hotelscan.com/combiner/${hotelid}?pos=zz&locale=en&checkin=${checkin}&checkout=${checkout}&rooms=2&mobile=0&loop=1&country=MV&ef=1&geoid=xmmmamtksdxx&toas=hotel%2Cbed_and_breakfast%2Cguest_house%2Cresort&availability=1&deviceNetwork=4g&deviceCpu=20&deviceMemory=8&limit=25&offset=0`, { waitUntil: 'networkidle2' });
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
