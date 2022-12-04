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
  'Acceptance test for V2 of BMI calculator with BMI category',
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

    it('TC1: Underweight', async () => {
      await delay(1000);
      await page.$eval('#cm', el => el.value = 200);
      await page.$eval('#kg', el => el.value = 50);

      // Click form
      await page.$eval('.panel-footer input', form => form.click())

      await delay(1000);
      let text = await page.evaluate(() => document.body.textContent)
      expect(text).toContain('Underweight')
    })

    it('TC2: Healthy weight', async () => {
      await delay(1000);
      await page.$eval('#cm', el => el.value = 200);
      await page.$eval('#kg', el => el.value = 90);

      // Click form
      await page.$eval('.panel-footer input', form => form.click())

      await delay(1000);
      let text = await page.evaluate(() => document.body.textContent)
      expect(text).toContain('Healthy weight')
    })

    it('TC3: Overweight', async () => {
      await delay(1000);
      await page.$eval('#cm', el => el.value = 200);
      await page.$eval('#kg', el => el.value = 110);

      // Click form
      await page.$eval('.panel-footer input', form => form.click())

      await delay(1000);
      let text = await page.evaluate(() => document.body.textContent)
      expect(text).toContain('Overweight')
    })

    it('TC4: Obese', async () => {
      await delay(1000);
      await page.$eval('#cm', el => el.value = 200);
      await page.$eval('#kg', el => el.value = 150);

      // Click form
      await page.$eval('.panel-footer input', form => form.click())

      await delay(1000);
      let text = await page.evaluate(() => document.body.textContent)
      expect(text).toContain('Obese')
    })
  },
  timeout
)
