const express = require('express')
const app = express()
const port = 5900
const router = require('./routes/router')
app.use('/api',router)
app.listen(port,()=>{
    console.log(`server running ${port}`)
})