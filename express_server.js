const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const PORT = 8080;


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(cookieParser())


//  SERVER SIDE //
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

 // ALLOWS USER TO LOG-IN && LOG-OUT //;
 // LOG-IN
app.post("/login", (request, response) => {
  var username = request.body.username;
  response.cookie("username", username);
  response.redirect("/urls/");
});
// LOG OUT
app.post("/logout", (request, response) => {
  var username = request.body.username;
  response.clearCookie("username",username);
  response.redirect("/urls/");
});

 //  HELLO PAGE   //
app.get("/", (request, response) => {
  response.send("Hello!");
});

//        //
app.get("/urls.json", (request, response) => {
  response.json(urlDatabase);
});

// URLS PAGE  //
app.get("/urls", (request, response) => {
  let templateVars = {
    urls: urlDatabase,
    username: request.cookies["username"]
  };
  response.render("urls_index", templateVars);
});

//  NEW URLS PAGE  //
app.get("/urls/new", (request, response) => {
  let templateVars = {
  username: request.cookies["username"],
};
  response.render("urls_new", templateVars);
});

// CREATES LONG & SHORT URLS IN URL DATABASE //
app.post("/urls", (request, response) => {
  var longURL = request.body.longURL;
  var shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  response.redirect(`/urls/${shortURL}`)
});

// UPDATE URLS //
app.post("/urls/:id/update", (request, response) => {
  var longURL = request.body.longURL;
  var shortURL = request.params.id
  urlDatabase[shortURL] = longURL;
  response.redirect("/urls")
});

//  REDIRECTS SHORT URL TO WEBSITE //
app.get("/u/:shortURL", (request, response) => {
  var shortURL = request.params.shortURL;
  var longURL = urlDatabase[shortURL];
  response.redirect(longURL);
});

// DISPLAYS LONG & SHORT URLS //
app.get("/urls/:id", (request, response) => {

  let templateVars = {
    shortURL: request.params.id,
    longURL: urlDatabase[request.params.id],
    username: request.cookies["username"]
  };
  response.render("urls_show", templateVars);
});

// DELETES URLS //
app.post('/urls/:id/delete', (request, response) => {
  let shortURL = request.params.id;
  delete urlDatabase[shortURL];

  response.redirect('/urls');
});

// DISPLAYS "HELLO" PAGE  //
app.get("/hello", (request, response) => {
  response.send("<html><body>Hello <b>World</b></body></html>\n");
});

// LOGS A MESSAGE TO NODE DECLARING THE SERVER IS WORKING  //

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// STRING GENERATOR //
function generateRandomString() {
  var string = "";
  var allCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 6; i++)
    string += allCharacters.charAt(Math.floor(Math.random() * allCharacters.length));
  return string;
};

