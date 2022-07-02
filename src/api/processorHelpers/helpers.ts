import { Page } from 'puppeteer-extra-plugin/dist/puppeteer';
import { promisify } from 'util';

export const waitUntilCaptchaSolved = (
  page: Page,
  ms?: number,
): Promise<string> =>
  new Promise((resolve) => {
    const intervalId = setInterval(async () => {
      const recaptcha = await page.waitForSelector('#g-recaptcha-response');
      const value = await page.evaluate((el) => el.value, recaptcha);

      if (value.length !== 0) {
        clearInterval(intervalId);
        resolve(value);
      }
    }, ms || 2500);
  });

export const delay = promisify(setTimeout);

export const puppeteerPreventFingerprint = () => {
  class ModifiedError extends Error {
    constructor(message) {
      super(message);
      this.stack = this.stack.replace(
        /at __puppeteer_evaluation_script__.*/gim,
        'at (window)',
      );
    }
  }

  Object.defineProperty(window, 'Error', {
    configurable: false,
    writable: false,
    value: ModifiedError,
  });
};
