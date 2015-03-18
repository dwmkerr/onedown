var mongoose = require('mongoose');

var crosswordSchema = mongoose.Schema({

  title:          {type: String, required: true},
  source:         {
    name:         {type: String, required: true},
    url:          {type: String, required: false}
  },
  originalUrl:    {type: String, required: true},
  setter:         {
    name:         {type: String, required: true},
    url:          {type: String, required: false}
  },
  width:          {type: Number, required: true, min: 1, max: 50}, 
  height:         {type: Number, required: true, min: 1, max: 50},
  acrossClues:    [{
    clue:         {type: String, required: true},
    number:       {type: Number, required: true},
    x:            {type: Number, required: true},
    y:            {type: Number, required: true},
    length:       [{type: Number, required: true}]
  }],
  downClues:      [{
    clue:         {type: String, required: true},
    number:       {type: Number, required: true},
    x:            {type: Number, required: true},
    y:            {type: Number, required: true},
    length:       [{type: Number, required: true}]
  }],
  hasAnswer:      {type: Boolean, required: true}
});

module.exports = mongoose.model('Crossword', crosswordSchema);