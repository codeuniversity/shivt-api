function handle(err, res) {

    res.status(500);
    if(err.name === 'TypeError' && err.message.indexOf('Cannot read property') !== -1 && err.message.indexOf('of undefined') !==  -1) {
        res.json(getErrorJSON('The requested object does not exist in the database.'));
    }
    else {
        res.json(getErrorJSON('An unknown error occurred.'));
    }
    console.log("MESSAGE: "+err);
}

function getErrorJSON(message) {
    console.log('ERROR: '+message);
    return {'status': 'error', 'message': message};
}

module.exports = {
    handle: handle
}