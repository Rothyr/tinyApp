


const bcrypt = require ('bcrypt');
const password = "fluffy puppy";
const hash = bcrypt.hashSync(password, 10);


console.log(password, hash)