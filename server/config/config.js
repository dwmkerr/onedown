var configs = {
  'development': {
    name: "Local Development",
    port: 3000,
    db: {
      connectionString: 'mongodb://localhost:27017/onedown'
    },
    auth0: {
      secret: process.env.ONEDOWN_AUTH0_SECRET,
      audience: process.env.ONEDOWN_AUTH0_AUDIENCE
    }
  },
  'production': {

  }
};

//  Get configuration for the mode.
module.exports = configs[process.env.node || 'development'];
