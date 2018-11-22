import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const PlayerPreview = props => {
  const { id, avatar, username, onReset } = props;
  return (
    <div>
      <div className="column">
        <img src={avatar} alt={username} className="avatar" />
        <h2 className="username">@{username}</h2>
      </div>
      <button className="reset" onClick={onReset.bind(null, id)}>
        Reset
      </button>
    </div>
  );
};

PlayerPreview.propTypes = {
  id: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  onReset: PropTypes.func.isRequired,
};

class PlayerInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
    };
  }

  handleChange = event => {
    const value = event.target.value;

    this.setState({ username: value });
  };

  handleSubmit = event => {
    event.preventDefault();

    this.props.onSubmit(this.props.id, this.state.username);
  };

  render() {
    return (
      <form className="column" onSubmit={this.handleSubmit}>
        <label htmlFor="username" className="header">
          {this.props.label}
        </label>
        <input
          type="text"
          id="username"
          placeholder="Github username"
          autoComplete="off"
          value={this.state.username}
          onChange={this.handleChange}
        />
        <button
          type="submit"
          className="button"
          disabled={!this.state.username}
        >
          Submit
        </button>
      </form>
    );
  }
}

PlayerInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

class Battle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playerOneName: '',
      playerTwoName: '',
      playerOneImage: null,
      playerTwoImage: null,
    };

    // this.handleSubmit = this.handleSubmit.bind(this);
    // this.handleReset = this.handleSubmit.bind(this);
  }

  handleSubmit = (id, username) => {
    this.setState(() => {
      const newState = {};
      newState[`${id}Name`] = username;
      newState[`${id}Image`] = `https://github.com/${username}.png?size=200`;
      return newState;
    });
  };

  handleReset = id => {
    this.setState(() => {
      const newState = {};
      newState[`${id}Name`] = '';
      newState[`${id}Image`] = null;
      return newState;
    });
  };

  render() {
    const {
      playerOneName,
      playerOneImage,
      playerTwoName,
      playerTwoImage,
    } = this.state;
    // Getting match prop from router
    const { match } = this.props;
    return (
      <>
        <div className="row">
          {!playerOneName ? (
            <PlayerInput
              id="playerOne"
              label="Player One"
              onSubmit={this.handleSubmit}
            />
          ) : (
            <PlayerPreview
              id="playerOne"
              avatar={playerOneImage}
              username={playerOneName}
              onReset={this.handleReset}
            />
          )}
          {!playerTwoName ? (
            <PlayerInput
              id="playerTwo"
              label="Player Two"
              onSubmit={this.handleSubmit}
            />
          ) : (
            <PlayerPreview
              id="playerTwo"
              avatar={playerTwoImage}
              username={playerTwoName}
              onReset={this.handleReset}
            />
          )}
        </div>
        {playerOneImage && playerTwoImage ? (
          <Link
            className="button"
            to={{
              pathname: `${match.url}/results`,
              search: `?playerOneName=${playerOneName}&playerTwoName=${playerTwoName}`,
            }}
          >
            Battle
          </Link>
        ) : null}
      </>
    );
  }
}

export default Battle;
