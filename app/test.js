const puppeteer = require("puppeteer-extra");
const RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: "2captcha",
      token: "c89c1e8d2c89299113e1f4c25b11ae91",
    },
  })
);

puppeteer.use(StealthPlugin());

const browser = await puppeteer.launch({
  headless: "new", // To make it visible
  // headless: false, // To make it visible
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-gpu",
    `--disable-extensions-except=/app/buster`,
    `--load-extension=/app/buster`,
    "--window-size=1400,900",
  ],
  executablePath: "google-chrome-stable",
});

const page = await browser.newPage();

page = await browser.newPage();
await page.setExtraHTTPHeaders({
  "Accept-Language": "",
  "User-Agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
});

await page.setRequestInterception(true);

page.on("request", (interceptedRequest) => {
  const headers = interceptedRequest.headers();
  headers["Accept-Language"] =
    "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7,la;q=0.6,sv;q=0.5";
  interceptedRequest.continue({
    headers: headers,
  });
});


await page.goto(
  "https://www.ufg.pl/infoportal/faces/oracle/webcenter/portalapp/pagehierarchy/Page190.jspx"
);

// Fill the input
const plateNumber = "HPPB141"; // Replace with the actual plate number or pass it as an argument
const inputElement = await page.$(
  "#T\\:oc_8035602191region1\\:s12\\:it1\\:\\:content"
);
if (inputElement) {
  await inputElement.type(plateNumber);
}

await page.solveRecaptchas();
await page.waitForTimeout(3000);
await page.screenshot({ path: "testresult.png", fullPage: true });
// Do other stuff like clicking on a submit button, waiting for navigation, etc.

// Close the browser (you might want to comment this out for testing)
// await browser.close();
