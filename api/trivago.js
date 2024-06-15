const puppeteer = require('puppeteer-core')
const chromium = require('@sparticuz/chromium-min');
const fs = require('fs');
// import path from 'path';
export const maxDuration = 60

async function scrape() {
    let browser;
    let json;

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
    
        //await page.setRequestInterception(true);
    
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36')
         
        await page.goto('https://jsonplaceholder.typicode.com/posts', { waitUntil: 'networkidle2' });
      
    
        // await page.on('response', async (response) => {
             
        //     if (response.url === 'https://www.trivago.com/graphql?accommodationSearchQuery') {
        //         const url = response.url();
        //         const status = response.status();
        //         const headers = response.headers();
        //         json = await response.json();
                    
        //         if(responseBody){
        //         await fs.writeFile('public/trivago.json', responseBody);
        //         }
    
        //         console.log(`URL: ${url}`);
        //         console.log(`Status: ${status}`);
        //         console.log('Headers:', headers);
        //         console.log('Response Body:', responseBody);
        //     }
             
        // });
         //const json = path.resolve('trivago.json');
         let body = await page.waitForSelector('body');
         json = await body?.evaluate(el => el.textContent);
    
        writeFile('../public/trivago.json', JSON.stringify(json, null, 2), (error) => {
            if (error) {
              console.log('An error has occurred ', error);
              return;
            }
            console.log('Data written successfully to disk');
          });
          
        res.status(200).send(json);
      } catch (error) {
        console.error('Error occurred:', error.message);
        res.status(500).json({ error: error.message });
      } finally {
        if (browser) {
          await browser.close();
        }
      }
}

 
module.exports = async (req, res) => {
 let jsn;
    
  try {
     
     setInterval( async () => {
        await scrape();
    }, 30000);


    fs.readFile("../public/trivago.json", "utf8", (error, data) => {
        if (error) {
          console.log(error);
          return;
        }
        console.log(JSON.parse(data));
        jsn = data
      });
      res.status(200).send(jsn);
  } catch (error) {
    console.error('Error occurred:', error.message);
    res.status(500).json({ error: error.message });
  }  
};
