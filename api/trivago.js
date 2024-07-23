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
      args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
      ignoreDefaultArgs: ['--disable-extensions'],
      executablePath: executablePath,
      headless: true,
    });
      const page = await browser.newPage();

      const ua = await page.evaluate('navigator.userAgent');

      await page.setUserAgent(ua)
      
      await page.setRequestInterception(true)

      await page.on ( 'request', async request => {
          if ( request.resourceType () === 'image' || request.resourceType () === 'media' || request.resourceType () === 'font' ) {
              request.abort ()
          } else {
              request.continue ()
          }
      })

      await page.goto(
        `https://www.trivago.com/en-US/lm/hotels-maldives?search=200-121;dr-20241001-20241005-s;rc-1-2`,
        {
          waitUntil: "networkidle0",
        }
      );

      await page.on('response', async (response) => {
        if (response.url() == "https://www.trivago.com/graphql?accommodationSearchQuery"){
          console.log('received, awaiting log...');
          console.log(ua)
          data = await response.json()
          }
        });
  
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
