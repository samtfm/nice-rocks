import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useSelector } from 'react-redux'
import { useFirebase, isLoaded, isEmpty } from 'react-redux-firebase'

import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-community/google-signin';



async function onGoogleButtonPress() {
  let googleSignConfiguration;
  if (true) { // android
    googleSignConfiguration = {
      // scopes: ["email", "profile"],
      // clientID: iosClientId,
      webClientId: "342705485686-q0rfukmubinofgjkt9jkruou6qlaip12.apps.googleusercontent.com",
      // serverClientID:
      androidClientId: '342705485686-rah975l5v8nq9c1clakd1oimancphvbu.apps.googleusercontent.com',
      // clientID: androidClientId,
      offlineAccess: true
    }
  }
  GoogleSignin.configure(googleSignConfiguration);

  // Get the users ID token
  console.log("HEY!")
  const { idToken } = await GoogleSignin.signIn();
  console.log(idToken);
  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  console.log(googleCredential);
  // Sign-in the user with the credential
  return auth().signInWithCredential(googleCredential);
}


const LoginScreen = () => {
  return (
    <View>
      <Button
        title="Google Sign-In 3 "
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

export default LoginScreen;
