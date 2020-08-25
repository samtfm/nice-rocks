import React from 'react';
import { StyleSheet, Text, Pressable, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from 'styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ComposeButton = () => {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.navigate('ComposeRock')}
      style={({ pressed }) => [
        {
          backgroundColor: pressed
            ? '#61CAF6'
            : colors.blue,
        },
        styles.composeButton
      ]}>
      <Icon name={'plus'} color={'white'} size={24} />
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
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default ComposeButton;
