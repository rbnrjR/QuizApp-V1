import React from 'react';
import request from 'superagent';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import {Grid,Row,Col} from 'react-flexbox-grid/lib';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import KeyboardArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import KeyboardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import SwipeableViews from 'react-swipeable-views';
import {GridList, GridTile} from 'material-ui/GridList';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Paginator from 'react-pagify';
import segmentize from 'segmentize';
import Subheader from 'material-ui/Subheader';
import {Link,hashHistory} from 'react-router';


const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 400,
    overflowY: 'auto',
  },
};


export default class TakeQuiz extends React.Component{

  constructor(props){
    super(props);
    this.state={
      hostedBy:[],
    quizData:[],
    options:[],
    result:"",
    correctAnswer:[],
    selectedAnswer:[],
    index:0,
    centerSlideIndex:0,
    firstSlideIndex:0,
    lastSlideIndex:1,
    index:0,
    defaultColor:"#dae2e8",

    selectedColor:"#607D8B",
    activePage:15,

    selectedColor:"#607D8B"

}
    this.handleSelectAnswer=this.handleSelectAnswer.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
    this.handlePrevious=this.handlePrevious.bind(this);
    this.handleNext=this.handleNext.bind(this);
    this.indexHandleChange=this.indexHandleChange.bind(this);
    this.centerHandleChange=this.centerHandleChange.bind(this);
    this.firstHandleChange=this.firstHandleChange.bind(this);
    this.lastHandleChange=this.lastHandleChange.bind(this);
    this.onChangePage=this.onChangePage.bind(this);
    this.handleSelectUser=this.handleSelectUser.bind(this);
    }

  componentDidMount(){
    var that=this;
    request.get("/quiz/"+this.props.params.topic+"/"+this.props.params.subtopic+"/checkAvailability").end(function(err,res){
      console.log('res -- > ',res.text);
      console.log('status -- > ',JSON.parse(res.text).status);
      if (JSON.parse(res.text).status==="true") {
        that.setState({hostedBy:JSON.parse(res.text).launchQuizUsers});
        console.log('hostedBy in didMount',JSON.parse(res.text).launchQuizUsers);
      }
      else if (res.text==="false") {
        that.setState({quizdata:[]});
        console.log('inside false');
      }
		});
  }

  onChangePage() {
    console.log('page changed');
  }

  handleSelectAnswer(index,option){
    //console.log(index,option);
    var a=this.state.selectedAnswer;
    a[index]=option;
    this.setState({selectedAnswer:a});
    this.indexHandleChange("next");
  }

handleSubmit(){
this.setState({quizData:[]});
var that=this;
  request.post("/quiz/"+this.props.params.topic+"/"+this.props.params.subtopic+"/"+this.props.params.user+"/validate").send({"selectedanswers":this.state.selectedAnswer}).set('Accept', 'application/json').end(function(err,res){
    that.setState({selectedAnswer:[]});
    console.log(res.text);
    hashHistory.push("/report/"+that.props.params.topic+"/"+that.props.params.subtopic+"/"+that.props.params.user);
  })
}

handlePrevious(){
    var a=this.state.index;
    this.setState({index:a-1})
}

handleNext(){
  var a=this.state.index;
  this.setState({index:a+1})
}

indexHandleChange(value){
  if(value=="prev"){
    if(this.state.centerSlideIndex==0){
      this.setState({centerSlideIndex:this.state.quizData.length-1})
    }
    else{
    var a=this.state.centerSlideIndex;
    this.setState({centerSlideIndex:a-1})
  }
    if(this.state.firstSlideIndex==0){
      this.setState({firstSlideIndex:this.state.quizData.length-1})
    }
    else{
      var a=this.state.firstSlideIndex;
      this.setState({firstSlideIndex:a-1})
    }
    if(this.state.lastSlideIndex==0){
      this.setState({lastSlideIndex:this.state.quizData.length-1})
    }
    else{
      var a=this.state.lastSlideIndex;
      this.setState({lastSlideIndex:a-1})
    }
  }
  else if(value=="next"){
    if(this.state.centerSlideIndex==this.state.quizData.length-1){
      this.setState({centerSlideIndex:0})
    }
    else{
    var a=this.state.centerSlideIndex;
    this.setState({centerSlideIndex:a+1})
  }
  if(this.state.firstSlideIndex==this.state.quizData.length-1){
    this.setState({firstSlideIndex:0})
  }
  else{
    var a=this.state.firstSlideIndex;
    this.setState({firstSlideIndex:a+1})
  }
  if(this.state.lastSlideIndex==this.state.quizData.length-1){
    this.setState({lastSlideIndex:0})
  }
  else{
    var a=this.state.lastSlideIndex;
    this.setState({lastSlideIndex:a+1})
  }
}
}

centerHandleChange(value){
  this.setState({centerSlideIndex:value})
}

firstHandleChange(value){
  this.setState({firstSlideIndex:value})
}

lastHandleChange(value){
  this.setState({lastSlideIndex:value})
}

handleSelectUser(item,e){
  var that=this;
  request.get("/quiz/"+this.props.params.topic+"/"+this.props.params.subtopic+"/"+item+"/take").end(function(err, res){
    that.setState({quizData:JSON.parse(res.text),firstSlideIndex:JSON.parse(res.text).length-1});
    console.log('out');
  });
}

