var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
// cart schema  
var CartSchema = new Schema({
    name: String,
    phone: String,
    message: String,
    cart: Object,
    status = Number
});

var Cart = mongoose.model('cart', CartSchema);
module.exports = Cart;
