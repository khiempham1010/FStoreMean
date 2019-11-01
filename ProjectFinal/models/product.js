var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var ProductSchema = new Schema({
  name 			:  String,
  image			: String,
  categoryId 		: String,
  description		: String,
  price 		: Number,
  status 			: Number

});
var Category = mongoose.model('category', CartSchema);
module.exports = Category;