  render(){
  var score=null;
  var that=this;
  if(this.state.result!=""){
    score=this.state.result;
  }
    var display=null;
    var that=this;
    var first=[];
    var center=[];
    var last=[];
    var pagenation=null;
    var submit=null;
    if(this.state.selectedAnswer.length==this.state.quizData.length){
      submit=<Link to={"report/"+this.props.params.topic+"/"+this.props.params.subtopic+"/"+this.props.params.user}><RaisedButton style={{width:"100%"}} onClick={this.handleSubmit} label="Submit"/>
      </Link>
    }
    else{
      submit=<RaisedButton style={{width:"100%"}} disabled={true} onClick={this.handleSubmit} label="Submit"/>

    }
    if(this.state.quizData.length>0){
          this.state.quizData.map(function(data,i){
              first.push(<div key={i} value={i} style={{overflow:"hidden"}}>
                            <center>
                            <h4>Question:{i+1}/{that.state.quizData.length}</h4>
                            <h3 style={{marginTop:"10%",marginBottom:"1%"}}>{data.question}</h3>
                            </center>
                          </div>)
      })

    this.state.quizData.map(function(data,i){
              last.push(<div key={i} value={i} style={{overflow:"hidden"}}>
                            <center>
                            <h4>Question:{i+1}/{that.state.quizData.length}</h4>
                            <h3>{data.question}</h3>
                            </center>
                          </div>)
    })

  this.state.quizData.map(function(data,i){
            center.push(<div value={i} key={i} style={{overflow:"hidden"}}>
                          <center>
                          <h4>Question:{i+1}/{that.state.quizData.length}</h4>
                          <h3 style={{backgroundColor: "#000000",color: "#fff",fontWeight: "bold",padding: "10px",borderRadius: "2px"}}>{data.question}</h3>  </center>
                          <div style={styles.root}>
                          <h4 style={{left:"0"}}>Options</h4>
                          <List style={styles.gridList} cols={1} className={"list"}>
                          {that.state.quizData[i].options.map(function(option,j){
                          return(<center key={j}><ListItem className={"listItem"} onClick={that.handleSelectAnswer.bind(that,i,option,that.state.defaultColor)} primaryText={option} style={{marginBottom:"5px",backgroundColor:that.state.defaultColor}} key={j} /></center>)
                               })}
                          </List>
                          </div>
                        </div>)
    })
      display=<Grid>
                <Row>
                <Col lg={2} >
                <FloatingActionButton backgroundColor="#000000" style={{marginTop:"150%",marginLeft:"10px"}} onClick={this.indexHandleChange.bind(this,"prev")}>
                            <KeyboardArrowLeft />
                 </FloatingActionButton>
                </Col>
                <Col lg={2} style={{padding:"0px",marginTop:"6%"}}>
                <Paper style={{height:"50vh",width:"100%",overflow:"hidden",opacity:"0.3"}} zDepth={1} >
                <SwipeableViews index={this.state.firstSlideIndex} onChangeIndex={this.firstHandleChange}>
                {first}
                </SwipeableViews>
                </Paper>
                </Col>
                <Col lg={4} style={{padding:"0px",marginTop:"3%"}}>
                <Paper style={{height:"60vh",width:"100%",overflow:"hidden",backgroundColor:"#c16d30"}} zDepth={5}>
                <SwipeableViews index={this.state.centerSlideIndex} onChangeIndex={this.centerHandleChange}>
                {center}
                </SwipeableViews>
                </Paper>
                </Col>
                <Col lg={2} style={{padding:"0px",marginTop:"6%"}}>
                <Paper style={{height:"50vh",width:"100%",overflow:"hidden",opacity:"0.3"}} zDepth={1} >
                <SwipeableViews index={this.state.lastSlideIndex} onChangeIndex={this.lastHandleChange}>
                {last}
                </SwipeableViews>
                </Paper>
                </Col>
                <Col lg={2}>
                <FloatingActionButton backgroundColor="#000000" style={{marginTop:"150%",marginLeft:"60%"}} onClick={this.indexHandleChange.bind(this,"next")}>
                           <KeyboardArrowRight />
                </FloatingActionButton>
                </Col>
                </Row>
                <Row style={{marginTop:"3%"}}>
                <Col lg={2}></Col>
                <Col lg={2}></Col>
                <Col lg={4} style={{padding:"0px"}}>
                {submit}
                </Col>
                <Col lg={2}></Col>
                <Col lg={2}></Col>
                </Row>
              </Grid>
    }
    else if (this.state.hostedBy.length>0) {
      let that = this;
      var disp = that.state.hostedBy.map(function(item, i){
        return (
          <div key={i}><ListItem value={item}  primaryText={item} onClick={that.handleSelectUser.bind(that,item)} />
          <Divider/>
          </div>
        );
      });
      display =
      <center>
      <Paper style={{width:"50%",marginTop:"5%"}}>
      <Subheader>Select any one of the host to take quiz</Subheader>
      <List>
        {disp}
      </List>
      </Paper>
      </center>
    }
    else {
      display =
      <center>
      <Paper style={{height:"100px",width:"50%",overflow:"hidden", marginTop:"10%",fontSize:"24px"}} zDepth={1} >
      <br/>
        <center><b>No quiz is live under this topic</b></center>
      </Paper>
      </center>
    }

    return(
      <div>
        <AppBar
            title={<span>MyQuiz</span>}
            iconElementLeft={<IconButton><img src="https://media.licdn.com/mpr/mpr/shrink_100_100/AAEAAQAAAAAAAAzgAAAAJDc2OTQ1OGZhLThmN2QtNGZiOC05MzM0LTlhMTRjNzQ1ZjIxYg.png " height="33" className="logo"/></IconButton>}

          />
        <h3 style={{color:"#ffffff",marginLeft:"20px"}}>{this.props.params.topic.toUpperCase()} / {this.props.params.subtopic.toUpperCase()}</h3>
        {display}
        <br/>
        <br/>
        {score}
        <br/>


      </div>
    );
  }
}

