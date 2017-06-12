const mongoose = require("mongoose"),
	    Schema=mongoose.Schema;


var launchQuizSchema=new Schema({
    topic:String,
    subtopic:String,
    user:String,
    date:Date,
    startTime:Date,
    endTime:Date,
    questions:[{question:String,options:[String],correctAnswer:String}]
});


var launchQuiz=mongoose.model("launchQuiz",launchQuizSchema);

module.exports=launchQuiz;
