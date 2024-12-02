import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import movieData from './movieData';
import axios from 'axios';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { token } from '../../api/network';

export const getDetails = async movieId => {
  const baseURL = 'https://api.themoviedb.org/3/movie/';
  try {
    const response = await axios.get(`${baseURL}${movieId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = response.data;
    const status = response.status;
    return { success: true, data: data, status: status };
  } catch (error) {
    console.log(error);
    console.log('id : ', movieId);
    return { success: false, data: error };
  }
};

export default function PickerScreen({ navigation }) {
  const [movieType, setMovieType] = useState('none');
  const [desiredFeeling, setDesiredFeeling] = useState('none');
  const [recommendedMovie, setRecommendedMovie] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [movieDetails, setMovieDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [showAnotherOneButton, setShowAnotherOneButton] = useState(false);

  const movieGroups = movieData;

  const handleGetDetails = async () => {
    setIsLoading(true);

    if (recommendedMovie && recommendedMovie.movieId) {
      const { success, data, status } = await getDetails(
        recommendedMovie.movieId
      );
      setIsLoading(false);

      if (success) {
        setMovieDetails(data);
        navigation.navigate('Movie', { movieData: data });
      } else {
        console.error('Error fetching movie details. Status:', status);
      }
    }
  };

  const handleAnotherOnePress = () => {
    handleRecommendation();
  };

  const handleRecommendation = async () => {
    setIsLoading(true);
    const lowercaseMovieType = movieType.toLowerCase();
    const lowercaseDesiredFeeling = desiredFeeling.toLowerCase();

    if (
      lowercaseMovieType in movieGroups &&
      lowercaseDesiredFeeling in movieGroups[lowercaseMovieType]
    ) {
      const group = movieGroups[lowercaseMovieType][lowercaseDesiredFeeling];
      const randomIndex = Math.floor(Math.random() * group.length);
      const selectedMovie = group[randomIndex];

      if (selectedMovie && selectedMovie.movieId) {
        try {
          const { success, data, status } = await getDetails(
            selectedMovie.movieId
          );
          setIsLoading(false);

          if (success) {
            setMovieDetails(data);
            setRecommendedMovie(selectedMovie);
            setShowAnotherOneButton(true);
          } else {
            console.error('Error fetching movie details. Status:', status);
          }
        } catch (error) {
          console.error('Error fetching movie details:', error);
        }
      }
    } else {
      setRecommendedMovie(
        'Sorry, no recommendation available for your selection.'
      );
    }
  };

  const handleNextPress = () => {
    setShowWelcome(false);
  };

  console.log('ssss' , isLoading)
  return (
    <View style={showWelcome ? welcomeStyles.container : mainStyles.container}>
      {showWelcome && (
        <ImageBackground
          style={welcomeStyles.img}
          source={require('../../assets/movieB.png')}
        >
          <View style={welcomeStyles.appName}>
            <Text style={[welcomeStyles.appNameLetter, { fontSize: 60 }]}>
              Movie
            </Text>
          </View>
          <View style={mainStyles.appName2}>
            <Text
              style={[
                welcomeStyles.appNameLetter,
                {marginTop: 10, fontSize: 60},
              ]}>
              P
            </Text>
            <Text
              style={[
                welcomeStyles.appNameLetter,
                {marginTop: 16, fontSize: 45},
              ]}>
              I
            </Text>
            <Text
              style={[
                welcomeStyles.appNameLetter,
                {marginTop: 17, fontSize: 40},
              ]}>
              C
            </Text>
            <Text
              style={[
                welcomeStyles.appNameLetter,
                {marginTop: 17, fontSize: 40},
              ]}>
              K
            </Text>
            <Text
              style={[
                welcomeStyles.appNameLetter,
                {marginTop: 15, fontSize: 45},
              ]}>
              E
            </Text>
            <Text
              style={[
                welcomeStyles.appNameLetter,
                {marginTop: 9, fontSize: 60, marginBottom: 80},
              ]}>
              R
            </Text>
          </View>
          <View style={welcomeStyles.intro}>
            <Text style={welcomeStyles.welcomeText}>
              Hi there! Allow us to Guide You To a Fantastic Movie.
            </Text>
          </View>
          <TouchableOpacity
            style={welcomeStyles.nextButton}
            onPress={handleNextPress}>
            <Text style={welcomeStyles.buttonText}> Lets Go </Text>
          </TouchableOpacity>
        </ImageBackground>
      )}

      {!showWelcome && (
        <View style={mainStyles.container}>
          <StatusBar backgroundColor={'#333'} />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={mainStyles.questionContainer}>
              <Text style={{color: 'white', fontWeight: 'bold', marginTop: 60}}>
                What type of movie do you want to watch?
              </Text>
              <RNPickerSelect
                defaultValue={'None'}
                onValueChange={value => setMovieType(value)}
                items={[
                  {label: 'Action', value: 'action'},
                  {label: 'Comedy', value: 'comedy'},
                  {label: 'Crime', value: 'crime'},
                  {label: 'War', value: 'war'},
                  {label: 'Drama', value: 'drama'},
                  {label: 'Thriller', value: 'thriller'},
                  {label: 'Based on True Story', value: 'truestory'},
                ]}
                textStyle={mainStyles.dropdownText}
                style={{
                  inputAndroid: mainStyles.dropdownContainer,
                  inputIOS: mainStyles.dropdownContainer,
                }}
              />
            </View>

            <View style={mainStyles.questionContainer}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                How do you want to feel after watching it?
              </Text>
              <RNPickerSelect
                defaultValue={'None'}
                onValueChange={value => setDesiredFeeling(value)}
                items={[
                  {label: 'Happy', value: 'happy'},
                  {label: 'Sad', value: 'sad'},
                  {label: 'Excited', value: 'excited'}
                ]}
                textStyle={mainStyles.dropdownText}
                style={{
                  inputAndroid: mainStyles.dropdownContainer,
                  inputIOS: mainStyles.dropdownContainer,
                }}
              />
            </View>

            <TouchableOpacity
              style={mainStyles.button}
              onPress={handleRecommendation}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={'white'} />
              ) : (
                <Text style={mainStyles.buttonText}>Get Recommendation</Text>
              )}
            </TouchableOpacity>

            <View style={mainStyles.recommendedMovieContainer}>
              <Text style={mainStyles.recommendedMovieLabel}>
                Recommended Movie:
              </Text>
              <Text style={mainStyles.recommendedMovie}>
                {recommendedMovie
                  ? `${recommendedMovie.title} (${recommendedMovie.year})`
                  : ''}
              </Text>
              {movieDetails && movieDetails.poster_path && (
                <Image
                  style={{
                    marginTop: 15,
                    width: responsiveWidth(30),
                    height: responsiveHeight(20),
                    resizeMode: 'contain',
                    borderRadius: 10,
                  }}
                  source={{
                    uri: `https://image.tmdb.org/t/p/w200/${movieDetails.poster_path}`,
                  }}
                />
              )}

              <View style={{marginTop: 10, flexDirection: 'row', padding: 10}}>
                {recommendedMovie && (
                  <TouchableOpacity onPress={handleGetDetails}>
                    <Text
                      style={{
                        backgroundColor: '#333',
                        padding: 10,
                        color: 'white',
                        fontWeight: '700',
                      }}>
                      Check it Out
                    </Text>
                  </TouchableOpacity>
                )}
                {showAnotherOneButton && (
                  <TouchableOpacity onPress={handleAnotherOnePress}>
                    <Text
                      style={{
                        backgroundColor: '#831010',
                        padding: 10,
                        marginLeft: 15,
                        color: 'white',
                        fontWeight: '700',
                      }}>
                      Another One
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}
const welcomeStyles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  appName: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  appNameLetter: {
    marginHorizontal: 1,
    color: '#ffffff',
    fontWeight: 'bold',
    textShadowColor: '#831010',
    textShadowOffset: {width: 4, height: 4},
    textShadowRadius: 4,
  },
  welcomeText: {
    color: '#ffffff',
    fontSize: 24,
    marginBottom: 20,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  nextButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 120,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  img: {
    width: '100%',
    height: '100%',
  },
  intro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
};

const mainStyles = {
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 10,
    justifyContent: 'flex-start',
    backgroundColor: '#121212',
  },
  appName: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  appName2: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 1,
  },
  appNameLetter: {
    marginHorizontal: 1,
    color: '#ffffff',
    fontWeight: 'bold',
    textShadowColor: '#831010',
    textShadowOffset: {width: 4, height: 4},
    textShadowRadius: 4,
  },
  questionContainer: {
    marginBottom: 20,
  },
  dropdownContainer: {
    height: 40,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 10,
  },
  dropdownText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recommendedMovieContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  recommendedMovie: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  recommendedMovieLabel: {
    marginTop: 10,
    color: 'white',
    fontWeight: '700',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#831010',
    marginTop: 20,
    padding: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
};
