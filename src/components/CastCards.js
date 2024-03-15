// CastCard.js

import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {
  responsiveHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

const CastCard = ({cast, navigation}) => {
  //console.log('Received cast data:', cast);

  if (!cast) {
    return null; // or some default content, depending on your requirements
  }

  // Check if the profile_path property is defined
  const profilePath = cast.profile_path
    ? `https://image.tmdb.org/t/p/w500/${cast.profile_path}`
    : 'https://ibb.co/HXC65Qv';

  return (
    <View style={styles.castItem}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Actor', {actorData: cast})}>
        <Image
          style={styles.castImage}
          source={{
            uri: profilePath,
          }}
        />
        <View style={styles.castDetails}>
          <Text style={styles.castName}>{cast.name}</Text>
          <Text style={styles.castCharacter}>{cast.character}</Text>
          <Text style={styles.castDepartment}>{cast.known_for_department}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  castItem: {
    flexDirection: 'column', // Updated to column layout
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  castImage: {
    width: responsiveScreenWidth(30),
    height: responsiveHeight(20),
    marginBottom: 10, // Added margin at the bottom
    borderRadius: 5,
    resizeMode: 'contain',
  },
  castDetails: {
    flex: 1,
    alignItems: 'center', // Centering text under the image
  },
  castName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  castCharacter: {
    color: 'white',
  },
  castDepartment: {
    color: '#CAC6C6',
    fontSize: 12,
  },
});

export default CastCard;
