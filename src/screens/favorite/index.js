import React from 'react';
import {
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Vibration,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect} from 'react';
import {removeFromFavoriteActors} from '../../redux/FavoriteReducer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function Favorite({navigation}) {
  const favorite = useSelector(state => state.favorite.favorite);
  const dispatch = useDispatch();

  useEffect(() => {
    AsyncStorage.setItem('Favorite', JSON.stringify(favorite))
      .then(() => {
        console.log('Favorite updated in AsyncStorage');
      })
      .catch(error =>
        console.error('Error updating Favorite in AsyncStorage:', error),
      );
  }, [favorite]);

  const removeFromFavoritelistHandler = item => {
    Alert.alert(
      'Remove from Favorite',
      'Are you sure you want to remove this Actor from your Favorite?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: () => {
            dispatch(removeFromFavoriteActors(item));
            Vibration.vibrate([200, 200, 200]);
          },
          style: 'destructive',
        },
      ],
    );
  };
  const handleItemPress = item => {
    console.log('Pressed item:', item);
    navigation.navigate('Actor', {actorData: item});
  };
  console.log('your data ', favorite);

  return (
    <View style={styles.main}>
      <Text
        ellipsizeMode="tail"
        numberOfLines={4}
        style={styles.listScreenText}>
        Favorite
      </Text>
      <FlatList
        data={favorite}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handleItemPress(item)}>
            {item && (
              <View style={styles.listItem}>
                <Image
                  style={styles.img}
                  source={{
                    uri: `https://image.tmdb.org/t/p/w200/${item.profile_path}`,
                  }}
                />
                <View style={styles.itemDetails}>
                  <View style={styles.textContainer}>
                    <Text style={styles.title}>{item?.title || item.name}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeFromFavoritelistHandler(item)}
                    style={styles.removeButton}>
                    <Text style={styles.removeButtonText}>remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#080808',
    padding: 10,
  },
  listScreenText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    marginTop: 15,
    backgroundColor: '#121212',
  },
  itemDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    padding: 10,
    fontWeight: 'bold',
    fontSize: 18,
  },
  year: {
    marginTop: 2,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    paddingLeft: 12,
  },

  img: {
    width: responsiveWidth(40),
    height: responsiveHeight(25),
    marginRight: 10,
    borderRadius: 5,
    resizeMode: 'contain',
  },
  removeButton: {
    marginTop: 25,
    backgroundColor: '#BC1829',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 50,
    alignSelf: 'flex-start', // Align the button to the top
    marginRight: 15,
  },
  removeButtonText: {
    color: '#D5CFD0',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
  },
});
