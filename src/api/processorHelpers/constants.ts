export const WIX_CAPTCHA_REQUIRED = 9981;
export const WIX_CAPTCHA_WRONG_ANSWER = 9982;
export const WIX_ERROR_CODE_DESCRIPTIONS = {
  '9966': 'NO_SUCH_MAIL',
  '9972': 'INVALID_LOGIN_PASSWORD',
  '9972.with_sso': 'INVALID_LOGIN_PASSWORD_WITH_SSO',
  general_error: 'GENERAL_ERROR',
};

export const PUPPETEER_DEFAULT_UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Safari/537.36';

export const PUPPETEER_DEFAULT_OPTIONS = {
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
};
