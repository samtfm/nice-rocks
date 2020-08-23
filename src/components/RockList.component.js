import React from 'react';
import RockPreview from './RockPreview.component'
import { StyleSheet, Text, View, Image } from 'react-native';
import { relativeTimeFromEpoch } from 'util/time';
import { useSelector } from 'react-redux'
import { useFirestoreConnect } from 'react-redux-firebase'

// avatarIdKey String: one of ['fromUserId', 'toUserId']
const RockList = ({rocks, avatarIdKey}) => {
  const {uid} = useSelector(state => state.firebase.auth)
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
              {avatarIdKey && contacts && (
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
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 6,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    // marginRight: 100,
  },

  preview: {
    flex: 1,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderColor: "gray",
    borderWidth: 2,
    marginLeft: 10,
  },
});

export default RockList;
