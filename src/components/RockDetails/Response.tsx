import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import Text from 'components/Text';
import Avatar from 'components/Avatar';
import { Surface } from 'react-native-paper';

interface Response {
  reaction: string
  note: string
  fromUserId: string,
}

const Response = ({reaction, note, fromUserId}: Response): ReactElement => {
  return (
    <View style={styles.container}>
      <Surface style={styles.response}>
        <Avatar id={fromUserId} size={38}/>
        <Text selectable={true} style={styles.stuff}>
          {reaction && <Text style={note ? styles.reaction : styles.reactionBig}>{`${reaction} `}</Text>}
          <Text style={styles.note}>{note}</Text>
        </Text>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
    marginLeft: 40,
    marginRight: 40,
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
    marginLeft: 6,
    paddingTop: 12,
    lineHeight: 18,
  },
  note: {
    fontSize: 14,
  },
  reaction: {
    fontSize: 22,
  },
  reactionBig: {
    fontSize: 26,
  }
});

export default Response;
