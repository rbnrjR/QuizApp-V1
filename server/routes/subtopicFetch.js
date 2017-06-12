const subtopicFetch = require('express').Router();
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo4j:password@localhost:7474');
var async=require('async');

subtopicFetch.get("/quiz/:topic/subtopic",function(req,res){
  var subtopics=[];
  db.cypher({
    query:"match(n:topic {name:{top}})<-[r:subTopicOf]-(s:subtopic) return s",
    params:{
      top:req.params.topic
    }
  },function(err,result){
    async.each(result,function(subtopic,callback){
      db.cypher({
        query:"match(n:topic {name:{top}})<-[r:subTopicOf]-(s:subtopic {name:{subtp}})<-[r2:contributorOf]-(c:contributor) return count(c) as count",
        params:{
          top:req.params.topic,
          subtp:subtopic.s.properties.name
            }
      },function(err,contributorCount){
        var obj={"subtopic":subtopic.s.properties.name,"contributorCount":contributorCount[0].count};
        subtopics.push(obj);
        callback();
      })
    },function(err){
      res.send(subtopics);
    })
  })
})

module.exports = subtopicFetch;
