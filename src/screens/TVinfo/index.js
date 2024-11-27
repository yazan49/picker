import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  FlatList,
  Alert,
  Vibration,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import {useEffect} from 'react';
import SeasonCard from '../../components/SeasonCard';
import CastCard from '../../components/CastCards';
import {
  addToWatchlist,
  removeFromWatchlist,
} from '../../redux/WatchlistReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';

export const getTvDetails = async TvId => {
  const apiKey =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwM2M5MzRiOWMwNDllZjU0ZWFhYzhhNWM2MjNmZGNhNCIsInN1YiI6IjY1ZGIwNzE4NjJmMzM1MDE3YzRkMGQxYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SCC3Ww2JJcqSljzFlhzUwVyBg5PBl5D-XNZaZWHa1fw';
  const baseURL = 'https://api.themoviedb.org/3/tv/';

  try {
    const response = await axios.get(`${baseURL}${TvId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
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

export const getCredits = async seriesId => {
  const apiKey =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwM2M5MzRiOWMwNDllZjU0ZWFhYzhhNWM2MjNmZGNhNCIsInN1YiI6IjY1ZGIwNzE4NjJmMzM1MDE3YzRkMGQxYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SCC3Ww2JJcqSljzFlhzUwVyBg5PBl5D-XNZaZWHa1fw'; // Replace with your TMDb API key
  const baseURL = 'https://api.themoviedb.org/3/tv/';

  try {
    const response = await axios.get(`${baseURL}${seriesId}/credits`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
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

export default function TvInfo({route, navigation}) {
  const TvData = route.params.mediaData;

  const rating = TvData.vote_average.toFixed(1);
  const releaseYear = TvData.first_air_date.split('-')[0];
  const [isBackdropModalVisible, setBackdropModalVisible] = useState(false);
  const [isPosterModalVisible, setPosterModalVisible] = useState(false);
  const [tvDetails, setTvDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add this line to define isLoading state
  const [credits, setCredits] = useState(null);
  const dispatch = useDispatch();
  const watchlist = useSelector(state => state.watchlist.watchlist);

  const [backdropImageUrl, setBackdropImageUrl] = useState(
    `https://image.tmdb.org/t/p/w500/${TvData.backdrop_path}`,
  );
  const [posterImageUrl, setPosterImageUrl] = useState(
    `https://image.tmdb.org/t/p/w500/${TvData.poster_path}`,
  );

  const toggleBackdropModal = () => {
    setBackdropModalVisible(!isBackdropModalVisible);
  };

  const togglePosterModal = () => {
    setPosterModalVisible(!isPosterModalVisible);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data, success, status} = await getTvDetails(
          route.params.mediaData.id,
        );

        if (success) {
          //console.log('Tv details:', data);

          setTvDetails(data); // Store movie details in state
        } else {
          console.error('Error fetching Tv details. Status:', status);
        }
      } catch (error) {
        console.error('Error fetching Tv details:', error);
      } finally {
        setIsLoading(false); // Set loading to false regardless of success or failure
      }
    };
    fetchData();
  }, [route.params.mediaData.id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data, success, status} = await getCredits(
          route.params.mediaData.id,
        );

        if (success) {
          setCredits(data); // Set the cast details in state
        } else {
          console.error('Error fetching cast details. Status:', status);
        }
      } catch (error) {
        console.error('Error fetching cast details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [route.params.mediaData.id]);

  const isMovieInWatchlist = watchlist.some(item => item.id === TvData.id);

  const handleWatchlistAction = () => {
    if (isMovieInWatchlist) {
      // Movie is in watchlist, show remove button
      removeFromWatchlistHandler();
    } else {
      // Movie is not in watchlist, show add button
      addToWatchlistHandler();
    }
  };

  const addToWatchlistHandler = () => {
    // Dispatch the addToWatchlist action with the movie data
    dispatch(addToWatchlist(TvData));

    Vibration.vibrate([200, 200, 200]);

    // Save the updated watchlist to AsyncStorage
    AsyncStorage.setItem('watchlist', JSON.stringify([...watchlist, TvData]))
      .then(() => {
        console.log('Movie added to watchlist and saved to AsyncStorage');
        // Log the current watchlist to check if it includes the added movie
        console.log('Current Watchlist:', [...watchlist]);

        Toast.show({
          type: 'success',
          text1: `${TvData.name} added to your Watchlist`,
          position: 'bottom',
          visibilityTime: 1500,
        });
      })
      .catch(error =>
        console.error('Error saving watchlist to AsyncStorage:', error),
      );
  };

  const removeFromWatchlistHandler = () => {
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
            // Dispatch the removeFromWatchlist action with the movie data
            dispatch(removeFromWatchlist(TvData));

            // Update the watchlist in AsyncStorage after removing the movie
            AsyncStorage.setItem('watchlist', JSON.stringify(watchlist))
              .then(() => {
                console.log(
                  'Movie removed from watchlist and updated in AsyncStorage',
                );
                // Log the current watchlist to check if it includes the removed movie
                console.log('Current Watchlist:', [...watchlist]);
              })
              .catch(error =>
                console.error(
                  'Error updating watchlist in AsyncStorage:',
                  error,
                ),
              );
          },
          style: 'destructive',
        },
      ],
    );
  };

  const buttonText = watchlist.find(item => item.id === TvData.id)
    ? 'Already Added to Watchlist'
    : 'Add to Watchlist';

  return (
    <View style={{flex: 1, backgroundColor: '#080808'}}>
      <View style={styles.Mcard}>
        <Text style={styles.name}>{TvData.name}</Text>

        <View style={styles.po}>
          <Text style={styles.year}> Tv Series ({releaseYear})</Text>
          <Text style={styles.Episodes}>
            {tvDetails?.number_of_seasons || ' '} Seasons
            {'    '}
            {tvDetails?.number_of_episodes || ' '} Episodes
          </Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={toggleBackdropModal}>
          <Image
            style={styles.Img}
            source={{
              uri: `https://image.tmdb.org/t/p/w500/${TvData.backdrop_path}`,
            }}
          />
          <View style={styles.buttonContainer}>
            {/* Add your buttons here */}
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('images', {
                  id: TvData.id,
                  mediaType: 'tv',
                })
              }
              style={styles.button}>
              <Text style={styles.buttonText}>More Images</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <View style={styles.mData}>
          <TouchableOpacity onPress={togglePosterModal}>
            <Image
              style={styles.smallImg}
              source={{
                uri: `https://image.tmdb.org/t/p/w500/${TvData.poster_path}`,
              }}
            />
          </TouchableOpacity>

          <View style={styles.descriptionContainer}>
            <Text style={styles.description} numberOfLines={11}>
              {TvData.overview}
            </Text>
          </View>
        </View>
        <View style={styles.rating}>
          <View style={{flexDirection: 'column'}}>
            <Text
              style={{color: 'white', paddingBottom: 7, fontWeight: 'bold'}}>
              Rating
            </Text>
            <View style={{paddingLeft: 13}}>
              <AntDesign name="star" color={'#F1C40F'} size={19} />
            </View>
            <Text style={{color: 'white', paddingTop: 5, paddingLeft: 5}}>
              {rating}/10
            </Text>
          </View>

          <View
            style={{
              justifyContent: 'center',
            }}>
            <TouchableOpacity onPress={handleWatchlistAction}>
              <Text
                style={{
                  color: 'white',
                  backgroundColor: isMovieInWatchlist ? '#c70000' : '#856B0C',
                  fontWeight: '700',
                  padding: 10,
                }}>
                {isMovieInWatchlist
                  ? 'Remove from Watchlist'
                  : 'Add to Watchlist'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Text style={styles.seasons}>Seasons</Text>
          {tvDetails && tvDetails.seasons && tvDetails.seasons.length > 0 ? (
            <FlatList
              horizontal
              data={tvDetails.seasons}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <SeasonCard
                  season={item}
                  seriesId={TvData.id}
                  navigation={navigation}
                />
              )}
            />
          ) : (
            <View style={styles.defaultImageContainer}>
              <Image
                style={styles.defaultImage}
                source={require('../../assets/splash.png')}
              />
            </View>
          )}
        </View>
        <View style={{marginTop: 10, flex: 1, backgroundColor: '#121212'}}>
          <Text style={styles.casts}>Casts</Text>
          {credits && credits.cast && credits.cast.length > 0 ? (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={credits.cast.slice(0, 20)} // Display only the first 20 items
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <CastCard cast={item} navigation={navigation} />
              )}
            />
          ) : (
            <View style={styles.defaultImageContainer}>
              <Image
                style={styles.defaultImage}
                source={require('../../assets/profile2.png')}
              />
            </View>
          )}
        </View>

        <View style={styles.CreatedBy}>
          <View style={styles.directorInfo}>
            <Text style={styles.directorLabel}>Directed By</Text>
            <Text style={styles.directorName}>
              {tvDetails?.created_by[0]?.name || ' '}
            </Text>
          </View>

          <View style={styles.directorImageContainer}>
            {tvDetails?.created_by[0]?.profile_path ? (
              <Image
                style={styles.directorImage}
                source={{
                  uri: `https://image.tmdb.org/t/p/w500/${tvDetails?.created_by[0]?.profile_path}`,
                }}
              />
            ) : (
              <Image
                style={styles.directorImage}
                source={require('../../assets/profile2.png')}
              />
            )}
          </View>
        </View>

        <View style={styles.ExtraDetails}>
          <View style={styles.detailsContainer}>
            <Text style={styles.extraDetailsTitle}>More Details</Text>
            <Text style={styles.extraDetailsText}>
              First Air Date: {tvDetails?.first_air_date || ' '}
            </Text>
            <Text style={styles.extraDetailsText}>
              Production Countries:{' '}
              {tvDetails?.production_countries
                .map(country => country?.name || ' ')
                .join('   ')}
            </Text>
            <Text style={styles.extraDetailsText}>
              Production Companies:{' '}
              {tvDetails?.production_companies[0]?.name || 'Unknown'}
            </Text>
            <View style={styles.productionCompaniesContainer}>
              <Image
                style={styles.productionCompanyImage}
                source={{
                  uri: `https://image.tmdb.org/t/p/w500/${
                    tvDetails?.production_companies[0]?.logo_path ||
                    'qv2v9HaStUTRjqonODM29YG0oFX.png'
                  }`,
                }}
              />
            </View>
          </View>
        </View>
        <Text style={styles.source}>Source</Text>

        <View style={styles.tmdb}>
          <Image
            style={styles.tmdbImg}
            source={require('../../assets/tmdb.png')}
          />
        </View>
      </ScrollView>
      <Modal
        visible={isBackdropModalVisible}
        transparent={true}
        onRequestClose={toggleBackdropModal}>
        <View style={styles.modalContainer}>
          <Image
            style={styles.enlargedImage}
            source={{uri: backdropImageUrl}}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={toggleBackdropModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        visible={isPosterModalVisible}
        transparent={true}
        onRequestClose={togglePosterModal}>
        <View style={styles.modalContainer}>
          <Image style={styles.enlargedImage} source={{uri: posterImageUrl}} />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={togglePosterModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  Mcard: {
    backgroundColor: '#121212',
    paddingBottom: 15,
    paddingTop: 10,
    marginTop: 10,
  },
  name: {
    paddingLeft: 7,
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
  },
  year: {
    paddingLeft: 5,
    marginTop: 7,
    color: '#CAC6C6',
    fontSize: 14,
    fontWeight: '500',
  },
  Img: {
    width: responsiveWidth(100),
    height: responsiveHeight(30),
  },
  smallImg: {
    padding: 30,
    width: responsiveWidth(35),
    height: responsiveHeight(30),
  },
  mData: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#121212',
  },
  description: {
    color: '#CAC6C6',
    fontSize: 15,
    paddingTop: 10,
    paddingLeft: 10,
  },
  descriptionContainer: {
    flex: 1,
  },
  rating: {
    marginTop: 15,
    backgroundColor: '#121212',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 25,
    borderRadius: 10,
  },
  po: {
    flexDirection: 'row',
    color: 'white',
    justifyContent: 'space-between',
    paddingEnd: 15,
  },
  popularity: {
    color: 'white',
    paddingLeft: 10,
    fontWeight: '600',
    paddingTop: 7,
  },
  Poo: {
    flexDirection: 'row',
    marginLeft: 80,
    alignItems: 'center',
  },
  Tv: {
    color: 'white',
    padding: 10,
    fontSize: 19,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  enlargedImage: {
    width: responsiveWidth(100),
    height: responsiveHeight(60),
    borderRadius: 10,
    resizeMode: 'contain',
  },
  closeButton: {
    marginBottom: 30,
    position: 'absolute',
    bottom: 50,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 16,
  },
  Episodes: {
    fontWeight: '700',
    alignContent: 'center',
    marginTop: 7,
    color: 'white',
    paddingTop: 3,
  },
  detailsContainer: {
    flexDirection: 'column',
  },

  ExtraDetails: {
    marginTop: 15,
    backgroundColor: '#121212',
    borderRadius: 10,
    padding: 20,
  },
  extraDetailsTitle: {
    color: '#66fcf1',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  extraDetailsText: {
    color: '#c5c6c7',
    fontSize: 16,
    marginBottom: 5,
  },
  productionCompaniesContainer: {
    marginTop: 10,
  },
  productionCompanyText: {
    color: '#c5c6c7',
    fontSize: 16,
    marginBottom: 5,
  },
  productionCompanyImage: {
    width: responsiveWidth(90),
    height: responsiveHeight(15),
    resizeMode: 'contain',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  defaultImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  defaultImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  seasons: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 15,
    paddingLeft: 10,
  },
  ExtraDetailsTextPro: {
    color: 'white',
    paddingTop: 12,
    paddingLeft: 1,
    paddingBottom: 8,
  },
  CreatedBy: {
    marginTop: 20,
    backgroundColor: '#021823',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
  },
  directorInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  directorLabel: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  directorName: {
    color: '#ecf0f1',
    fontSize: 20,
    fontFamily: 'cursive', // Use a creative font or one that suits your style
  },
  directorImageContainer: {
    marginLeft: 20,
  },
  directorImage: {
    height: responsiveHeight(20),
    width: responsiveWidth(30),
    resizeMode: 'cover',
    borderRadius: 50,
  },
  casts: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 19,
    marginTop: 13,
    marginLeft: 10,
    marginBottom: 5,
  },
  tmdb: {
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  tmdbImg: {
    width: responsiveWidth(50),
    height: responsiveHeight(10),
  },
  source: {
    color: '#90cea1',
    fontWeight: 'bold',
    marginTop: 50,
    marginHorizontal: 30,
  },
  buttonContainer: {
    position: 'absolute',
    top: 10, // Adjust as needed
    right: 10, // Adjust as needed
    flexDirection: 'row',
    justifyContent: 'flex-end', // Align the buttons to the right
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#333',
    opacity: 0.8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
});