// if(this.state.quizData.length>0){
//   display=<Card style={cardstyle}>{this.state.quizData.map(function(item,i){
//     return(
//       <Paper style={paperstyle} zDepth={2} rounded={false}
//         key={i}><p style={questyle}>{item.question}</p>
//         {item.options.map(function(option,j){
//         return(<div key={j}><input type="radio" value={option} checked={that.state.selectedAnswer[i]==option} onClick={that.handleSelectAnswer.bind(that,i,option)}/><span style={optstyle}>{option}</span></div>)
//         })}
//         <br />
//       </Paper>
//     );
//   })}
//   <br />
//   <br />
//   <center><RaisedButton
//             backgroundColor="#C5D86D"
//             onClick={this.handleSubmit}
//           >Submit</RaisedButton></center>
//   </Card>
// }
//
//
// display=<Grid>
//         <Row>
//         <Col lg={1}>
//         <FloatingActionButton backgroundColor="#000000" style={{marginTop:"200%",marginLeft:"10px"}} onClick={this.handlePrevious}>
//             <KeyboardArrowLeft />
//           </FloatingActionButton>
//         </Col>
//         <Col lg={10} style={{height:"50vh"}}>
//             <Card style={{width:"100%",height:"100%",marginTop:"3%"}}>
//               <CardHeader title={<h2>{"Question"+this.state.index+1}</h2>}/>
//               <CardText>
//               <h3>{this.state.quizData[this.state.index].question}</h3>
//               {this.state.quizData[this.state.index].options.map(function(option,j){
//                return(<div key={j}><RadioButton value={option} checked={that.state.selectedAnswer[that.state.index]==option} onClick={that.handleSelectAnswer.bind(that,that.state.index,option)} label={option}/></div>)
//                  })}
//               </CardText>
//             </Card>
//         </Col>
//         <Col lg={1}>
//         <FloatingActionButton backgroundColor="#000000" style={{marginTop:"200%"}} onClick={this.handleNext}>
//             <KeyboardArrowRight />
//           </FloatingActionButton>
//         </Col>
//         </Row>
//         <Row style={{marginTop:"100px"}}>
//           {
//           this.state.quizData.map(function(data,i){
//                return(<Col lg={1} key={i}>
//                  <RaisedButton label={i+1}/>
//                </Col>)
//            })
//          }
//         </Row>
//         <Row style={{marginTop:"100px"}}>
//           <center><RaisedButton
//                     onClick={this.handleSubmit} label="Submit"/></center>
//         </Row>
//         </Grid>
