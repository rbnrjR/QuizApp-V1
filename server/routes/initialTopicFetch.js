const topicFetch = require('express').Router();
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo4j:password@localhost:7474');
var async=require('async');

topicFetch.get("/quiz/topics",function(req,res){
  console.log('inside topic fetch');
  var topics=[];
  var image="";
  db.cypher({
    query:"match(n:topic) return n"
  },function(err,result){
    async.each(result,function(topic,callback){
      db.cypher({
        query:"match(n:topic {name:{top}})<-[r:imageOf]-(i:image) return i",
        params:{top:topic.n.properties.name}
      },function(err,image){
        image=image[0].i.properties;
        db.cypher({
          query:"match(n:topic {name:{tp}})<-[r:subTopicOf]-(s:subtopic) return count(s) as count",
          params:{tp:topic.n.properties.name}
        },function(err,subCount){
          var obj={"topic":topic.n.properties.name,"subTopicCount":subCount[0].count,"image":image.link};
          topics.push(obj);
          callback();
        })
      })
    },function(err){
      res.send(topics);
    })
  })
})

module.exports = topicFetch;
