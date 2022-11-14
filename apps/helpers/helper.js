var bcrypt = require("bcrypt");
var config = require("config");
const argon2 = require('argon2');

function hash_password(password){
    var saltRounds = config.get("salt");

    var salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync(password, salt);

    return hash;
}

function compare_password(password, hash){
    return bcrypt.compareSync(password, hash);
}


/*
async function hash_password(password){

   const hash = await argon2.hash(password);
   // var saltRounds = config.get("salt");
   // var salt = bcrypt.genSaltSync(saltRounds);
   // var hash = bcrypt.hashSync(password, salt);

    return hash;
}

async function compare_password(password, hash){
   // return bcrypt.compareSync(password, hash);
   try {
	  if (await argon2.verify(hash, password)) {
	  	return " password match";
	    // password match
	  } else {
	    // password did not match
	  }
	} catch (err) {
	  // internal failure
	}
}
*/
module.exports = {
    hash_password: hash_password,
    compare_password: compare_password
}