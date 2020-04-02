var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const userImageBasePath = 'uploads/userImages'
const path = require('path')
require('dotenv').config()

//User Schema 
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    profileimage: {
        type: String
    }
});

UserSchema.virtual('userImagePath').get(function() {
    if(this.profileimage != null) {
        return path.join('/', userImageBasePath, this.profileimage)
    }
})

var User = module.exports = mongoose.model('User', UserSchema);
module.exports.userImageBasePath = userImageBasePath

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
  var query = {username: username};
  User.findOne(query, callback);   
}

module.exports.comparePassword = function(candidatepassword, hash, callback){
    bcrypt.compare(candidatepassword, hash, function(err, isMatch) {
        callback(null, isMatch);
    });
}
module.exports.createUser  = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    })
}