import React, { useState } from 'react';
import { StyleSheet, View, Button, ActivityIndicator} from 'react-native';
import { useSelector } from 'react-redux'
import { useFirebase, isLoaded, isEmpty } from 'react-redux-firebase'
import { HelperText } from 'react-native-paper';

import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-community/google-signin';
import colors from 'styles/colors';
import Text from 'components/Text.component';
const googleSignConfiguration = {
  // scopes: ["email", "profile"],
  webClientId: "342705485686-q0rfukmubinofgjkt9jkruou6qlaip12.apps.googleusercontent.com",
  androidClientId: '342705485686-e69fh24ifclk78mned781lo276n369c3.apps.googleusercontent.com',
  iosClientId: '342705485686-l0ekdnd3op9fq2vk5r3t51bq35a1q3l7.apps.googleusercontent.com',
  offlineAccess: true
}
GoogleSignin.configure(googleSignConfiguration);



const Login = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  async function onGoogleButtonPress() {
    setLoading(true)
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  return (
    <View style={styles.main}>
      <Text style={styles.titleText}>Nice Rocks</Text>
      {loading && <ActivityIndicator style={styles.spinner} size="large" color={colors.blue} />}
      <View style={styles.loginButton}>
        <Button
          disabled={loading}
          title="Sign in with Google"
          onPress={() => onGoogleButtonPress().then(
            () => {return;},
            err => {
              setLoading(false)
              setError(err.message)
            }
          )}
        />
        <HelperText
          type="error"
          visible={Boolean(error)}
        >{error}</HelperText>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  spinner: {
    position: 'absolute',
    bottom: 230,
  },
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
    alignItems: 'center',
  }
});

export default Login;
