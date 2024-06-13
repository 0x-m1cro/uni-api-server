const chromium = require('@sparticuz/chromium-min');
const puppeteer = require('puppeteer-core');
const express = require('express')
const app = express()
const port = 8000
 
app.get('/', (req, res) => { res.send('Welcome') })

app.get('/api/maldives', async (req, res) => {
  
  try {
    const options = {
      args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
      executablePath: await chromium.executablePath(
        `https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar`
      ),
      headless: "new",
    };
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.goto('https://hotelscan.com/combiner?pos=zz&locale=en&checkin=2024-07-23&checkout=2024-07-28&rooms=2&mobile=0&loop=3&country=MV&ef=1&geoid=xmmmamtksdxx&deviceNetwork=4g&deviceCpu=20&deviceMemory=8&limit=25&offset=0',
        {
          waitUntil: "networkidle2",
          timeout: 0
        });

    let body = await page.waitForSelector('body');
    let json = await body?.evaluate(el => JSON.parse(el.textContent));
    await browser.close();   
    res.status(200).json(json);       
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
})

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app