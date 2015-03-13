module.exports = {
  name: "Production",
  port: 80,
  db: {
    connectionString: 'mongodb://localhost:27017/onedown'
  },
  auth0: {
    secret: process.env.ONEDOWN_AUTH0_SECRET,
    audience: process.env.ONEDOWN_AUTH0_AUDIENCE
  }
};