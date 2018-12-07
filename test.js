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


function urlsForUser(id) {
  const resultURLs = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      let temp = {
        shortURL: url ,
        longURL: urlDatabase[url].longurl
      }
      resultURLs[url] = temp;
    }
  }
  return resultURLs;
};


let templateVars = {
    urls: urlsForUser("userID2")
  };

  console.log(templateVars.urls)