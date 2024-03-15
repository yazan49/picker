import {useNavigation} from '@react-navigation/native';
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

export default function TvCards({title, data}) {
  const navigation = useNavigation();
  const handleOnClick = mediaData => {
    navigation.navigate('Tv', {mediaData});
  };

  const renderTvCard = ({item, index}) => {
    return (
      <TouchableOpacity onPress={() => handleOnClick(item)}>
        <Image
          style={styles.movieImg}
          source={{
            uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: 'white',
          fontSize: 17,
          fontWeight: 'bold',
          letterSpacing: 1,
          marginTop: 5,
        }}>
        {title}
      </Text>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={renderTvCard}
        ItemSeparatorComponent={() => <View style={{width: 15}}></View>}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  movieImg: {
    resizeMode: 'contain',
    height: '100%',
    borderRadius: 10,
    width: responsiveWidth(40),

    aspectRatio: 2 / 3.5,
  },
});
