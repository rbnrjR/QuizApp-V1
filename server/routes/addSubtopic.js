const addSubtopic = require('express').Router();
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo4j:password@localhost:7474');

addSubtopic.post("/quiz/subtopic/add",function(req,res){
  db.cypher({
    query:"match (n:topic {name:{topic}}) merge(n)<-[r:subTopicOf]-(s:subtopic {name:{subtopic}}) merge(s)<-[r2:contributorOf]-(c:contributor {name:{user}}) return n,s,c",
    params:{
      topic:req.body.topic,
      subtopic:req.body.subtopic,
      user:req.body.user
    }
  },function(err,result){
    var obj={"subtopic":req.body.subtopic,"contributorCount":1}
    res.send(obj);
  })
})

module.exports = addSubtopic;
