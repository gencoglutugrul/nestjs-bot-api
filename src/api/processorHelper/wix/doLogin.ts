import { delay, waitUntilCaptchaSolved } from '../helpers';

import { Page } from 'puppeteer-extra-plugin/dist/puppeteer';

const CAPTCHA_REQUIRED = 9981;
const CAPTCHA_WRONG_ANSWER = 9982;
const ERROR_CODE_DESCRIPTIONS = {
  '9966': 'NO_SUCH_MAIL',
  '9972': 'INVALID_LOGIN_PASSWORD',
  '9972.with_sso': 'INVALID_LOGIN_PASSWORD_WITH_SSO',
  general_error: 'GENERAL_ERROR',
};

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

export default async (page: Page, email: string, password: string) => {
  await page.click('input[name=email]');
  await page.focus('input[name=email]');
  await page.type('input[name=email]', email);

  await page.focus('input[name=password]');
  await page.type('input[name=password]', password);

  let loginResponse;
  while ((loginResponse = await onResponseForLogin(page))) {
    if (loginResponse.errorCode === 0) return;

    if (
      loginResponse.errorCode === CAPTCHA_REQUIRED ||
      loginResponse.errorCode === CAPTCHA_WRONG_ANSWER
    ) {
      // TODO: send notification to the user to solve captcha
      await waitUntilCaptchaSolved(page, 500);
      await delay(200);
    } else {
      throw Error(
        `Error: ${
          Object.keys(ERROR_CODE_DESCRIPTIONS).indexOf(
            loginResponse.errorCode.toString(),
          ) !== -1
            ? ERROR_CODE_DESCRIPTIONS[loginResponse.errorCode]
            : 'UNKNOWN_ERROR_CODE_' + loginResponse.errorCode
        }`,
      );
    }
  }
};
