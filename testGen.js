function generateRandomString() {
  var string = "";
  var allCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 6; i++)
    string += allCharacters.charAt(Math.floor(Math.random() * allCharacters.length));
  return string;

};