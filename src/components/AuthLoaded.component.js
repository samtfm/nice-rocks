
import React from 'react';
import { useSelector } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';
import { StyleSheet, Text, View } from 'react-native';

const AuthLoaded = ({ children }) => {
  const auth = useSelector(state => state.firebase.auth);

  if (!isLoaded(auth)) {
    return <Text>splash screen...</Text>;
  }

  return children
}

export default AuthLoaded;


// // Set an initializing state whilst Firebase connects
// const [initializing, setInitializing] = useState(true);
// const [user, setUser] = useState();
//
// // Handle user state changes
// function onAuthStateChanged(user) {
//   setUser(user);
//   if (initializing) setInitializing(false);
// }
//
// useEffect(() => {
//   const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
//   return subscriber; // unsubscribe on unmount
// }, []);
//
