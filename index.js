require('dotenv').config()
const express = require('express')
const cors = require('cors')
const UserRouter = require('./Routes/router.js')
const adminRouter = require('./Routes/adminRoutes.js')
require('./DB/connection')

const ecartServer = express()

ecartServer.use(cors())
ecartServer.use(express.json())
ecartServer.use('/api/user',UserRouter)
ecartServer.use('/api/admin',adminRouter)

// available uploads folder from server to other app
ecartServer.use('/uploads',express.static('./uploads'))

const PORT = 4000 || process.env.PORT
ecartServer.listen(PORT,()=>{
    console.log(`E-cart Server started at port: ${PORT}`);
})
ecartServer.get('/',(req,res)=>{
    res.send("<h1 style=color:red>E-cart Server started... and waiting for client Requests!!!</h1>")
})