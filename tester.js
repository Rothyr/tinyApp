//  TEST URL DATABASE //
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

function userURLs(userID) {
  let resultURLs = {};
  for (let url in urlDatabase) {
    if (userID === urlDatabase[url].userID) {
      let temp = {
        shortURL: url,
        longURL: urlDatabase[url].longurl
      }
      resultURLs[url] = temp;
    }
  }
  return resultURLs;
};

console.log(userURLs("userID1"));