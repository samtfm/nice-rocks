import Text from "components/Text";
import React, { ReactElement } from "react";
import { View, StyleSheet, Pressable, Linking } from "react-native";
import colors from "styles/colors";

const supportEmail = "nicerocks@googlegroups.com"
const Support = (): ReactElement => {
  return (
    <View style={styles.main}>
      <Text style={styles.infoText}>{
      "Please send questions, bugs, or report abuse to"
      }
      <Pressable
        onPress={() => Linking.openURL(`mailto:${supportEmail}`)}
        >
        <Text style={styles.supportEmail}
        >{supportEmail}</Text>
      </Pressable>

      </Text>
    </View>
  )
};
const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
  },
  infoText: {
    margin: 'auto',
    textAlign: 'center',
  },
  supportEmail: {
    color: colors.blue,
    marginTop: 10,
    textAlign: 'center',
  },
})
export default Support;

