module.exports = {
  name: "Development",
  port: 3000,
  db: {
    connectionString: 'mongodb://localhost:27017/onedown'
  },
  auth0: {
    secret: process.env.ONEDOWN_AUTH0_SECRET,
    audience: 'oWeXhqDS5VLh8asTvNUEqKFA6wIbGIsJ'
  },
  logging: {
    logentries: {
      token: process.env.ONEDOWN_LOGENTRIES_TOKEN
    }
  }
};