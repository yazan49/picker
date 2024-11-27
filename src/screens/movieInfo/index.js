import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  Alert,
  Vibration,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import RoundButtonComp from '../../components/RoundButtonComp';
import {useState, useEffect} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CastCard from '../../components/CastCards';
import {useDispatch, useSelector} from 'react-redux';
import {addToWatchlist, removeFromWatchlist} from '../../redux/WatchlistReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export const getDetails = async movieId => {
  const apiKey =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwM2M5MzRiOWMwNDllZjU0ZWFhYzhhNWM2MjNmZGNhNCIsInN1YiI6IjY1ZGIwNzE4NjJmMzM1MDE3YzRkMGQxYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SCC3Ww2JJcqSljzFlhzUwVyBg5PBl5D-XNZaZWHa1fw'; // Replace with your TMDb API key
  const baseURL = 'https://api.themoviedb.org/3/movie/';

  try {
    const response = await axios.get(`${baseURL}${movieId}`, {
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

export const getCredits = async movieId => {
  const apiKey =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwM2M5MzRiOWMwNDllZjU0ZWFhYzhhNWM2MjNmZGNhNCIsInN1YiI6IjY1ZGIwNzE4NjJmMzM1MDE3YzRkMGQxYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SCC3Ww2JJcqSljzFlhzUwVyBg5PBl5D-XNZaZWHa1fw'; // Replace with your TMDb API key
  const baseURL = 'https://api.themoviedb.org/3/movie/';

  try {
    const response = await axios.get(`${baseURL}${movieId}/credits`, {
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

export const getSimilar = async movieId => {
  const apiKey =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwM2M5MzRiOWMwNDllZjU0ZWFhYzhhNWM2MjNmZGNhNCIsInN1YiI6IjY1ZGIwNzE4NjJmMzM1MDE3YzRkMGQxYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SCC3Ww2JJcqSljzFlhzUwVyBg5PBl5D-XNZaZWHa1fw'; // Replace with your TMDb API key
  const baseURL = 'https://api.themoviedb.org/3/movie/';

  try {
    const response = await axios.get(`${baseURL}${movieId}/similar`, {
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

export default function MovieInfo({route, navigation}) {
  const movieData = route.params.movieData;
  const releaseYear = movieData.release_date.split('-')[0];
  const rating = movieData.vote_average.toFixed(1);
  const [isBackdropModalVisible, setBackdropModalVisible] = useState(false);
  const [isPosterModalVisible, setPosterModalVisible] = useState(false);
  const [movieDetails, setMovieDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [similar, setSimilar] = useState(null);
  const [credits, setCredits] = useState(null);

  const dispatch = useDispatch();
  const watchlist = useSelector(state => state.watchlist.watchlist);

  const [backdropImageUrl, setBackdropImageUrl] = useState(
    `https://image.tmdb.org/t/p/w500/${movieData.backdrop_path}`,
  );
  const [posterImageUrl, setPosterImageUrl] = useState(
    `https://image.tmdb.org/t/p/w500/${movieData.poster_path}`,
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
        const {data, success, status} = await getSimilar(
          route.params.movieData.id,
        );

        if (success) {
          //console.log('Similar Movies :', data);

          setSimilar(data); // Store movie details in state
        } else {
          console.error('Error fetching Similar Movies. Status:', status);
        }
      } catch (error) {
        console.error('Error fetching Similar movie :', error);
      } finally {
        setIsLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchData();
  }, [route.params.movieData.id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data, success, status} = await getDetails(
          route.params.movieData.id,
        );

        if (success) {
          //console.log('Movie details:', data);

          setMovieDetails(data); // Store movie details in state
        } else {
          console.error('Error fetching movie details. Status:', status);
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setIsLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchData();
  }, [route.params.movieData.id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data, success, status} = await getCredits(
          route.params.movieData.id,
        );

        if (success) {
          //console.log('Credits : ', data);

          setCredits(data); // Store movie details in state
        } else {
          console.error('Error fetching movie Credtis. Status:', status);
        }
      } catch (error) {
        console.error('Error fetching Credits details:', error);
      } finally {
        setIsLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchData();
  }, [route.params.movieData.id]);

  const formatBudget = budget => {
    if (budget === 0) {
      return 'Not available';
    }

    const million = 1000000;

    // Check if the budget is a multiple of a million
    if (budget % million === 0) {
      const inMillions = budget / million;
      return `${inMillions} million`;
    }

    return `${(budget / million).toFixed(2)} million`;
  };
  const formatMovieDuration = duration => {
    if (!duration || duration <= 0) {
      return ' ';
    }

    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    const formattedDuration = `${hours}h ${minutes}min`;

    return formattedDuration;
  };

  const isMovieInWatchlist = watchlist.some(item => item.id === movieData.id);

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
    dispatch(addToWatchlist(movieData));

    Vibration.vibrate([200, 200, 200]);

    // Save the updated watchlist to AsyncStorage
    AsyncStorage.setItem('watchlist', JSON.stringify([...watchlist, movieData]))
      .then(() => {
        console.log('Movie added to watchlist and saved to AsyncStorage');
        // Log the current watchlist to check if it includes the added movie
        Toast.show({
          type: 'success',
          text1: `${movieData.title} added to your Watchlist`,
          position: 'bottom',
          visibilityTime: 2000,
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
            dispatch(removeFromWatchlist(movieData));

            // Update the watchlist in AsyncStorage after removing the movie
            AsyncStorage.setItem('watchlist', JSON.stringify(watchlist))
              .then(() => {
                console.log(
                  'Movie removed from watchlist and updated in AsyncStorage',
                );
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
  return (
    <View style={{flex: 1, backgroundColor: '#080808'}}>
      <View style={styles.Mcard}>
        <Text style={styles.name}>{movieData.title}</Text>
        <View style={styles.po}>
          <Text style={styles.year}>{releaseYear}</Text>
          <Text style={styles.year}>
            {'   '} {formatMovieDuration(movieDetails?.runtime)}
          </Text>
        </View>
      </View>

      <ScrollView>
        <TouchableOpacity onPress={toggleBackdropModal}>
          <Image
            style={styles.Img}
            source={{
              uri: `https://image.tmdb.org/t/p/w500/${movieData.backdrop_path}`,
            }}
          />
          <View style={styles.buttonContainer}>
            {/* Add your buttons here */}
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('images', {
                  id: movieData.id,
                  mediaType: 'movie',
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
                uri: `https://image.tmdb.org/t/p/w500/${movieData.poster_path}`,
              }}
            />
          </TouchableOpacity>

          <View style={styles.descriptionContainer}>
            <Text style={styles.description} numberOfLines={10}>
              {movieData.overview}
            </Text>
          </View>
        </View>
        <View style={styles.rating}>
          <View style={{flexDirection: 'column'}}>
            <Text
              style={{color: 'white', paddingBottom: 7, fontWeight: 'bold'}}>
              Rating
            </Text>
            <View style={{paddingLeft: 10}}>
              <AntDesign name="star" color={'#F1C40F'} size={19} />
            </View>
            <Text style={{color: 'white', paddingTop: 5, paddingLeft: 1}}>
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

        <Text style={styles.casts}>Casts</Text>
        {credits && credits.cast && credits.cast.length > 0 ? (
          <FlatList
            horizontal
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

        {/* Similar Movies FlatList */}
        {similar && similar.results && similar.results.length > 0 && (
          <View style={styles.similarMoviesContainer}>
            <Text style={styles.headingText}>Similar Movies</Text>
            <FlatList
              data={similar.results.slice(0, 20).sort((a, b) => {
                // Sort by rating first
                if (b.vote_average !== a.vote_average) {
                  return b.vote_average - a.vote_average;
                }
                // If rating is the same, sort by popularity
                return b.popularity - a.popularity;
              })}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    // Navigate to the selected similar movie
                    navigation.push('Movie', {movieData: item});
                  }}>
                  <Image
                    style={styles.similarMovieImage}
                    source={{
                      uri: `https://image.tmdb.org/t/p/w200/${item.poster_path}`,
                    }}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        <View style={styles.ExtraDetails}>
          <View style={styles.detailsContainer}>
            <Text style={styles.extraDetailsTitle}>More Details</Text>
            <Text style={styles.ExtraDetailsText}>
              Movie Duration: {formatMovieDuration(movieDetails?.runtime)}
            </Text>
            <Text style={styles.ExtraDetailsText}>
              Release Date: {movieData.release_date}
            </Text>

            <Text style={styles.ExtraDetailsText}>
              Production Countries:{' '}
              {`${movieDetails?.production_countries[0]?.name || ' '}
        ${movieDetails?.production_countries[1]?.name || ' '}
        ${movieDetails?.production_countries[2]?.name || ' '}`}
            </Text>

            <Text style={styles.ExtraDetailsText}>
              Budget: ${formatBudget(movieDetails?.budget)}
            </Text>
            <Text style={styles.ExtraDetailsText}>
              Revenue: ${formatBudget(movieDetails?.revenue)}
            </Text>

            <Text style={styles.ExtraDetailsText}>
              Production Companies:{' '}
              {movieDetails?.production_companies[0]?.name || 'Unknown'}
            </Text>
            <View style={styles.prodImgContainer}>
              <Image
                style={styles.ProdImg}
                source={{
                  uri: `https://image.tmdb.org/t/p/w500/${
                    movieDetails?.production_companies[0]?.logo_path ||
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
      {/* Modal for enlarged image */}
      {/* Modal for backdrop image */}
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

      {/* Modal for poster image */}
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
    backgroundColor: '#121212',
    color: '#CAC6C6',
    fontSize: 15,
    padding: 15,
    // paddingEnd:70,
  },
  descriptionContainer: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
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
  rating: {
    marginTop: 15,
    backgroundColor: '#121212',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 25,
  },
  po: {
    flexDirection: 'row',
    color: 'white',
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
  ExtraDetails: {
    marginTop: 15,
    backgroundColor: '#121212',
    borderRadius: 10,
    padding: 20,
  },
  detailsContainer: {
    flexDirection: 'column',
  },
  headingText: {
    color: 'white',
    paddingBottom: 9,
    fontWeight: 'bold',
    fontSize: 15,
  },
  extraDetailsTitle: {
    color: '#66fcf1',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  ExtraDetailsText: {
    color: 'white',
    paddingTop: 12,
    paddingLeft: 1,
  },
  ProdImg: {
    width: '100%', // Adjusted to make it responsive
    height: '100%', // Adjusted to make it responsive
    resizeMode: 'contain',
  },
  prodImgContainer: {
    backgroundColor: '#D7DBDD',
    marginTop: 10,
    width: '100%', // Adjusted to make it responsive
    height: responsiveHeight(15), // Adjusted to make it responsive
  },
  similarMoviesContainer: {
    marginTop: 15,
    backgroundColor: '#121212',
    padding: 25,
  },
  similarMovieImage: {
    width: 120,
    height: 180,
    marginRight: 10,
    borderRadius: 10,
  },
  casts: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 19,
    marginTop: 13,
    marginLeft: 10,
    marginBottom: 5,
  },
  defaultImage: {
    width: 40,
    height: 60,
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
