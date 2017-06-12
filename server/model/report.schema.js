const mongoose = require("mongoose"),
	    Schema=mongoose.Schema;


var reportSchema=new Schema({
    topic:String,
    subtopic:String,
    users:[{}]
});


var report=mongoose.model("report",reportSchema);

module.exports=report;
