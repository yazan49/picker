import React, {useEffect} from 'react';
import {ImageBackground} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

export default function SplashScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const user = await auth().currentUser;
        console.log('User:', user);

        if (user) {
          // User is authenticated, navigate to Main screen
          console.log('User is authenticated. Navigating to Main.');
          navigation.navigate('Main');
        } else {
          // User is not authenticated, navigate to First screen
          console.log('User is not authenticated. Navigating to First.');
          navigation.navigate('First');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // In case of an error, navigate to First screen
        console.log('Error checking authentication. Navigating to First.');
        navigation.navigate('First');
      }
    };

    const timer = setTimeout(() => {
      checkAuthentication();
    }, 2000); // Adjust the timeout as needed

    // Clear the timeout when the component unmounts
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ImageBackground
      source={require('../../assets/splash.png')}
      style={{
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
      }}></ImageBackground>
  );
}
