import React, {useEffect} from 'react';
import MainNavigator from './src/MainNavigator';
import Reducer from './src/store/reducers';
import {persistStore, persistReducer} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import Thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import PushNotification from 'react-native-push-notification';
import {getUniqDeviceId} from './src/config/notification';
import {db} from './firebaseConfig';

const users = db.ref('/users');

const PERSIST_CONFIG = {
  key: 'root',
  storage: AsyncStorage,
};

const PERSIST_REDUCER = persistReducer(PERSIST_CONFIG, Reducer);
const STORE = createStore(PERSIST_REDUCER, applyMiddleware(Thunk));
let PERSIST_STORE = persistStore(STORE);

PushNotification.configure({
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
  },
  onAction: function (notification) {
    console.log('ACTION:', notification.action);
    console.log('NOTIFICATION:', notification);
  },
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: true,
});

const App = () => {
  async function getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log('FCM Token: ', fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        console.log('FCM Token: ', fcmToken);
        await storeFCM(fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }

  async function requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      await getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  async function checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      await getToken();
    } else {
      await requestPermission();
    }
  }

  const showNotification = async (title, message) => {
    let latitude = await AsyncStorage.getItem('latitude');
    let longitude = await AsyncStorage.getItem('longitude');

    if (!latitude || !longitude) {
      console.log('Unable to get Location');
    } else {
      await axios
        .get(
          `http://api.openweathermap.org/data/2.5/weather?lat=${parseFloat(
            latitude,
          )}&lon=${parseFloat(
            longitude,
          )}&appid=ffb8c3decb6e7b68c36aca2d55c410ac`,
          {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        )
        .then(res => {
          const msg = `Current Temperature: ${Math.round(
            res?.data?.main?.temp - 273.15,
          ).toString()}° C`;
          console.log(msg);
          PushNotification.localNotification({
            title: title,
            message: msg,
            largeIcon: 'ic_cloud',
            smallIcon: 'ic_launcher',
            playSound: true,
            soundName: 'default',
          });
        })
        .catch(e => {
          throw 'Unable to get Temperature';
        });
    }
  };

  let messageListener = async () => {
    const notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        const {title, body} = notification;
        console.log('1');
        showNotification(title, body);
      });

    const notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        const {title, body} = notificationOpen.notification;
        console.log('2');
        showNotification(title, body);
      });

    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const {title, body} = notificationOpen.notification;
      console.log('3');
      await showNotification(title, body);
    }

    messageListener = firebase.messaging().onMessage(message => {
      console.log(JSON.stringify(message));
    });
  };

  useEffect(() => {
    checkPermission();
    messageListener();
  });

  const storeFCM = async fcm => {
    await getUniqDeviceId().then(res => {
      let newObj = {};
      newObj[res] = fcm;
      users.push(newObj);
    });
  };

  return (
    <Provider store={STORE}>
      <PersistGate loading={null} persistor={PERSIST_STORE}>
        <MainNavigator />
      </PersistGate>
    </Provider>
  );
};

export default App;
