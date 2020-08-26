import React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { useSelector } from 'react-redux'
import { useFirebase, isLoaded, isEmpty } from 'react-redux-firebase'

import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-community/google-signin';
import colors from 'styles/colors';
import Text from 'components/Text.component';

async function onGoogleButtonPress() {
  const googleSignConfiguration = {
    // scopes: ["email", "profile"],
    webClientId: "342705485686-q0rfukmubinofgjkt9jkruou6qlaip12.apps.googleusercontent.com",
    androidClientId: '342705485686-e69fh24ifclk78mned781lo276n369c3.apps.googleusercontent.com',
    iosClientId: '342705485686-l0ekdnd3op9fq2vk5r3t51bq35a1q3l7.apps.googleusercontent.com',
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
    <View style={styles.main}>
      <Text style={styles.titleText}>Nice Rocks</Text>
      <View style={styles.loginButton}>
        <Button
          title="Sign in with Google"
          onPress={() => onGoogleButtonPress().then(
            () => console.log('Signed in with Google!'),
            err => console.log(Object.entries(err))
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: colors.beige,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 40,
    marginBottom: 20,
    position: 'absolute',
    top: '30%',
  },
  loginButton: {
    position: 'absolute',
    bottom: 120,
  }

});

export default Login;
