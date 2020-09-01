import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from 'components/Text';
import ContactName from 'components/ContactName';

interface Response {
  reaction: string
  note: string
}

const Response = ({reaction, note, fromUserId}) => {
  return (
    <View style={styles.container}>
      <View style={styles.response}>
        <Text style={styles.reaction}>{reaction}</Text>

        <Text style={styles.note}>{note}</Text>
        <View style={styles.avatarContainer}>
          <Text>{"- "}<ContactName id={fromUserId}/>{" "}</Text>
          <View style={styles.avatar}></View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  response: {
    borderRadius: 4,
    alignSelf: 'center',
  },
  note: {
    padding: 10,
    maxWidth: 300,
    backgroundColor: 'hsl(36, 35%, 90%)',
    paddingBottom: 20,
    borderRadius: 4,
  },
  avatarContainer: {
    position: "absolute",
    zIndex: 1,
    right: 10,
    bottom: -18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: 'hsl(100, 29%, 80%)',
  },
  reaction: {
    position: "absolute",
    zIndex: 1,
    left: 20,
    top: -18,
    fontSize: 20,
  }
});

export default Response;
