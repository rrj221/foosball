import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
 
import { Tasks } from '../api/tasks.js';
import { Games } from '../api/games.js';
 
import Task from './Task.jsx';
import Game from './Game.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
 
// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      hideCompleted: false,
    };
  }

  handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
 
    Tasks.insert({
      text,
      createdAt: new Date(), // current time
      owner: Meteor.userId(),           // _id of logged in user
      username: Meteor.user().username,  // username of logged in user
    });
 
    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  handleSubmitCreate(event) {
    event.preventDefault();

    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    console.log(text);

    Games.insert({
      name: text,
      createdAt: new Date(),
      p1ID: Meteor.userId(),
      p1Username: Meteor.user().username,
      p2ID: '',
      p2Username: '',
      startedAt: '',
      endedAt: '',
      winner: '',
    });

    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }
 
  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }

  renderGames() {
    let games = this.props.games;
    return games.map((game) => (
      <Game key={game._id} game={game} />
    ));
  }
 
  render() {
    return (
      <div className="container">
        <header>

          <h1>FoosBalls</h1>

          <AccountsUIWrapper />

          { this.props.currentUser ?
            <form className="new-task" onSubmit={this.handleSubmitCreate.bind(this)} >
              <input
                type="text"
                ref="textInput"
                placeholder="New Game Name"
              />
              <button type='submit' >Create Game</button>
            </form> : ''
          }
        </header>
 
        <ul>
          {this.renderGames()}
        </ul>
      </div>
    );
  }
}

App.propTypes = {
  games: PropTypes.array.isRequired,
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
};
 
export default createContainer(() => {
  return {
    games: Games.find({}, { sort: { createdAt: -1 } }).fetch(),
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
}, App);