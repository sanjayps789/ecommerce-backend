const mongoose = require('mongoose')

const wishlistSchema = new mongoose.Schema({
    userId:{
        type:String,
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'products',
        required:true
    }
})

const wishlists = mongoose.model("wishlists",wishlistSchema)

module.exports = wishlists