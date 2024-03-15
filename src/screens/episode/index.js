import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  responsiveHeight,
  responsiveScreenHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function EpisodeInfoScreen({route, navigation}) {
  const {episodeData} = route.params;
  const date = episodeData.air_date.split('-')[0];
  const rating = episodeData.vote_average.toFixed(1);

  // console.log(episodeData);

  const crewAndGuestStars = [...episodeData.guest_stars, ...episodeData.crew];

  return (
    <View style={styles.Main}>
      <View style={styles.Epcard}>
        <Text style={styles.EpName}>
          {episodeData.name} ({date})
        </Text>
        <Text style={styles.EpYear}>{episodeData.runtime} minutes</Text>
      </View>

      <ScrollView>
        <Image
          style={styles.image}
          source={{
            uri: `https://image.tmdb.org/t/p/w500/${episodeData.still_path}`,
          }}
        />
        <View style={styles.info}>
          <Text style={styles.overview}>{episodeData.overview}</Text>
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
        </View>
        <View style={styles.crew}>
          <FlatList
            horizontal
            data={crewAndGuestStars.slice(0, 10)} // Displaying up to 10 crew and guest stars
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Actor', {actorData: item})}>
                <View style={styles.crewMember}>
                  {item.profile_path ? (
                    <Image
                      style={styles.crewImg}
                      source={{
                        uri: `https://image.tmdb.org/t/p/w500/${item.profile_path}`,
                      }}
                    />
                  ) : (
                    <View style={styles.crewImgPlaceholder} />
                  )}
                  <Text style={styles.crewName}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        <Text style={styles.source}>Source</Text>

        <View style={styles.tmdb}>
          <Image
            style={styles.tmdbImg}
            source={require('../../assets/tmdb.png')}
          />
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  Main: {
    flex: 1,
    backgroundColor: '#080808',
  },
  EpName: {
    color: 'white',
    padding: 10,
    fontWeight: 'bold',
    fontSize: 18,
  },
  EpYear: {
    color: 'white',
    fontWeight: '500',
    paddingLeft: 10,
  },

  Epcard: {
    backgroundColor: '#121212',
    padding: 10,
  },
  image: {
    width: responsiveWidth(100),
    height: responsiveScreenHeight(30),
  },
  info: {
    backgroundColor: '#121212',
  },
  overview: {
    color: 'white',
    marginTop: 5,
    padding: 10,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 25, // Adjust this value based on your preference
  },
  rating: {
    marginTop: 15,
    backgroundColor: '#121212',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 25,
  },
  crew: {
    padding: 10,
    backgroundColor: '#121212',
    marginTop: 10,
  },
  crewImg: {
    width: responsiveWidth(30),
    height: responsiveHeight(20),
    borderRadius: 10,
  },
  crewImgPlaceholder: {
    width: responsiveWidth(30),
    height: responsiveHeight(20),
    backgroundColor: 'gray',
    borderRadius: 10,
  },
  crewMember: {
    marginRight: 15,
    alignItems: 'center',
  },
  crewName: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
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
