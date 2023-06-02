import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [magnetometerData, setMagnetometerData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      setHasCameraPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  const _subscribe = () => {
    setSubscription(
      Magnetometer.addListener(result => {
        setMagnetometerData(result);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const takePhoto = async () => {
    if (cameraRef) {
      const options = { quality: 0.5, base64: true };
      const photo = await cameraRef.takePictureAsync(options);
      console.log(photo.uri);
    }
  };

  if (hasCameraPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={ref => setCameraRef(ref)} />
      <TouchableOpacity onPress={takePhoto} style={styles.capture} activeOpacity={0.7}>
        <Text>Take Photo</Text>
      </TouchableOpacity>
      <Text>Magnetometer:</Text>
      <Text>x: {magnetometerData.x}</Text>
      <Text>y: {magnetometerData.y}</Text>
      <Text>z: {magnetometerData.z}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});
