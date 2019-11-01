var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var Role = require('./role').schema;
// user schema  
var UserSchema = new Schema({
    name: String,
    phone: String,
    email: String,
    address: String,
    username: String,
    password: String,
    googleId: String,
    thumbnail: String,
    facebookId: String,
    role: String
});
// hash the password before the user is saved 
UserSchema.pre('save', function (next) {
    var user = this; // hash the password only if the password has been changed or user is new 
    if (!user.isModified('password')) return next();
    // generate the hash 
    bcrypt.hash(user.password, null, null, function (err, hash) {
        if (err) return next(err); // change the password to the hashed version 
        user.password = hash;
        next();
    });
});
// method to compare a given password with the database hash 
UserSchema.methods.comparePassword = function (password) {
    var user = this;
    return bcrypt.compareSync(password, user.password);
};

var User = mongoose.model('user', UserSchema);
module.exports = User;
