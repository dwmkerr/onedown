var mongoose = require('mongoose');

var crosswordSchema = mongoose.Schema({

  title:          {type: String, required: true},
  setter:         {type: String, required: true},
  source:         {type: String},
  width:          {type: Number, required: true, min: 1, max: 50}, 
  height:         {type: Number, required: true, min: 1, max: 50}, 

});

module.exports = mongoose.model('Crossword', crosswordSchema);