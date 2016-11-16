import React, { Component, PropTypes } from 'react';

import { Games } from '../api/games.js';

export default class Game extends Component {
  joinGame() {
    // Tasks.remove(this.props.task._id);
    console.log(Games);
    Games.update(this.props.game._id, {
    	$set: {
    		p2ID: Meteor.userId(),
    		p2Username: Meteor.user().username,
    		startedAt: new Date()
    	}
    });
  }
  render() {    
    return (
      <li className='game'>
        <button className="join" onClick={this.joinGame.bind(this)}>
          Join
        </button>
 
        <span className="text">
          <strong>{this.props.game.name}</strong>
        </span>

        <ul>
        	<li>Player 1: {this.props.game.p1Username}</li>
        	<li>Player 2: {this.props.game.p2Username}</li>
        	<li>Created: {this.props.game.endedAt}</li>
        </ul>
      </li>
    );
  }
}

Game.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  game: PropTypes.object.isRequired,
};