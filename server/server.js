const express=require('express');
var     app=express()
var    mongoose = require('mongoose')
var bodyParser = require('body-parser');
mongoose.connect('mongodb://localhost/test');


//routes
var imageSearch = require('./routes/imageSearch.js');
var topicFetch = require('./routes/initialTopicFetch.js');
var subtopicFetch = require('./routes/subtopicFetch.js');
var listUsers = require('./routes/listUsers.js');
var checkAvailability = require('./routes/checkAvailablity.js');
var takeQuiz = require('./routes/takeQuiz.js');
var deleteQues = require('./routes/deleteQues.js');
var ansValidation = require('./routes/ansValidation.js');
var leaderboard = require('./routes/leaderBoard.js');
var retriveQuesByUser = require('./routes/retriveQuesByUser.js');
var saveQuestion = require('./routes/saveQues.js');
var report = require('./routes/report.js');
var addContributors = require('./routes/addContributers.js');
var launchQuiz = require('./routes/launchQuiz.js');
var addSubtopic = require('./routes/addSubtopic.js');
var editQuestion = require('./routes/editQuestion.js');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('./../'));
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use('/',function(err,res,next){
  console.log('in the use');
  next();
},imageSearch,ansValidation,saveQuestion,addContributors,launchQuiz,addSubtopic,topicFetch,subtopicFetch,listUsers,checkAvailability,takeQuiz,leaderboard,report,deleteQues,editQuestion);


app.listen(8000,function(){
  console.log("Server Started on 8000");
})
