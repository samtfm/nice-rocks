import React, { ReactElement } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Text from 'components/Text';
import { relativeTimeFromEpoch } from 'util/time';
import { useNavigation } from '@react-navigation/native';
import colors from 'styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface TimeStamp {
  seconds: number,
  nanoseconds: number,
}
interface RockPreview {
  id: string
  title: string
  url: string
  note: string
  timestamp: TimeStamp
  fromUserId: string
  toUserId: string
}

const RockPreview = ({title, url, note, timestamp, toUserId, id}: RockPreview): ReactElement => {
  const navigation = useNavigation();

  return (
    <View style={styles.rockItem}>
      <Pressable
        onPress={() => {
          navigation.navigate(
            'ViewRock',
            { rockId: id, toUserId: toUserId },
          );
        }}
      >
        {url ? (
          <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
            <Text numberOfLines={1} style={styles.title}>{title || url}</Text>
            <Icon name={'link'} color={colors.blue} size={16} style={{marginLeft: 10, marginRight: 10}} />
          </View>
        ) : (
          <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
            <Text numberOfLines={1} style={styles.title}>{title}</Text>
          </View>
        )}
        <View style={styles.descriptionTimestamp}>
          <Text numberOfLines={1} style={styles.description}>{note}</Text>
          {timestamp && <Text style={styles.timestamp}>{relativeTimeFromEpoch(timestamp.seconds)}</Text>}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  rockItem: {
    padding: 10,
    backgroundColor: 'transparent',
  },
  title: {
    fontFamily: 'Bitter-Bold',
    color: colors.gray40,
    marginBottom: 8,
    flex: 1,
  },
  descriptionTimestamp: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    fontSize: 14,
  },
  description: {
    flex: 1,
    color: colors.gray40,
    marginRight: 12,
  },
  timestamp: {
    color: colors.gray70,
    fontSize: 11,
  },
});

export default RockPreview;
