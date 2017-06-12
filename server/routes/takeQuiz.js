const takeQuiz = require('express').Router();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const launchQuizSchema = require('./../model/launchQuiz.schema.js');
const reportSchema=require('./../model/report.schema.js');
const scoreSchema=require('./../model/score.schema.js');
var async=require('async');

takeQuiz.get("/quiz/:topic/:subtopic/:user/take", function(req, res){
  launchQuizSchema.find({'topic':req.params.topic,'subtopic':req.params.subtopic,'user':req.params.user},function(err,reply){
    var questions=[];
    console.log("Question has been taken ---> ",reply);
    async.each(reply[0].questions,function(question,callback){
      var obj={"question":question.question,"options":question.options}
      questions.push(obj);
      callback();
    },function(err){
       res.send(questions);
    });
  });
});

module.exports = takeQuiz;
