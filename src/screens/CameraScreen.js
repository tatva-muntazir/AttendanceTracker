import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function CameraScreen({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Camera Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f6fc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 50,
    color: '#333',
    textAlign: 'center',
  },
});
