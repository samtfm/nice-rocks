
import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';
import { Text } from 'react-native';
import { RootState } from 'reducers/rootReducer';

interface AuthLoaded {
  children: ReactElement
}
const AuthLoaded = ({ children }: AuthLoaded): ReactElement => {
  const auth = useSelector((state: RootState) => state.firebase.auth);

  if (!isLoaded(auth)) {
    return <Text>splash screen...</Text>;
  }

  return <>{children}</>
}

export default AuthLoaded;
