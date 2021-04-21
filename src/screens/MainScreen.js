import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  StatusBar,
  Alert,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {hp, wp, FONTS} from '../config/constants';
import {getCities} from '../store/actions/weather';
import {getTemperature} from '../config/notification';
import {useDispatch} from 'react-redux';

const MainScreen = props => {
  const {navigation} = props;
  const [weatherData, setWeatherData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCities())
      .then(res => {
        setWeatherData(res?.list);
        setIsLoading(false);
      })
      .catch(e => {
        Alert.alert('Unable to Fetch Cities');
        setIsLoading(false);
      });
  }, []);

  const capitalize = string =>
    string
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  const renderCity = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('DetailViewScreen', {
            cityId: item?.id,
          });
        }}>
        <View style={styles.container_city}>
          <View>
            <Text style={{...FONTS.robotoRegular, fontSize: 20}}>
              {item?.name}
            </Text>
            <Text style={{...FONTS.robotoLight, fontSize: 15, marginTop: 8}}>
              {capitalize(item?.weather[0].description)}
            </Text>
          </View>
          <Text style={{...FONTS.robotoRegular, fontSize: 30}}>
            {getTemperature(item?.main?.temp)}
          </Text>
        </View>
        <View style={styles.lineSpacer} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#184026" barStyle="light-content" />
      {isLoading ? (
        <>
          <View style={styles.gif1}>
            <Image
              source={require('../assets/diff_loading.gif')}
              style={styles.gif}
              resizeMode="contain"
            />
          </View>
          <View style={styles.gif2}>
            <Image
              source={require('../assets/loading.gif')}
              style={styles.gif}
              resizeMode="contain"
            />
          </View>
        </>
      ) : (
        <FlatList data={weatherData} renderItem={renderCity} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  container_city: {
    width: wp(100),
    height: hp(10),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  gif: {
    flex: 1,
  },
  gif1: {
    width: 300,
    height: 300,
    alignSelf: 'center',
  },
  gif2: {
    width: 500,
    height: 200,
    alignSelf: 'center',
  },
  lineSpacer: {
    height: 0.5,
    marginTop: 5,
    width: '100%',
    backgroundColor: '#000',
  },
});

export default MainScreen;
