import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';

export default class QuizAppBar extends React.Component
{
  render()
  {
    return(
      <AppBar
          title={<span>MyQuiz</span>}
          iconElementLeft={<Link to={'/home/'+this.props.user}><IconButton><img src="https://media.licdn.com/mpr/mpr/shrink_100_100/AAEAAQAAAAAAAAzgAAAAJDc2OTQ1OGZhLThmN2QtNGZiOC05MzM0LTlhMTRjNzQ1ZjIxYg.png " height="33" className="logo"/></IconButton></Link>}
          iconElementRight={<Link to={'/leaderboard/'+"overall/"+"overall/"+this.props.user}><FlatButton label="Leader Board" style={{color:"#ffffff"}}/></Link>}
        />
    );
  }
}
