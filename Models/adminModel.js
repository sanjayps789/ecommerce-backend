const mongoose = require('mongoose')

const adminSchema = mongoose.Schema({
    name:{
        type:String,
        require
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }

})
const admins = mongoose.model('admins',adminSchema)

module.exports = admins