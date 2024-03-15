import React from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import RoundButtonComp from '../../components/RoundButtonComp';

export default function FirstScreen({navigation}) {
  return (
    <View style={{flex: 1, backgroundColor: '#121212'}}>
      <View
        style={{
          marginTop: 20,
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: 50,
            marginTop: 50,
            textShadowColor: 'red',
            textShadowOffset: {width: 4, height: 4},
            textShadowRadius: 4,
          }}>
          {' '}
          Movie Picker
        </Text>
      </View>
      <View style={{marginBottom: 450, alignItems: 'center'}}>
        <Image
          source={require('../../assets/movieC.png')}
          style={{width: '90%', height: '90%', resizeMode: 'contain'}}
        />
        <Text
          style={{
            color: 'white',
            paddingBottom: 10,
            fontSize: 18,
            fontWeight: '600',
          }}>
          Welcome to Movie Picker{' '}
        </Text>

        <View style={{flexDirection: 'row', marginTop: 20, paddingRight: 70}}>
          <RoundButtonComp
            label={'Sign Up'}
            width="160%"
            backgroundColor="#93170D"
            onPress={() => navigation.navigate('Signup')}
          />
          <View style={{paddingLeft: 70}}>
            <RoundButtonComp
              label={'Login'}
              width="190%"
              backgroundColor="#333"
              onPress={() => navigation.navigate('Log')}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
