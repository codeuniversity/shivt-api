'use strict'
var express = require('express')
var app = express()
var port = process.env.PORT || 3000
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken')
var publicRoutes = require('./routes/publicRoutes')
var privatRoutes = require('./routes/privatRoutes')
var fs = require('fs')

global.datastore = require('@google-cloud/datastore')({
  projectId: 'conferencify-2018',
  keyFilename: 'keyfile.json'
});

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use('/api/v1', publicRoutes)
app.use((req, res, next)=>{
    var token = req.headers['x-access-token']
    if(token){
        let cert = fs.readFileSync('token_public.pem')
        jwt.verify(token, cert, { algorithm: ['RS256'] }, (err,decod)=>{
            if(err){
                if(err.name == 'TokenExpiredError'){
                    res.status(403).json({
                        message:'Token expired'
                    });
                }
                else{
                    res.status(403).json({
                        message:'Wrong Token'
                    });
                }
            }
            else{
                req.decoded=decod
                next()
            }
        });
    }
    else{
        res.status(403).json({
            message:'No Token'
        })
    }
})
app.use('/api/v1', privatRoutes)

app.listen(port);

console.log('Shivt RESTful API server started on: ' + port)