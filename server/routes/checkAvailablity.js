const checkAvailability = require('express').Router();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const launchQuizSchema = require('./../model/launchQuiz.schema.js');
const reportSchema=require('./../model/report.schema.js');
const scoreSchema=require('./../model/score.schema.js');

checkAvailability.get("/quiz/:topic/:subtopic/checkAvailability",function(req,res){
  launchQuizSchema.find({'topic':req.params.topic,'subtopic':req.params.subtopic},function(err,reply){
    var launchQuizUsers=[];
    var resObj={};
    var currentTime = new Date().getTime()/1000;
    for(i=0;i<reply.length;i++){
      var st = reply[i].startTime.getTime()/1000;
      var et = reply[i].endTime.getTime()/1000;
      console.log(currentTime, st , et);
      if ((currentTime>st)) {
        console.log('quiz iruku');
        launchQuizUsers.push(reply[i].user);
      }
    }
    if (launchQuizUsers.length!=0) {
      resObj["status"]="true";
      resObj["launchQuizUsers"]=launchQuizUsers;
      console.log("arr - ", resObj);
      res.send(resObj);
    }
    else {
      res.send("false");
    }
  })
})

module.exports = checkAvailability;
