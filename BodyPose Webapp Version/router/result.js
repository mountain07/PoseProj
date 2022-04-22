const express = require('express')

const resultRouter = express.Router()

resultRouter.get('/result', (req,res)=>{
    res.render('Result')
})

module.exports = resultRouter