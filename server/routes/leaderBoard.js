const leaderboard = require('express').Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async=require('async');
const launchQuizSchema = require('./../model/launchQuiz.schema.js');
const reportSchema=require('./../model/report.schema.js');
const scoreSchema=require('./../model/score.schema.js');

leaderboard.get("/quiz/leaderboard/:topic/:subtopic",function(req,res){
  if(req.params.topic=="overall"&&req.params.subtopic=="overall"){
  var Arr=[];
  var name=[];
  var max=0;
  scoreSchema.find({},function(err,reply){
    async.each(reply,function(item,callback){
      var obj={};
      obj["name"]=item.user;
      obj["score"]=0;
      var score=0;
      Object.keys(item.scores).map(function(topic,i){
        obj["score"]+=item.scores[topic];
        if(obj["score"]>max){
          max=obj["score"];
        }
      })
      Arr.push(obj);
      callback();
    },function(err){
      console.log(Arr,max);
      Arr.sort(function(a, b) {
      return parseFloat(b.score) - parseFloat(a.score);
    });
      res.send({data:Arr,max:max});
  })
})
}
else{
  var Arr=[];
  var name=[];
  var max=0;
  reportSchema.findOne({topic:req.params.topic,subtopic:req.params.subtopic},function(err,reply){
    async.each(reply.users,function(item,callback){
      var obj={};
      obj["name"]=Object.keys(item)[1];
      obj["score"]=item.score;
      if(item.score>max){
        max=item.score;
      }
      Arr.push(obj);
      callback();
    },function(err){
            Arr.sort(function(a, b) {
            return parseFloat(b.score) - parseFloat(a.score);
      });
            res.send({data:Arr,max:max});
    })
  })
    }
})

module.exports = leaderboard;
