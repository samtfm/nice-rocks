import React, { ReactElement } from 'react';
import RockPreview from './RockPreview'
import { StyleSheet, View, Image } from 'react-native';
import { useSelector } from 'react-redux'
import colors from 'styles/colors';
import { RootState } from 'reducers/rootReducer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface TimeStamp {
  seconds: number,
  nanoseconds: number,
}

interface RockDetails {
  id: string
  title: string
  url: string
  note: string
  timestamp: TimeStamp
  fromUserId: string
  toUserId: string
  response?: {
    reaction: string
    note: string
    timestamp: TimeStamp
  }
}

interface RockListProps {
  rocks: Array<RockDetails>
  avatarIdKey: 'fromUserId' | 'toUserId'
}


const RockList = ({rocks, avatarIdKey}: RockListProps): ReactElement => {
  const contacts = useSelector(
    ({ firestore: { data } }: RootState) => {
      return data.userData.contacts
    }
  )

  return (
    <View>
      {rocks.map(rock => (
          rock && (
            <View key={rock.id} style={styles.listItem}>
              {rock.response && (
                <Icon style={styles.responseIndicator} name={'comment'} color={colors.darkMint} size={14} />
              )}
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
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: 'row',
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

  responseIndicator: {
    position: 'absolute',
    top: 2,
    left: 2,
  },
});

export default RockList;
