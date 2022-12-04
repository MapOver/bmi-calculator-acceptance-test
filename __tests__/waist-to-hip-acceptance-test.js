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
  'Acceptance test for V2 of BMI calculator with "Waist to hip ratio"',
  () => {
    let page
    beforeEach(async () => {
      console.log(chalk.green('Setup Puppeteer'))
      browser = await puppeteer.launch({
        headless: true
      })
      console.log(chalk.green('Go to app page'))
      page = await browser.newPage()
      await page.goto('http://localhost:8080/waist-to-hip', 
        { waitUntil: 'networkidle0' })
    }, timeout)

    afterEach(async () => {
      await page.close()
      console.log(chalk.green('Teardown Puppeteer'))
      await browser.close()
      browser = null
    })

    
    it('TC1: normal weight', async () => {
      await delay(1000);
      await page.$eval('#hip', el => el.value = 100);
      await page.$eval('#waist', el => el.value = 50);
      await page.$eval('#gender', el => el.value = "Male");

      // Click form
      await page.$eval('.panel-footer input', form => form.click())

      await delay(1000);
      let text = await page.evaluate(() => document.body.textContent)
      expect(text).toContain('normal weight')
    })

    it('TC2: normal weight', async () => {
      await delay(1000);
      await page.$eval('#hip', el => el.value = 100);
      await page.$eval('#waist', el => el.value = 84);
      await page.$eval('#gender', el => el.value = "Male");

      // Click form
      await page.$eval('.panel-footer input', form => form.click())

      await delay(1000);
      let text = await page.evaluate(() => document.body.textContent)
      expect(text).toContain('normal weight')
    })

    it('TC3: obese', async () => {
      await delay(1000);
      await page.$eval('#hip', el => el.value = 100);
      await page.$eval('#waist', el => el.value = 84);
      await page.$eval('#gender', el => el.value = "Female");

      // Click form
      await page.$eval('.panel-footer input', form => form.click())

      await delay(1000);
      let text = await page.evaluate(() => document.body.textContent)
      expect(text).toContain('over weight')
    })

    it('TC4: Correct hip ratio calculation', async () => {
        await delay(1000);
        await page.$eval('#hip', el => el.value = 100);
        await page.$eval('#waist', el => el.value = 50);
        await page.$eval('#gender', el => el.value = "Male");
  
        // Click form
        await page.$eval('.panel-footer input', form => form.click())
  
        await delay(1000);
        let text = await page.evaluate(() => document.body.textContent)
        expect(text).toContain('0.5')
      })
  },
  timeout
)
