module.exports = {
  name: "Production",
  port: 8081,         // nginx running as a reverse proxy, 80 -> 8081 
  db: {
    connectionString: 'mongodb://52.10.235.154:27017/onedown'
  },
  auth0: {
    secret: process.env.ONEDOWN_AUTH0_SECRET,
    audience: process.env.ONEDOWN_AUTH0_AUDIENCE
  }
};