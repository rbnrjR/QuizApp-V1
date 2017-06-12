import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import {Grid,Row,Col} from 'react-flexbox-grid/lib';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import Badge from 'material-ui/Badge';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import Assignment from 'material-ui/svg-icons/action/assignment';
import Create from 'material-ui/svg-icons/content/create';
import { Link } from 'react-router';
import request from 'superagent';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import QuizAppBar from './Appbar.jsx';
var subtopic=[];
export default class Cards extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state={classname:"NotFlipped",subtopics:[],open:false,subtopic:"",subtopicError:""};
		this.handleClick=this.handleClick.bind(this);
		this.handleOpen=this.handleOpen.bind(this);
		this.handleClose=this.handleClose.bind(this);
		this.handleSubmit=this.handleSubmit.bind(this);
		this.handleSubtopicChange=this.handleSubtopicChange.bind(this);
	}

	componentDidMount(){
	var that=this;
	console.log(this.props.params.topic);
	request.get("/quiz/"+this.props.params.topic+"/subtopic").end(function(err,res){
		var subtopicArr=JSON.parse(res.text);
		subtopicArr.map((item)=>{
	    subtopic.push(item.subtopic.toLowerCase());
	  })
		that.setState({subtopics:subtopicArr});
		})
	}

	handleClick(value)
	{
		console.log(value);
	}

 handleOpen(){
 this.setState({open:true})
 }

handleClose(){
this.setState({open:false})
}

handleSubtopicChange(e){
this.setState({subtopic:e.target.value})
}

handleSubmit(){
var that=this;
if(this.state.subtopic==""){
	this.setState({subtopicError:"Subtopic name cannot be empty"})
}
else if(subtopic.indexOf(this.state.subtopic.toLowerCase())!=-1){
	this.setState({subtopicError:"Subtopic already exists"})
}
else{
request.post("/quiz/subtopic/add").send({"user":this.props.params.user,"topic":that.props.params.topic,"subtopic":that.state.subtopic}).end(function(err,res){
	  var arr=that.state.subtopics;
	  arr.push(JSON.parse(res.text));
	  that.setState({open:false,stopics:arr})
})
}
}


	render()
	{

	const actions = [
       <RaisedButton
         label="Cancel"
         onTouchTap={this.handleClose}
       />,
       <RaisedButton
         label="Add"
         onTouchTap={this.handleSubmit}
       />,
     ];

  var addSubTopic=<Dialog
            title="Add a New SubTopic"
            actions={actions}
            modal={true}
            open={this.state.open}
            onRequestClose={this.handleClose}
          >
          <TextField
            hintText="Enter topic name"
            value={this.props.params.topic}
            disabled={true}
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
		return(
			<div>
					<QuizAppBar user={this.props.params.user}/>
				<br/>
				<Grid fluid>
		        <Row>

			{this.state.subtopics.map((stopics,i)=>{
			return(


			<Col key={i} lg={4} md={6} xs={12} sm={6}>
			<Card onClick={()=>this.handleClick(this.state.subtopic)} style={{borderRadius:"20px"}} >
    		<CardHeader
      		title={stopics.subtopic}
      		subtitle={"Contributors :"+stopics.contributorCount}
      		avatar={
						<Avatar color="#ffffff" backgroundColor="#000000" size={35} style={{marginTop:"0px"}}>
						{stopics.subtopic.charAt(0).toUpperCase()}
						</Avatar>
}
    		/>
			<CardActions style={{backgroundColor:"#8c6d56",borderBottomRightRadius:"20px",borderBottomLeftRadius:"20px"}}>
<Link to={"/take/"+this.props.params.topic+"/"+stopics.subtopic+"/"+this.props.params.user}>
					<IconButton tooltip="Take Quiz">
							<Assignment />
					</IconButton>
					</Link>
					<Link to={"/creator/"+this.props.params.topic+"/"+stopics.subtopic+"/"+this.props.params.user}>
					<IconButton tooltip="create Quiz">
							<Create />
					</IconButton>
</Link>

    		</CardActions>
 			 </Card>
			 <br/>
		 </Col>
	 )})}
		 </Row>
	 </Grid>
	 <FloatingActionButton style={{marginRight:"20px",marginBottom:"20px",bottom:"0",right:"0",position:"fixed",zIndex:"3000"}} onClick={this.handleOpen}>
		 <ContentAdd />
	 </FloatingActionButton>
	 {addSubTopic}
 			 </div>
		);
	}
}
