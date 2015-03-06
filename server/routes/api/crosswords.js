var Crossword = require('../../models/crossword.js');

module.exports = function(app) {

  //  Get all crosswords.
  app.get('/api/crosswords', function(req, res, next) {
  
    Crossword.find({}, function(err, crosswords) {
      if(err) return next(err);
      res.send(200, crosswords);
    });

  });

  app.get('/api/crosswords/:id', function(req, res, next) {

    Crossword.findOne({'userId':req.user._id, '_id':req.params.id}, function(err, crossword) {

      if(err) return next(err);
      res.send(200, crossword);
      
    });
  });

};