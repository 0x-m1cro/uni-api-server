const chromium = require('@sparticuz/chromium-min');
const puppeteer = require('puppeteer-core');
let _page;
// const express = require('express')
// const app = express()
// const port = 8000


async function getBrowser() {
  // local development is broken for this 👇
  // but it works in vercel so I'm not gonna touch it
  return puppeteer.launch({
    args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
    executablePath: await chromium.executablePath(
      `https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar`
    ),
    headless: "new",
    ignoreHTTPSErrors: true,
  });
}

// async function getPage() {
//   if (_page) return _page;

//   const browser = await getBrowser();
//   _page = await browser.newPage();
//   return _page;
// }
 
// app.get('/', (req, res) => { res.send('Welcome') })

// app.get('/api/maldives', async (req, res) => {
  
//   try {
//     const page = await getPage();
//     await page.goto('https://hotelscan.com/combiner?pos=zz&locale=en&checkin=2024-07-23&checkout=2024-07-28&rooms=2&mobile=0&loop=3&country=MV&ef=1&geoid=xmmmamtksdxx&deviceNetwork=4g&deviceCpu=20&deviceMemory=8&limit=25&offset=0',
//         {
//           waitUntil: "networkidle2",
//           timeout: 0
//         });

//     let body = await page.waitForSelector('body');
//     let json = await body?.evaluate(el => JSON.parse(el.textContent));
//     await browser.close();   
//     res.status(200).json(json);       
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   } finally {
//     if (browser !== null) {
//       await browser.close();
//     }
//   }
// })

// app.listen(port, () => console.log(`App listening on port ${port}!`))

// module.exports = async (req, res) => {
 
 
// };

module.exports = async (req, res) => {
 
  try {
    const browser = await getBrowser();
    let page = await browser.newPage();
    await page.goto('https://hotelscan.com/combiner?pos=zz&locale=en&checkin=2024-07-23&checkout=2024-07-28&rooms=2&mobile=0&loop=3&country=MV&ef=1&geoid=xmmmamtksdxx&deviceNetwork=4g&deviceCpu=20&deviceMemory=8&limit=25&offset=0',
        {
          waitUntil: "networkidle2",
          timeout: 0
        });

    let body = await page.waitForSelector('body');
    let json = await body?.evaluate(el => JSON.parse(el.textContent));  
    await browser?.close();   
    res.status(200).json(json);  
       
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}