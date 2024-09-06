const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    stock:{
        type:Number
    },
    tags:{
        type:Array
    },
    brand:{
        type:String
    },
    availibilityStatus:{
        type:String,
        default:"In Stock"
    },
    reviews:{
        type:Array
    },
    images:[{
        type:String
    }],
    thumbnail:{
        type:String
    }
})

const products = mongoose.model("products",productSchema)
module.exports = products