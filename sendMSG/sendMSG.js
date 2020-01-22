const puppeteer = require("puppeteer");
const accounts = require("../config/config");
const sleep = require("../function/sleep");
const clipboardy = require("clipboardy");

const self = {
  broswer: null,
  page: null,
  initialize: async () => {
    self.broswer = await puppeteer.launch({
      headless: false,
      timeout: 0
    });

    self.page = await self.broswer.newPage();
    await self.page.setViewport({
      width: 1366,
      height: 768
    });
    await self.page.goto("https://vendoradmin.fashiongo.net/#/auth/login");
  },

  login: async (username, password) => {
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

  gotoCustomer: async () => {
    var customerSelecor =
      "body > fg-root > div.fg-container > fg-secure-layout > fg-left-menu > ul > li:nth-child(5) > div";
    await self.page.waitForSelector(customerSelecor);
    var buttonCtm = await self.page.$(
      "body > fg-root > div.fg-container > fg-secure-layout > fg-left-menu > ul > li:nth-child(5) > div"
    );
    await buttonCtm.click();

    var allCustomerSelector =
      "body > fg-root > div.fg-container > fg-secure-layout > fg-left-menu > ul > li:nth-child(5) > ul > li:nth-child(1) > a";
    await self.page.waitForSelector(allCustomerSelector);
    buttonAllctm = await self.page.$(allCustomerSelector);
    await self.page.focus(allCustomerSelector).then(console.log("focus 1"));
    await buttonAllctm.click().then(console.log("click buttonAllctm"));
    await sleep(1000);
  },

  selectCustmorGroupe: async (value, region) => {
    var inputSelectorBox =
      "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-content > fg-customer > form > div > div:nth-child(3) > div.search-cell.search-cell--select > span > select";

    await self.page.waitForSelector(inputSelectorBox);
    await self.page.focus(inputSelectorBox);
    await self.page.select(inputSelectorBox, value);

    var blockStatusSelector =
      "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-content > fg-customer > form > div > div:nth-child(3) > div:nth-child(3) > span.input-select.width-100.margin-right-16 > select";
    await self.page.select(blockStatusSelector, "N");

    var regionInputSelector =
      "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-content > fg-customer > form > div > div:nth-child(3) > div.search-cell.search-cell--input > div > input.ng-pristine.ng-valid.ng-touched";
    var regionInput = await self.page.$(regionInputSelector);

    await regionInput.type(region);
    await self.page.keyboard.press("Enter");

    var displaySelector =
      "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-content > fg-customer > div.table-grid.fixed.search-result-bottom > div.table-grid__right > span > select";
    await self.page.select(displaySelector, "500");
  },

  send: async (msg, files) => {
    //copy msgbody to clipboard
    await clipboardy.writeSync(msg[1]);

    var pageSelector =
      "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-content > fg-customer > div.table-grid.fixed.search-result-bottom > div.table-grid__center > fg-pagination > ul > li.pagination__numbers > div > div.table-grid__center.align-mid > div";
    await self.page.waitForSelector(pageSelector);
    await sleep(3000);
    var ps = await self.page.$(pageSelector);
    var pages = await self.page.evaluate(
      ps => parseInt(ps.innerText.substring(3)),
      ps
    );
    var messageSent = 0;

    for (let page = 60; page > 0; page--) {
      console.log(page);
      var pageInputSelector =
        "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-content > fg-customer > div.table-grid.fixed.search-result-bottom > div.table-grid__center > fg-pagination > ul > li.pagination__numbers > div > div.table-grid__left.align-mid > div > input";

      await self.page.waitForSelector(pageInputSelector);
      await self.page.focus(pageInputSelector);
      var pageInput = await self.page.$(pageInputSelector);
      var pageNum = page.toString();
      await pageInput.click({
        clickCount: 3
      });
      await sleep(300);
      await pageInput.type(pageNum).then(console.log(pageNum));
      await sleep(300);
      var goButton = await self.page.$(
        "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-content > fg-customer > div.table-grid.fixed.search-result-bottom > div.table-grid__center > fg-pagination > ul > li.pagination__numbers > div > div.table-grid__right.align-mid > button"
      );
      await goButton.click().then(console.log("click go"));
      await sleep(5000);
      //--------------------------------------------------------------
      await self.page.waitForSelector(
        "table > tbody > tr > td.search-result__mail > button"
      );
      var orders = await self.page.$$(
        "table > tbody > tr > td.search-result__mail > button"
      );
      var messageSent = 0;
      for (let i = orders.length - 1; i >= 0; i--) {
        await self.page.waitForSelector(
          "table > tbody > tr > td.search-result__mail > button"
        );

        orders = await self.page.$$(
          "table > tbody > tr > td.search-result__mail > button"
        );
        await sleep(500);
        var order = orders[i];
        await order.click().then(() => console.log("click msg"));

        await sleep(200);
        const companySelector =
          "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-content > fg-customer > div:nth-child(8) > fg-message-compose-modal > div > div.modal-dialog.large > div > div.panel__body > div.fieldset > div:nth-child(2) > div.input-row__value > span";
        await self.page.waitForSelector(companySelector);
        const company = await self.page.$(companySelector);
        const companyName = await self.page.evaluate(
          company => company.innerText,
          company
        );
        await sleep(200);
        // type title

        var titleSelector =
          "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-content > fg-customer > div:nth-child(8) > fg-message-compose-modal > div > div.modal-dialog.large > div > div.panel__body > div.fieldset > div:nth-child(3) > div.input-row__value > div.input-txt.width-350 > input.ng-untouched.ng-pristine.ng-valid";
        var titleInput = await self.page.$(titleSelector);
        await titleInput.type(msg[0]);
        sleep(500);
        // type msg body
        var msgBodySelector =
          "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-content > fg-customer > div:nth-child(8) > fg-message-compose-modal > div > div.modal-dialog.large > div > div.panel__body > div.fieldset > div:nth-child(4) > div.input-row__value > textarea";
        await self.page.click(msgBodySelector);
        await sleep(200);
        await paste();
        //doesnt' work
        // await self.page.waitForSelector(msgBodySelector);
        // await setMsgBody(msgBodySelector, msg[1]);
        //takes too long
        //var msgBodyInput = await self.page.$(msgBodySelector);
        // await msgBodyInput.type(msg[1]);

        //upload linesheet
        var attachFileSelector = "#fileForm1 > input[type=file]";
        var attach = await self.page.$(attachFileSelector);
        await attach.uploadFile(files);

        await sleep(200);
        const closeSelector =
          "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-content > fg-customer > div:nth-child(8) > fg-message-compose-modal > div > div.modal-dialog.large > div > div.panel__header > div > div.table-grid__right.align-mid > i";

        const sendButtonSelector =
          "body > fg-root > div.fg-container > fg-secure-layout > div > div.fg-content > fg-customer > div:nth-child(8) > fg-message-compose-modal > div > div.modal-dialog.large > div > div.panel__body > div.fieldset > div.text-right > button.btn.btn-blue.btn--min-width";
        const sendButton = await self.page.$(sendButtonSelector);
        await sendButton.click().then(() => {
          messageSent++;
          console.log(`Send to ${companyName}\n${messageSent}`);
        });
        await sleep(1000);
        await self.page.waitForSelector(closeSelector);
        const closeButton = await self.page.$(closeSelector);
        await closeButton.click();
      }
    }
  }
};
module.exports = self;

const setMsgBody = async (selector, text) => {
  await self.page.evaluate(
    data => {
      return (document.querySelector(data.selector).value = data.text);
    },
    { selector, text }
  );
};

const paste = async () => {
  await self.page.keyboard.down("Control");
  await self.page.keyboard.press("KeyV");
  await self.page.keyboard.up("Control");
};
