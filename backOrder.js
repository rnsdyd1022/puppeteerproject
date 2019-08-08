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

    await displayHundred();

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
      await sleep(1000);
      var orders = await collectOrders();
      var modifiedOrders = await modifyStyNumOfOrders(orders);
      
    }

  }
}


const displayHundred = async() => {
  var select =
    "#dataTables-backorders2_length > label > select";
  await self.page.waitForSelector(select);
  await self.page.select(select, "100");
  await sleep (100);
  console.log("Display 100 orders");
};

const collectOrders = async () => {
  var orders = [];
  const table = await self.page.$$("#dataTables-backorders2 > tbody > tr");
  for ( row of table) {
    let order = {};

    var records = await row.$$("#dataTables-backorders2 > tbody > tr > td");
    if(records.length === 1) {
      let msg = records[0];
      let msgText = await self.page.evaluate(msg => msg.innerText, msg) ;
       console.log(msgText);
      continue;
    }
    let vender = records[1];
    let originalNum = records[2];
    let styNum = records[3];
    let color = records[4];
    let qty = records[5];

    let venderText = await self.page.evaluate(vender=> vender.innerText, vender);
    let originalNumText = await self.page.evaluate(originalNum=> originalNum.innerText, originalNum);
    let styNumText = await self.page.evaluate(styNum=> styNum.innerText, styNum);
    let colorText = await self.page.evaluate(color=> color.innerText, color);
    let qtyText = await self.page.evaluate(qty=> qty.innerText, qty);

    order.vender = venderText;
    order.originalNum = originalNumText;
    order.styNum = styNumText;
    order.color = colorText;
    order.qty = qtyText;
    orders.push(order);
  }
  console.log(orders);
  return orders;
}

const modifyStyNumOfOrders = async (orders) => {

  var modifiedOrders = orders.map((order)=> {

    //original# = "" -- LASHOWROOM
    if(order.originalNum === '') {
      console.log("LA SHOWROOM")
      let st = order.styNum;
      var deletTargets = ["PLUS", "PLU","PL"];
      order.SIZE = "R";
      for (target of deletTargets) {
        if( st.indexOf(target) > 0 ) {
          order.SIZE = "P"
          st = st.slice(0,st.indexOf(target)).trim();
        }
      }
      var isFirstDash = 0
      for( let i = 0; i < st.length; i++ ) {
        
        if(st[i] ==='-') {
          if(isFirstDash === 0) {
            var subSt = st.subStr(0,i)
          }
        }
      }


    } else {
      console.log("FASHION GO")

     let st = order.originalNum;
     //FashionGO
      if ( st.indexOf("PLUS") < 0 ) {

         order.SIZE = "R";

      } else if (st.indexOf("PLUS") > 0 ){

         order.SIZE = "P";
         order.originalNum = st.slice(0,styleNum.indexOf("PLUS")).trim();

      }
    }
  })
}
module.exports = self;