const listUsers = require('express').Router();
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo4j:password@localhost:7474');


listUsers.get("/quiz/:topic/:subtopic",function(req,res){
  //console.log(req.params);
  var topic=req.params.topic;
  var subtopic=req.params.subtopic;
  var users=[];
//  console.log(topic,subtopic);
  db.cypher({
    query: "match(n:topic {name:{topic}})<-[r:subTopicOf]-(s:subtopic {name:{subtopic}})<-[contributorOf]-(c:contributor) return c",
    params: {
        topic:topic,
        subtopic:subtopic}
}, function (err, results) {
    //console.log(results);
    results.map(function(result,i){
    //  console.log(result.c.properties);
      users.push(result.c.properties.name);
    })
    console.log(users);
    res.send(users);
});

})

module.exports = listUsers;
