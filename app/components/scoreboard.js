import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from '../css/scoreboard.css';

class Scoreboard extends Component {
  constructor(props) {
    super(props);
  }

  renderScore() {
    if (this.props.gameOver) {
      return (
        <div className={styles.score}>
          <div className={styles.center}>Game Over</div>
          <div className={styles.center}>{this.props.userName}'s Score:  {this.props.score}</div>
        </div>
      )
    }
  }

  renderHighScorers() {
    var musicListHighScorers = this.props.musicListHighScorers;
    var score = this.props.score;
    var currentPlayerStats = {email: this.props.userName, score: score};
    var statsAdded = false;
    for (var i = 0; i < musicListHighScorers.length; i++) {
      if (score >= musicListHighScorers[i].score) {
        musicListHighScorers.splice(i, 0, currentPlayerStats);
        statsAdded = true;
        musicListHighScorers.length = Math.min(10, musicListHighScorers.length);
        break;
      }
    }
    if (musicListHighScorers.length < 10 && !statsAdded) {
      musicListHighScorers.push(currentPlayerStats);
    }
    if (musicListHighScorers.length !== 0) {
      let list = musicListHighScorers.map((player) => {
        if (player) {
          return (
            <div className={styles.tableWidth} key={player.email}>
              <table >
                <tbody>
                  <tr>
                    <td className={styles.column1}>{player.email}</td>
                    <td className={styles.column2}>{player.score}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )
        }
      });

      if (this.props.gameOver) {
        return (
          <div className={styles.highScorers}>
            <div className={styles.centerHeading}>High Scorers For This Mix:</div>
            <div className={styles.highScorersList}>
              {list}
            </div>
          </div>
        );
      }
    }
  }

  render() {
    return (
      <div className={styles.scoreboard}>
          {this.renderScore()}
          {this.renderHighScorers()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { score : state.score,
           musicListHighScorers: state.musicListHighScorers,
           userName: state.userName }
}

export default connect(mapStateToProps)(Scoreboard);

