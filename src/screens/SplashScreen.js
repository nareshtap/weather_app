import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {color, FONTS} from '../config/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    getLocation();
    setTimeout(() => {
      navigation.replace('MainScreen');
    }, 1000);
  }, []);

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      info => {
        if (info) {
          setLocation(info.coords.latitude, info.coords.longitude);
        }
      },
      err => {
        console.log(err);
      },
    );
  };

  const setLocation = async (latitude, longitude) => {
    try {
      await AsyncStorage.setItem('latitude', latitude.toString());
      await AsyncStorage.setItem('longitude', longitude.toString());
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.mainText}>WeatherApp</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: {
    color: color.green,
    fontSize: 40,
    ...FONTS.robotoBold,
  },
});

export default SplashScreen;
