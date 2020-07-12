import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { relativeTimeFromEpoch } from '../util/time';

const RockPreview = ({title, url, note, timestamp}) => {
  return (
    <View style={styles.rockItem}>
      <Text style={styles.title}>{title || url}</Text>
      <Text style={styles.description}>{note}</Text>
      <Text style={styles.timestamp}>{relativeTimeFromEpoch(timestamp)}</Text>
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
