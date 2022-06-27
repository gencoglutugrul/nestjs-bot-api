import { delay, waitUntilCaptchaSolved } from '../helpers';

import { Page } from 'puppeteer-extra-plugin/dist/puppeteer';

export default async (page: Page) => {
  const onResponseForLogin = (page: Page): Promise<any> =>
    new Promise((resolve) => {
      page.on('response', (response) => {
        const request = response.request();
        if (request.url().indexOf('auth/v2/login') !== -1) {
          response.json().then(resolve);
        }
      });
      setTimeout(() => page.click('.login-btn'), 200);
    });

  try {
    await page.waitForSelector('#g-recaptcha-response', {
      timeout: 2000,
    });
    // TODO: send notification to the user to solve captcha
    await waitUntilCaptchaSolved(page, 500);
    await delay(200);
    const loginResponse = await onResponseForLogin(page);
    if ([0, 9981, 9982].indexOf(loginResponse.errorCode) !== -1)
      return loginResponse.errorCode !== 0;

    let errorDesc = 'UNKNOWN_ERROR';
    if (loginResponse.errorCode === 9966) errorDesc = 'NO_SUCH_MAIL';
    else if (loginResponse.errorCode === 'general_error')
      errorDesc = 'General Error';
    else if (loginResponse.errorCode === 9972)
      errorDesc = 'INVALID_LOGIN_PASSWORD';
    else if (loginResponse.errorCode === '9972.with_sso')
      errorDesc = 'INVALID_LOGIN_PASSWORD_WITH_SSO';

    delete loginResponse['payload'];
    throw Error(`Error: ${errorDesc}`);
  } catch (err) {
    if (err.name === 'TimeoutError') return false;
    throw err;
  }
};
