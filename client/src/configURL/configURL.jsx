//This will allow you to conveniently switch url based on production vs local
// const config_url =
//   process.env.NODE_ENV === 'production'
//     ? 'https://chatapplivedemo.com' // Production domain
//     : 'http://localhost:8080'; // Local development

// const config_url =
//   import.meta.env.NODE_ENV === 'production'
//     ? import.meta.env.VITE_API_URL // points to Render backend
//     : 'http://localhost:8080';

// const config_url = import.meta.env.PROD
//   ? import.meta.env.VITE_API_URL
//   : 'http://localhost:8080';

const config_url =
  import.meta.env.NODE_ENV === 'production'
    ? 'https://chatapplivedemo.com'
    : 'http://localhost:8080';

export const url = config_url;
