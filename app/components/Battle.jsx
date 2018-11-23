import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import PlayerPreview from './PlayerPreview';

class PlayerInput extends Component {
  state = {
    username: '',
  };

  static propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    label: 'Username',
  };

  handleChange = event => {
    // Apparently need to capture event value before setState
    const value = event.target.value;

    this.setState({ username: value });
  };

  handleSubmit = event => {
    event.preventDefault();

    this.props.onSubmit(this.props.id, this.state.username);
  };

  render() {
    const { username } = this.state;
    const { label } = this.props;
    return (
      <form className="column" onSubmit={this.handleSubmit}>
        <label htmlFor="username" className="header">
          {label}
        </label>
        <input
          type="text"
          id="username"
          placeholder="Github username"
          autoComplete="off"
          value={username}
          onChange={this.handleChange}
        />
        <button type="submit" className="button" disabled={!username}>
          Submit
        </button>
      </form>
    );
  }
}

class Battle extends Component {
  state = {
    playerOneName: '',
    playerTwoName: '',
    playerOneImage: null,
    playerTwoImage: null,
  };

  handleSubmit = (id, username) => {
    this.setState({
      [id + 'Name']: username,
      [id + 'Image']: `https://github.com/${username}.png?size=200`,
    });
  };

  handleReset = id => {
    this.setState({
      [id + 'Name']: '',
      [id + 'Image']: null,
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
      <div style={{ marginTop: '5vh' }}>
        <div className="row">
          {!playerOneName ? (
            <PlayerInput
              id="playerOne"
              label="Player One"
              onSubmit={this.handleSubmit}
            />
          ) : (
            <PlayerPreview avatar={playerOneImage} username={playerOneName}>
              <button
                className="reset"
                onClick={() => this.handleReset('playerOne')}
              >
                Reset
              </button>
            </PlayerPreview>
          )}
          {!playerTwoName ? (
            <PlayerInput
              id="playerTwo"
              label="Player Two"
              onSubmit={this.handleSubmit}
            />
          ) : (
            <PlayerPreview avatar={playerTwoImage} username={playerTwoName}>
              <button
                className="reset"
                onClick={() => this.handleReset('playerTwo')}
              >
                Reset
              </button>
            </PlayerPreview>
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
      </div>
    );
  }
}

export default Battle;
