function normalizeDate(date) {
    date.setUTCHours(0);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);
    return date;
}

module.exports = {
    normalizeDate: normalizeDate
}