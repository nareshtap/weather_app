import React, {useLayoutEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {color, FONTS} from '../config/constants';
import Icon from 'react-native-vector-icons/Ionicons';
import {getTemperature} from '../config/notification';
import {useSelector} from 'react-redux';

const DetailViewScreen = (props) => {
  const {navigation, route} = props;
  const cityData = useSelector(state => state?.weather?.cityList);
  const city = cityData.find(i => i?.id === route?.params?.cityId);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            size={25}
            color={color.white}
            name="arrow-back-outline"
            style={{marginLeft: 20}}
          />
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  const capitalize = string =>
    string
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#184026" barStyle="light-content" />
      <MapView
        style={{
          flex: 1,
          width: '100%',
        }}
        provider={PROVIDER_GOOGLE}
        region={{
          latitude: city?.coord?.lat,
          longitude: city?.coord?.lon,
          latitudeDelta: 0.04,
          longitudeDelta: 0.05,
        }}>
        <Marker
          coordinate={{
            latitude: city?.coord?.lat,
            longitude: city?.coord?.lon,
          }}
          identifier={`${city.id}`}>
          <Image
            source={require('../assets/pointer.png')}
            resizeMode="contain"
            style={styles.pointer}
          />
          <Text style={{...FONTS.robotoMedium, fontSize: 15}}>
            {city?.name}
          </Text>
        </Marker>
      </MapView>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View style={styles.leftContainer}>
          <Text style={styles.text}>{city?.name}</Text>
          <Text style={[styles.subText, {marginTop: 20}]}>
            {capitalize(city?.weather[0].description)}
          </Text>
          <Text style={styles.subText}>Humidity: {city?.main?.humidity}</Text>
          <Text style={styles.subText}>Wind Speed: {city?.wind?.speed}</Text>
          <Text style={styles.subText}>
            Max. Temp.: {getTemperature(city?.main?.temp_max)}
          </Text>
          <Text style={styles.subText}>
            Max. Temp.: {getTemperature(city?.main?.temp_min)}
          </Text>
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.text}>{getTemperature(city?.main?.temp)}</Text>
          <View style={styles.weatherImage}>
            <Image
              source={{
                uri: `http://openweathermap.org/img/w/${city?.weather[0]?.icon}.png`,
              }}
              style={styles.weather}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  weatherImage: {
    alignSelf: 'center',
    width: 150,
    height: 150,
  },
  weather: {
    flex: 1,
    height: undefined,
    width: undefined,
  },
  subText: {
    ...FONTS.robotoLight,
    fontSize: 20,
    marginTop: 15,
  },
  text: {
    ...FONTS.robotoRegular,
    fontSize: 30,
  },
  rightContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftContainer: {
    flex: 1,
    padding: 30,
  },
  pointer: {
    width: 40,
    height: 40,
  },
});

export default DetailViewScreen;
