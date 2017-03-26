//Module dependencies.
var mongoose = require('mongoose');
var uuidV1 = require('uuid/v1');
var path = require('path');

//Connect to Database
mongoose.connection.on('open', function(ref) {
    console.log('Connected to mongo server.');
});
mongoose.connection.on('error', function(err) {
    console.log('Could not connect to mongo server!');
    console.log(err);
});
mongoose.connect('mongodb://localhost/Shopr');

//Product Schema
var Schema = mongoose.Schema;

var ProductDetail = new Schema({
    productName: String,  // product name
    productId: String,   // product id
    productDesc: String, // production description
    productCategory: String,
    productImage: String, // path to image
    productCity: String,    // product
    productState: String // product state

}, {
    collection: 'productInfo'
});
var Product = mongoose.model('productInfo', ProductDetail);

// export test???
exports.productDetail = ProductDetail


function createProduct( productObject )
{
    var uniqueID = uuidV1()
    var newProduct = new Product({
        productName: productObject.name,
        productId: uniqueID,
        productDesc: productObject.desc,
        productCategory: productObject.category,
        productImage: uniqueID + ".jpg",
        productCity: productObject.city,
        productState: productObject.state
    });
    console.log("image_dir: " + newProduct.productImage);

    newProduct.save(function(err, newProduct){
        if (err) return console.error(err);
    });

    console.log("Adding " + productObject.name + " to DB...");
    console.log("Product Added!")

}
exports.createProduct = createProduct
