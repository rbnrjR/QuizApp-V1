import React from 'react';
import request from 'superagent';
import {List, ListItem,makeSelectable} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

let SelectableList=makeSelectable(List);

export default class User extends React.Component{

constructor(props){
super(props);
this.state={
  users:[]
}
this.handleContributorAdd=this.handleContributorAdd.bind(this);
}

componentWillMount(){
 let that=this;
  request.get("/quiz/"+this.props.topic+"/"+this.props.subtopic).end(function(err,res){
    var a=JSON.parse(res.text);
    a.push("View All");
    that.setState({users:a});
  })
}

handleContributorAdd(){
var that=this;
  request.post("/quiz/addContributors").send({"topic":this.props.topic,"subtopic":this.props.subtopic,"user":this.props.user})
  .end(function(err,res){
    if(!err)
    {
      var arr=that.state.users;
      arr.push(res.text);
       that.setState({users:arr});
    }
    else {
      console.log(err);
    }
  })
}

render(){
let that=this;
var addContributor=null;
if(this.state.users.indexOf(this.props.user)==-1){
  addContributor=<FloatingActionButton mini={true} onClick={this.handleContributorAdd} style={{marginRight:"50px",marginBottom:"20px",bottom:"0",right:"0",position:"fixed",zIndex:"3000"}}>
      <ContentAdd />
    </FloatingActionButton>
}

if(this.state.users.length>0){
var topics=this.state.users.map(function(user,i){
return(
        <ListItem value={user} key={i}
        leftAvatar={
        <Avatar color="#ffffff" backgroundColor="#000000" size={30} style={{marginTop:"4px"}}>
        {user.charAt(0).toUpperCase()}
        </Avatar>
      }
      style={{padding:"0px"}} primaryText={user} onClick={that.props.userChange.bind(that,user)}/>
)
})
}

return(
<div>
   <Subheader>Contributors</Subheader>
   <SelectableList value={this.props.selectedUser} style={{padding:"0px",margin:"0px"}}>
   {topics}
   {addContributor}
   </SelectableList>
</div>
)
}
}
