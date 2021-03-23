const numericQuantity = require('numeric-quantity'); //numeric-quantity converts vulgar fractions & numbers like "1 1/2" into a number
const Fraction = require('fraction.js'); //fraction.js converts decimals back into mixed fractions

function recipeParser(dom, servingsMult) {
  //this requires jquery and loads the $ selector for use
  const $ = (jQuery = require('jquery')(dom.window));

  let listItems;

  // WPRM is the most common recipe site builder plugin used by food bloggers. This conditional checks whether a site was built with WPRM then creates an array with each ingredient list item
  if ($('.wprm-recipe-ingredients').length > 0) {
    listItems = $('.wprm-recipe-ingredients > li.wprm-recipe-ingredient').get();
  } else {
    //~~~~~~~~~~~~~~~~~~~~~~~~ Issue: insert more conditionals here to better find the Ingredients list ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    listItems = $(':header')
      .filter(function () {
        return $(this).text() == 'Ingredients';
      })
      .siblings('ul')
      .children('li')
      .get(); //this code selects li children of ul siblings of any header containing "Ingredients"
  }

  let liNumber,
    newNum,
    newList = [],
    oldList = [];

  //this code selects each li in the array, parses the numbers, converts to new quantity
  for (let i = 0; i < listItems.length; i++) {
    //grab text content of each listItems array
    let currentLi = listItems[i].textContent.trim(); //NOTE: using trim because otherwise it adds new line break \n characters and breaks the regex

    // regex expressions to extract numbers from list items
    const regexDash = /\d+(-|–)\d+\s*\D/;
    const regexTo = /\d+\s*to\s*\d+/;
    const regexAll = /(\d*)(\.\d+|(\s+\d*\s*)?\s*\/\s*\d+|(\-\d*\s*)?\s*\/\s*\d+|(\&\d*\s*)?\s*\/\s*\d+|\s*[\u00BC-\u00BE\u2150-\u215E]+|(\-[\u00BC-\u00BE\u2150-\u215E])?)?/;

    //First, check for "1-2" cups
    if (regexDash.exec(currentLi)) {
      liNumber = regexDash.exec(currentLi);
      liNumber[0] = liNumber[0].replace(/\s+/, '').slice(0, -1); //trims spaces and the first non-digit off the end
      let newNumArray = liNumber[0].replace(/(-|–)/, '-').split('-'); //creates new array with 2 numbers split at the "-"
      for (let i = 0; i < newNumArray.length; i++) {
        newNumArray[i] *= servingsMult;
        newNumArray[i] = roundSixEight(newNumArray[i]);
      }
      newNum = newNumArray[0] + '-' + newNumArray[1];

      //Then, check for "1 to 2" cups
    } else if (regexTo.exec(currentLi)) {
      liNumber = regexTo.exec(currentLi);
      let newNumArray = liNumber[0].replace(/\s/g, '').split('to'); //creates new array with 2 numbers split at the "to"
      for (let i = 0; i < newNumArray.length; i++) {
        newNumArray[i] *= servingsMult;
        newNumArray[i] = roundSixEight(newNumArray[i]);
      }
      newNum = newNumArray[0] + ' to ' + newNumArray[1];
      
    } else {
      liNumber = regexAll.exec(currentLi);

      //numeric-quantity npm library converts fraction/number strings to numbers
      let num = numericQuantity(liNumber[0]);
      newNum = num * servingsMult;

      //use my helper function to round the new quantity to the nearest sixth or eighth
      newNum = roundSixEight(newNum);
    }

    //create new list item with the old number replaced
    let newLi = currentLi.replace(liNumber[0], newNum);

    //add original and new list items to arrays
    oldList.push(currentLi);
    newList.push(newLi);
  }

  return { oldList, newList };
}

//Helper function - rounds a number to the nearest sixth or eighth
function roundSixEight(num) {
  if (isNaN(num)) {
    num = '';
  } else {
    let eighth = Math.round(num * 8) / 8;
    let sixth = Math.round(num * 6) / 6;
    let diffE = Math.abs(num - eighth);
    let diffS = Math.abs(num - sixth);
    if (diffE <= diffS) {
      num = eighth;
    } else if (diffS < diffE) {
      num = sixth;
    }
    num = new Fraction(num).toFraction(true);
  }
  return num;
}

module.exports = { recipeParser };
