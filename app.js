const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");
const fetch = require("isomorphic-fetch");
const jsdom = require("jsdom");
const ejs = require("ejs");
//note: I also installed jquery with npm i jquery, it is required in the asynchronous function below.

//installed npm i fraction.js to convert decimals back into fractions
const Fraction = require("fraction.js");

const { JSDOM } = jsdom;
const app = express();

//installed npm i numeric-quantity to convert vulgar fractions & numbers like "1 1/2"
const numericQuantity = require("numeric-quantity");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


app.get("/", function (req, res) {
  res.render("home");
});

//this captures the user's HTML url & serving # form submission
app.post("/", function (req, res) {
  const url = req.body.url;
  const servingsOld = req.body.servingsOld;
  const servingsNew = req.body.servingsNew;

  const servingsMult = servingsNew / servingsOld;

  //this function fetches the URL and uses the JSDOM library to get the dom
  (async () => {
    const response = await fetch(url);
    const text = await response.text();
    const dom = await new JSDOM(text);
    //this requires jquery and loads the $ selector for use
    const $ = (jQuery = require("jquery")(dom.window));

    //***STARTING HERE, THIS IS FOR NON WPRM SITES!!!!
    // console.log(dom.window.document.body.innerHTML);
    //***DELETE? this code selects all h3 headers and defines a variable for Ingredients header and the following h3 header text
    const headers = dom.window.document.querySelectorAll("h3");
    for (let i = 0; i < headers.length; i++) {
      if (headers[i].textContent === "Ingredients") {
        let headerIng = headers[i].textContent;
        let headerEnd = headers[i + 1].textContent;
      }
    }
    //this code selects li children of ul siblings of any header containing "Ingredients"
    $(dom.window.document).ready(function () {
      let listItems = $(":header:contains(Ingredients)")
        .siblings("ul")
        .children("li")
        .get();

      //this code selects each li in the array, parses the numbers, converts to new quantity
      for (let i = 0; i < listItems.length; i++) {
        
        //grab text content of each listItems array
        //NOTE: using trim because otherwise it adds new line break \n characters and breaks the regex
        let currentLi = listItems[i].textContent.trim();
        
        // use this regex to extract numbers from LI text
        const regexAll = /(\d*)(\.\d+|(\s+\d*\s*)?\s*\/\s*\d+|(\-\d*\s*)?\s*\/\s*\d+|(\&\d*\s*)?\s*\/\s*\d+|\s*[\u00BC-\u00BE\u2150-\u215E]+|(\-[\u00BC-\u00BE\u2150-\u215E])?)?/;
        let liNumber = regexAll.exec(currentLi);
        
        console.log(listItems[i].innerHTML);
        // console.log(liNumber);
        
        //use the numeric-quantity npm library to convert fraction/number strings to numbers
        let num = numericQuantity(liNumber[0]);
        let newNum = num * servingsMult;
        console.log(newNum);

        /*//code to create mixed fraction NOTE: Fraction.js library can do this below, with toFraction(true)
                // if newNum>1, split newNum at the '.', then 
                if(newNum>1) {
                    let numDen = newNum.toString().split('.');
                let a = new Array();
                a = numDen;
                a[1]=parseFloat("."+a[1]);
                console.log(a[1]);
                };*/

        //convert newNum from decimal to mixed fraction string (if newNum is .333, .666 or .999, change back to a string fraction so that the toFraction function doesn't give things like 500/133)
        if (newNum == 0.333) {
          newNum = "1/3";
        } else if (newNum == 0.666) {
          newNum = "2/3";
        } else if (newNum == 0.999) {
          newNum = "1";
        } else {
          newNum = new Fraction(newNum).toFraction(true);
        }

        console.log(newNum);

        //replace old quantities with the new for an HTML list
        

        /*//find all vulgar fractions and replace them
                let regexVF = /[\u00BC-\u00BE\u2150-\u215E]/;
                let liVF = regexVF.exec(currentLi);
                if(liVF) {
                let liNum = numericQuantity(liExec[0]);
                console.log(liNum);
                }*/
      }
      // console.log(listItems);
    });
  })();
});

app.listen(3000, function () {
  console.log("Server is running on port 3000.");
});
