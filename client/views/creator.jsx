import React from 'react';
import User from './../components/user.jsx';
import {Grid,Row,Col} from 'react-flexbox-grid/lib';
import Question from './../components/question.jsx';
import Paper from 'material-ui/Paper';
import request from 'superagent';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router';
import QuizAppBar from './../components/Appbar.jsx';
export default class Creator extends React.Component{

constructor(props){
super(props);
this.state={
  topic:this.props.params.topic,
  subtopic:this.props.params.subtopic,
  user:this.props.params.user,
  selectedUser:"",
  questions:[],
  expanded:[]
}
this.handleUserChange=this.handleUserChange.bind(this);
this.handleAddQuestions=this.handleAddQuestions.bind(this);
this.handleDeleteQuestion=this.handleDeleteQuestion.bind(this);
this.handleCardExpansion=this.handleCardExpansion.bind(this);
}

handleUserChange(name){
  this.setState({selectedUser:name})
  var that = this;
  request.get("/quiz/"+this.state.topic+"/"+this.state.subtopic+"/"+name).end(function(err,res){
    that.setState({questions:JSON.parse(res.text)});
    var a=JSON.parse(res.text).length;
    var exp=Array(a).fill(false);
    that.setState({expanded:exp})
  })
}

handleAddQuestions(arr){
  this.setState({questions:arr});
}

handleDeleteQuestion(qn,options){
 var arr=this.state.questions;
 var index=-1;
 for(var i=0;i<arr.length;i++){
  if(arr[i].question==qn){
    index=i;
    break;
  }
 }
 arr.splice(index,1);
 this.setState({questions:arr})
}

handleCardExpansion(i){
  if(this.state.expanded[i]==true){
    var exp=Array(this.state.questions.length).fill(false);
    this.setState({expanded:exp})
  }
  else{
    var exp=Array(this.state.questions.length).fill(false);
    exp[i]=true;
    this.setState({expanded:exp})
  }
}

render(){

return(
  <div >
<QuizAppBar user={this.props.params.user}/>
<Grid style={{padding:"0px",width:"100%"}}>
 <Row>
  <Col style={{padding:"0px"}} lg={10} >
  <Paper style={{height:"100%"}}>
<Question expandCard={this.handleCardExpansion} userChange={this.handleUserChange} expanded={this.state.expanded} addQuestions={this.handleAddQuestions} deleteQuestion={this.handleDeleteQuestion} user={this.state.user} topic={this.state.topic} subtopic={this.state.subtopic} selectedUser={this.state.selectedUser} questions={this.state.questions}/>
</Paper>
</Col>
<Col style={{height:"100%",padding:"0px",margin:"0px",overflowY:"scroll"}} xs={12} md={12} lg={2}>
  <Paper style={{height:"90vh",width:"100%",backgroundColor:"#f4f4f8"}}>
 <User style={{height:"100%"}} topic={this.state.topic} user={this.state.user} selectedUser={this.state.selectedUser} subtopic={this.state.subtopic} userChange={this.handleUserChange}/>
</Paper>
  </Col>
</Row>
</Grid>
</div>
)
}
}
