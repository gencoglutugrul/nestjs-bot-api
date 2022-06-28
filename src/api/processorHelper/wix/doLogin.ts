import { Page } from 'puppeteer-extra-plugin/dist/puppeteer';
import solveCaptcha from './solveCaptcha';

export default async (page: Page, email: string, password: string) => {
  await page.click('input[name=email]');
  await page.focus('input[name=email]');
  await page.type('input[name=email]', email);

  await page.focus('input[name=password]');
  await page.type('input[name=password]', password);

  await page.click('.login-btn');

  let i = 1;
  while (await solveCaptcha(page)) {
    console.log('Captcha solution has not accepted: ' + i++);
  }
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 58000 });
};
