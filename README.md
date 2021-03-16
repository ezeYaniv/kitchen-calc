<p align="center"><img width=100% src="https://github.com/ezeYaniv/kitchen-calc/blob/main/public/images/header-image.png"></p>

# Less 🧮, more 👨‍🍳 

No more mental kitchen math - [try it here!](https://kitchen-calc.herokuapp.com/)

## Introduction
I created this project to solve a problem we've all faced while cooking: trying to convert a recipe that serves 4 to serve 6 (or 2, or 11) in our heads. Two and a quarter cups times 1.5, anyone?  
This web app makes it easy to multiply ingredient measurements for the right number of mouths.

---

## Usage
🖨️ Copy & paste a recipe's URL and input your desired servings. The app will automatically display the recipe's new ingredient list.

🍳 The final version of Kitchen Calc can be accessed at https://kitchen-calc.herokuapp.com/

📱 Yes, I'm mobile responsive!

---

## Under the Hood
### Technologies Applied & Skills Learned
* Node.js & Express
* EJS templating
* SCSS styling
* Mobile-responsive design & media queries
* Regular expressions

### Summary
In this project, I practiced creating a webpage with Express and how to handle basic routing methods such as GET and POST. I also dynamically rendered components using the EJS template engine. My app uses the JSDOM library, jQuery and regular expressions to retrieve, scrape and run calculations on third-party webpage information. Finally, I implemented version control using command-line Git.

### How It Works
1. Using an HTML form and a POST request, the app takes a user input URL
2. Inside an asynchronous function, the URL is fetched and the JSDOM library parses the HTML
3. Using jQuery, the app searches the site's DOM to find the ingredients list and adds each item as a new array element
4. A few conditionals, a massive regular expression (see below) and the npm package numeric-quantity parse the ingredient quantity strings into numbers
5. Using the user inputted original and desired servings, multiply the parsed numbers for final yield
6. res.redirect to the root path, which renders the home page passing the old and new ingredient arrays
7. Using EJS scripting, create a dynamic length HTML ingredients list

### Known Issues & Bugs
Issues can be found in this repo's [Issues](https://github.com/ezeYaniv/kitchen-calc/issues) tab.

### Biggest Challenge
My biggest challenge was working with non-standard data: it turns out every food blogger has a different way of writing quantities! For example, all these are equal - 1½ cups, 1.5 cups, 1 1/2 cups, 1-1/2 cups, 1 & 1/2 cups. Figuring out how to parse those strings into numbers was tricky, but I accomplished it with **the mother of all regular expressions** - check this out:
<br>
`const regexAll = /(\d*)(\.\d+|(\s+\d*\s*)?\s*\/\s*\d+|(\-\d*\s*)?\s*\/\s*\d+|(\&\d*\s*)?\s*\/\s*\d+|\s*[\u00BC-\u00BE\u2150-\u215E]+|(\-[\u00BC-\u00BE\u2150-\u215E])?)?/;`

---

## Screenshots
![fluffy pancakes for 10!](https://github.com/ezeYaniv/kitchen-calc/blob/main/public/images/partial-screenshot1.png)

---

## Links
* [The kitchen calc app (hosted on Heroku)](https://kitchen-calc.herokuapp.com/)

<!-- ![Kitchen Calc logo](https://github.com/ezeYaniv/kitchen-calc/blob/main/public/images/kitchen-calc-favicon.ico "Kitchen Calc") -->
