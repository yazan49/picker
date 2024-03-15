import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {forwardRef} from 'react';
import SplashScreen from './src/screens/splash';
import SignUpScreen from './src/screens/signup';
import MainScreen from './src/screens/main';
import FirstScreen from './src/screens/first';
import LoginScreen from './src/screens/login';
import ProfileScreen from './src/screens/profile';
import PickerScreen from './src/screens/picker';
import {Image, Text, View} from 'react-native';
import MovieInfo from './src/screens/movieInfo';
import TvInfo from './src/screens/TVinfo';
import ActorInfo from './src/screens/actor';
import Search from './src/components/Search';
import SeasonInfoScreen from './src/screens/seasonInfo';
import EpisodeInfoScreen from './src/screens/episode';
import Store from './Store';
import {Provider} from 'react-redux';
import ListScreen from './src/screens/list';
import FavoriteScreen from './src/screens/favorite';
import Toast from 'react-native-toast-message';
import {ForwardedRef} from 'react';
import ImageScreen from './src/screens/image';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: '#242424',
        borderTopWidth: 0,
      },
    }}>
    <Tab.Screen
      name="Home"
      component={MainScreen}
      options={{
        tabBarIcon: ({focused}) => (
          <View>
            <Image
              source={require('../../yazanodeh/MovieApp999/src/assets/home.png')}
              resizeMode="contain"
              style={{
                width: 25,
                height: 25,
                tintColor: focused ? 'red' : 'white',
              }}
            />
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Search"
      component={Search}
      options={{
        tabBarIcon: ({focused}) => (
          <View>
            <Image
              source={require('../../yazanodeh/MovieApp999/src/assets/ssearch.png')}
              resizeMode="contain"
              style={{
                width: 25,
                height: 25,
                tintColor: focused ? 'red' : 'white',
              }}
            />
          </View>
        ),
      }}
    />

    <Tab.Screen
      name="Picker"
      component={PickerScreen}
      options={{
        tabBarIcon: ({focused}) => (
          <View>
            <Image
              source={require('../../yazanodeh/MovieApp999/src/assets/picker.png')}
              resizeMode="contain"
              style={{
                width: 25,
                height: 25,
                tintColor: focused ? 'red' : 'white',
              }}
            />
          </View>
        ),
      }}
    />

    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({focused}) => (
          <View>
            <Image
              source={require('../../yazanodeh/MovieApp999/src/assets/profile.png')}
              resizeMode="contain"
              style={{
                width: 35,
                height: 35,
                tintColor: focused ? 'red' : 'white',
              }}
            />
          </View>
        ),
      }}
    />
  </Tab.Navigator>
);

export default function App() {
  return (
    <Provider store={Store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="First"
            component={FirstScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Log"
            component={LoginScreen}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="Signup"
            component={SignUpScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Main"
            component={MainNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Movie"
            component={MovieInfo}
            options={{
              headerShown: true,
              headerBackTitle: 'back',
              title: '',
              headerStyle: {backgroundColor: '#080808'},
              headerTintColor: 'white',
            }}
          />
          <Stack.Screen
            name="Tv"
            component={TvInfo}
            options={{
              headerShown: true,
              headerBackTitle: 'back',
              title: '',
              headerStyle: {backgroundColor: '#080808'},
              headerTintColor: 'white',
            }}
          />
          <Stack.Screen
            name="Actor"
            component={ActorInfo}
            options={{
              headerShown: true,
              headerBackTitle: 'back',
              title: '',
              headerStyle: {backgroundColor: '#080808'},
              headerTintColor: 'white',
            }}
          />

          <Stack.Screen
            name="Search"
            component={Search}
            options={{headerShown: true}}
          />

          <Stack.Screen
            name="Season"
            component={SeasonInfoScreen}
            options={{
              headerShown: true,
              headerBackTitle: 'back',
              title: '',
              headerStyle: {backgroundColor: '#080808'},
              headerTintColor: 'white',
            }}
          />
          <Stack.Screen
            name="Episode"
            component={EpisodeInfoScreen}
            options={{
              headerShown: true,
              headerBackTitle: 'back',
              title: '',
              headerStyle: {backgroundColor: '#080808'},
              headerTintColor: 'white',
            }}
          />
          <Stack.Screen
            name="list"
            component={ListScreen}
            options={{
              headerShown: true,
              headerBackTitle: 'back',
              title: '',
              headerStyle: {backgroundColor: '#080808'},
              headerTintColor: 'white',
            }}
          />
          <Stack.Screen
            name="favorite"
            component={FavoriteScreen}
            options={{
              headerShown: true,
              headerBackTitle: 'back',
              title: '',
              headerStyle: {backgroundColor: '#080808'},
              headerTintColor: 'white',
            }}
          />
          <Stack.Screen
            name="images"
            component={ImageScreen}
            options={{
              headerShown: true,
              headerBackTitle: 'back',
              title: '',
              headerStyle: {backgroundColor: '#080808'},
              headerTintColor: 'white',
            }}
          />
        </Stack.Navigator>
        <Toast
          config={{
            // Customize toast style
            success: ({text1, props, ...rest}) => (
              <View
                style={{
                  height: 60,
                  width: '80%',
                  backgroundColor: 'white',
                  padding: 10,
                  justifyContent: 'center',
                  borderRadius: 10,
                  opacity: 0.8,
                }}>
                <Text style={{color: 'black'}}>{text1}</Text>
              </View>
            ),
            error: ({text1, props, ...rest}) => (
              <View
                style={{
                  height: 80,
                  width: '100%',
                  backgroundColor: '#333333',
                  padding: 20,
                  justifyContent: 'center',
                }}>
                <Text style={{color: 'white'}}>{text1}</Text>
              </View>
            ),
            // ... other configurations
          }}
        />
      </NavigationContainer>
    </Provider>
  );
}
