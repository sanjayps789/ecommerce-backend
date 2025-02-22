const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    categoryName:{
        type:String,
        unique:true,
        required:true
    },
    image:{
        type:String,
        required:true
    }
})

const categories = mongoose.model("categories",categorySchema)

module.exports = categories