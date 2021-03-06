// ***  TINY APP EXPRESS_SERVER.JS  ***  //

//  MIDDLEWARE USED IN TINY APP  //
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require("bcrypt");
const PORT = 8080;

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(cookieSession ( {
  name: "session",
  keys: ['user_id']
}));

// REDIRECT TO LOGIN PAGE //
app.get("/", (request, response) => {
  response.redirect("/login");
});

// JSON //
app.get("/urls.json", (request, response) => {
  response.json(urlDatabase);
});

 //  **  ALLOWS USER TO LOG-IN && LOG-OUT  **  //;
 // LOG-IN
app.get("/login", (request, response) => {
  let templateVars = {
    user: userDatabase[request.session["user_id"]]
  }
  response.render("login", templateVars);
});

app.post("/login", (request, response) => {
  if (request.body.email === "" || request.body.password === "") {
    response.send("Please provide an email and password");
  } else if (checkLogin(request)) {
    request.session["user_id"] = findUserID(request.body.email);
    response.redirect("/urls/");
  } else {
    response.send("Invalid username or password");
  }
});

// LOG OUT
app.post("/logout", (request, response) => {
  request.session = null;
  response.redirect("/login");
});

//  **  END OF LOGIN/LOGOUT SECTION  **  //

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
      "password": bcrypt.hashSync(request.body.password, 12)
    }
    request.session["user_id"] = userDatabase[newUserID].id;
    response.redirect("/urls/");
  }
});

// URLS PAGE  //
app.get("/urls", (request, response) => {
  let templateVars = {
    urls: userURLs(request.session["user_id"]),
    user: userDatabase[request.session["user_id"]]
  }
  if (templateVars.user) {
    response.render("urls_index", templateVars);
  } else {
    response.redirect("/login");
  }
});

//  NEW URLS PAGE  //
app.get("/urls/new", (request, response) => {
  let templateVars = {
    user: userDatabase[request.session["user_id"]]
  }
  if (templateVars.user) {
    response.render("urls_new", templateVars);
  } else {
    response.redirect("/login");
  }
});

// CREATES LONG & SHORT URLS IN URL DATABASE //
app.post("/urls", (request, response) => {
  var longURL = request.body.longURL;
  var shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longurl: longURL,
    userID: request.session["user_id"]
  }
  response.redirect(`/urls/${shortURL}`)
});

// DISPLAYS LONG & SHORT URLS //
app.get("/urls/:id", (request, response) => {
  let templateVars = {
    shortURL: request.params.id,
    longURL: urlDatabase[request.params.id].longurl,
    user: userDatabase[request.session["user_id"]]
  };
  if (ownURL(request)) {
    response.render("urls_show", templateVars);
  } else {
    response.status(400);
    response.send("You do not own this URL");
  }
});

//  REDIRECTS SHORT URL TO ORIGINAL WEBSITE //
app.get("/u/:shortURL", (request, response) => {
  var shortURL = request.params.shortURL;
  var longURL = urlDatabase[shortURL].longurl;
  response.redirect(longURL);
});

// UPDATE URLS //
app.post("/urls/:id/update", (request, response) => {
  var longURL = request.body.longURL;
  var shortURL = request.params.id;
  if (request.session["user_id"]) {
    if(request.session["user_id"] === urlDatabase[request.params.id].userID) {
      urlDatabase[shortURL].longurl = longURL;
      response.redirect('/urls');
    } else {
      response.send("Sorry the URL does not belong to you");
    }
  } else {
    response.send("You must be logged in");
  }
});

// DELETES URLS //
app.post('/urls/:id/delete', (request, response) => {
  if (request.session["user_id"]) {
    if(request.session["user_id"] === urlDatabase[request.params.id].userID) {
      delete urlDatabase[request.params.id];
      response.redirect('/urls');
    } else {
      response.send("Sorry the URL does not belong to you");
    }
  } else {
    response.send("You must be logged in");
  }
});

// DISPLAYS "HELLO" PAGE  //
app.get("/hello", (request, response) => {
  response.send("<html><body>Hello <b>World</b></body></html>\n");
});


// ** FUNCTIONS USED THROUGHOUT TINY APP ** //
// STRING GENERATOR //
function generateRandomString() {
  var string = "";
  var allCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 6; i++) {
    string += allCharacters.charAt(Math.floor(Math.random() * allCharacters.length));
  }
  return string;
};

// CHECK EMAIL ADDRESS IN USE //
function checkEmailAddress(request) {
  let email = request;
  for (let key in userDatabase) {
    if (email.toLowerCase() === userDatabase[key].email.toLowerCase()) {
      return true;
    }
  }
  return false;
};

//CHECK LOGIN IS VALID USER //
function checkLogin(request) {
  let email = request.body.email;
  let password = request.body.password;
  for (let key in userDatabase) {
    if (bcrypt.compareSync(password, userDatabase[key].password) && email.toLowerCase() === userDatabase[key].email.toLowerCase()) {
      return true;
    }
  }
  return false;
};

// SEARCH IF EMAIL IS ALREADY VALID ACCOUNT //
function findUserID(email) {
  for (let key in userDatabase) {
    if (email === userDatabase[key].email) {
      return userDatabase[key].id;
    }
  }
};

// SEARCH THROUGH URLDATABASE AND LINK ACCOUNTS TO URLS //
function userURLs(userID) {
  let resultURLs = {};
  for (let url in urlDatabase) {
    if (userID === urlDatabase[url].userID) {
      let temp = {
        shortURL: url,
        longurl: urlDatabase[url].longurl
      }
      resultURLs[url] = temp;
    }
  }
  return resultURLs;
};

//  FUNCTION USED TO CHECK CORRECT URL BELONGS TO THE CORRECT OWNER  //
function ownURL (request) {
  let user = request.session["user_id"];
  let shortURL = request.params.id;
  if (urlDatabase[shortURL].userID === user) {
    return true;
  }
  return false;
};

// ***  USER DATABASE - FOR TEST PURPOSES ONLY  ***  //
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

// ***  URL DATABASE - FOR TEST PURPOSES ONLY  ***  //
var urlDatabase = {
  "b2xVn2": {
    longurl: "http://www.lighthouselabs.ca",
    userID: "userID1"
  },
  "9sm5xK": {
    longurl: "http://www.google.com",
    userID: "userID2"
  },
  "9sjhfK": {
    longurl: "http://www.bbc.com",
    userID: "userID2"
  },

  "9s345K": {
    longurl: "http://www.lights.com",
    userID: "userID2"
  }
};


// LOGS A MESSAGE TO NODE DECLARING THE SERVER IS WORKING  //
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}!`);
});


