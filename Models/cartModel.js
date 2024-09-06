const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    userId:{
        type:String,
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'products',
        required:true
    },
    quantity:{  
        type:Number,
        default: 1,
        required:true
    },
    originalPrice:{
        type:Number,
        required:true
    }
})

const cartItems = mongoose.model("cartItems",cartSchema)

module.exports = cartItems