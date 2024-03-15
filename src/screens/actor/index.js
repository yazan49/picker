import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Modal,
  Vibration,
  Alert,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {useNavigation} from '@react-navigation/native';
import {useState, useEffect} from 'react';
import axios from 'axios';
import {
  addToFavoriteActors,
  removeFromFavoriteActors,
} from '../../../FavoriteReducer';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export const getDetails = async id => {
  const apiKey =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwM2M5MzRiOWMwNDllZjU0ZWFhYzhhNWM2MjNmZGNhNCIsInN1YiI6IjY1ZGIwNzE4NjJmMzM1MDE3YzRkMGQxYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SCC3Ww2JJcqSljzFlhzUwVyBg5PBl5D-XNZaZWHa1fw'; // Replace with your TMDb API key
  const baseURL = 'https://api.themoviedb.org/3/person/';

  try {
    const response = await axios.get(`${baseURL}${id}`, {
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

export default function ActorInfo({route}) {
  const {actorData} = route.params;
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [Details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const age = calculateAge(Details?.birthday || 0);
  const [showFullBiography, setShowFullBiography] = useState(false);
  const dispatch = useDispatch();
  const favorite = useSelector(state => state.favorite.favorite); // Access the list property

  const originalBiography = Details?.biography || ' ';
  const truncatedBiography = truncateBiographyToSentence(originalBiography, 53);

  function calculateAge(birthday) {
    // Parse the birthday string to a Date object
    const birthDate = new Date(birthday);

    // Get the current date
    const currentDate = new Date();

    // Calculate the difference in years
    const age = currentDate.getFullYear() - birthDate.getFullYear();

    // Check if the birthday has occurred this year
    if (
      currentDate.getMonth() < birthDate.getMonth() ||
      (currentDate.getMonth() === birthDate.getMonth() &&
        currentDate.getDate() < birthDate.getDate())
    ) {
      // Subtract 1 year if the birthday hasn't occurred yet
      return age - 1;
    }

    return age;
  }

  const handleOnClick = (actorData, index) => {
    const selectedMedia = actorData.known_for[index];

    if (selectedMedia.media_type === 'movie') {
      navigation.navigate('Movie', {movieData: selectedMedia});
    } else if (selectedMedia.media_type === 'tv') {
      navigation.navigate('Tv', {mediaData: selectedMedia});
    }
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  //console.log(actorData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data, success, status} = await getDetails(
          route.params.actorData.id,
        );

        if (success) {
          //console.log('Actor details:', data);

          setDetails(data); // Store movie details in state
        } else {
          console.error('Error fetching Actor details. Status:', status);
        }
      } catch (error) {
        console.error('Error fetching Actor details:', error);
      } finally {
        setIsLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchData();
  }, [route.params.actorData.id]);

  function truncateBiographyToSentence(biography, wordLimit) {
    // Use a regular expression to split the biography at the first period
    const words = biography.split(' ');

    if (words.length <= wordLimit) {
      // If the number of words is less than or equal to the limit, return the original biography
      return biography;
    } else {
      // If the number of words exceeds the limit, truncate and join the words
      const truncatedWords = words.slice(0, wordLimit);
      return truncatedWords.join(' ') + '...';
    }
  }
  //console.log(actorData);

  const isActorInFavoritelist = favorite.some(item => item.id === actorData.id);

  const handleFavoritelistAction = () => {
    if (isActorInFavoritelist) {
      // Actor is in Favorite list, show remove button
      removeFromFavoritelistHandler();
    } else {
      // Movie is not in watchlist, show add button
      addToFavoritelistHandler();
    }
  };

  const addToFavoritelistHandler = () => {
    // Dispatch the addToWatchlist action with the movie data
    dispatch(addToFavoriteActors(actorData));

    Vibration.vibrate([200, 200, 200]);

    // Save the updated watchlist to AsyncStorage
    AsyncStorage.setItem('Favorite', JSON.stringify([...favorite, actorData]))
      .then(() => {
        console.log('Actor added to Favorite list and saved to AsyncStorage');
        // Log the current watchlist to check if it includes the added movie
        console.log('Current Favorite list:', [...favorite]);

        Toast.show({
          type: 'success',
          text1: `${actorData.name} added to your favorite list`,
          position: 'bottom',
        });
      })
      .catch(error =>
        console.error('Error saving Favorite list to AsyncStorage:', error),
      );
  };

  const removeFromFavoritelistHandler = () => {
    Alert.alert(
      'Remove from Favorite list',
      'Are you sure you want to remove the actor from your Favorite?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: () => {
            // Dispatch the removeFromWatchlist action with the movie data
            dispatch(removeFromFavoriteActors(actorData));

            // Update the watchlist in AsyncStorage after removing the movie
            AsyncStorage.setItem('Favorite list', JSON.stringify(favorite))
              .then(() => {
                console.log(
                  'Actor removed from Favorite list and updated in AsyncStorage',
                );
                // Log the current watchlist to check if it includes the removed movie
                console.log('Current Favorite list:', [...favorite]);
              })
              .catch(error =>
                console.error(
                  'Error updating Favorite list in AsyncStorage:',
                  error,
                ),
              );
          },
          style: 'destructive',
        },
      ],
    );
  };

  //console.log('this data is ----', Details);
  return (
    <View style={{flex: 1, backgroundColor: '#080808'}}>
      <ScrollView>
        <View style={styles.Mcard}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.name}>{actorData.name}</Text>
            <View
              style={{
                marginLeft: 15,
                justifyContent: 'center',
              }}>
              <TouchableOpacity onPress={handleFavoritelistAction}>
                {isActorInFavoritelist ? (
                  <MaterialIcons name="favorite" color={'red'} size={30} />
                ) : (
                  <MaterialIcons
                    name="favorite-border"
                    color={'white'}
                    size={30}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.AP}>
            <Text style={styles.year}>{actorData.known_for_department}</Text>

            <View style={styles.Poo}>
              <FontAwesome5 name="user-friends" color={'#FFD700'} size={18} />
              <Text style={styles.popularity}>{actorData.popularity}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={toggleModal}>
          <Image
            style={styles.Img}
            source={{
              uri: `https://image.tmdb.org/t/p/w500/${actorData.profile_path}`,
            }}
          />
        </TouchableOpacity>

        <View style={styles.actorData}>
          <Text style={styles.info}>🌟 Info</Text>
          <TouchableOpacity
            onPress={() => setShowFullBiography(!showFullBiography)}>
            <Text style={styles.age}>
              {actorData.name} is {age} Years Old Born In{' '}
              {Details?.place_of_birth || ' '}
            </Text>

            {showFullBiography ? (
              <Text style={styles.age}>{Details?.biography || ' '}</Text>
            ) : (
              <Text style={styles.age}>{truncatedBiography}</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.MovieContainer}>
          {actorData.known_for && actorData.known_for.length > 0 && (
            <>
              <Text style={styles.KnownFor}>Known For</Text>

              {actorData.known_for.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleOnClick(actorData, index)}>
                  <View style={styles.mData}>
                    <Image
                      style={styles.MovieImg}
                      source={{
                        uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
                      }}
                    />
                    <View style={{flex: 1}}>
                      <Text style={styles.mTitle}>
                        {item.media_type === 'movie'
                          ? item.title
                          : item.original_name}{' '}
                        {item.media_type === 'movie'
                          ? `(${item.release_date?.split('-')[0] || ''})`
                          : `(${item.first_air_date?.split('-')[0] || ''})`}
                      </Text>
                      <Text style={styles.mDescreption} numberOfLines={13}>
                        {item.overview}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>
        <Text style={styles.source}>Source</Text>

        <View style={styles.tmdb}>
          <Image
            style={styles.tmdbImg}
            source={require('../../assets/tmdb.png')}
          />
        </View>
      </ScrollView>

      {/* Modal for backdrop image */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={toggleModal}>
        <View style={styles.modalContainer}>
          <Image
            style={styles.enlargedImage}
            source={{
              uri: `https://image.tmdb.org/t/p/w500/${actorData.profile_path}`,
            }}
          />
          <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
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
    paddingBottom: 20,
    paddingTop: 10,
    marginTop: 10,
  },
  name: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    padding: 10,
  },
  year: {
    marginTop: 5,
    color: '#CAC6C6',
    fontSize: 14,
    fontWeight: '500',
    paddingLeft: 10,
  },
  Img: {
    width: responsiveWidth(100),
    height: responsiveHeight(60),
  },

  KnownFor: {
    marginTop: 5,
    color: 'white',
    fontSize: 16,
    padding: 15,
    fontWeight: 'bold',
  },
  MovieContainer: {
    backgroundColor: '#121212',
  },
  AP: {
    flexDirection: 'row',
    backgroundColor: '#121212',
  },
  popularity: {
    color: 'white',
    //paddingLeft:200,
    fontWeight: '600',
    paddingLeft: 10,
  },
  Poo: {
    flexDirection: 'row',
    paddingLeft: 220,
    alignItems: 'center',
  },
  MovieImg: {
    width: responsiveWidth(40),
    height: responsiveHeight(40),
  },
  mData: {
    marginTop: 15,
    flexDirection: 'row',
    paddingLeft: 10,
  },
  mTitle: {
    paddingLeft: 10,
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mDescreption: {
    padding: 10,
    color: 'white',
  },
  m2Data: {
    marginTop: 5,
    flexDirection: 'row',
    padding: 10,
  },
  m3Data: {
    flexDirection: 'row',
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Adjust the background color and opacity
  },
  enlargedImage: {
    width: responsiveWidth(100),
    height: responsiveHeight(60),
    borderRadius: 10, // Add border radius for rounded corners
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
  actorData: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#2C2C2C',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#3D3D3D',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  info: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  age: {
    color: '#D3D3D3',
    fontSize: 16,
    marginBottom: 10,
  },
  biography: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'justify',
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
});
