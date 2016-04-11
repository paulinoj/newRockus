import _ from 'lodash';
import React from 'react';
import styles from './App.css';
import AnswerBar from './components/answer_bar';
import MusicPlayerGroup from './components/music_player_group';
import soundcloud from '../soundcloud.config.js';

export default class App extends React.Component {
  constructor(props) {
    super(props);    
    this.state = {test: 'foo'};
  }

  check(answer) {
    // if user guesses a song correctly make corresponding music player stop playing
    // and calculate points
    console.log(answer);
  }

  render() {
    // Not sure want to throttle answer checking -- will effect scoring
    const answerCheck = _.debounce((answer) => { this.check(answer) }, 300);

    const musicList = 
      [`https://api.soundcloud.com/tracks/25278226/stream?client_id=${soundcloud.key}`,
       `https://api.soundcloud.com/tracks/251024523/stream?client_id=${soundcloud.key}`,
       `https://api.soundcloud.com/tracks/77862534/stream?client_id=${soundcloud.key}`,
       `https://api.soundcloud.com/tracks/30396474/stream?client_id=${soundcloud.key}`]

    return (
      <div className={styles.app}>
        <AnswerBar onAnswerChange={answerCheck}/>
        <MusicPlayerGroup musicList={musicList} />
      </div>
    );
  }
}
