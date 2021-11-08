import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";

const API_KEY = "ddc6afdeba4b52bfb507a513655a385b";
// api key를 앱에 적어두면 안되는데 우선 하쟈 ~ 무료이긴 함
const SCREEN_WIDTH = Dimensions.get("window").width;
export default function App() {
  const [city, setCity] = useState("Loading");
  const [days, setdays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWhether = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false); // user not granted
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    /* 
    Arguments
    options (object) — A map of options:
    accuracy : LocationAccuracy — Location manager accuracy. 
    Pass one of LocationAccuracy enum values.  {1-5}
    */
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].street); // Array - Object - city
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alert&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setdays(json.daily);
  };
  useEffect(() => {
    getWhether();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator size="large" color="black" />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <Text style={styles.temp}>
                {parseFloat(day.temp.day).toFixed(1)}
              </Text>
              <Text style={styles.desc}>{day.weather[0].main}</Text>
              <Text style={styles.tinytext}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
      <StatusBar />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5dc",
  },
  city: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    color: "black",
    fontSize: 68,
    fontWeight: "500",
  },
  day: {
    width: SCREEN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  weather: {},
  temp: { fontSize: 127, fontWeight: "600", marginTop: -150},
  desc: { fontSize: 60 },
  tinytext: { fontSize: 21 },
});
