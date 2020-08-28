import React from 'react';
import RockPreview from './RockPreview'
import { StyleSheet, View, Image } from 'react-native';
import Text from 'components/Text';
import { relativeTimeFromEpoch } from 'util/time';
import { useSelector } from 'react-redux'
import { useFirestoreConnect } from 'react-redux-firebase'
import colors from 'styles/colors';

// avatarIdKey String: one of ['fromUserId', 'toUserId']
const RockList = ({rocks, avatarIdKey}) => {
  const contacts = useSelector(
    ({ firestore: { data } }) => {
      return data.userData && data.userData.contacts
    }
  )

  return (
    <View>
      {rocks.map(rock => (
          rock && (
            <View key={rock.id} style={styles.listItem}>
              {avatarIdKey && contacts && rock[avatarIdKey] && contacts[rock[avatarIdKey]] && (
                <Image
                  style={styles.avatar}
                  source={{
                    uri: contacts[rock[avatarIdKey]].photo
                  }}
                />
              )}
              <View style={styles.preview}>
              <RockPreview {...rock} />
              </View>
            </View>
          )
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    borderRadius: 5,
    marginBottom: 8,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    backgroundColor: colors.beige,

    //android
    elevation: 4,

    //ios
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },

  preview: {
    flex: 1,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginLeft: 10,
  },
});

export default RockList;