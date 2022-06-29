import { getNewBrowser, getNewPage } from '../browser';

import { Page } from 'puppeteer-extra-plugin/dist/puppeteer';
import doLogin from './doLogin';
import path from 'path';
import requestBlockingDecisionMaker from './blockedRequests';
import wixSyncReservation from './syncReservations';

export const syncReservations = async (
  email: string,
  password: string,
  headless?: boolean,
) => authAndCallback(email, password, wixSyncReservation, headless);

const authAndCallback = async (
  email: string,
  password: string,
  callback: (page: Page) => Promise<{
    success: boolean;
    message: string;
  }>,
  headless?: boolean,
) => {
  headless = headless || false;
  const browser = await getNewBrowser({
    headless,
    userDataDir: path.join(process.env.SESSIONS_DIR, email),
  });

  try {
    const page = await getNewPage(
      requestBlockingDecisionMaker,
      browser,
      headless,
    );

    await page.goto('https://manage.wix.com/', {
      waitUntil: 'networkidle2',
      timeout: 59000,
    });

    if (page.url().startsWith('https://users.wix.com/')) {
      await doLogin(page, email, password);
      await page.waitForNavigation({
        waitUntil: 'networkidle2',
        timeout: 58000,
      });
    }

    return await callback(page);
  } catch (err) {
    return {
      message: err.message,
      success: false,
    };
  } finally {
    browser.close();
  }
};
