import React from 'react';
import { StyleSheet, Text, Pressable, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const ComposeButton = () => {
  const navigation = useNavigation();

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
    bottom: 40,
    right: 0,
    margin: 20,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'center',

    //android
    elevation: 10,

    //ios
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonContents:{
    color: 'white',
    fontSize: 30,
    flex: 1,
    left: 1,
    top: 3,
  }
});

export default ComposeButton;
