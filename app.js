//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const request = require('request');
const fetch = require('isomorphic-fetch');
const jsdom = require('jsdom');
const ejs = require('ejs');
const { recipeParser } = require('./scripts/recipeParser');

const { JSDOM } = jsdom;
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

//global variable declarations
let newList = [];
let oldList = [];
let servingsOld;
let servingsNew;
let url;

app.get('/', function (req, res) {
  res.render('home', { oldList: oldList, newList: newList, servingsOld: servingsOld, servingsNew: servingsNew, url: url });
});

//this captures the user's HTML url & serving # form submission
app.post('/', function (req, res) {
  url = req.body.url;
  if (url.startsWith('http') == false) {
    url = 'http://' + url;
  }
  servingsOld = req.body.servingsOld;
  servingsNew = req.body.servingsNew;

  const servingsMult = servingsNew / servingsOld;

  //this function fetches the URL and uses the JSDOM library to get the dom
  (async () => {
    const response = await fetch(url);
    const text = await response.text();
    const dom = await new JSDOM(text);

    //this requires jquery and loads the $ selector for use
    const $ = (jQuery = require('jquery')(dom.window));

    //This ensures the webpage is loaded and runs the recipe parser function - outputs two arrays, the original ingredients and new quantity ingredients
    $(dom.window.document).ready(function () {
      ({ oldList, newList } = recipeParser(dom, servingsMult));

      res.redirect('/');
    });
  })();
});

let port = process.env.PORT;
if (port == null || port == '') {
  port = 3000;
}
app.listen(port, () => {
  console.log('Server is listening on port ' + port);
});
