import React from 'react';
import { StyleSheet, Text, Pressable, Button } from 'react-native';

const ComposeButton = ({ navigation }) => {
  return (
    <Pressable
      onPress={() => navigation.navigate('ComposeRock')}
      style={({ pressed }) => [
        {
          backgroundColor: pressed
            ? '#61CAF6'
            : '#3AB1E4'
        },
        styles.composeButton
      ]}>
      <Text style={styles.buttonContents}>+</Text>
    </Pressable>

  );
}

const styles = StyleSheet.create({
  composeButton: {
    borderRadius: 100,
    width: 50,
    height: 50,
    position:'absolute',
    bottom: 0,
    right: 0,
    margin: 20,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContents:{
    color: 'white',
    fontSize: 30,
    flex: 1,
  }
});

export default ComposeButton;
