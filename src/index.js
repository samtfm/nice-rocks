import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RockPreview from './components/RockPreview.component'

const fakeRock = {
  title: "New Cool Thing",
  url: "zombo.com",
  note: "check this out!",
  timestamp: 1594521172,
}
export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <RockPreview {...fakeRock} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
