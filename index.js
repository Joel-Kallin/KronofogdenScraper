const puppeteer = require('puppeteer')
const fs = require('fs')
const os = require("os");



const allDigitsRegex = new RegExp('^[0-9]+$');

const writeLine = async (data) => {
   return fs.appendFile("history.txt", `${data}${os.EOL}`, (err) => {
      if (err) console.log(err);
      console.log("Successfully Written to File.");
    });
}

const getDateString = () => {
// current timestamp in milliseconds
let ts = Date.now();

let date_ob = new Date(ts);
let date = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();

// prints date & time in YYYY-MM-DD format
return(`${year}-${month}-${date}`);
}

const getSlectorElementAsText = async (page, selector) => {
   var element = await page.waitForSelector(selector)
   const text = await page.evaluate(element => element.textContent, element);
   return text
}

const getTotalAmount = async (page) => {
   var text = await getSlectorElementAsText(page, '#resPanel > div > div > span')
   const textArray = text.split(" ") 
   var totalAmount = 0
   textArray.forEach(el => { 
      if(allDigitsRegex.test(el.trim())) {
         totalAmount = el.trim()
      }
   })
   return totalAmount
}

const getBreakdown = async (page) => {
   text = await getSlectorElementAsText(page, '#facetPanel > div.expandable-panel > div > div:nth-child(3) > ul')
   const allElementsList = text.replace(/\s/g,'').replaceAll(')', '),').split(",").filter(str => !(str === null || str.match(/^ *$/) !== null))
   return allElementsList
}


const scrape = async() => {
   const browser = await puppeteer.launch({})
   const page = await browser.newPage()
   await page.goto('https://auktionstorget.kronofogden.se/Sokfastigheterbostadsratter.html?query=*')

   const totalAmount = await getTotalAmount(page)
   const breakdown = await getBreakdown(page)

   
   browser.close()
   await writeLine(`${getDateString()}: ${totalAmount} ${breakdown}`)
}


scrape()
