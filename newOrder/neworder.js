const puppeteer = require("puppeteer");
const accounts = require("../config/config");
const sleep = require("../function/sleep");

const self = {
  browser: null,
  page: null,

  initialize: async () => {
    self.browser = await puppeteer.launch({
      headless: false,
      timeout: 0
    });

    self.page = await self.browser.newPage();
    await self.page.setViewport({ width: 1366, height: 768 });
    /* Go to fashiongo admin*/
    await self.page.goto("https://vendoradmin.fashiongo.net/#/auth/login");
  },

  end: async () => {
    await self.page.close();
    await self.browser.close();
  },

  login: async () => {
    const username = accounts.fashionGoID;
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
    await self.page.waitForNavigation(
      "body > fg-root > div.fg-container > fg-secure-layout > fg-left-menu > ul > li:nth-child(2) > ul > li:nth-child(2) > a > div"
    );

    const accountsinfo = accounts.info;
    var totalOrders;
    for (account of accountsinfo) {
      await switchCompany(account.code);
      await clickNeworders();
      await selectDisplayNum();
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
  await sleep(3000);
};

const switchCompany = async code => {
  var companySelectBox =
    "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-header > fg-header > ul > li:nth-child(6) > div > select";
  await self.page.waitForSelector(companySelectBox);
  await self.page.select(companySelectBox, code);
  totalOrders = 0;
  await sleep(500);
  console.log(code);
};

const selectDisplayNum = async () => {
  var selectNum =
    "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-content > fg-orders > div:nth-child(4) > div > fg-order-list > div.panel__body.panel__body--nopadding.is-active > div > div > div.table-grid__right.align-mid > div > fg-per-page > div > div > select";
  await self.page.waitForSelector(selectNum);
  await self.page
    .select(selectNum, "2: Object")
    .then(() => console.log("Display 50 orders"));
  await sleep(1000);
};
const selectAll = async () => {
  await sleep(500);
  var selectAll =
    "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-content > fg-orders > div:nth-child(4) > div > fg-order-list > div.panel__body.panel__body--nopadding.is-active > table > thead > tr > th.width-3p.text-left > div > label > input";
  await self.page.waitForSelector(selectAll);
  await self.page
    .click(selectAll)
    .then(() => console.log("Select All new orders"));
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

  await sleep(5000);
  console.log("Export Sheet");
};

const updateBoxNum = async num => {
  const date = new Date().toISOString().slice(8, 10);
  var number = num;

  var pageSelector =
    "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-content > fg-orders > div:nth-child(4) > div > fg-order-list > div.panel__body.panel__body--nopadding.is-active > div > div > div.table-grid__center.align-mid.width-40p > fg-pagination > ul > li.pagination__numbers > div > div.table-grid__center.align-mid > div";
  var ps = await self.page.$(pageSelector);

  var pages = await self.page.evaluate(
    ps => parseInt(ps.innerText.substring(3)),
    ps
  );

  for (let page = pages; page > 0; page--) {
    console.log(page);
    var pageInputSelector =
      "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-content > fg-orders > div:nth-child(4) > div > fg-order-list > div.panel__body.panel__body--nopadding.is-active > div > div > div.table-grid__center.align-mid.width-40p > fg-pagination > ul > li.pagination__numbers > div > div.table-grid__left.align-mid > div > input";

    await self.page.waitForSelector(pageInputSelector);
    await self.page.focus(pageInputSelector);
    var pageInput = await self.page.$(pageInputSelector);
    var pageNum = page.toString();
    await pageInput.click({ clickCount: 3 });
    await sleep(300);
    await pageInput.type(pageNum);
    await sleep(300);
    var goButton = await self.page.$(
      "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-content > fg-orders > div:nth-child(4) > div > fg-order-list > div.panel__body.panel__body--nopadding.is-active > div > div > div.table-grid__center.align-mid.width-40p > fg-pagination > ul > li.pagination__numbers > div > div.table-grid__right.align-mid > button"
    );
    await goButton.click().then(console.log("click go"));
    await sleep(1000);
    await selectAll();
    await exportSheet();

    await sleep(1000);
    //--------------------------------------------------------------
    await self.page.waitForSelector("table > tbody > tr > td:nth-child(5)");
    var orders = await self.page.$$("table > tbody > tr > td:nth-child(5)");
    totalOrders = totalOrders + orders.length;
    console.log("Total order to process: " + totalOrders);
    for (let i = orders.length - 1; i >= 0; i--) {
      await self.page.waitForSelector(
        "table > tbody > tr > td:nth-child(5) > a"
      );

      orders = await self.page
        .$$("table > tbody > tr > td:nth-child(5) > a")
        .then();
      await sleep(500);
      var order = orders[i];
      await order.click();

      await sleep(200);
      const companySelector =
        "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-content > fg-order-detail > div:nth-child(3) > div.panel__body.panel__body--nopadding > div:nth-child(2) > div:nth-child(1) > ul > li:nth-child(1) > span.info-item__cont > strong";
      await self.page.waitForSelector(companySelector);
      const company = await self.page.$(companySelector);
      const companyName = await self.page.evaluate(
        company => company.innerText,
        company
      );

      const textArea =
        "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-content > fg-order-detail > div:nth-child(4) > div.panel__body.panel__body--nopadding > div.order-table__container > div > div > div.table-grid__center.summary-block__container.width-29p > div > textarea";
      await self.page.waitForSelector(textArea);
      const boxNumber = "Joe" + date + "=" + number + "\n";
      const msg = companyName + ": " + boxNumber;

      console.log(msg);

      await self.page.waitForSelector(textArea);
      await self.page.focus(textArea);
      var textInput = await self.page.$(textArea);
      await textInput.type(boxNumber);

      await self.page.waitForSelector(
        "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-content > fg-order-detail > div.table-grid.page-menu > div > button"
      );
      var saveButton = await self.page.$(
        "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-content > fg-order-detail > div.table-grid.page-menu > div > button"
      );
      await saveButton.focus();
      await saveButton.click();
      number++;
      await self.page.goBack();
      //----------------------------------------------------------------------------------------
    }
  }
};
