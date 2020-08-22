import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useSelector } from 'react-redux'
import { useFirebase, isLoaded, isEmpty } from 'react-redux-firebase'

import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-community/google-signin';



async function onGoogleButtonPress() {
  const googleSignConfiguration = {
    // scopes: ["email", "profile"],
    webClientId: "342705485686-q0rfukmubinofgjkt9jkruou6qlaip12.apps.googleusercontent.com",
    androidClientId: '342705485686-e69fh24ifclk78mned781lo276n369c3.apps.googleusercontent.com',
    iosClientId: '342705485686-e09uj5k1oumjlrpvv4b6qijn7k82tt94.apps.googleusercontent.com',
    offlineAccess: true
  }
  GoogleSignin.configure(googleSignConfiguration);

  // Get the users ID token
  const { idToken } = await GoogleSignin.signIn();
  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  // Sign-in the user with the credential
  return auth().signInWithCredential(googleCredential);
}


const Login = () => {
  return (
    <View>
      <Button
        title="Google Sign-In"
        onPress={() => onGoogleButtonPress().then(
          () => console.log('Signed in with Google!'),
          err => console.log(Object.entries(err))
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  test: {
    padding: 10,
  },
});

export default Login;
