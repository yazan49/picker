/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import SplashScreen from './src/screens/splash';
import MainScreen from './src/screens/main';
import MovieInfo from './src/screens/movieInfo';

AppRegistry.registerComponent(appName, () => App);
