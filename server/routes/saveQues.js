var saveQuestion = require('express').Router();
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo4j:password@localhost:7474');
var async=require('async');

saveQuestion.post("/quiz/:topic/:subtopic/:user/save",function(req,res){
    db.cypher({
      query: "match(n:topic {name:{topic}})<-[r:subTopicOf]-(s:subtopic {name:{subtopic}})<-[r1:contributorOf]-(c:contributor {name:{contributor}}) merge (c)<-[rel:questionOf]-(q:question {statement:{statement}})",
      params: {
          topic:req.params.topic,
          subtopic:req.params.subtopic,
          contributor:req.params.user,
          statement:req.body.statement}
  }, function (err, results) {
    async.each(req.body.options, function(option, callback) {
      var value=0;
    if(option==req.body.correctOption){
      value=1;
    }
    db.cypher({
      query: "match(n:topic {name:{topic}})<-[r:subTopicOf]-(s:subtopic {name:{subtopic}})<-[r1:contributorOf]-(c:contributor {name:{contributor}})<-[r2:questionOf]-(q:question {statement:{statement}}) merge (q)<-[rels:optionsOf]-(o:options {option:{option}, value:{correct}})",
      params: {
          topic:req.params.topic,
          subtopic:req.params.subtopic,
          contributor:req.params.user,
          statement:req.body.statement,
          option: option,
          correct:value
        }
  }, function (err) {
        callback();
    })

  },function(err, results){
    var qns=[];
    db.cypher({
      query: "match(n:topic {name:{topic}})<-[r:subTopicOf]-(s:subtopic {name:{subtopic}})<-[contributorOf]-(c:contributor {name:{contributor}})<-[questionOf]-(q:question)<-[optionsOf]-(opt:options) return q,opt",
      params: {
          topic:req.params.topic,
          subtopic:req.params.subtopic,
          contributor:req.params.user}
  }, function (err, results) {
       var obj={};
       var id="";
       var statement="";
       var options=[];
       results.map(function(result,i){
          if(id!=result.q._id){
            if(options.length>0){
              obj={"question":statement,"option":options};
              qns.push(obj);
              obj={};
            }
            options=[];
            id=result.q._id;
            statement=result.q.properties.statement;
            options.push({"opt":result.opt.properties.option,"value":result.opt.properties.value});
          }
          else{
            options.push({"opt":result.opt.properties.option,"value":result.opt.properties.value});
          }
       })
       if(statement!=""&&options!=[]){
       obj={"question":statement,"option":options};
       qns.push(obj);
     }
       res.send(qns);
     })
  })
  })

})

module.exports = saveQuestion;
