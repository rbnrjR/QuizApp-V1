import React from 'react';
import ReactDom from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Creator from './client/views/creator.jsx';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Router, Route, hashHistory,browserHistory} from 'react-router';
import Cards from './client/components/TopicCards.jsx';
import Home from './client/views/home.jsx';
import Login from './client/views/login.jsx';
import TakeQuiz from './client/views/takeQuiz.jsx';
import LeaderBoard from './client/views/leaderboard.jsx';
import Report from './client/views/report.jsx';

const muiTheme = getMuiTheme({

  raisedButton: {
    color:"#343434",
    textColor:"#ffffff",
    margin:"10px"
  },
  radioButton: {
    checkedColor: "#343434",
    size: 20
  },
  textField: {
      floatingLabelColor: "#343434",
      focusColor: "#343434",
      backgroundColor: 'transparent'
    },
  floatingActionButton: {
       color: "#b3001b",
       iconColor: "#ffffff"
     },
     cardMedia: {
       color: "#90c2e7"
   },
   appBar:{
     color:"#1c0b19"
   }
});

injectTapEventPlugin();
ReactDom.render(<MuiThemeProvider muiTheme={muiTheme}>
                <div style={{padding:"0px",margin:"0px"}}>
                <Router history={hashHistory} >
		                <Route path='/' component={Login} />
                    <Route path='/home/:user' component={Home} />
		                <Route path='/subtopic/:topic/:user' component={Cards}/>
                    <Route path='/creator/:topic/:subtopic/:user' component={Creator}/>
                    <Route path='/take/:topic/:subtopic/:user' component={TakeQuiz}/>
                    <Route path='/leaderboard/:topic/:subtopic/:user' component={LeaderBoard}/>
                    <Route path='/report/:topic/:subtopic/:user' component={Report}/>
              </Router>
                </div>
                </MuiThemeProvider>,document.getElementById("content"));
