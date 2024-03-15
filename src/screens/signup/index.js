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
import Toast from 'react-native-toast-message';
import Spinner from 'react-native-loading-spinner-overlay';
import {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {_signUpWithGoogle} from '../../config/firebase/GoogleSignUp';

export default function SignUpScreen({navigation}) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const signUpTestFn = () => {
    if (password !== confirmPassword) {
      Alert.alert('error', 'Passwords do not match');
      return;
    }

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async userCredential => {
        // Send email verification
        await userCredential.user.sendEmailVerification();

        // Sign out the user to force them to sign in after email verification
        await auth().signOut();

        setLoading(false);

        // Notify the user to check their email for verification
        Alert.alert(
          'Success',
          'Account created successfully. Check your email for verification.',
        );

        navigation.replace('Log'); // Navigate to sign-in screen
      })
      .catch(error => {
        console.log(error.message);
        Alert.alert('Error', error.message);
        setLoading(false);
      });
  };
  useEffect(() => {
    Toast.show({
      type: 'info',
      text1: 'Welcome!',
      text2: ' ',
    });
  }, []);

  const showToast = (type, text) => {
    Toast.show({
      type: type,
      position: 'bottom',
      text1: text,
    });
  };

  async function GoogleSignin() {
    setLoading(true);

    _signUpWithGoogle(navigation).then(data => {
      setLoading(false);

      if (!data) {
        showToast('error', 'No data');
        return;
      }

      showToast('success', 'Sign in with Google successful');
      console.log('=>success', data);

      navigation.navigate('Main');
    });
  }

  return (
    <View style={{flex: 1, backgroundColor: '#121212'}}>
      <View style={{alignItems: 'center', marginTop: 50}}>
        <Text style={{fontSize: 28, fontWeight: 'bold', color: 'white'}}>
          Sign Up
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
          <View style={{marginTop: 20}}>
            <TextInput
              value={confirmPassword}
              onChangeText={text => setConfirmPassword(text)}
              placeholder={'Confirm Password'}
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
        </View>
        <View style={{marginTop: 30, paddingLeft: 40}}>
          <RoundButtonComp
            label={'Sign Up'}
            width="80%"
            backgroundColor="#93170D"
            onPress={signUpTestFn}
          />
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
              label="     Sign up with Google"
              onPress={() => GoogleSignin()}
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
        <View
          style={{
            marginTop: 20,
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('Log')}>
            <Text style={{fontSize: 14, fontWeight: 'bold', color: '#C7281B'}}>
              Already have Account?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
