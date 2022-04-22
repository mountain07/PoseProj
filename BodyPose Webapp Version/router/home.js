const express = require('express')
const fs = require('fs')
const csv=require('csvtojson');
const exec = require('child_process').exec;

const homeRouter = express.Router()

homeRouter.get('/', (req,res)=>{
    res.render('home')
})

homeRouter.post('/process', async(req,res)=>{
    let dstring = ''
    let rbody = JSON.parse(JSON.stringify(req.body))
    for(let i=0;i<rbody.length;i++){
        dstring +=rbody[i].base64 +'@'+rbody[i].name +'@'+rbody[i].hg+'\n'
    }

    fs.writeFile('./file.txt', dstring, function (error) {
        if (error) {
          console.log('error')
        } else {
            exec('python pose_new.py '+ './file.txt ./',function(error,stdout,stderr){
                if(error) {
                    console.info('stderr : '+stderr);
                }
                console.log('exec py successfully');
                csv()
                    .fromFile('./output.csv')
                    .then((jsonObj)=>{
                        jsonObj = JSON.stringify(jsonObj)
                        res.send(jsonObj)
                    })

            })
        }
      })


})


module.exports = homeRouter