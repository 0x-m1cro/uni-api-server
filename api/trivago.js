const puppeteer = require('puppeteer-core')
const chromium = require('@sparticuz/chromium-min');
//const fs = require('fs');
export const maxDuration = 60

module.exports = async (req, res) => {
  let data  
  let browser;

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
      
      await page.setRequestInterception(true)

      await page.on ( 'request', async request => {
          if ( request.resourceType () === 'image' || request.resourceType () === 'media' || request.resourceType () === 'font' ) {
              request.abort ()
          } else {
              request.continue ()
          }
      })
      page.on('response', async (response) => {
        if (response.url() == "https://www.trivago.com/graphql?accommodationSearchQuery"){
        console.log('received, awaiting log..');
        // console.log(await response.json());
        data = await response.json()
        }
        });
  
      await page.goto(
        `https://www.trivago.com/en-US/srl/hotels-maldives?search=200-121;dr-20241116-20241120;rc-1-2`,
        {
          waitUntil: "networkidle2",
          timeout: 0
        }
      );
      // let body = await page.waitForSelector('body');
      // let json = await body?.evaluate(el => JSON.parse(el.textContent));
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
