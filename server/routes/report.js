const report = require('express').Router();

report.get("/quiz/:topic/:subtopic/:user/getreport",function(req,res){
  reportSchema.find({topic:req.params.topic,subtopic:req.params.subtopic},function(err,reply){
    console.log(reply);
    reply[0].users.map(function(item,i){
      if(Object.keys(item)[1]==req.params.user){
        res.send(item[req.params.user]);
      }
    })
  })
})

module.exports = report;
