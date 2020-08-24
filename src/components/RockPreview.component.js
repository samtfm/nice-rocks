import React from 'react';
import { StyleSheet, Text, View, Linking, Pressable } from 'react-native';
import { relativeTimeFromEpoch } from 'util/time';
import { useSelector } from 'react-redux'
import { useFirestoreConnect } from 'react-redux-firebase'
import { useNavigation } from '@react-navigation/native';
import colors from 'styles/colors';

const RockPreview = ({title, url, note, timestamp, toUserId, id}) => {
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
          <Text numberOfLines={1} style={{...styles.title, ...styles.url}}>
            {title || url}
          </Text>
        ) : (
          <Text numberOfLines={1} style={styles.title}>{title}</Text>
        )}
        <View style={styles.descriptionTimestamp}>
          <Text numberOfLines={1} style={styles.description}>{note}</Text>
          <Text style={styles.timestamp}>{relativeTimeFromEpoch(timestamp.seconds)}</Text>
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
    fontWeight: 'bold',
    color: colors.gray40,
    marginBottom: 8,
  },
  url: {
    color: '#00ace6',
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
