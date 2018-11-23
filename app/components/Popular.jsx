import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Loading from './Loading';
import { fetchPopularRepos } from '../utils/api';

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
          onClick={() => onSelect(lang)}
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

const RepoGrid = ({ repos }) => (
  <ul className="popular-list">
    {repos.map(({ name, owner, html_url, stargazers_count }, index) => (
      <li key={name} className="popular-item">
        <div className="popular-rank">#{index + 1}</div>
        <ul className="space-list-items">
          <li>
            <img
              className="avatar"
              src={owner.avatar_url}
              alt={`Avatar for ${owner.login}`}
            />
          </li>
          <li>
            <a
              className="popular-link"
              href={html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {name}
            </a>
          </li>
          <li>@{owner.login}</li>
          <li>{stargazers_count} stars</li>
        </ul>
      </li>
    ))}
  </ul>
);

RepoGrid.propTypes = {
  repos: PropTypes.arrayOf(PropTypes.object).isRequired,
};

class Popular extends Component {
  state = {
    selectedLanguage: 'All',
    repos: null,
  };

  componentDidMount() {
    this.updateLanguage(this.state.selectedLanguage);
  }

  // ? Why not arrow func instead of bind above ?
  // Added class properties plugin to babel
  updateLanguage = async lang => {
    this.setState({
      selectedLanguage: lang,
      repos: null,
    });

    const repos = await fetchPopularRepos(lang);
    this.setState({ repos });
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
          <Loading text={`Loading top repos on GitHub`} />
        ) : (
          <Loading text={`Loading top ${selectedLanguage} repos`} />
        )}
      </div>
    );
  }
}

export default Popular;
