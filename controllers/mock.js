'use strict';

const errors = require('../util/error_handling');
const faker = require('faker');

function show (req, res) {
    res.json({
        'user': faker.name.title()+" "+faker.commerce.color(),
        'random': faker.helpers.createCard()
    });
}

module.exports = {
    show: show
};