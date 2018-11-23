const id = '';
const sec = '';

const params = `?client_id=${id}&client_secret=${sec}`;

const getProfile = async username => {
  const response = await fetch(
    `https://api.github.com/users/${username}${params}`
  );
  return response.json();
};

// const getProfile = async username =>
//   ({ data } = await axios.get(
//     `https://api.github.com/users/${username}${params}`
//   ));

const getRepos = async username => {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos${params}&per_page=100`
  );
  return response.json();
};

const getStarCount = repos =>
  repos.reduce((count, { stargazers_count: current }) => count + current, 0);

const calculateScore = ({ followers, login }, repos) => {
  const boost = login === 'mk-hill' ? 9000 : 0;
  return followers * 3 + getStarCount(repos) * 2 + repos.length + boost;
};

const handleError = error => {
  console.log(error);
  return null;
};

const getUserData = async player => {
  const [profile, repos] = await Promise.all([
    getProfile(player),
    getRepos(player),
  ]);

  return {
    profile,
    score: calculateScore(profile, repos),
  };
};

const sortPlayers = players => players.sort((a, b) => b.score - a.score);

export async function fetchPopularRepos(language) {
  const encodedURI = window.encodeURI(
    `https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`
  );

  const response = await fetch(encodedURI).catch(handleError);
  const repos = await response.json();

  return repos.items;
}

export async function battle(players) {
  const results = await Promise.all(players.map(getUserData)).catch(
    handleError
  );
  return results === null ? results : sortPlayers(results);
}
