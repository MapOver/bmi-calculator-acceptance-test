const chalk = require('chalk')
const puppeteer = require('puppeteer')

const timeout = 15000
browser = null

function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}

describe(
  '/ (Home Page)',
  () => {
    let page
    beforeEach(async () => {
      console.log(chalk.green('Setup Puppeteer'))
      browser = await puppeteer.launch({
        headless: true
      })
      page = await browser.newPage()
      await page.goto('https://duckduckgo.com/', 
        { waitUntil: 'networkidle0' })
    }, timeout)

    afterEach(async () => {
      await page.close()
      console.log(chalk.green('Teardown Puppeteer'))
      await browser.close()
      browser = null
    })

    it('accept correct credentials', async () => {
      await delay(2000);
      let text = await page.evaluate(() => document.body.textContent)
      expect(text).toContain('DuckDuckGo')
    })
  },
  timeout
)
