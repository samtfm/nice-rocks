import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from 'components/Text';
import Avatar from 'components/Avatar';
import { Surface } from 'react-native-paper';

interface Response {
  reaction: string
  note: string
}

const Response = ({reaction, note, fromUserId}) => {
  return (
    <View style={styles.container}>
      <Surface style={styles.response}>
        <Avatar id={fromUserId} size={45}/>
        <Text style={styles.stuff}>
          <Text style={note ? styles.reaction : styles.reactionBig}>{`${reaction} `}</Text>
          <Text style={styles.note}>{note}</Text>
        </Text>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  response: {
    elevation: 2,

    alignSelf: 'center',
    padding: 12,
    backgroundColor: 'hsl(36, 35%, 90%)',
    borderRadius: 14,
    flexDirection: 'row',
  },
  stuff: {
    top: -4,
    maxWidth: 200,
    marginLeft: 6,
  },
  note: {
    fontSize: 14,
    left: 10,
  },
  reaction: {
    fontSize: 22,
  },
  reactionBig: {
    fontSize: 26,
  }
});

export default Response;
