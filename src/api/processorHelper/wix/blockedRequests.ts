import { HTTPRequest } from 'puppeteer';

export default (request: HTTPRequest): boolean => {
  if (['image', 'font', 'media'].indexOf(request.resourceType()) !== -1)
    return true;

  for (const url of [
    'https://apis.google.com',
    'https://apps.wix.com/support-chat-widget/script.js',
    'https://frog.wix.com/',
    'https://googleapis.com',
    'https://googletagmanager.com',
    'https://manage.wix.com/_api/app-market-api',
    'https://manage.wix.com/_api/chat-web',
    'https://manage.wix.com/_api/dealer-offer-events-service',
    'https://manage.wix.com/_api/dealer-offers-serving-service',
    'https://manage.wix.com/_api/premium-assets',
    'https://manage.wix.com/_api/premium-store',
    'https://manage.wix.com/_api/trigger-catalog',
    'https://manage.wix.com/_api/wix-bi-profile-webapp',
    'https://manage.wix.com/_api/wix-form-builder-web',
    'https://manage.wix.com/_api/wix-laboratory-server/laboratory/conductAllInScope?scope=my-account',
    'https://manage.wix.com/_api/wix-user-preferences-webapp',
    'https://manage.wix.com/_serverless/assignee-service',
    'https://manage.wix.com/_serverless/dashboard-setup',
    'https://manage.wix.com/_serverless/dealer-banners-service',
    'https://manage.wix.com/analytics-ng',
    'https://manage.wix.com/serverless-yoshi-business-dashboard-app',
    'https://maps.googleapis.com',
    'https://sentry.wixpress.com/api',
    'https://static.parastorage.com/services/business-info-client',
    'https://static.parastorage.com/services/account-team-client',
    'https://manage.wix.com/_api/wix-user-preferences-webapp/getVolatilePrefForKey/HELP_CENTER_WIDGET',
    'https://manage.wix.com/_api/chatbot',
    'https://manage.wix.com/_serverless/app-market-rpc-proxy/',
  ]) {
    if (
      request.url().startsWith(url) ||
      request.url().startsWith(url.replace('https://', 'https://www.'))
    )
      return true;
  }
  return false;
};
