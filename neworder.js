const puppeteer = require("puppeteer");

const self = {
  browser: null,
  page: null,

  initialize: async () => {
    self.browser = await puppeteer.launch({ headless: false, slowMo: 250 });

    self.page = await self.browser.newPage();

    await self.page.setViewport({ width: 1200, height: 1500 });
    /* Go to fashiongo admin*/
    await self.page.goto("https://vendoradmin.fashiongo.net/#/auth/login");
  },

  login: async () => {
    var userNameInput = 'input[formcontrolname="username"]';
    await self.page.waitForSelector(userNameInput);
    await self.page.type(userNameInput, "cezanne");

    var passWordInput = 'input[formcontrolname="password"]';
    await self.page.type(passWordInput, "Rt123!");

    var button = await self.page.$(
      "body > fg-root > div.fg-container > fg-public-layout > fg-auth > div.login-container > div > div > div.content > div > div > form > div:nth-child(4) > button"
    );
    await button.click();
  },
  processNeworder: async () => {
    await self.page.waitForNavigation(
      "body > fg-root > div.fg-container > fg-secure-layout > fg-left-menu > ul > li:nth-child(2) > ul > li:nth-child(2) > a > div"
    );
    var allOrdersButton = await self.page.$(
      "body > fg-root > div.fg-container > fg-secure-layout > fg-left-menu > ul > li:nth-child(2) > ul > li:nth-child(2) > a > div"
    );
    await allOrdersButton.click();

    await page.waitForSelector(
      "body > fg-root > div.fg-container > fg-secure-layout > fg-left-menu > ul > li:nth-child(2) > ul > li:nth-child(2) > ul > li:nth-child(1) > a"
    );
    var newOrderButton = await page.$(
      "body > fg-root > div.fg-container > fg-secure-layout > fg-left-menu > ul > li:nth-child(2) > ul > li:nth-child(2) > ul > li:nth-child(1) > a"
    );
    await newOrderButton.click();

    var selectAll =
      "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-content > fg-orders > div:nth-child(4) > div > fg-order-list > div.panel__body.panel__body--nopadding.is-active > table > thead > tr > th.width-3p.text-left > div > label > input";
    await page.waitForSelector(selectAll);
    await page.click(selectAll);

    var exportPOButton =
      "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-content > fg-orders > div:nth-child(4) > div > fg-order-list > div.panel__body.panel__body--nopadding.is-active > div > div > div.table-grid__right.align-mid > button";
    await page.focus(exportPOButton);
    await page.click(exportPOButton);

    var separateSheet =
      "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-content > fg-orders > div:nth-child(4) > div > fg-order-list > fg-export-modal > div > div.modal-dialog > div > div > div.panel__body > div:nth-child(2) > div > div > h3";
    await page.click(separateSheet);

    var exportButton =
      "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-content > fg-orders > div:nth-child(4) > div > fg-order-list > fg-export-modal > div > div.modal-dialog > div > div > div.panel__body > div.row.margin-top-32.text-right > button";
    await page.click(exportButton);

    var companySelectBox =
      "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-header > fg-header > ul > li:nth-child(6) > div > select";
    await page.select(companySelectBox, "1428");
  }
};

module.exports = self;
