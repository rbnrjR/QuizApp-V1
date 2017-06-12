const retriveQuesByUser = require('express').Router();
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo4j:password@localhost:7474');

retriveQuesByUser.get("/quiz/:topic/:subtopic/:user",function(req,res){
  var qns=[];
  if(req.params.user=="View All"){
    db.cypher({
      query: "match(n:topic {name:{topic}})<-[r:subTopicOf]-(s:subtopic {name:{subtopic}})<-[contributorOf]-(c:contributor)<-[questionOf]-(q:question)<-[optionsOf]-(opt:options) return q,opt",
      params: {
          topic:req.params.topic,
          subtopic:req.params.subtopic
        }
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
  }
  else{
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
 //     db.cypher({
 //       query: "match(n:topic {name:{topic}})<-[r:subTopicOf]-(s:subtopic {name:{subtopic}})<-[contributorOf]-(c:contributor {name:{contributor}})<-[questionOf]-(q:question {statement:{question}})<-[optionsOf]-(opt:options) return opt",
 //       params: {
 //           topic:req.params.topic,
 //           subtopic:req.params.subtopic,
 //           contributor:req.params.user,
 //           question:qn
 //         }
 //   }, function (err, resultsss) {
 //      console.log(resultsss[0].opt.properties);
 //   }
 // )
});
}
})

module.exports = retriveQuesByUser;
