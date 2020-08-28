
import React from 'react';
import { useSelector } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';
import { Text } from 'react-native';

const AuthLoaded = ({ children }) => {
  const auth = useSelector(state => state.firebase.auth);

  if (!isLoaded(auth)) {
    return <Text>splash screen...</Text>;
  }

  return <>{children}</>
}

export default AuthLoaded;
