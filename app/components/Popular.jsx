import React, { Component } from 'react';

class Popular extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLanguage: 'All',
    };
    // this.updateLanguage = this.updateLanguage.bind(this);
  }

  // ? Why not arrow func instead of bind above ?
  // Added class properties plugin to babel
  updateLanguage = lang => {
    this.setState({
      selectedLanguage: lang,
    });
  };

  render() {
    const languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python'];
    return (
      <ul className="languages">
        {/* Arrow func here as well instead of .map(function() {}, this) */}
        {languages.map(lang => (
          <li
            style={
              lang === this.state.selectedLanguage ? { color: '#d0021b' } : null
            }
            onClick={this.updateLanguage.bind(null, lang)}
            key={lang}
          >
            {lang}
          </li>
        ))}
      </ul>
    );
  }
}

export default Popular;
