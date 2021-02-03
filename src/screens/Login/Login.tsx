import React, { useState, ReactElement } from 'react';
import { StyleSheet, View, ActivityIndicator, Pressable, Image} from 'react-native';
import { HelperText, Surface } from 'react-native-paper';

import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-community/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';

import colors from 'styles/colors';
import Text from 'components/Text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const googleSignConfiguration = __DEV__ ? 
{
  webClientId: "1451319754-lrfca3qds1n5j4og2uu106dgnmitqqfu.apps.googleusercontent.com",
  offlineAccess: true,
  prompt: 'select-account',
} : {
  // scopes: ["email", "profile"],
  webClientId: "342705485686-q0rfukmubinofgjkt9jkruou6qlaip12.apps.googleusercontent.com",
  androidClientId: '342705485686-e69fh24ifclk78mned781lo276n369c3.apps.googleusercontent.com',
  iosClientId: '342705485686-l0ekdnd3op9fq2vk5r3t51bq35a1q3l7.apps.googleusercontent.com',
  offlineAccess: true,
  prompt: 'select-account',
}

GoogleSignin.configure(googleSignConfiguration);

async function onGoogleButtonPress() {
  // Get the users ID token
  const { idToken } = await GoogleSignin.signIn();
  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  // Sign-in the user with the credential
  return auth().signInWithCredential(googleCredential);
}

async function onAppleButtonPress() {
  // Start the sign-in request
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });
  // Ensure Apple returned a user identityToken
  if (!appleAuthRequestResponse.identityToken) {
    throw 'Apple Sign-In failed - no identify token returned';
  }

  // Create a Firebase credential from the response
  const { identityToken, nonce } = appleAuthRequestResponse;
  const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

  // Sign the user in with the credential
  return auth().signInWithCredential(appleCredential);
}

const Login = (): ReactElement => {

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  return (
    <View style={styles.main}>
      <Text style={styles.titleText}>NiceRocks</Text>
      {loading && <ActivityIndicator style={styles.spinner} size="large" color={colors.blue} />}
      <View style={styles.loginButtons}>
        <LoginButton
          onPress={() => {
            setLoading(true);
            setError('');
            onGoogleButtonPress().then(
              () => {return;},
              err => {
                setLoading(false)
                setError("authentication error")
              }
          )}}
          IconComponent={() =>
            <Image style={{width: 18, height: 18}} source={require('./google_logo_color.png')} />
          }
          text={'Sign in with Google'}
          disabled={loading}
        />
        {appleAuth.isSignUpButtonSupported && appleAuth.isSupported &&
          <LoginButton
            onPress={() => {
              setLoading(true)
              setError('');
              onAppleButtonPress().then(
                () => {return;},
                err => {
                  setLoading(false)
                  setError("authentication error")
                }
              )}}
              IconComponent={() => <Icon name={'apple'} size={18}/>}
              text={'Sign in with Apple'}
              disabled={loading}
            />
        }
        <HelperText
          type="error"
          visible={Boolean(error)}
        >{error}</HelperText>

      </View>

    </View>
  );
}

const LoginButton = ({IconComponent, text, disabled, onPress}) => {
  return (
    <Pressable onPress={onPress}
      disabled={disabled}
    >
      {({pressed}) => (
        <Surface
          style={[
            styles.loginButton,
            disabled ? styles.loginButtonDisabled : {},
            pressed ? styles.loginButtonPressed : {},
          ]}
        >
          <IconComponent/>
          <Text style={{fontFamily: 'System', marginLeft: 12}}>{text}</Text>
        </Surface>
      )}
    </Pressable>
  )
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
  titleText: {
    fontSize: 40,
    marginTop: '25%',
    flex: 1,
  },
  loginButtons: {
    justifyContent: 'flex-end',
    marginBottom: 40,
    alignItems: 'center',
  },
  loginButton: {
    width: 200,
    height: 45,
    margin: 8,
    elevation: 2,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 3,
  },
  loginButtonDisabled: {
    backgroundColor: colors.gray93,
    elevation: 0,
  },
  loginButtonPressed: {
    backgroundColor: colors.gray80,
    elevation: 0,
  }
});

export default Login;
