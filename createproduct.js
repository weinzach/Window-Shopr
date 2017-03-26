//Module dependencies.
var mongoose = require('mongoose');
var config = require("./crypto.json");
var uuidV1 = require('uuid/v1');

//Load Necessary Config Files
var node_algorithm = config["algorithm"];
var node_password = config["password"];

//AES256 Crypto Functions
var crypto = require('crypto'),
    algorithm = node_algorithm,
    password = node_password;

function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

//Connect to Database
mongoose.connection.on('open', function(ref) {
    console.log('Connected to mongo server.');
});
mongoose.connection.on('error', function(err) {
    console.log('Could not connect to mongo server!');
    console.log(err);
});
mongoose.connect('mongodb://localhost/Shopr');

//User Schema
var Schema = mongoose.Schema;
var ProductDetail = new Schema({
    productName: String, // product name
    productId: String, // product id
    productDesc: String, // production description
    productCategory: String,
    productImage: String, // path to image
    productCity: String, // product
    productState: String // product state

}, {
    collection: 'productInfo'
});
var Product = mongoose.model('productInfo', ProductDetail);


function createProduct()
{
    var uniqueID = uuidV1();
    var newProduct = new Product({
        productName: "Test TV1",
        productId: uniqueID,
        productDesc: "TV Desc1  ",
        productCategory: "tv",
        productImage: uniqueID + ".jpg",
        productCity: "lakeland",
        productState: "fl"
    });
    console.log("image_dir: " + newProduct.productImage);

    newProduct.save(function(err, newProduct){
        if (err) return console.error(err);
    });

    setTimeout(function() {
        console.log("Product Added!");
        process.exit();
    }, 3000);

}
createProduct();
