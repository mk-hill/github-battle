import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { battle } from '../utils/api';

import PlayerPreview from './PlayerPreview';
import Loading from './Loading';

const Profile = ({ info }) => (
  <PlayerPreview avatar={info.avatar_url} username={info.login}>
    <ul className="space-list-items">
      {info.name ? <li>{info.name}</li> : null}
      {info.location ? <li>{info.location}</li> : null}
      {info.company ? <li>{info.company}</li> : null}
      <li>Followers: {info.followers}</li>
      <li>Following: {info.following}</li>
      <li>Public Repos: {info.public_repos}</li>
      {info.blog ? (
        <li>
          <a href={info.blog}>{info.blog}</a>
        </li>
      ) : null}
    </ul>
  </PlayerPreview>
);

const Player = ({ label, score, profile }) => (
  <div>
    <h1 className="header">
      {profile.login === 'mk-hill' ? 'Totally Legitimate Winner 🚀' : label}
    </h1>
    <h3>Score: {score}</h3>

    <Profile info={profile} />
  </div>
);

Player.propTypes = {
  label: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  profile: PropTypes.object.isRequired,
};

class Results extends Component {
  state = {
    winner: null,
    loser: null,
    error: null,
    loading: true,
  };

  componentDidMount = async () => {
    const { playerOneName, playerTwoName } = queryString.parse(
      this.props.location.search
    );
    const players = await battle([playerOneName, playerTwoName]);

    if (players === null) {
      return this.setState({
        error: 'Something went wrong. Check that both users exist on Github.',
        loading: false,
      });
    }

    return this.setState({
      error: null,
      winner: players[0],
      loser: players[1],
      loading: false,
    });
  };

  render() {
    const { winner, loser, error, loading } = this.state;

    if (loading) return <Loading text="Battling" />;

    if (error) {
      return (
        <div>
          <p>{error}</p>
          <Link to="/battle">Reset</Link>
        </div>
      );
    }
    return (
      <div className="content">
        <div className="row">
          <Player
            label="Winner"
            score={winner.score}
            profile={winner.profile}
          />
          <Player label="Loser" score={loser.score} profile={loser.profile} />
        </div>
        <Link className="button" to="/battle">
          Reset
        </Link>
      </div>
    );
  }
}

export default Results;
