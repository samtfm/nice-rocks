import React, { ReactElement } from 'react';
import RockPreview from './RockPreview'
import { StyleSheet, View } from 'react-native';
import colors from 'styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Avatar from 'components/Avatar';
import { Surface } from 'react-native-paper';

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
  return (
    <View>
      {rocks.map(rock => (
          rock && (
            <Surface key={rock.id} style={styles.listItem}>
              {rock.response && (
                <Icon style={styles.responseIndicator} name={'comment'} color={colors.primary} size={14} />
              )}
              {avatarIdKey && rock[avatarIdKey] && (
                <Avatar id={rock[avatarIdKey]} size={40}/>
              )}
              <View style={styles.preview}>
              <RockPreview {...rock} />
              </View>
            </Surface>
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
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.beige,
    elevation: 4,
  },

  preview: {
    flex: 1,
  },

  avatar: {
    marginLeft: 10,
  },

  responseIndicator: {
    position: 'absolute',
    top: 2,
    left: 2,
  },
});

export default RockList;
