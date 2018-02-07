"use strict"

const errors = require( '../util/error_handling' )
const jwt = require('jsonwebtoken')
const fs = require('fs')

function login(req, res) {
    let user = {
        id: 1,
        name: 'Lukas Vollmer'
    }
    let cert = fs.readFileSync('token_privat.key')
    let token = jwt.sign({
        data: user,
    }, cert, { algorithm: 'RS256', expiresIn: '1h' })
    res.json({'status': true, 'token': token})
}

module.exports = {
    'login': login
};
