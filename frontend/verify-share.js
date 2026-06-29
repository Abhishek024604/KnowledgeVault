const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set local storage for auth since the page is protected
  await page.goto('http://localhost:5173/login');
  // I will just wait for network idle instead of logging in, wait, the layout is protected!
  // I must be logged in to see MainLayout.
  
  await browser.close();
})();
