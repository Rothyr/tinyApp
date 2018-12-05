var express = require("express");
var app = express();
var PORT = 8080;

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

app.post("/urls", (request, response) => {
  console.log(request.body);
  response.send("Ok");

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

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


// STRING GENERATOR //

function generateRandomString() {
  return Math.floor((1 + Math.random()) * 0x100000).toString(36);


};



