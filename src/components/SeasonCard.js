// SeasonCard.js
import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import axios from 'axios';
import {useState, useEffect} from 'react';

export const getSeasonDetails = async (seriesId, seasonNumber) => {
  const apiKey =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwM2M5MzRiOWMwNDllZjU0ZWFhYzhhNWM2MjNmZGNhNCIsInN1YiI6IjY1ZGIwNzE4NjJmMzM1MDE3YzRkMGQxYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SCC3Ww2JJcqSljzFlhzUwVyBg5PBl5D-XNZaZWHa1fw'; // Replace with your TMDb API key
  const baseURL = 'https://api.themoviedb.org/3/tv/';

  try {
    const response = await axios.get(
      `${baseURL}${seriesId}/season/${seasonNumber}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );
    const data = response.data;
    const status = response.status;
    return {success: true, data: data, status: status};
  } catch (error) {
    console.log(error);
    return {success: false, data: error};
  }
};

const SeasonCard = ({season, seriesId, navigation}) => {
  const [seasonDetails, setSeasonDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data, success, status} = await getSeasonDetails(
          seriesId,
          season.season_number,
        );

        if (success) {
          setSeasonDetails(data);
        } else {
          console.error('Error fetching season details. Status:', status);
        }
      } catch (error) {
        console.error('Error fetching season details:', error);
      }
    };
    fetchData();
  }, [seriesId, season.season_number]);

  return (
    <TouchableOpacity
      onPress={() => {
        if (seasonDetails) {
          navigation.navigate('Season', {seasonDetails});
        } else {
          console.error('Season details are not available.');
        }
      }}
      style={styles.container}>
      <Image
        style={styles.seasonImage}
        source={{
          uri: `https://image.tmdb.org/t/p/w500/${season.poster_path}`,
        }}
      />
      <View style={styles.seasonDetails}>
        <Text style={styles.seasonName}>{season.name}</Text>
        <Text
          style={
            styles.episodeCount
          }>{`${season.episode_count} Episodes`}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  seasonImage: {
    width: responsiveWidth(30),
    height: responsiveHeight(20),
    borderRadius: 8,
    marginRight: 10,
    resizeMode: 'contain',
  },
  seasonDetails: {
    flex: 1,
  },
  seasonName: {
    marginTop: 7,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  episodeCount: {
    marginTop: 5,
    color: '#CAC6C6',
    fontSize: 12,
  },
});

export default SeasonCard;
