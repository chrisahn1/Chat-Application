//This will allow you to conveniently switch url based on production vs local
const config_url =
  process.env.NODE_ENV === 'production'
    ? 'https://chatapplivedemo.com' // Production domain
    : 'http://localhost:8080'; // Local development

export const url = config_url;
