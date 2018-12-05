var express = require("express");
var app = express();
const bodyParser = require("body-parser");
var PORT = 8080;


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//  SERVER SIDE //

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (request, response) => {
  response.send("Hello!");
});

app.get("/urls.json", (request, response) => {
  response.json(urlDatabase);
});

app.get("/urls", (request, response) => {
  let templateVars = { urls: urlDatabase };
  response.render("urls_index", templateVars);
});

app.get("/urls/new", (request, response) => {
  response.render("urls_new");
});

// CREATES LONG & SHORT URLS IN URL DATABASE //

app.post("/urls", (request, response) => {
  console.log(request.body);
  var longURL = request.body.longURL;
  var shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  response.redirect(`/urls/${shortURL}`)
});

//  REDIRECTS SHORT URL TO WEBSITE //

app.get("/u/:shortURL", (request, response) => {
  var shortURL = request.params.shortURL;
  var longURL = urlDatabase[shortURL];
  response.redirect(longURL);
});

// DISPLAYS LONG & SHORT URLS

app.get("/urls/:id", (request, response) => {

  let templateVars = {
    shortURL: request.params.id,
    longURL: urlDatabase[request.params.id]
  };
  response.render("urls_show", templateVars);
});


app.get("/hello", (request, response) => {
  response.send("<html><body>Hello <b>World</b></body></html>\n");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


// STRING GENERATOR //

function generateRandomString() {
  return Math.floor((1 + Math.random()) * 0x10000000).toString(36);
};



