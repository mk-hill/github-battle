import axios from 'axios';

const id = '';
const sec = '';

const params = `?client_id=${id}&client_secret=${sec}`;

const getProfile = username =>
  axios
    .get(`https://api.github.com/users/${username}${params}`)
    .then(user => user.data);

const getRepos = username =>
  axios.get(
    `https://api.github.com/users/${username}/repos${params}&per_page=100`
  );

const getStarCount = repos =>
  repos.data.reduce((count, repo) => count + repo.stargazers_count, 0);

const calculateScore = (profile, repos) => {
  const followers = profile.followers;
  const totalStars = getStarCount(repos);

  return followers * 3 + totalStars;
};

const handleError = error => {
  console.log(error);
  return null;
};

const getUserData = player =>
  axios.all([getProfile(player), getRepos(player)]).then(data => {
    const profile = data[0];
    const repos = data[1];

    return {
      profile,
      score: calculateScore(profile, repos),
    };
  });

const sortPlayers = players => players.sort((a, b) => b.score - a.score);

const api = {
  fetchPopularRepos(language) {
    const encodedURI = window.encodeURI(
      `https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`
    );

    return axios.get(encodedURI).then(res => res.data.items);
  },

  battle(players) {
    return axios.all(players.map(getUserData)).then(sortPlayers);
  },
};

export default api;
