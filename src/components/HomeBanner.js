import React, {useState, useEffect, useRef} from 'react';
import {
  Alert,
  Text,
  View,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Platform,
  Vibration,
} from 'react-native';
import {getUpcomingMovies} from '../api/network';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {addToWatchlist, removeFromWatchlist} from '../redux/WatchlistReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';

export default function HomeBanner({navigation}) {
  const [upcomingApiData, setUpcomingApiData] = useState([]);
  const [flatListIndex, setFlatListIndex] = useState(0);
  const flatListRef = useRef(null);
  const dispatch = useDispatch();
  const watchlist = useSelector(state => state.watchlist.watchlist);

  useEffect(() => {
    const handleUpComingApi = async () => {
      const {data, status} = await getUpcomingMovies();
      if (status === 200) {
        setUpcomingApiData(data.results);
      } else {
        Alert.alert(`Request failed with ${data}`);
      }
    };
    handleUpComingApi();
  }, []);

  useEffect(() => {
    if (upcomingApiData.length > 0) {
      const intervalId = setInterval(() => {
        setFlatListIndex(prevIndex => (prevIndex + 1) % upcomingApiData.length);
        flatListRef.current?.scrollToIndex({
          index: flatListIndex,
          animated: true,
        });
      }, 4000);

      return () => clearInterval(intervalId);
    }
  }, [upcomingApiData, flatListIndex]);

  const handleWatchlistAction = item => {
    const isMovieInWatchlist = watchlist.some(i => i.id === item.id);

    if (isMovieInWatchlist) {
      removeFromWatchlistHandler(item);
    } else {
      addToWatchlistHandler(item);
    }
  };

  const addToWatchlistHandler = item => {
    dispatch(addToWatchlist(item));

    Vibration.vibrate([200, 200, 200]);

    // Save the updated watchlist to AsyncStorage
    AsyncStorage.setItem(
      'watchlist',
      JSON.stringify([...watchlist, item]),
    ).then(() => {
      console.log('Movie added to watchlist and saved to AsyncStorage');
      Toast.show({
        type: 'success',
        text1: `${item.title} added to your Watchlist`,
        position: 'bottom',
        visibilityTime: 2000,
      });
    });
  };

  const removeFromWatchlistHandler = item => {
    Alert.alert(
      'Remove from Watchlist',
      'Are you sure you want to remove this movie from your watchlist?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: () => {
            dispatch(removeFromWatchlist(item));
            AsyncStorage.setItem('watchlist', JSON.stringify(watchlist));
          },
          style: 'destructive',
        },
      ],
    );
  };

  const handleScrollEnd = event => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / responsiveWidth(100));

    if (index !== flatListIndex) {
      setFlatListIndex(index);
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
      });
    }
  };

  const renderMovieBanner = ({item, index}) => {
    return (
      <ImageBackground
        style={styles.movieBanner}
        resizeMode="stretch"
        source={{
          uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
        }}>
        <LinearGradient
          colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,7)']}
          style={styles.linearGradient}>
          <TouchableOpacity onPress={() => handleWatchlistAction(item)}>
            {Platform.OS === 'android' ? (
              <Ionicons name="add-circle" size={35} color="white" />
            ) : (
              <Entypo name="add-to-list" size={35} color="white" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Movie', {movieData: item})}>
            <Text style={styles.titles}>Info</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ImageBackground>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        horizontal
        data={upcomingApiData}
        renderItem={renderMovieBanner}
        keyExtractor={item => item.id.toString()}
        onMomentumScrollEnd={handleScrollEnd}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: responsiveHeight(60),
    width: '100%',
  },
  movieBanner: {
    width: responsiveWidth(100),
    height: '100%',
    justifyContent: 'flex-end',
  },
  linearGradient: {
    flex: 0.19,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  titles: {
    fontSize: responsiveScreenFontSize(2.5),
    color: 'white',
    fontWeight: '500',
  },
});
