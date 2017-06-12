const addContributors = require('express').Router();
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo4j:password@localhost:7474');

addContributors.post("/quiz/addContributors",function(req,res){
  db.cypher({
    query:"match (n:topic {name:{topic}})<-[r:subTopicOf]-(s:subtopic {name:{subtopic}}) merge(s)<-[r1:contributorOf]-(c:contributor {name:{user}}) return c",
    params:{
      topic:req.body.topic,
      subtopic:req.body.subtopic,
      user:req.body.user
    }
  },function(err,result){
    res.send(req.body.user);
  })
})

module.exports = addContributors;
