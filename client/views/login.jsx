import React from 'react';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';


export default class Login extends React.Component{

constructor(props){
super(props);
this.state={name:""}
this.handleNameChange=this.handleNameChange.bind(this);
}

handleNameChange(e){
  this.setState({name:e.target.value})
}

render(){
return(
<div>
  <AppBar
      title={<span>MyQuiz</span>}
      iconElementLeft={<IconButton><img src="https://media.licdn.com/mpr/mpr/shrink_100_100/AAEAAQAAAAAAAAzgAAAAJDc2OTQ1OGZhLThmN2QtNGZiOC05MzM0LTlhMTRjNzQ1ZjIxYg.png " height="33" className="logo"/></IconButton>}
    />
    <center>
    <Paper style={{width:"700px"}}>
      <h2>LOGIN</h2>
      <br/>
      <TextField
      hintText="User Name"
      value={this.state.name}
      onChange={this.handleNameChange}
    />
    <br/>
    <br/>
    <Link to={"/home/"+this.state.name}><RaisedButton label="Login"/></Link>
    <br/>
    <br/>
    <br/>
    </Paper>
    </center>
</div>
)
}
}
