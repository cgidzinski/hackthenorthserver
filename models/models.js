var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;


// define the schema for our user model
var userSchema = new mongoose.Schema({

    public           : {
        name         : {type: String, default: "" },
        email        : {type: String, default: "" }
    },
    private          : {
        password     : {type: String, default: "" }
    }
})
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.private.password);
}

var User = mongoose.model('User', userSchema);

var memorySchema = new mongoose.Schema({

        name         : {type: String, default: "" },
        data         : {type: String, default: "" },
        type         : {type: String, default: "" }
   
})
var Memory = mongoose.model('Memory', memorySchema);



module.exports = {
    User: User,
    Memory:Memory
};
