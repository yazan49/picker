import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  Button,
  Alert,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import auth from '@react-native-firebase/auth';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({navigation}) {
  const [isSignedOut, setIsSignedOut] = useState(false);
  const watchlist = useSelector(state => state.watchlist.watchlist);
  const favorite = useSelector(state => state.favorite.favorite);

  const movies = watchlist;

  useEffect(() => {
    AsyncStorage.setItem('watchlist', JSON.stringify(watchlist))
      .then(() => {
        console.log('Watchlist updated in AsyncStorage');
      })
      .catch(error =>
        console.error('Error updating watchlist in AsyncStorage:', error),
      );
  }, [watchlist]);

  useEffect(() => {
    AsyncStorage.setItem('favorite', JSON.stringify(favorite))
      .then(() => {
        console.log('favorite updated in AsyncStorage');
      })
      .catch(error =>
        console.error('Error updating favorite in AsyncStorage:', error),
      );
  }, [favorite]);

  useEffect(() => {
    // Check if user is already signed out when component mounts
    const checkSignedOutStatus = async () => {
      const currentUser = auth().currentUser;
      setIsSignedOut(!currentUser);
    };

    checkSignedOutStatus();
  }, []);

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await auth().signOut();
              setIsSignedOut(true);
              navigation.replace('First');
              // Optionally, you can navigate to the login or another screen after sign-out
            } catch (error) {
              console.error('Error signing out:', error);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <Image
            style={styles.profileImage}
            source={require('../../assets/profile2.png')}
          />
          <Text style={styles.profileName}>Yazan Odeh</Text>
        </View>
        <View style={{marginTop: 20, alignItems: 'center'}}>
          {isSignedOut ? (
            <Text style={styles.signedOutText}>Signed Out</Text>
          ) : (
            <Button title="Sign Out" onPress={handleSignOut} color="#FF5252" />
          )}
        </View>
        <View>
          <View style={styles.card}>
            <Text style={styles.listScreenText}>WatchList</Text>
            <TouchableOpacity onPress={() => navigation.navigate('list')}>
              <Text style={styles.listScreenbutton}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            scrollIndicatorInsets={false}
            data={movies}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => navigation.navigate('list')}>
                {item && (
                  <View style={styles.listItem}>
                    <Image
                      style={styles.img}
                      source={{
                        uri: `https://image.tmdb.org/t/p/w200/${item.poster_path}`,
                      }}
                    />
                    <View style={styles.itemDetails}></View>
                  </View>
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <View style={styles.listItem}>
                <Text style={{color: 'white', padding: 10, fontWeight: '900'}}>
                  No movies in the WatchList.
                </Text>
              </View>
            )}
          />
        </View>

        <View>
          <View style={styles.FavoriteCard}>
            <Text style={styles.listScreenText}>Favorite</Text>
            <TouchableOpacity onPress={() => navigation.navigate('favorite')}>
              <Text style={styles.listScreenbutton}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            scrollIndicatorInsets={false}
            data={favorite}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => navigation.navigate('favorite')}>
                {item && (
                  <View style={styles.listItem}>
                    <Image
                      style={styles.img}
                      source={{
                        uri: `https://image.tmdb.org/t/p/w200/${item.profile_path}`,
                      }}
                    />
                    <View style={styles.itemDetails}></View>
                  </View>
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <View style={styles.listItem}>
                <Text style={{color: 'white', fontWeight: '900', padding: 10}}>
                  Your Favorite List is Empty.
                </Text>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
  },
  profileCard: {
    flexDirection: 'row',
    paddingTop: 40,
    backgroundColor: '#121212',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 30,
    padding: 5,
    paddingHorizontal: 40,
  },
  signedOutText: {
    marginTop: 10,
    color: '#FF5252',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  listScreenText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  listScreenbutton: {
    color: '#6495ED',
    fontSize: 20,
    fontWeight: 'bold',
    paddingRight: 10,
  },

  listItem: {
    flexDirection: 'row',
    marginTop: 15,
  },

  img: {
    width: responsiveWidth(40),
    height: responsiveHeight(25),
    marginRight: 5,
    borderRadius: 15,
    resizeMode: 'contain',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 15,
    borderRadius: 5,
  },
  FavoriteCard: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 5,
  },
});
