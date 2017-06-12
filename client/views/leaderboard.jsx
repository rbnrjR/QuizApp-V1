import React from 'react';
import Paper from 'material-ui/Paper';
import request from 'superagent';
import Avatar from 'material-ui/Avatar';
import SwipeableViews from 'react-swipeable-views';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import {autoPlay} from 'react-swipeable-views-utils';
import School from 'material-ui/svg-icons/social/school';
import IconButton from 'material-ui/IconButton';
import AppBar from 'material-ui/AppBar';
import {Link} from 'react-router';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);


export default class LeaderBoard extends React.Component{

  constructor(props){
      super(props);
      this.state={
        data:[],
        max:0
      }
  }

  componentDidMount(){
    var that=this;
      request.get("/quiz/leaderboard/"+that.props.params.topic+"/"+that.props.params.subtopic).end(function(err,res){
        that.setState({data:JSON.parse(res.text).data,max:JSON.parse(res.text).max})
      })

  }

  render(){
   var that=this;
   var leaders=[];
   var list=null;
   var rank=1;
   var score=100000;
   list=this.state.data.map(function(item,i){
     if(item.score==that.state.max){
       leaders.push(<div key={i} style={{color:"#ffffff"}}>
         <center>
         <Avatar size={100}>{item.name.charAt(0)}</Avatar>
         <br/>
         <br/>
         <h3>{item.name}</h3><br/>
         </center>
         </div>)
     }
     else{
       if(item.score<score){
         rank++;
         score=item.score;
       }
       return(
         <TableRow key={i}>
        <TableRowColumn>{rank}</TableRowColumn>
        <TableRowColumn>{item.name}</TableRowColumn>
        <TableRowColumn>{item.score}</TableRowColumn>
      </TableRow>
       )
     }
   })
    return(
      <div>
      <AppBar
          title={<span>MyQuiz</span>}
          iconElementLeft={<Link to={'/home/'+this.props.params.user}><IconButton><img src="https://media.licdn.com/mpr/mpr/shrink_100_100/AAEAAQAAAAAAAAzgAAAAJDc2OTQ1OGZhLThmN2QtNGZiOC05MzM0LTlhMTRjNzQ1ZjIxYg.png " height="33" className="logo"/></IconButton></Link>}

        />
      <Paper style={{height:"500px",width:"300px",marginTop:"120px",marginLeft:"150px",float:"left",backgroundColor:"#673AB7"}} zDepth={5}>
      <center>
      <IconButton iconStyle={{height:"150px",width:"150px"}} style={{height:"200px",width:"200px"}}>
      <School />
      </IconButton>
      <AutoPlaySwipeableViews>
      {leaders}
      </AutoPlaySwipeableViews>
       <h3 style={{color:"#ffffff"}}>{this.state.max} Points</h3>
       </center>
      </Paper>
      <Paper style={{height:"700px",width:"600px",marginLeft:"410px"}} zDepth={2}>
      <Table selectable={false}>
  <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
    <TableRow>
      <TableHeaderColumn>Rank</TableHeaderColumn>
      <TableHeaderColumn>Name</TableHeaderColumn>
      <TableHeaderColumn>Points</TableHeaderColumn>
    </TableRow>
  </TableHeader>
  <TableBody displayRowCheckbox={false}>
  {list}
  </TableBody>
  </Table>
      </Paper>
      </div>
    )
  }
}
