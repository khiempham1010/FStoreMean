var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
// category schema  
var CartSchema = new Schema({
    name: String
});

var Category = mongoose.model('category', CartSchema);
module.exports = Category;