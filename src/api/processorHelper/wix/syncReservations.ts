import { Page } from 'puppeteer-extra-plugin/dist/puppeteer';

export default async (
  page: Page,
): Promise<{
  success: boolean;
  message: string;
}> => {
  if (page.url().indexOf('/account/sites') !== -1) {
    await page.waitForSelector('[data-hook=site-list-area-select]');
    await page.click('[data-hook=site-list-area-select]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
  }

  await page.waitForSelector('a[data-hook=hotels]');
  await page.click('a[data-hook=hotels]');

  const iframe = await page.waitForSelector('iframe[title="Wix Hotels"]');
  const frame = await iframe.contentFrame();

  await frame.waitForSelector('a[ui-sref="base.reservations"]');
  await frame.click('a[ui-sref="base.reservations"]');

  await frame.waitForSelector('a[wix-bi=SYNC_CALENDAR]');
  await frame.click('a[wix-bi=SYNC_CALENDAR]');
  const messageBar = await frame.waitForSelector('.message-bar.mb-show');
  const className = await messageBar.getProperty('className');
  const success = className.toString().indexOf('type-success') !== -1;
  const message = (
    await (await messageBar.getProperty('textContent')).jsonValue()
  ).toString();

  return {
    message,
    success,
  };
};
