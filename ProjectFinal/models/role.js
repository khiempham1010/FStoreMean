var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// user schema  
var RoleSchema = new Schema({
    name: String
});

var Role = mongoose.model('role', RoleSchema);
module.exports = Role;
