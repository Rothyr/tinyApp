const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const PORT = 8080;


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(cookieParser())


// TEST USER DATABASE //

const userDatabase = {
  "userID1" : {
    id: "userID1",
    email: "freddie@queen.com",
    password: "queen123"
  },
  "userID2" : {
    id: "userID2",
    email: "mick@therollingstones.com",
    password: "stones123"
  },
  "userID3" : {
    id: "userID3",
    email: "david@ziggystardust.com",
    password: "ziggy123"
  },
  "userID4" : {
    id: "userID4",
    email: "roger@pinkfloyd.com",
    password: "floyd123"
  }
}

//  TEST URL DATABASE //
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


 // ALLOWS USER TO LOG-IN && LOG-OUT //;

 // LOG-IN
app.get("/login", (request, response) => {
  response.render("login");
});

app.post("/login", (request, response) => {
 if (request.body.email === "" || request.body.password === ""){
  response.send("Please provide an email and password");
 } else if (checkLogin(request)) {
    response.cookie("id", findUserID(request));
    response.redirect("/urls/");
  } else {
    response.send("Invalid username or password")

  }
});

// LOG OUT
app.post("/logout", (request, response) => {
  var email = request.body.email;
  response.clearCookie("id", email);
  response.redirect("/urls/");
});


// REGISTRATION PAGE //

app.get("/register", (request, response) => {

  response.render("register");
});

app.post("/register", (request, response) => {
  const email = request.body.email;
  const password = request.body.password;
  if (email === " " || password === " ") {
    response.status(400);
    response.send("Please provide valid email & password");
  } else if (checkEmailAddress(email) === true) {
    response.status(400);
    response.send("Email Address already in use")
  } else {
    var newUserID = generateRandomString();
    userDatabase[newUserID] = {
      "id": newUserID,
      "email": request.body.email,
      "password": request.body.password,
    }
    response.cookie("id", newUserID)
    response.redirect("/urls/")
  }
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
  let userId = request.cookies["id"]; // note: might be nothing there, and/or garbage
  let userObject = userDatabase[userId];
  let templateVars = {
    urls: urlDatabase,
    user: userObject
  };
  response.render("urls_index", templateVars);
});

//  NEW URLS PAGE  //
app.get("/urls/new", (request, response) => {
  let templateVars = {
    user: userObject
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

//  REDIRECTS SHORT URL TO ORIGINAL WEBSITE //
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
    user: userObject
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


function checkEmailAddress(request) {
  let email = request;
  for (let key in userDatabase) {
    if (email.toLowerCase() === userDatabase[key].email.toLowerCase()) {
      return true;
    }
  }
  return false;
}

function checkLogin(request) {
  let email = request.body.email;
  let password = request.body.password;
  for (let key in userDatabase) {
    if (password === userDatabase[key].password && email.toLowerCase() === userDatabase[key].email.toLowerCase()) {
      return true;
    }
  }
  return false;
}

function findUserID(request) {
  let email = request.body.email;
  for (let key in userDatabase) {
    if (email === userDatabase[key].email) {
      return userDatabase[key].id;
    }
  }
}


