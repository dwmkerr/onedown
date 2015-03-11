var Crossword = require('../../models/crossword.js');

module.exports = function(app) {

  //  Get all crosswords.
  app.get('/api/crosswords', function(req, res, next) {
  
    Crossword.find({}, function(err, crosswords) {
      if(err) return next(err);
      res.status(200).send(crosswords);
    });

  });

  app.get('/api/crosswords/:id', function(req, res, next) {

    Crossword.findOne({'_id':req.params.id}, function(err, crossword) {

      if(err) return next(err);
      res.status(200).send(crossword);
      
    });
  });

};