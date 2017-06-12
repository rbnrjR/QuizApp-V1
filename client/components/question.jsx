  import React from 'react';
  import RaisedButton from 'material-ui/RaisedButton';
  import request from 'superagent';
  import {CardText,Card,CardHeader,CardActions} from 'material-ui/Card';
  import FloatingActionButton from 'material-ui/FloatingActionButton';
  import ContentAdd from 'material-ui/svg-icons/content/add';
  import Dialog from 'material-ui/Dialog';
  import TextField from 'material-ui/TextField';
  import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
  import Paper from 'material-ui/Paper';
  import ScrollArea from 'react-scrollbar';
  import Create from 'material-ui/svg-icons/content/create';
  import Delete from 'material-ui/svg-icons/action/delete';
  import {Grid,Row,Col} from 'react-flexbox-grid/lib';
  import IconMenu from 'material-ui/IconMenu';
  import MenuItem from 'material-ui/MenuItem';
  import IconButton from 'material-ui/IconButton';
  import AddToQueue from 'material-ui/svg-icons/av/add-to-queue';
  import DatePicker from 'material-ui/DatePicker';
  import TimePicker from 'material-ui/TimePicker';
  import Drawer from 'material-ui/Drawer';
  import Subheader from 'material-ui/Subheader';
  import Divider from 'material-ui/Divider';

  export default class Question extends React.Component{

  constructor(props){
  super(props);
  this.state={open:false,
              statement:"",
              options:[],
              noOfOptions:2,
              correctOption:"",
              deleteOpen:false,
              deleteQn:"",
              deleteOptions:[],
              launchQns:[],
              launchQnCount:0,
              launchOpen:false,
              startDate:new Date(),
              startTime:new Date(),
              endTime:new Date(),
              selectedQuestionsOpen:false,
              editOpen:false,
              editQn:"",
              editOptions:[],
              editedQn:""
            }
  this.handleAddQuestions=this.handleAddQuestions.bind(this);
  this.handleSubmit=this.handleSubmit.bind(this);
  this.handleClose=this.handleClose.bind(this);
  this.handleAddOptions=this.handleAddOptions.bind(this);
  this.handleOptionChange=this.handleOptionChange.bind(this);
  this.handleQuestionChange=this.handleQuestionChange.bind(this);
  this.handleCheck=this.handleCheck.bind(this);
  this.handleDelete=this.handleDelete.bind(this);
  this.handleDeleteClose=this.handleDeleteClose.bind(this);
  this.handleDeleteSubmit=this.handleDeleteSubmit.bind(this);
  this.handleAddToLaunch=this.handleAddToLaunch.bind(this);
  this.handleLaunchOpen=this.handleLaunchOpen.bind(this);
  this.handleDateChange=this.handleDateChange.bind(this);
  this.handleStartTimeChange=this.handleStartTimeChange.bind(this);
  this.handleEndTimeChange=this.handleEndTimeChange.bind(this);
  this.handleLaunchQuiz=this.handleLaunchQuiz.bind(this);
  this.handleExpandChange=this.handleExpandChange.bind(this);
  this.handleViewSelectedQuestions=this.handleViewSelectedQuestions.bind(this);
  this.handleEdit=this.handleEdit.bind(this);
  this.handleEditSubmit=this.handleEditSubmit.bind(this);
  this.handleEditQuestionChange=this.handleEditQuestionChange.bind(this);
  this.handleEditOptionChange=this.handleEditOptionChange.bind(this);
  }

  componentDidMount(){

  }

  handleAddQuestions(){
    this.setState({open:true})
  }

  handleSubmit(){
    this.setState({open:false});
    var statement=this.state.statement;
    var options=this.state.options;
    var correct=this.state.correctOption;
    var that=this;
    this.setState({statement:"",options:[],noOfOptions:2,correctOption:""})
    request.post("/quiz/"+this.props.topic+"/"+this.props.subtopic+"/"+this.props.user+"/save").send({statement:statement,options:options,correctOption:correct}).end(function(err,res){
       that.props.addQuestions(JSON.parse(res.text));
    })
  }

  handleClose(){
    this.setState({open:false,launchOpen:false});
    this.setState({statement:"",options:[],editOpen:false,noOfOptions:2,correctOption:""})
  }

  handleAddOptions(){
    var a=this.state.noOfOptions;
    this.setState({noOfOptions:a+1})
  }

  handleOptionChange(i,event){
    var arr=this.state.options;
    arr[i]=event.target.value;
    this.setState({options:arr})
  }

  handleQuestionChange(e){
    this.setState({statement:e.target.value})
  }

  handleCheck(option){
    this.setState({correctOption:option})
  }

  handleDelete(qn,option){
    this.setState({deleteOpen:true,deleteQn:qn,deleteOptions:option})
  }

  handleDeleteClose(){
  this.setState({deleteOpen:false})
  }

  handleDeleteSubmit(){
    this.setState({deleteOpen:false});
    var that=this;
    request.delete("/quiz/"+this.props.topic+"/"+this.props.subtopic+"/"+this.props.user+"/delete").send({statement:this.state.deleteQn}).end(function(err,res){
     that.props.deleteQuestion(that.state.deleteQn,that.state.deleteOptions);
       that.setState({deleteQn:"",deleteOptions:[]})
    })
  }


  handleAddToLaunch(question){
    if(this.state.launchQns.indexOf(question)==-1){
    var arr=this.state.launchQns;
    var count=this.state.launchQnCount;
    arr.push(question);
    this.setState({launchQns:arr,launchQnCount:count+1});
  }
  }

  handleLaunchOpen(){
      this.setState({launchOpen:true})
  }

  handleDateChange(event,date){
      this.setState({startDate:date})
  }

  handleStartTimeChange(event,time){
    this.setState({startTime:time})
  }

  handleEndTimeChange(event,time){
    this.setState({endTime:time})
  }

  handleLaunchQuiz(){
    let that=this;
    that.setState({launchOpen:false})
      request.post("/quiz/launch").send({"topic":this.props.topic,"subtopic":this.props.subtopic,"user":this.props.user,"date":this.state.startDate.getTime(),"startTime":this.state.startTime.getTime(),"endTime":this.state.endTime.getTime(),"questions":this.state.launchQns}).end(function(err,res){

      })
  }

  handleExpandChange(i){
   this.props.expandCard(i);
  }

  handleViewSelectedQuestions(){
    if(this.state.selectedQuestionsOpen){
      this.setState({selectedQuestionsOpen:false})
    }
    else{
      this.setState({selectedQuestionsOpen:true})
    }
  }

  handleEdit(qn,opt){
    let that=this;
    opt.map(function(item,i){
      if(item.value==1){
        that.setState({correctOption:item.opt})
      }
    })
    this.setState({editOpen:true,editQn:qn,editOptions:opt,editedQn:qn});
    }

  handleEditSubmit(){
    let that=this;
    console.log("selected Question:",this.state.editedQn,this.state.editOptions);
    request.put("/quiz/question/edit").send({"topic":this.props.topic,"subtopic":this.props.subtopic,"user":this.props.user,"oldQuestion":this.state.editQn,"newQuestion":this.state.editedQn,"options":this.state.editOptions}).end(function(err,res){
      console.log(res.text);
      that.props.userChange(that.props.user);
      that.setState({editOpen:false})
    })
  }

  handleEditQuestionChange(e){
    this.setState({editedQn:e.target.value})
  }

  handleEditOptionChange(i,e){
    var arr=this.state.editOptions;
    arr[i].opt=e.target.value;
    this.setState({editOptions:arr})
  }

  handleEditCorrectOption(i){
      var arr=this.state.editOptions;
      arr.map(function(item,j){
        if(i==j){
          arr[i].value=1;
        }
        else{
          arr[j].value=0;
        }
      })
      this.setState({editOptions:arr,correctOption:arr[i].opt})
  }

  render(){
  var options=[];
  var that=this;
  for(var i=0;i<this.state.noOfOptions;i++){
   options.push(<div key={i}><input type="radio" checked={this.state.correctOption==this.state.options[i]} onClick={this.handleCheck.bind(this,this.state.options[i])} style={{padding:"0px",margin:"0px",width:"30px"}}/>
   <TextField hintText={"Option "+String.fromCharCode(65+i)} value={this.state.options[i]} onChange={this.handleOptionChange.bind(this,i)}/></div>)
  }
  const actions = [
       <RaisedButton
         label="Cancel"
         onTouchTap={this.handleClose}
         style={{marginRight:"20px"}}
       />,
       <RaisedButton
         label="Submit"
         onTouchTap={this.handleSubmit}
       />,
     ];
  var dialog= <Dialog
            title="Add Questions"
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
          >
          <TextField
               hintText="Question Statement"
               multiLine={true}
               rows={1}
               fullWidth={true}
               onChange={this.handleQuestionChange}
               rowsMax={4}
             /><br />
             {options}
             <IconButton  onClick={this.handleAddOptions}>
       <ContentAdd />
     </IconButton>
            </Dialog>
    const actions1 = [
                 <RaisedButton
                   label="Yes"
                   onTouchTap={this.handleDeleteSubmit}
                   style={{marginRight:"20px"}}
                 />,
                 <RaisedButton
                   label="No"
                   onTouchTap={this.handleDeleteClose}
                 />,
               ];
      var deleteDialog= <Dialog
                      title="Confirm Delete"
                      actions={actions1}
                      modal={false}
                      open={this.state.deleteOpen}
                      onRequestClose={this.handleDeleteClose}
                    >
                    Do you want to confirm delete <b>{this.state.deleteQn}</b> Question ?

                      </Dialog>
var editOption=[];
for(var i=0;i<this.state.editOptions.length;i++){
 editOption.push(<div key={i}><input type="radio" onChange={this.handleEditCorrectOption.bind(this,i)} checked={this.state.correctOption==this.state.editOptions[i].opt} style={{padding:"0px",margin:"0px",width:"30px"}}/>
 <TextField hintText={"Option "+String.fromCharCode(65+i)} onChange={this.handleEditOptionChange.bind(this,i)} value={this.state.editOptions[i].opt}/> </div>)
}
const actions5 = [
     <RaisedButton
       label="Cancel"
       onTouchTap={this.handleClose}
       style={{marginRight:"20px"}}
     />,
     <RaisedButton
       label="Submit"
       onTouchTap={this.handleEditSubmit}
     />,
   ];
var edit= <Dialog
          title="Edit Question"
          actions={actions5}
          modal={false}
          open={this.state.editOpen}
          onRequestClose={this.handleClose}
        >
        <TextField
             hintText="Question Statement"
             value={this.state.editedQn}
             multiLine={true}
             rows={1}
             fullWidth={true}
             onChange={this.handleEditQuestionChange}
             rowsMax={4}
           /><br />
           {editOption}
          </Dialog>
  var display=null;
  var addQn=null;
  var launchQuiz=null;
  var addToLauncher=null;
  var selectedQnView=null;
  if(this.state.launchQns.length>0){
    selectedQnView=  <RaisedButton onClick={this.handleViewSelectedQuestions} style={{position:"absolute",marginTop:"5px",marginLeft:"64%"}} label={"Selected questions : "+this.state.launchQnCount}/>
  }
  else{
    selectedQnView=  <RaisedButton disabled={true} style={{position:"absolute",marginTop:"5px",marginLeft:"64%"}} label={"Selected questions : "+this.state.launchQnCount}/>
  }
  if(this.state.launchQnCount>=5){
  launchQuiz=<RaisedButton onClick={this.handleLaunchOpen} label={"Launch Quiz"} style={{position:"absolute",marginTop:"5px",marginLeft:"86%"}}/>
  }
  else{
  launchQuiz=<RaisedButton disabled={true} label={"Launch Quiz"} style={{position:"absolute",marginTop:"5px",marginLeft:"86%"}}/>
  }
  if(this.props.user==this.props.selectedUser){
    addQn= <div style={{height:"6.6%",backgroundColor:"#f4f4f8",position:"relative"}}>
          <span style={{position:"absolute",marginLeft:"20px",fontSize:"18px",marginTop:"15px"}}><b>{this.props.topic.toUpperCase()} / {this.props.subtopic.toUpperCase()}</b></span>
          <RaisedButton onClick={this.handleAddQuestions} style={{position:"absolute",marginTop:"5px",marginLeft:"45.5%"}} label={"Add New Question"}/>
          {selectedQnView}
          {launchQuiz}
          </div>
  }
  if(this.props.questions.length>0&&this.props.user==this.props.selectedUser){
    display = this.props.questions.map(function(ques,i){
         addToLauncher=<IconButton onClick={that.handleAddToLaunch.bind(that,ques)} tooltip="Add to your quiz" tooltipPosition="bottom-right">
            <AddToQueue />
              </IconButton>


        return(<Card key={i} style={{marginBottom:"5px",backgroundColor:"gainsboro"}} expanded={that.props.expanded[i]} onExpandChange={that.handleExpandChange.bind(that,i)}>
      <CardHeader title={i+1+") "+ques.question} titleStyle={{fontSize:"18px"}} actAsExpander={true} showExpandableButton={true}/>
      <CardText  expandable={true} style={{paddingTop:"0px",paddingBottom:"0px"}} >

        {  ques.option.map(function(opt,j){
          if(opt.value==0){
            return(
              <div key={j} style={{fontSize:"16px",margin:"5px"}}>
                     {String.fromCharCode(65+j)+") "+opt.opt}
                    </div>
                  )
        }
        else{
          return(
            <div key={j} style={{fontSize:"16px",margin:"5px"}}>
                  <b> <em>{String.fromCharCode(65+j)+") "+opt.opt}</em></b>
                  </div>
                )
        }
        })
          }

          <center>

              {addToLauncher}
            <IconButton onClick={that.handleEdit.bind(that,ques.question,ques.option)} tooltip="Edit" tooltipPosition="bottom-right">
              <Create/>
            </IconButton>
            <IconButton onClick={that.handleDelete.bind(that,ques.question,ques.option)} tooltip="Delete" tooltipPosition="bottom-right">
              <Delete />
            </IconButton>
          </center>
          </CardText>
          </Card>
          )
      });

  }
  else if(this.props.questions.length>0&&this.props.user!=this.props.selectedUser){

    addQn= <div style={{height:"6.6%",backgroundColor:"#f4f4f8",position:"relative"}}>
    <span style={{marginLeft:"20px",fontSize:"18px",position:"absolute",marginTop:"15px"}}><b>{this.props.topic.toUpperCase()} / {this.props.subtopic.toUpperCase()}</b></span>
    {selectedQnView}
    {launchQuiz}
      </div>
  display = this.props.questions.map(function(ques,i){

       addToLauncher=<IconButton tooltip="Add to your quiz" tooltipPosition="bottom-right">
          <AddToQueue onClick={that.handleAddToLaunch.bind(that,ques)}/>
            </IconButton>
      return(<Card key={i} style={{marginBottom:"5px",backgroundColor:"gainsboro"}} expanded={that.props.expanded[i]} onExpandChange={that.handleExpandChange.bind(that,i)}>
    <CardHeader title={i+1+") "+ques.question} titleStyle={{fontSize:"18px"}} actAsExpander={true} showExpandableButton={true}/>
    <CardText expandable={true} style={{paddingTop:"0px",paddingBottom:"0px"}} >
      {  ques.option.map(function(opt,j){
        if(opt.value==0){
          return(
            <div key={j} style={{fontSize:"16px",margin:"5px"}}>
                   {String.fromCharCode(65+j)+") "+opt.opt}
                  </div>
                )
      }
      else{
        return(
          <div key={j} style={{fontSize:"16px",margin:"5px"}}>
                <b> <em>{String.fromCharCode(65+j)+") "+opt.opt}</em></b>
                </div>
              )
      }
        })
        }
        <center>
            {addToLauncher}
        </center>
        </CardText>
        </Card>
        )
    });
  }
  else{
    display=<center><br/><br/>{"No Questions yet"}</center>
  }
  const actions2 = [
               <RaisedButton
                 label="Cancel"
                 onTouchTap={this.handleClose}
                 style={{marginRight:"20px"}}
               />,
               <RaisedButton
                 label="Launch"
                 onTouchTap={this.handleLaunchQuiz}
               />,
             ];
  var launchDialog=<Dialog
            title="Launch Quiz"
            actions={actions2}
            modal={true}
            open={this.state.launchOpen}
            onRequestClose={this.handleClose}
          >
            Enter the Quiz Date
            <DatePicker hintText="Date" container="inline" mode="landscape" value={this.state.startDate} onChange={this.handleDateChange} minDate={new Date()} />
            Enter Start time
            <TimePicker hintText="Start Time" value={this.state.startTime} onChange={this.handleStartTimeChange}/>
            Enter End time
            <TimePicker hintText="Start Time" value={this.state.endTime} onChange={this.handleEndTimeChange}/>
          </Dialog>
  return(

  <Paper style={{width:"100%",height:"90vh",margin:"0px",overflowY:"scroll"}}>
  {addQn}
  {display}
  {edit}
  {dialog}
  {deleteDialog}
  {launchDialog}
  <Drawer docked={false} width={600} open={this.state.selectedQuestionsOpen} onRequestChange={this.handleViewSelectedQuestions}>
    <Subheader>Selected Questions</Subheader>
  {
    this.state.launchQns.map(function(item,i){
      return(<div key={i}><MenuItem >{i+1}){item.question}</MenuItem><Divider/></div>)
    })
  }
       </Drawer>
  </Paper>
  )
  }
  }
