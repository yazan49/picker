import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

export const _signUpWithGoogle = async () => {
  try {
    console.log('Starting Google Sign-In');
    GoogleSignin.configure({
      offlineAccess: false,
      webClientId:
        '839297790909-2tah4uhiruvhp9chradlu4ntspssjnhq.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
    });

    await GoogleSignin.hasPlayServices();
    console.log('Play Services available');

    const userInfo = await GoogleSignin.signIn();
    console.log('User info:', userInfo);

    const {idToken} = userInfo;
    const googleCredentials = auth.GoogleAuthProvider.credential(idToken);

    await auth().signInWithCredential(googleCredentials);

    console.log('Google Sign-In successful');

    return userInfo;
  } catch (error) {
    console.log('Google SignIn Error:', error);
    return null;
  }
};
