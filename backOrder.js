const puppeteer = require("puppeteer");
const accounts = require("./config/config");
const sleep = require("./sleep");

const self = {
  browser: null,
  page: null,

  initialize: async () => {
    self.browser = await puppeteer.launch({
      headless: false,
      timeout: 0
    });

    self.page = await self.browser.newPage();
    await self.page.setViewport({ width: 1366, height: 768}); 
    await self.page.goto("http://styleinusa.net/login");
  },

  login: async () => {
    const username = accounts.backOrderID;
    const password = accounts.password;

    var userNameInput = 'input[name="username"]';
    await self.page.waitForSelector(userNameInput);
    await self.page.type(userNameInput, username);

    var passWordInput = 'input[name="password"]';
    await self.page.type(passWordInput, password);

    var button = await self.page.$("button");
    await button.click();
  },
  search: async (list) => {
    await self.page.waitForSelector("div.clearfix");
    var button = await self.page.$("div.clearfix");
    await button.click();

    const searchInputSelector = "#dataTables-backorders2_filter > label > input"
    await self.page.waitForSelector(searchInputSelector);
    const searchInput = await self.page.$(searchInputSelector);
    //check start;
    for (item of list) {
      console.log(item);
      await searchInput.click({clickCount: 3});
      await sleep(2000);
      self.page.type(searchInputSelector,item.STYLENUM);

      //do something...
      await sleep(3000);
    }

  }
}

module.exports = self;