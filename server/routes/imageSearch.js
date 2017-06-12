const imageSearch = require('express').Router();
imageSearch.use(require('body-parser').json());
const GoogleImages = require('google-images');
const client = new GoogleImages('006703518498526470931:fbn-v7xsm2g', 'AIzaSyCtP850ZXwm0vrHeaQzqd6wq6uuxw1qV8s');
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo4j:password@localhost:7474');

imageSearch.post('/quiz/topic/add',(req,res)=>{
  // console.log(req.body.topic);
  client.search(req.body.topic)
    .then(function(images){
      var link=images[0].url;
      db.cypher({
        query:"create (n:topic {name:{topic}}) merge(n)<-[r:subTopicOf]-(s:subtopic {name:{subtopic}}) merge(n)<-[r1:imageOf]-(i:image {link:{imagelink}}) merge(s)<-[r3:contributorOf]-(c:contributor {name:{user}}) return n,s,i,c",
        params:{
          topic:req.body.topic,
          subtopic:req.body.subtopic,
          imagelink:link,
          user:req.body.user
        }
      },function(err,result){
        if(err){
          res.send("error");
        }
        else{
        var obj={"topic":req.body.topic,"subTopicCount":1,"image":link}
        res.send(obj);
      }
      })
    });

});

module.exports = imageSearch;
