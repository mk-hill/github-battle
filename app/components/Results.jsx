import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import api from '../utils/api';

import PlayerPreview from './PlayerPreview';

const Profile = props => {
  const { info } = props;
  return (
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
};

const Player = props => {
  const { label, score, profile } = props;
  return (
    <div>
      <h1 className="header">
        {profile.login === 'mk-hill' ? 'Totally Legitimate Winner 🚀' : label}
      </h1>
      <h3>Score: {score}</h3>

      <Profile info={profile} />
    </div>
  );
};

Player.propTypes = {
  label: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  profile: PropTypes.object.isRequired,
};

class Results extends Component {
  constructor(props) {
    super(props);

    this.state = {
      winner: null,
      loser: null,
      error: null,
      loading: true,
    };
  }

  componentDidMount = () => {
    const players = queryString.parse(this.props.location.search);
    api.battle([players.playerOneName, players.playerTwoName]).then(results => {
      if (results === null) {
        return this.setState({
          error: 'Something went wrong. Check that both uses exist on Github.',
          loading: false,
        });
      }
      return this.setState({
        error: null,
        winner: results[0],
        loser: results[1],
        loading: false,
      });
    });
  };

  render() {
    const { winner, loser, error, loading } = this.state;

    if (loading) return <p>Loading</p>;

    if (error) {
      return (
        <div>
          <p>{error}</p>
          <Link to="/battle">Reset</Link>
        </div>
      );
    }
    return (
      <>
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
      </>
    );
  }
}

export default Results;
