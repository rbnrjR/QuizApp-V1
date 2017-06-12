const launchQuiz = require('express').Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async=require('async');
const launchQuizSchema = require('./../model/launchQuiz.schema.js');
const reportSchema=require('./../model/report.schema.js');
const scoreSchema=require('./../model/score.schema.js');

launchQuiz.post("/quiz/launch",function(req,res){
  var launchQns=[];
  var obj={};
  async.each(req.body.questions,function(question,callback){
      var ques=question.question;
      var correctAnswer="";
      var options=[];
    async.each(question.option,function(opt,callback){
      options.push(opt.opt);
      if(opt.value==1){
        correctAnswer=opt.opt;
      }
      callback();
    },function(error){
        obj={"question":ques,"options":options,"correctAnswer":correctAnswer}
        launchQns.push(obj);
    })
    callback();
  },function(err){
     var launch=new launchQuizSchema({
       topic:req.body.topic,
       subtopic:req.body.subtopic,
       user:req.body.user,
       date:req.body.date,
       startTime:req.body.startTime,
       endTime:req.body.endTime,
       questions:launchQns
     });
     launch.save(function(err,reply){
       console.log(err);
     })
  })
})

module.exports = launchQuiz;
