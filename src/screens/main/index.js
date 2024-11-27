import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  getNowPlayingMovies,
  getTopRatedMovies,
  getPopularMovies,
  getTopRatedTVSeries,
  getTrendingMovies,
  getTrendingPeople,
  getTopTrendingTVSeries,
  getAiringTv,
} from '../../api/network';
import HomeBanner from '../../components/HomeBanner';
import MovieCards from '../../components/MovieCards';
import ActorCard from '../../components/ActorCard';
import TvCards from '../../components/TvCard';
import {BackHandler} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {useRef} from 'react';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {addToWatchlist} from '../../redux/WatchlistReducer';
import {addToFavoriteActors} from '../../redux/FavoriteReducer';

export default function MainScreen({navigation}) {
  const [nowPlayingData, setNowPlayingData] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedTVSeries, setTopRatedTVSeries] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingPeople, setTrendingPeople] = useState([]);
  const [trendingTVSeries, setTrendingTVSeries] = useState([]);
  const [airingTv, setAiringTv] = useState([]);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const isFocused = useIsFocused();
  const tapCount = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );

    return () => {
      backHandler.remove();
    };
  }, [isFocused]);

  const handleBackPress = () => {
    if (isFocused) {
      tapCount.current += 1;

      if (tapCount.current === 1) {
        timeoutRef.current = setTimeout(() => {
          tapCount.current = 0;
        }, 2000);
      } else if (tapCount.current === 2) {
        clearTimeout(timeoutRef.current); // Clear the previous timeout
        Alert.alert(
          'Confirm Exit',
          'Are you sure you want to exit the app?',
          [
            {
              text: 'Cancel',
              onPress: () => {
                tapCount.current = 0;
              },
              style: 'cancel',
            },
            {
              text: 'Exit',
              onPress: () => BackHandler.exitApp(),
            },
          ],
          {cancelable: false},
        );
      }
      return true;
    } else {
      // Allow the default back button behavior on other screens
      return false;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data: nowPlayingDataResponse} = await getNowPlayingMovies();
        setNowPlayingData(nowPlayingDataResponse.results);

        const {data: topRatedMoviesResponse} = await getTopRatedMovies();
        setTopRatedMovies(topRatedMoviesResponse.results);

        const {data: popularMoviesResponse} = await getPopularMovies();
        setPopularMovies(popularMoviesResponse.results);

        const {data: topRatedTVSeriesResponse} = await getTopRatedTVSeries();
        setTopRatedTVSeries(topRatedTVSeriesResponse.results);

        const {data: trendingMoviesResponse} = await getTrendingMovies();
        setTrendingMovies(trendingMoviesResponse.results);

        const {data: trendingPeopleResponse} = await getTrendingPeople();
        setTrendingPeople(trendingPeopleResponse.results);

        const {data: trendingTVSeriesResponse} = await getTopTrendingTVSeries();
        setTrendingTVSeries(trendingTVSeriesResponse.results);

        const {data: airingTvResponse} = await getAiringTv();
        setAiringTv(airingTvResponse.results);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Load watchlist from AsyncStorage when the component mounts
    const loadWatchlist = async () => {
      try {
        const savedWatchlist = await AsyncStorage.getItem('watchlist');
        if (savedWatchlist) {
          const parsedWatchlist = JSON.parse(savedWatchlist);

          // Dispatch addToWatchlist for each movie in the saved watchlist
          parsedWatchlist.forEach(movie => {
            dispatch(addToWatchlist(movie));
          });
        }
      } catch (error) {
        console.error('Error loading watchlist from AsyncStorage:', error);
      }
    };

    loadWatchlist();
  }, [dispatch]);

  useEffect(() => {
    // Load watchlist from AsyncStorage when the component mounts
    const loadFavoritelist = async () => {
      try {
        const savedFavoritelist = await AsyncStorage.getItem('Favorite');
        if (savedFavoritelist) {
          const parsedFavoritelist = JSON.parse(savedFavoritelist);

          // Dispatch addToWatchlist for each movie in the saved watchlist
          parsedFavoritelist.forEach(actor => {
            dispatch(addToFavoriteActors(actor));
          });
        }
      } catch (error) {
        console.error('Error loading Favorite list from AsyncStorage:', error);
      }
    };

    loadFavoritelist();
  }, [dispatch]);

  if (Platform.OS === 'android') {
    StatusBar.setBarStyle('default');
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setTranslucent(true);
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          <View style={styles.subContainer}>
            <HomeBanner navigation={navigation} />

            <MovieCards title={'Trending'} data={trendingMovies} />
            <MovieCards title={'Popular'} data={popularMovies} />
            <MovieCards title={'Top Rated'} data={topRatedMovies} />
            <MovieCards title={'Now Playing'} data={nowPlayingData} />
            <TvCards title={'Top Rated TV Series'} data={topRatedTVSeries} />
            <TvCards title={'Trending TV Series'} data={trendingTVSeries} />
            <TvCards title={'Airing Today TV Series'} data={airingTv} />

            <ActorCard
              title={'Trending Actor'}
              data={trendingPeople}
              navigation={navigation}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
  },
  scrollView: {
    flex: 1,
  },
  subContainer: {
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
  },
});
