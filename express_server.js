var express = require("express");
var app = express();
var PORT = 8080;

app.set("view engine", "ejs");

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

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

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