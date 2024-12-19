const bcrypt = require("bcryptjs");
bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash("121313131", salt, function(err, hash) {
        if(err){
            console.log(err);
        }else{
            console.log(hash);
        }
    });
});