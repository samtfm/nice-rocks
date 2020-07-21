import React from 'react';
import { StyleSheet, Text, View, Linking } from 'react-native';
import { relativeTimeFromEpoch } from '../util/time';
import { useSelector } from 'react-redux'
import { useFirestoreConnect } from 'react-redux-firebase'

const RockPreview = ({title, url, note, timestamp}) => {
  return (
    <View style={styles.rockItem}>
      {url ? (
        <Text style={styles.title}
              onPress={() => Linking.openURL(url)}>
          {title || url}
        </Text>
      ) : (
        <Text style={styles.title}>{title || url}</Text>
      )}
      <Text style={styles.description}>{note}</Text>
      {timestamp && <Text style={styles.timestamp}>{relativeTimeFromEpoch(timestamp.seconds)}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  rockItem: {
    padding: 10,
    marginBottom: 6,
    marginLeft: 20,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 3,
    paddingBottom: 33,
  },
  title: {
    fontWeight: 'bold',
    color: '#00ace6',
    overflow: 'hidden',
    // // whiteSpace: 'nowrap',
    // // textOverflow: 'ellipsis',
    marginBottom: 8,
  },
  description: {
    overflow: 'hidden',
    // // whiteSpace: 'nowrap',
    // // textOverflow: 'ellipsis',
  },
  timestamp: {
    color: 'gray',
    position: 'absolute',
    right: 8,
    bottom: 0,
  },
});

export default RockPreview;
