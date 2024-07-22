const puppeteer = require('puppeteer-core')
const chromium = require('@sparticuz/chromium-min');
//const fs = require('fs');
export const maxDuration = 60

module.exports = async (req, res) => {
  let data  
  let browser;
  let query = req.query;

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
      page.on('response', async (response) => {
        if (response.url().contains() == "https://www.resortlife.travel/hotels/ashx/results.ashx"){
        console.log('received, awaiting log..');
        // console.log(await response.json());
        data = await response.json()
        }
        });
  
      await page.goto(
        `https://www.resortlife.travel/en/hotels/maldives/2024-10-01/2024-10-05/41856?searchSessionID=1860676`,
        {
          waitUntil: "domcontentloaded",
        }
      );
      // let body= await page.waitForSelector('body');
      // let json= await body?.evaluate(el => JSON.parse(el.textContent));
      console.log(await browser.version());
      await browser.close();   
      res.status(200).json(data);           
    } catch (error) {
      console.log(error); 
      res.statusCode = 500;
      res.json({
        body: "Sorry, Something went wrong!",
      });
    } finally {
  if (browser) {
    await browser.close();
  }
}
};
