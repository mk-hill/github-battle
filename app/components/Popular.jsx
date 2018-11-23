import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Loading from './Loading';
import api from '../utils/api';

const SelectLanguage = ({ onSelect, selectedLanguage }) => {
  const languages = [
    'All',
    'JavaScript',
    'TypeScript',
    'Ruby',
    'Java',
    'CSS',
    'Python',
  ];
  return (
    <ul className="languages">
      {/* Arrow func here as well instead of .map(function() {}, this) */}
      {languages.map(lang => (
        <li
          style={lang === selectedLanguage ? { color: '#d0021b' } : null}
          onClick={onSelect.bind(null, lang)}
          key={lang}
        >
          {lang}
        </li>
      ))}
    </ul>
  );
};

SelectLanguage.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

const RepoGrid = ({ repos }) => {
  return (
    <ul className="popular-list">
      {repos.map((repo, index) => (
        <li key={repo.name} className="popular-item">
          <div className="popular-rank">#{index + 1}</div>
          <ul className="space-list-items">
            <li>
              <img
                className="avatar"
                src={repo.owner.avatar_url}
                alt={`Avatar for ${repo.owner.login}`}
              />
            </li>
            <li>
              <a
                className="popular-link"
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {repo.name}
              </a>
            </li>
            <li>@{repo.owner.login}</li>
            <li>{repo.stargazers_count} stars</li>
          </ul>
        </li>
      ))}
    </ul>
  );
};

RepoGrid.propTypes = {
  repos: PropTypes.arrayOf(PropTypes.object).isRequired,
};

class Popular extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLanguage: 'All',
      repos: null,
    };
    // this.updateLanguage = this.updateLanguage.bind(this);
  }

  componentDidMount() {
    this.updateLanguage(this.state.selectedLanguage);
  }

  // ? Why not arrow func instead of bind above ?
  // Added class properties plugin to babel
  updateLanguage = lang => {
    this.setState({
      selectedLanguage: lang,
      repos: null,
    });
    api.fetchPopularRepos(lang).then(repos => {
      this.setState({ repos });
    });
  };

  render() {
    const { repos, selectedLanguage } = this.state;
    // Using <> instead of React.Fragment
    return (
      <div>
        <SelectLanguage
          onSelect={this.updateLanguage}
          selectedLanguage={selectedLanguage}
        />
        {repos ? (
          <RepoGrid repos={repos} />
        ) : selectedLanguage === 'All' ? (
          <Loading text={`Loading top repos on Github`} />
        ) : (
          <Loading text={`Loading top ${selectedLanguage} repos`} />
        )}
      </div>
    );
  }
}

export default Popular;
