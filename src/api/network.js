import axios from 'axios';

export const token =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwM2M5MzRiOWMwNDllZjU0ZWFhYzhhNWM2MjNmZGNhNCIsInN1YiI6IjY1ZGIwNzE4NjJmMzM1MDE3YzRkMGQxYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SCC3Ww2JJcqSljzFlhzUwVyBg5PBl5D-XNZaZWHa1fw';

const searcConfig = {
  baseURL: 'https://api.themoviedb.org/3',
  token,
};

const config = {
  baseURL: 'https://api.themoviedb.org/3/movie',
  token,
};
const tvConfig = {
  baseURL: `https://api.themoviedb.org/3/tv`,
  headers: {
    Authorization: `Bearer ${config.token}`,
  },
};
const MovieConfig = {
  baseURL: `https://api.themoviedb.org/3/trending/movie/day`,
  headers: {
    Authorization: `Bearer ${config.token}`,
  },
};
const PeopleConfig = {
  baseURL: `https://api.themoviedb.org/3/trending/person/day`,
  headers: {
    Authorization: `Bearer ${config.token}`,
  },
};

export const getUpcomingMovies = async () => {
  try {
    const response = await axios.get(`${config.baseURL}/upcoming`, {
      headers: {
        Authorization: `Bearer ${config.token}`,
      },
    });
    const data = response.data;
    const status = response.status;
    return {success: true, data: data, status: status};
  } catch (error) {
    console.log(error);
    return {success: false, data: error};
  }
};

export const getNowPlayingMovies = async () => {
  try {
    const response = await axios.get(`${config.baseURL}/now_playing`, {
      headers: {
        Authorization: `Bearer ${config.token}`,
      },
    });
    const data = response.data;
    const status = response.status;
    return {success: true, data: data, status: status};
  } catch (error) {
    console.log(error);
    return {success: false, data: error};
  }
};
export const getTopRatedMovies = async () => {
  try {
    const response = await axios.get(`${config.baseURL}/top_rated`, {
      headers: {
        Authorization: `Bearer ${config.token}`,
      },
    });
    const data = response.data;
    const status = response.status;
    return {success: true, data: data, status: status};
  } catch (error) {
    console.log(error);
    return {success: false, data: error};
  }
};
export const getPopularMovies = async () => {
  try {
    const response = await axios.get(`${config.baseURL}/popular`, {
      headers: {
        Authorization: `Bearer ${config.token}`,
      },
    });
    const data = response.data;
    const status = response.status;
    return {success: true, data: data, status: status};
  } catch (error) {
    console.log(error);
    return {success: false, data: error};
  }
};
export const getTopRatedTVSeries = async () => {
  try {
    const response = await axios.get(`${tvConfig.baseURL}/top_rated`, {
      headers: {
        Authorization: `Bearer ${config.token}`,
      },
    });
    const data = response.data;
    const status = response.status;
    return {success: true, data: data, status: status};
  } catch (error) {
    console.log(error);
    return {success: false, data: error};
  }
};
export const getTopTrendingTVSeries = async () => {
  try {
    const response = await axios.get(`${searcConfig.baseURL}/trending/tv/day`, {
      headers: {
        Authorization: `Bearer ${searcConfig.token}`,
      },
    });
    const data = response.data;
    const status = response.status;
    return {success: true, data: data, status: status};
  } catch (error) {
    console.log(error);
    return {success: false, data: error};
  }
};

export const getTrendingMovies = async () => {
  try {
    const response = await axios.get(`${MovieConfig.baseURL}`, {
      headers: {
        Authorization: `Bearer ${config.token}`,
      },
    });
    const data = response.data;
    const status = response.status;
    return {success: true, data: data, status: status};
  } catch (error) {
    console.log(error);
    return {success: false, data: error};
  }
};
export const getTrendingPeople = async () => {
  try {
    const response = await axios.get(`${PeopleConfig.baseURL}`, {
      headers: {
        Authorization: `Bearer ${config.token}`,
      },
    });
    const data = response.data;
    const status = response.status;
    return {success: true, data: data, status: status};
  } catch (error) {
    console.log(error);
    return {success: false, data: error};
  }
};

export const searchMovies = async query => {
  try {
    const response = await axios.get(`${searcConfig.baseURL}/search/multi`, {
      headers: {
        Authorization: `Bearer ${config.token}`,
      },
      params: {
        query: query,
      },
    });

    const {data, status} = response;

    return {success: true, data, status};
  } catch (error) {
    console.error('Error in searchMovies:', error);

    return {success: false, data: null, status: 500};
  }
};
export const getAiringTv = async () => {
  try {
    const response = await axios.get(`${tvConfig.baseURL}/airing_today`, {
      headers: {
        Authorization: `Bearer ${config.token}`,
      },
    });
    const data = response.data;
    const status = response.status;
    return {success: true, data: data, status: status};
  } catch (error) {
    console.log(error);
    return {success: false, data: error};
  }
};
