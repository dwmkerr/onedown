var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var solutionSchema = mongoose.Schema({

  //  TODO: Good candidate for compound index, as always search
  //  by both. Also good candidate for _id, however _id cannot support
  //  a compound index, recommendation is use default ObjectID _id
  //  and compound index the below.
  crosswordId:  {type: ObjectId, required: true},
  userId:       {type: String, required: true},

  answers:        [{
    clueCode:     {type: String, required: true},
    answer:       {type: String, required: true} 
  }]

});

module.exports = mongoose.model('Solution', solutionSchema);