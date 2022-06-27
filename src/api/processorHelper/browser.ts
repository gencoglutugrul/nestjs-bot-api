import { Browser } from 'puppeteer-extra-plugin/dist/puppeteer';
import { PuppeteerLaunchOptions } from 'puppeteer';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import puppeteer from 'puppeteer-extra';

puppeteer.use(StealthPlugin());

export const getNewBrowser = (options?: PuppeteerLaunchOptions) =>
  puppeteer.launch({
    headless: false,
    args: [
      '--disable-web-security',
      '--disable-features=site-per-process',
      '--disable-features=IsolateOrigins,site-per-process',
      '--allow-running-insecure-content',
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--mute-audio',
      '--no-zygote',
      '--no-xshm',
      '--window-size=1920,1080',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--enable-webgl',
      '--ignore-certificate-errors',
      '--lang=en-US,en;q=0.9',
      '--password-store=basic',
      '--disable-gpu-sandbox',
      '--disable-software-rasterizer',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-infobars',
      '--disable-breakpad',
      '--disable-canvas-aa',
      '--disable-2d-canvas-clip-aa',
      '--disable-gl-drawing-for-tests',
      '--enable-low-end-device-mode',
    ],
    ...options,
  });

export const getNewPage = async (
  browser?: Browser,
  headless?: boolean,
  userAgent?: string,
) => {
  browser = browser || (await getNewBrowser({ headless }));
  const [page] = await browser.pages();
  userAgent =
    userAgent ||
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36';
  page.setUserAgent(userAgent);
  // remove fingerprint
  page.evaluateOnNewDocument(() => {
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
  });

  await page.setRequestInterception(true);
  page.on('request', (request) => {
    if (
      request.url().endsWith('.png') ||
      request.url().endsWith('.jpg') ||
      request.url().startsWith('https://manage.wix.com/analytics-ng') ||
      request
        .url()
        .startsWith('https://manage.wix.com/_api/premium-store/v1/offering') ||
      request
        .url()
        .startsWith('https://manage.wix.com/_serverless/dashboard-setup') ||
      request
        .url()
        .startsWith(
          'https://manage.wix.com/_api/dealer-offer-events-service',
        ) ||
      request.url().startsWith('https://sentry.wixpress.com/api/') ||
      request
        .url()
        .startsWith(
          'https://manage.wix.com/_serverless/dealer-banners-service/v1',
        )
    ) {
      request.abort();
    } else {
      request.continue();
    }
  });
  return page;
};
