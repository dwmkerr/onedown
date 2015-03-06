var configs = {
  'development': {
    name: "Local Development",
    port: 3000,
    db: {
      connectionString: 'mongodb://localhost:27017/onedown'
    }
  },
  'production': {

  }
};

//  Get configuration for the mode.
module.exports = configs[process.env.node || 'development'];
