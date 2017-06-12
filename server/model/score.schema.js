const mongoose = require("mongoose"),
	    Schema=mongoose.Schema;


var scoreSchema=new Schema({
    user:String,
		scores:{}
});


var score=mongoose.model("score",scoreSchema);

module.exports=score;
