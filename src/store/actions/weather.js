import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MAP_KEY} from '../../config/api_key';

export const STORE_CITIES = 'STORE_CITIES';
export const RESET_STORE = 'RESET_STORE';
export const LOCATION = 'LOCATION';

export const getCities = () => {
  return dispatch => {
    return axios
      .get(
        `http://api.openweathermap.org/data/2.5/find?lat=23.68&lon=90.35&cnt=50&appid=${MAP_KEY}`,
        {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      )
      .then(res => {
        if (res?.data?.list.length > 0) {
          dispatch({
            type: STORE_CITIES,
            payload: res?.data?.list,
          });
        }
        return Promise.resolve(res?.data);
      })
      .catch(err => {
        return Promise.reject(err);
      });
  };
};

export const getCityData = (lat, lon) => {
  return () => {
    return axios
      .get(
        `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${MAP_KEY}`,
        {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      )
      .then(res => {
        return Promise.resolve(res?.data);
      })
      .catch(err => {
        return Promise.reject(err);
      });
  };
};

export const getLocationData = () => {
  Geolocation.getCurrentPosition(
    info => {
      return info.coords.latitude;
    },
    err => {
      console.log(err);
      return err;
    },
  );
};
