import React from 'react';
import {Grid,Row,Col} from 'react-flexbox-grid/lib';
import {Card,CardHeader,CardTitle,CardActions,CardMedia,CardText} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import PlayArrow from 'material-ui/svg-icons/av/play-arrow';
import Add from 'material-ui/svg-icons/content/add';
import { Link } from 'react-router';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import request from 'superagent';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import QuizAppBar from './../components/Appbar.jsx';
var topic=[];
export default class Home extends React.Component{

constructor(props){
super(props);
this.state={
  topics:[],
  shadow:[],
  open:false,
  topic:"",
  subtopic:"",
  user:this.props.params.user,
  searchText:'',
  topicError:"",
  subtopicError:"",
  searchError:""
}
console.log(this.props.params,"----");
this.handleClick=this.handleClick.bind(this);
this.onMouseOver=this.onMouseOver.bind(this);
this.onMouseOut=this.onMouseOut.bind(this);
this.handleOpen=this.handleOpen.bind(this);
this.handleClose=this.handleClose.bind(this);
this.handleSubmit=this.handleSubmit.bind(this);
this.handleTopicChange=this.handleTopicChange.bind(this);
this.handleSubtopicChange=this.handleSubtopicChange.bind(this);
this.handleSelect=this.handleSelect.bind(this);

}

componentDidMount(){
var that=this;
  request.get("/quiz/topics").end(function(err,res){
  var topicArr=JSON.parse(res.text);
  var shadows=Array(topicArr.length).fill(1);
  that.setState({topics:topicArr,shadow:shadows});
  topicArr.map((item)=>{
    topic.push(item.topic.toLowerCase());
  })
  that.setState({topicStack:topic});
  console.log(that.state.topicStack);
  })
}

onMouseOver(i){
console.log(i);
 var arr=this.state.shadow;
 arr[i]=5;
  this.setState({shadow:arr})
}

onMouseOut(i){
var arr=this.state.shadow;
arr[i]=1;
 this.setState({shadow:arr})
}

handleClick(topic)
{
  console.log(topic);
}

handleOpen(){
  this.setState({open:true})
}

handleClose(){
  this.setState({open:false})
}

handleTopicChange(e){
  this.setState({topic:e.target.value,topicError:""})
}

handleSubtopicChange(e){
this.setState({subtopic:e.target.value,subtopicError:""})
}

handleSubmit(){
var that=this;
if(this.state.topic=="")
{
  this.setState({topicError:"Topic name cannot be empty"})
}
else if(topic.indexOf(this.state.topic.toLowerCase())!=-1){
  this.setState({topicError:"Topic already exists"})
}
else if(this.state.subtopic==""){
  this.setState({subtopicError:"Subtopic name cannot be empty"})
}
else{
request.post("/quiz/topic/add").send({"user":that.state.user,"topic":that.state.topic, "subtopic":that.state.subtopic}).end(function(err,res){
   var arr=that.state.topics;
   arr.push(JSON.parse(res.text));
   that.setState({topics:arr,open:false})
})
}
}

handleSelect(e)
{
  var that = this;
  that.setState({searchText:e});
  if(topic.indexOf(e.toLowerCase())==-1){
    this.setState({searchError:"No such topic is available"})
  }
  else{
    this.setState({searchError:"OK"})
  }

}
render(){

var that=this;

const actions = [
       <RaisedButton
         label="Cancel"
         onTouchTap={this.handleClose}/>,
         <RaisedButton
            label="Add"
            onTouchTap={this.handleSubmit}
          />
     ];
var addTopic=<Dialog
          title="Add a New Topic"
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
        <TextField
          hintText="Enter topic name"
          value={this.state.topic}
          onChange={this.handleTopicChange}
          errorText={this.state.topicError}
        />
        <br />
        <TextField
          hintText="Enter subtopic name"
          value={this.state.subtopic}
          onChange={this.handleSubtopicChange}
            errorText={this.state.subtopicError}
        />
        <br />
        </Dialog>
      var searchButton=null;
      if(this.state.searchError=="OK"){
        searchButton=<Link to={"/subtopic/"+that.state.searchText+"/"+that.state.user}>
        <RaisedButton label="Search"  />
        </Link>
      }
      else{
          searchButton=<RaisedButton label="Search" disabled={true} />
      }

return(
<div>

  <QuizAppBar user={this.state.user}/>




<br/>
<center>
  <AutoComplete
        onUpdateInput={that.handleSelect}
        searchText={that.state.searchText}
        floatingLabelText="Search your tech"
        filter={AutoComplete.caseInsensitiveFilter}
        dataSource={topic}
        maxSearchResults={5}
      />&nbsp;
{searchButton}
  </center>
    <br/>
<Grid fluid style={{padding:"1px"}}>
<Row style={{height:"276px",marginLeft:"50px",marginRight:"50px"}}>
  {
    this.state.topics.map(function(topic,i){
     return(
     <Col style={{marginTop:"20px"}} key={i} lg={4} md={4} xs={12} sm={6}>
     <Link to={"/subtopic/"+topic.topic+"/"+that.state.user}>
     <Card onMouseOver={that.onMouseOver.bind(that,i)} onMouseOut={that.onMouseOut.bind(that,i)}
     zDepth={that.state.shadow[i]} onClick={()=>that.handleClick(topic.topic)}>
     <CardMedia
     overlay={<CardTitle style={{height:"80%"}} title={topic.topic} subtitle={"Subtopics Available :"+topic.subTopicCount} />}><center>
       <img style={{width:"100%",height:"100%",margin:"0px",padding:"0px",maxHeight:"200px",minHeight:"200px"}} src ={topic.image}  />
</center>
  </CardMedia>
        </Card>
        </Link>
        <br/>
     </Col>
     )
    })
  }
</Row>
    <FloatingActionButton style={{marginRight:"20px",marginBottom:"20px",bottom:"0",right:"0",position:"fixed",zIndex:"3000"}} onClick={this.handleOpen}>
      <ContentAdd />
    </FloatingActionButton>
{addTopic}
</Grid>
</div>
)
}
}
