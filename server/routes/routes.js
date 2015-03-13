var config = require('config');
var jwt = require('express-jwt');
var Crossword = require('../models/crossword.js');
var Solution = require('../models/solution.js');

//  'requireAuthentication' middleware throws 401 if the
//  request is not authenticated.
var requireAuthentication = jwt({
  secret: new Buffer(config.get('auth0.secret'), 'base64'),
  audience: config.get('auth0.audience')
});

//  'supportAuthentication' allows unauthorised requests (which)
//  may return limited data) and supports authorised requests.
//  Invalid authorisation still results in a 401.
var supportAuthentication = jwt({
  secret: new Buffer(config.get('auth0.secret'), 'base64'),
  audience: config.get('auth0.audience'),
  credentialsRequired: false
});


module.exports = function(app) {

  //  Get all crosswords.
  app.get('/api/crosswords', function(req, res, next) {
  
    Crossword.find({}, function(err, crosswords) {
      if(err) return next(err);
      res.status(200).send(crosswords);
    });

  });

  app.get('/api/crosswords/:crosswordId', supportAuthentication, function(req, res, next) {

    //  Get the crossword.
    Crossword.findOne({'_id':req.params.crosswordId}, function(err, crossword) {

      //  TODO: If null return 404.
      if(err) return next(err);

      //  If we are authenticated, we can check to see if we can enrich
      //  the crossword with a solution.
      if(!req.user) return res.status(200).send(crossword);

      Solution.findOne({'crosswordId': crossword._id, 'userId': req.user.sub}, function(err, solution) {

        if(err) return next(err);
        if(!solution) return res.status(200).send(crossword);

        var crosswordWithSolution = crossword.toObject();
        crosswordWithSolution.solution = {
          answers: []
        };
        for(var i=0; i<solution.answers.length; i++) {
          crosswordWithSolution.solution.answers.push({
            clueCode: solution.answers[i].clueCode,
            answer: solution.answers[i].answer
          });
        }
         
        return res.status(200).send(crosswordWithSolution);

      });
      
    });

  });

  app.post('/api/crosswords/:crosswordId/solution', requireAuthentication, function(req, res, next) {

    //  Create a solution model.
    var solution = new Solution({
      crosswordId: req.params.crosswordId,
      userId: req.user.sub, //  jwt sub = oauth user id 
      answers: []
    });

    var answers = req.body.answers;
    for(var i=0; i<answers.length; i++) {
      solution.answers.push({
        clueCode: answers[i].clueCode,
        answer: answers[i].answer
      });
    }

    //  Turn it into a POJO.
    var solutionPojo = solution.toObject();

    //  Upsert the solution.
    Solution.update(
      {crosswordId: solutionPojo.crosswordId, userId: solutionPojo.userId}, 
      {$set: {answers: solutionPojo.answers}}, {upsert: true}, function(err) {
      if(err) return next(err);
      res.status(200).send();
    });

  });

};