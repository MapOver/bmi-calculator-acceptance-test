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
      console.log(chalk.green('Go to app page'))
      page = await browser.newPage()
      await page.goto('http://localhost:8080/', 
        { waitUntil: 'networkidle0' })
    }, timeout)

    afterEach(async () => {
      await page.close()
      console.log(chalk.green('Teardown Puppeteer'))
      await browser.close()
      browser = null
    })

    // Test case 1
    it('TC1: Redirect to main page', async () => {
      await delay(1000);

      // Input test case value
      await page.$eval('#cm', el => el.value = 0);

      // Click form
      await page.$eval('.panel-footer input', form => form.click())

      let text = await page.evaluate(() => document.body.textContent)
      expect(text).toContain('Please enter your details!')
    })

    // Test case 2
    it('TC2: Correct calculation', async () => {
      await delay(1000);
      await page.$eval('#cm', el => el.value = 100);
      await page.$eval('#kg', el => el.value = 50);

      // Click form
      await page.$eval('.panel-footer input', form => form.click())

      await delay(1000);
      let text = await page.evaluate(() => document.body.textContent)
      expect(text).toContain('50')
    })
  },
  timeout
)
