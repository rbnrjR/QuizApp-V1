import React from 'react';
import request from 'superagent';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import {Link} from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import {Card,CardHeader,CardTitle} from 'material-ui/Card';

export default class Report extends React.Component{

constructor(props){
  super(props);
  this.state={
    resultData:[]
  }
}

componentDidMount(){
  var that=this;
    request.get("/quiz/"+this.props.params.topic+"/"+this.props.params.subtopic+"/"+this.props.params.user+"/getreport").end(function(err,res){
        that.setState({resultData:JSON.parse(res.text)})
    })
}

render(){

var correct=null;
var score=0;
var display=this.state.resultData.map(function(item,i){
  if(item.value==1){
    score++;
  }
  return(
    <Card key={i} style={{marginBottom:"8px",backgroundColor:"#f4f4f8"}}>
    <CardHeader title={i+1+") "+item.question} titleStyle={{fontSize:"20px"}}/>
    {
      item.options.map(function(opt,j){
        if(item.correctAnswer==opt&&item.selectedAnswer==opt){
          return(<CardTitle key={j} style={{paddingTop:"0px",paddingBottom:"0px"}} titleColor="#4CAF50" titleStyle={{fontSize:"18px"}} title={String.fromCharCode(65+j)+") "+opt}/>)
        }
        else if(item.correctAnswer==opt){
            return(<CardTitle key={j} style={{paddingTop:"0px",paddingBottom:"0px"}} titleColor="#4CAF50" title={String.fromCharCode(65+j)+") "+opt} titleStyle={{fontSize:"18px"}}/>)
        }
        else if(item.selectedAnswer==opt){
          return(<CardTitle key={j} style={{paddingTop:"0px",paddingBottom:"0px"}} titleColor="#F44336" title={String.fromCharCode(65+j)+") "+opt} titleStyle={{fontSize:"18px"}}/>)
        }
        else{
          return(<CardTitle key={j} style={{paddingTop:"0px",paddingBottom:"0px"}} title={String.fromCharCode(65+j)+") "+opt} titleStyle={{fontSize:"18px"}}/>)
        }
      })
    }
  </Card>
)
})
    return(
      <Paper style={{width:"100%",height:"100vh",overflowY:"scroll"}}>
      <AppBar
          title={<span>MyQuiz</span>}
          iconElementLeft={<Link to={'/home/'+this.props.user}><IconButton><img src="https://media.licdn.com/mpr/mpr/shrink_100_100/AAEAAQAAAAAAAAzgAAAAJDc2OTQ1OGZhLThmN2QtNGZiOC05MzM0LTlhMTRjNzQ1ZjIxYg.png " height="33" className="logo"/></IconButton></Link>}
              />
      <Link to={"/leaderboard/"+this.props.params.topic+"/"+this.props.params.subtopic+"/"+this.props.params.user}><RaisedButton label="View LeaderBoard" style={{float:"right",marginTop:"20px"}}/></Link>
      <center><h1>You have got {score} Answers Right!!</h1></center>
      <h3><u>Your Quiz Report</u></h3>
      {display}
      </Paper>
    )
}

}
