const puppeteer = require("puppeteer");
const accounts = require("./config/config");

const self = {
  browser: null,
  page: null,

  initialize: async () => {
    self.browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
      timeout: 0
    });

    self.page = await self.browser.newPage();

    /* Go to fashiongo admin*/
    await self.page.goto("https://vendoradmin.fashiongo.net/#/auth/login");
  },

  login: async () => {
    const username = accounts.id;
    const password = accounts.password;

    var userNameInput = 'input[formcontrolname="username"]';
    await self.page.waitForSelector(userNameInput);
    await self.page.type(userNameInput, username);

    var passWordInput = 'input[formcontrolname="password"]';
    await self.page.type(passWordInput, password);

    var button = await self.page.$(
      "body > fg-root > div.fg-container > fg-public-layout > fg-auth > div.login-container > div > div > div.content > div > div > form > div:nth-child(4) > button"
    );
    await button.click();
  },
  processNeworder: async () => {
    await clickAllorders();

    const accountsinfo = accounts.info;

    for (account of accountsinfo) {
      await switchCompany(account.code);
      await clickNeworders();
      await selectDisplayNum();
      await selectAll();
      await exportSheet();
      await updateBoxNum(account.startingNum);
    }
  }
};

module.exports = self;

const clickAllorders = async () => {
  await self.page.waitForNavigation(
    "body > fg-root > div.fg-container > fg-secure-layout > fg-left-menu > ul > li:nth-child(2) > ul > li:nth-child(2) > a > div"
  );

  var allOrdersButton = await self.page.$(
    "body > fg-root > div.fg-container > fg-secure-layout > fg-left-menu > ul > li:nth-child(2) > ul > li:nth-child(2) > a > div"
  );
  await allOrdersButton.click();
};

const clickNeworders = async () => {
  await self.page.waitForSelector(
    "body > fg-root > div.fg-container > fg-secure-layout > fg-left-menu > ul > li:nth-child(2) > ul > li:nth-child(2) > ul > li:nth-child(1) > a"
  );
  var newOrderButton = await self.page.$(
    "body > fg-root > div.fg-container > fg-secure-layout > fg-left-menu > ul > li:nth-child(2) > ul > li:nth-child(2) > ul > li:nth-child(1) > a"
  );
  await newOrderButton.click();
};

const switchCompany = async code => {
  var companySelectBox =
    "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-header > fg-header > ul > li:nth-child(6) > div > select";
  await self.page.waitForSelector(companySelectBox);
  await self.page.select(companySelectBox, code);
  console.log(code);
};

const selectDisplayNum = async () => {
  var selectNum =
    "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-content > fg-orders > div:nth-child(4) > div > fg-order-list > div.panel__body.panel__body--nopadding.is-active > div > div > div.table-grid__right.align-mid > div > fg-per-page > div > div > select";
  await self.page.waitForSelector(selectNum);
  await self.page.select(selectNum, "2: Object");
  console.log("Display 50 orders");
};
const selectAll = async () => {
  var selectAll =
    "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-content > fg-orders > div:nth-child(4) > div > fg-order-list > div.panel__body.panel__body--nopadding.is-active > table > thead > tr > th.width-3p.text-left > div > label > input";
  await self.page.waitForSelector(selectAll);
  await self.page.click(selectAll);
  console.log("Select All new orders");
};

const exportSheet = async () => {
  var exportPOButton =
    "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-content > fg-orders > div:nth-child(4) > div > fg-order-list > div.panel__body.panel__body--nopadding.is-active > div > div > div.table-grid__right.align-mid > button";
  await self.page.focus(exportPOButton);
  await self.page.click(exportPOButton);

  var separateSheet =
    "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-content > fg-orders > div:nth-child(4) > div > fg-order-list > fg-export-modal > div > div.modal-dialog > div > div > div.panel__body > div:nth-child(2) > div > div > h3";
  await self.page.click(separateSheet);

  var exportButton =
    "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-content > fg-orders > div:nth-child(4) > div > fg-order-list > fg-export-modal > div > div.modal-dialog > div > div > div.panel__body > div.row.margin-top-32.text-right > button";
  await self.page.click(exportButton);
  console.log("Export Sheet");
};

const updateBoxNum = async num => {
  const date = new Date().toISOString().slice(8, 10);
  var number = num;
  const orders = await self.page.$$("table > tbody > tr > td:nth-child(5)");
  console.log("Total order to process: " + orders.length);
  for (let i = orders.length - 1; i >= 0; i--) {
    await self.page.waitForSelector("table > tbody > tr > td:nth-child(5) > a");
    const orders = await self.page.$$(
      "table > tbody > tr > td:nth-child(5) > a"
    );

    const order = orders[i];
    await order.focus();
    await order.click();
    const textArea =
      "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-content > fg-order-detail > div:nth-child(4) > div.panel__body.panel__body--nopadding > div.order-table__container > div > div > div.table-grid__center.summary-block__container.width-29p > div > textarea";
    const boxNumber = "This is a test of Joe " + date + "=" + number + "\n";
    console.log(boxNumber);
    await self.page.waitForSelector(textArea);
    await self.page.focus(textArea);
    var textInput = await self.page.$(textArea);
    await textInput.type(boxNumber);

    var saveButton = await self.page.$(
      "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-content > fg-order-detail > div.table-grid.page-menu > div > button"
    );
    await saveButton.click();
    number++;
    await self.page.goBack();
  }
};
