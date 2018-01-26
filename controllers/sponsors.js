"use strict"

const errors = require("../util/error_handling")
const helpers = require("../util/helpers")

function index(req, res) {
    res.json({'status': 'Implementation missing'});
}


function show(req, res) {
    res.json({'status': 'Implementation missing'});
}

module.exports = {
    index: index,
    show: show
};
