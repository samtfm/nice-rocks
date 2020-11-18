import React, { ReactElement } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Text from 'components/Text';
import Avatar from 'components/Avatar';
import { Surface } from 'react-native-paper';
import colors from 'styles/colors';

interface Response {
  reaction: string
  note: string
  fromUserId: string,
}

const Response = ({reaction, note, fromUserId}: Response): ReactElement => {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar id={fromUserId} size={38}/>
      </View>

      <Surface style={styles.response}>
        {(reaction && !note) ? (
            <View style={styles.reactionBigContainer}><Text style={styles.reactionBig}>{`${reaction} `}</Text></View>
          ) : (
          <Text selectable={true} style={styles.stuff}>
              {reaction && <Text style={styles.reaction}>{`${reaction} `}</Text>}
              <Text style={styles.note}>{note}</Text>  
          </Text>
        )}
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 40,
    marginRight: 64,
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  avatarContainer: {
    paddingTop: 6,
    paddingRight: 4,
  },
  response: {
    elevation: 0,

    alignSelf: 'center',
    paddingVertical: 6,
    paddingLeft: 6,
    paddingRight: 12,
    backgroundColor: colors.white,
    borderColor: colors.primaryLight,
    borderLeftWidth: 2,
    
    borderRadius: 14,
    flexDirection: 'row',
  },
  stuff: {
    top: -4,
    marginLeft: 6,
    paddingTop: 12,
    lineHeight: 19,
  },
  note: {
    fontSize: 14,
    lineHeight: 24,
  },
  reaction: {
    fontSize: 22,
  },
  reactionBigContainer: {
    top: -1,
    paddingVertical: Platform.OS === "ios" ? 0 : 4,
  },
  reactionBig: {
    fontSize: 30,  
  }
});

export default Response;
