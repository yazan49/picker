// MyBottomNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Screen1 from './path-to/Screen1'; // Create your screen components
import Screen2 from './path-to/Screen2';

const Tab = createBottomTabNavigator();

const MyBottomNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Screen1" component={Screen1} />
      <Tab.Screen name="Screen2" component={Screen2} />
      {/* Add more screens as needed */}
    </Tab.Navigator>
  );
};

export default MyBottomNavigator;
