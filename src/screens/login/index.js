import React from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import InputFeildComp from '../../components/InputFeildComp';
import RoundButtonComp from '../../components/RoundButtonComp';
import ImageButtonComp from '../../components/ImageButtonComp';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {_signInWithGoogle} from '../../config/firebase/GoogleSignin';
import Toast from 'react-native-toast-message';
import Spinner from 'react-native-loading-spinner-overlay';
import {useState, useEffect} from 'react';
import auth, {firebase} from '@react-native-firebase/auth';
import {error} from 'console';

export default function LoginScreen({navigation}) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginWithEmailAndPass = () => {
    auth()
      .signInWithEmailAndPassword(email, password)

      .then(res => {
        console.log(res);
        alert('success: logged in');
        navigation.navigate('Main');
      })
      .catch(err => console.log(err));
  };

  const forgetPassword = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        Alert.alert('Password Reset Email Sent');
      })
      .catch(error => {
        alert(error);
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: '#121212'}}>
      <View style={{alignItems: 'center', marginTop: 100}}>
        <Text style={{fontSize: 28, fontWeight: 'bold', color: 'white'}}>
          Logn In
        </Text>
      </View>
      <View style={{padding: 40}}>
        <Spinner
          visible={loading}
          textContent={'Loading...'}
          textStyle={{color: '#FFF'}}
        />
      </View>
      <View style={{padding: 20}}>
        <Text
          style={{
            color: 'white',
            paddingBottom: 10,
            fontWeight: 'bold',
            fontSize: 20,
          }}>
          Email
        </Text>
        <TextInput
          value={email}
          onChangeText={text => setEmail(text)}
          placeholder={'Example@gmail.com'}
          keyboardType="email-address"
          style={{
            padding: 10,
            fontSize: 20,
            color: 'black',
            backgroundColor: 'white',
            fontWeight: 'bold',
            borderRadius: 5,
          }}
        />
        <View style={{marginTop: 30}}>
          <Text
            style={{
              color: 'white',
              paddingBottom: 10,
              fontWeight: 'bold',
              fontSize: 20,
            }}>
            Password
          </Text>

          <TextInput
            value={password}
            onChangeText={text => setPassword(text)}
            placeholder={'*******'}
            secureTextEntry={true}
            style={{
              padding: 10,
              fontSize: 16,
              color: 'black',
              backgroundColor: 'white',
              fontWeight: 'bold',
              borderRadius: 5,
            }}
          />
        </View>
        <View style={{marginTop: 30, paddingLeft: 40}}>
          <RoundButtonComp
            label={'Sign In'}
            onPress={loginWithEmailAndPass}
            width="80%"
            backgroundColor="#93170D"
          />

          <TouchableOpacity onPress={forgetPassword}>
            <Text style={{color: '#C7281B', marginTop: 20, fontWeight: '700'}}>
              Forget Password?
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              fontWeight: 'bold',
              marginTop: 30,
            }}>
            ——————— or ———————
          </Text>
        </View>
        <View
          style={{
            marginTop: 30,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 55,
          }}>
          <TouchableOpacity>
            <ImageButtonComp
              label="     Sign in with Google"
              onPress={() => _signInWithGoogle(navigation)}
              imageSource={require('../../assets/google.png')}
              buttonStyle={{
                backgroundColor: '#333',
                padding: 10,
                borderRadius: 5,
                paddingLeft: 25,
                paddingRight: 40,
              }}
              labelStyle={{color: 'white', fontWeight: 'bold'}}
            />
          </TouchableOpacity>
        </View>
        <View style={{alignItems: 'center', marginTop: 20}}>
          <Text style={{color: 'white', fontWeight: '800'}}>
            Dont have Account ?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={{color: '#C7281B', fontWeight: '800', marginTop: 10}}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
