module.exports = {
  //database
  datastore: {
    projectId: 'conferencify-2018',
    keyFilename: 'config/keyfile.json'
  },
  token: {
    public: 'config/token_public.pem',
    privat: 'config/token_privat.key',
    expires: '1h',
    algorithm: 'RS256'
  },
  bcrypt: {
    saltRounds: 9
  },
  log: {
    prefix: 'api:'
  },
  mailgun: {
    key: 'key-f4dbeb86623261dff6f14d14800dc251',
    domain: 'unicode.berlin'
  }
}
