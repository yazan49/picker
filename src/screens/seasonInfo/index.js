import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';

export default function SeasonInfoScreen({route}) {
  const {seasonDetails} = route.params;
  const navigation = useNavigation();

  const renderEpisodeItem = ({item}) => (
    <TouchableOpacity
      style={styles.episodeCard}
      onPress={() =>
        navigation.navigate('Episode', {
          episodeData: item,
          seriesId: seasonDetails.id,
          seasonNumber: item.season_number,
        })
      }>
      <Image
        source={{
          uri: `https://image.tmdb.org/t/p/w500/${item.still_path}`,
        }}
        style={styles.episodeImage}
        resizeMode="cover"
      />
      <View style={styles.episodeDetails}>
        <Text style={styles.episodeName}>
          {item.episode_number}. {item.name}
        </Text>
        <Text
          style={styles.episodeRuntime}>{`Runtime: ${item.runtime} min`}</Text>
        <Text style={styles.episodeOverview} numberOfLines={4}>
          {item.overview}
        </Text>
      </View>
    </TouchableOpacity>
  );
  //console.log(seasonDetails);

  return (
    <View style={styles.main}>
      <View style={styles.seasonCard}>
        <Text style={styles.seasonName}>{seasonDetails.name}</Text>
      </View>
      <View style={styles.seasonInfo}>
        <View
          style={{
            alignItems: 'center',
          }}>
          <Text style={{color: 'white', fontWeight: '700', fontSize: 16}}>
            overview
          </Text>
        </View>
        <Text style={{color: 'white', fontWeight: '500', marginTop: 9}}>
          {seasonDetails.overview}
        </Text>
      </View>
      <FlatList
        data={seasonDetails.episodes}
        keyExtractor={item => item.id.toString()}
        renderItem={renderEpisodeItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#080808',
  },
  seasonCard: {
    backgroundColor: '#121212',
    padding: 10,
  },
  seasonName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingTop: 8,
  },
  seasonInfo: {
    backgroundColor: '#121212',
    padding: 10,
  },
  poster_path: {
    width: responsiveWidth(100),
    height: responsiveHeight(40),
  },
  episodeCard: {
    flexDirection: 'row',
    backgroundColor: '#121212',
    margin: 5,
    padding: 10,
  },
  episodeImage: {
    width: responsiveWidth(40),
    height: responsiveHeight(20),
    marginRight: 10,
  },
  episodeDetails: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
  },
  episodeNumber: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  episodeName: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  episodeRuntime: {
    marginTop: 6,
    color: 'white',
    fontSize: 12,
    fontWeight: '400',
  },
  episodeOverview: {
    color: 'white',
    fontSize: 12,
    padding: 4,
    marginTop: 6,
  },
});
