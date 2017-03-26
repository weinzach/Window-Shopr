//Module dependencies.
var mongoose = require('mongoose');
var uuidV1 = require('uuid/v1');

//Connect to Database
mongoose.connection.on('open', function(ref) {
    console.log('Connected to mongo server.');
});
mongoose.connection.on('error', function(err) {
    console.log('Could not connect to mongo server!');
    console.log(err);
});
mongoose.connect('mongodb://localhost/Vamos');

//Product Schema
var Schema = mongoose.Schema;

var ProductDetail = new Schema({
    productName: String,  // product name
    productId: String,   // product id
    productDesc: String, // production description
    productImage: String // path to image

}, {
    collection: 'productInfo'
});
var Product = mongoose.model('productInfo', ProductDetail);

// export test???
exports.productDetail = ProductDetail


function createProduct( productObject )
{
    var newProduct = new Product({
        productName: productObject.name,
        productId: uuidV1(),
        productDesc: productObject.desc
        productImage: "./listing"
    });

    newProduct.save(function(err, newProduct){
        if (err) return console.error(err);
    });
    
    console.log("Adding " + productObject.name + " to DB...");
    console.log("Product Added!")
    
}
exports.createProduct = createProduct