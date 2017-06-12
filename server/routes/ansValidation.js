const ansValidation = require('express').Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async=require('async');
const launchQuizSchema = require('./../model/launchQuiz.schema.js');
const reportSchema=require('./../model/report.schema.js');
const scoreSchema=require('./../model/score.schema.js');

ansValidation.post("/quiz/:topic/:subtopic/:user/validate",function(req,res){
  var marks=0;
  var resultData=[];
  var i=0;
  var score=0;
    launchQuizSchema.find({'topic':req.params.topic,'subtopic':req.params.subtopic},function(err,reply){
      async.each(reply[0].questions,function(question,callback){
        var obj={};
        obj["question"]=question.question;
        obj["options"]=question.options;
        obj["selectedAnswer"]=req.body.selectedanswers[i];
        obj["correctAnswer"]=question.correctAnswer;
        if(question.correctAnswer==req.body.selectedanswers[i])
        {
          obj["value"]=1;
          score++;
        }
        else{
          obj["value"]=0;
        }
        resultData.push(obj);
        i++;
        callback();
      },function(err){
        var obj={};
        obj[req.params.user]=resultData;
        obj["score"]=score;
            var obj1={};
            obj1[req.params.topic+"#"+req.params.subtopic]=score;

            scoreSchema.update({user:req.params.user},{$set:{scores:obj1}},{upsert:true},function(err,reply){

            })
        reportSchema.findOne({topic:req.params.topic,subtopic:req.params.subtopic},function(err,reply){
          if(reply==null){
            var arr=[];
            arr.push(obj);
            var report=new reportSchema({
              topic:req.params.topic,
              subtopic:req.params.subtopic,
              users:arr
            });
            report.save(function(err,reply){
              res.send("done");
          })
          }
          else{
            reportSchema.findOneAndUpdate({topic:req.params.topic,subtopic:req.params.subtopic},{$push:{users:obj}},function(err,reply){
              res.send("done");
            })
          }
        })

    })
})
})

module.exports = ansValidation;
