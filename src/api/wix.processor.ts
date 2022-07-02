import { Browser, Page } from 'puppeteer-extra-plugin/dist/puppeteer';
import {
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import {
  PUPPETEER_DEFAULT_OPTIONS,
  PUPPETEER_DEFAULT_UA,
  WIX_CAPTCHA_REQUIRED,
  WIX_CAPTCHA_WRONG_ANSWER,
  WIX_ERROR_CODE_DESCRIPTIONS,
} from './processorHelpers/constants';
import {
  puppeteerPreventFingerprint,
  waitUntilCaptchaSolved,
} from './processorHelpers/helpers';

import { BotDTO } from './dto/bot.dto';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import { PuppeteerLaunchOptions } from 'puppeteer';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import blockNonNecessaryWixRequests from './processorHelpers/blockNonNecessaryWixRequests';
import { delay } from './processorHelpers/helpers';
import path from 'path';
import puppeteer from 'puppeteer-extra';

@Processor('bot')
export class WixProcessor {
  @Inject(ConfigService) private configService: ConfigService;

  private browser: Browser;
  private page: Page;

  @Process('wix')
  async handleProcess(job: Job) {
    const data: BotDTO = job.data;
    await this.prepareBrowser({
      userDataDir: path.join(
        this.configService.get('SESSIONS_DIR'),
        data.username,
      ),
    });

    await this.preparePage();

    return await this.syncReservations(data);
  }

  @OnQueueCompleted()
  async onCompleted() {
    await this.browser.close();
  }

  @OnQueueFailed()
  async onFailed() {
    await this.browser.close();
  }

  private async syncReservations(data: BotDTO) {
    await this.page.goto('https://manage.wix.com/', {
      waitUntil: 'networkidle2',
      timeout: 59000,
    });

    await this.loginIfNeeded(data.username, data.password);
    await this.selectWebsiteIfNeeded();

    await this.page.waitForSelector('a[data-hook=hotels]');
    await this.page.click('a[data-hook=hotels]');

    const iframe = await this.page.waitForSelector(
      'iframe[title="Wix Hotels"]',
    );
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
  }

  private async selectWebsiteIfNeeded() {
    if (this.page.url().indexOf('/account/sites') !== -1) {
      await this.page.waitForSelector('[data-hook=site-list-area-select]');
      await this.page.click('[data-hook=site-list-area-select]');
      await this.page.waitForNavigation({
        waitUntil: 'networkidle2',
        timeout: 60000,
      });
    }
  }
  private async loginIfNeeded(email: string, password: string) {
    if (this.page.url().startsWith('https://users.wix.com/')) {
      await this.doLogin(email, password);
      await this.page.waitForNavigation({
        waitUntil: 'networkidle2',
        timeout: 58000,
      });
    }
  }

  private async onResponseForLogin(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.page.on('response', (response) => {
        const request = response.request();
        if (request.url().indexOf('auth/v2/login') !== -1) {
          response.json().then((data) => {
            resolve(data);
          });
        }
      });

      setTimeout(() => this.page.click('.login-btn'), 200);
      setTimeout(() => reject('Failed to send login request.'), 10000);
    });
  }

  private async doLogin(email: string, password: string) {
    await this.page.click('input[name=email]');
    await this.page.focus('input[name=email]');
    await this.page.type('input[name=email]', email);

    await this.page.focus('input[name=password]');
    await this.page.type('input[name=password]', password);

    let loginResponse;
    while ((loginResponse = await this.onResponseForLogin())) {
      if (loginResponse.errorCode === 0) return;

      if (
        loginResponse.errorCode === WIX_CAPTCHA_REQUIRED ||
        loginResponse.errorCode === WIX_CAPTCHA_WRONG_ANSWER
      ) {
        await waitUntilCaptchaSolved(this.page, 500);
        await delay(200);
      } else {
        throw Error(
          `Error: ${
            Object.keys(WIX_ERROR_CODE_DESCRIPTIONS).indexOf(
              loginResponse.errorCode.toString(),
            ) !== -1
              ? WIX_ERROR_CODE_DESCRIPTIONS[loginResponse.errorCode]
              : 'UNKNOWN_ERROR_CODE_' + loginResponse.errorCode
          }`,
        );
      }
    }
  }

  private async prepareBrowser(options?: PuppeteerLaunchOptions) {
    puppeteer.use(StealthPlugin());

    const browser = await puppeteer.launch({
      ...PUPPETEER_DEFAULT_OPTIONS,
      ...options,
    });
    this.browser = browser;
    return browser;
  }

  private async preparePage(userAgent?: string) {
    userAgent = userAgent || PUPPETEER_DEFAULT_UA;

    const [page] = await this.browser.pages();
    page.setUserAgent(userAgent);
    page.evaluateOnNewDocument(puppeteerPreventFingerprint);

    await page.setRequestInterception(true);
    page.on('request', blockNonNecessaryWixRequests);
    this.page = page;
    return page;
  }
}
