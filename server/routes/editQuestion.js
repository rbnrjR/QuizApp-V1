const editQuestion = require('express').Router();
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo4j:password@localhost:7474');
var async=require('async');


editQuestion.put("/quiz/question/edit",function(req,res){
  db.cypher({
    query:"match (n:topic {name:{topic}})<-[r:subTopicOf]-(s:subtopic {name:{subtopic}})<-[r1:contributorOf]-(c:contributor {name:{user}})<-[r2:questionOf]-(q:question {statement:{oldQn}})<-[r3:optionsOf]-(o:options) detach delete q,o merge (c)<-[rel:questionOf]-(q1:question {statement:{newQn}})",
    params:{
      topic:req.body.topic,
      subtopic:req.body.subtopic,
      user:req.body.user,
      oldQn:req.body.oldQuestion,
      newQn:req.body.newQuestion
    }
  },function(error,result){
    async.each(req.body.options, function(option, callback) {
    db.cypher({
      query: "match(n:topic {name:{topic}})<-[r:subTopicOf]-(s:subtopic {name:{subtopic}})<-[r1:contributorOf]-(c:contributor {name:{contributor}})<-[r2:questionOf]-(q:question {statement:{statement}}) merge (q)<-[rels:optionsOf]-(o:options {option:{option}, value:{value}})",
      params: {
          topic:req.body.topic,
          subtopic:req.body.subtopic,
          contributor:req.body.user,
          statement:req.body.newQuestion,
          option: option.opt,
          value: option.value
        }
  }, function (errr,ress) {
        callback();
    })
  },function(err){
      res.send("Received");
  })
  })
})

module.exports = editQuestion;
