const deleteQues = require('express').Router();
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo4j:password@localhost:7474');

deleteQues.delete("/quiz/:topic/:subtopic/:user/delete",function(req,res){
  var statement=req.body.statement;
  db.cypher({
    query: "match(n:topic {name:{topic}})<-[r:subTopicOf]-(s:subtopic {name:{subtopic}})<-[r1:contributorOf]-(c:contributor {name:{contributor}})<-[r2:questionOf]-(q:question {statement:{ques}})<-[r3:optionsOf]-(opt:options) detach delete q,opt",
    params: {
        topic:req.params.topic,
        subtopic:req.params.subtopic,
        contributor:req.params.user,
        ques:statement
      }
  }, function (err, results) {
    res.send("Deleted");
  })
})

module.exports = deleteQues;
