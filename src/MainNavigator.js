import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen';
import MainScreen from './screens/MainScreen';
import DetailViewScreen from './screens/DetailViewScreen';
import {color} from './config/constants';

const Stack = createStackNavigator();

const navigationOption = {
  headerLeft: false,
  headerTitle: 'WeatherApp',
  headerTitleStyle: {alignSelf: 'center'},
  headerStyle: {backgroundColor: color.green},
  headerTintColor: color.white,
};

const navigationSplashOption = {
  headerShown: false,
  headerLeft: false,
};

const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={navigationSplashOption}
        />
        <Stack.Screen
          name="MainScreen"
          component={MainScreen}
          options={navigationOption}
        />
        <Stack.Screen
          name="DetailViewScreen"
          component={DetailViewScreen}
          options={navigationOption}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
