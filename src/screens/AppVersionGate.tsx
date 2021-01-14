import { useNavigation } from "@react-navigation/native";
import Text from "components/Text";
import React, { ReactElement } from "react";
import { View, StyleSheet, Linking, Platform } from "react-native";
import { Button } from "react-native-paper";
import { useSelector } from "react-redux";
import { RootState } from "reducers/rootReducer";
import colors from "styles/colors";

const AppVersionGate = ({force}: {force: boolean}): ReactElement => {
  const {
    updateMessage,
    appStoreUrl,
    playStoreUrl,
  } = useSelector(
    ({ firestore: { data } }: RootState) => {
      return data.remoteConfig;
    }
  )
  const navigation = !force ? useNavigation() : undefined;


  return (
    <View style={styles.main}>
      <View style={styles.spacer}></View>
      <View>
      <Text style={styles.infoTextHeadline}>{
        force ? updateMessage.forceHeadline : updateMessage.recommendHeadline
      }</Text>
      <Text style={styles.infoText}>{ 
      force ? updateMessage.forceBody : updateMessage.recommendBody
      }
      </Text>    
      </View>

      <View style={styles.bottom}>
        <View style={styles.buttons}>
          {!force && 
            <Button
              onPress={() => navigation && navigation.goBack()}
              mode={'outlined'}
            >Remind me later</Button>
          }
          <Button 
            onPress={() => Linking.openURL(Platform.OS === 'ios' ? appStoreUrl : playStoreUrl)}
            mode={'contained'}
          >Update</Button>
        </View>
      </View>

    </View>
  )
};
const styles = StyleSheet.create({
  main: {
    backgroundColor: 'white',
    flex: 1,
    paddingHorizontal: 20,
  },
  spacer: {
    flex: .8,
  },
  infoText: {
    margin: 'auto',
    textAlign: 'center',
  },
  infoTextHeadline: {
    margin: 'auto',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36,
  },
  updateButton: {
    color: colors.blue,
    marginTop: 10,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
  }
})
export default AppVersionGate;

