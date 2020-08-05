import React from 'react';
import { StyleSheet, Text, View, Linking } from 'react-native';
import ContactName from './ContactName.component';
import { relativeTimeFromEpoch } from 'util/time';
import { useSelector } from 'react-redux'
import { useFirestoreConnect } from 'react-redux-firebase'

const RockDetails = ({title, url, note, timestamp, fromUserId}) => {
  return (
    <View style={styles.rockItem}>
      <ContactName id={fromUserId}/>
      {url ? (
        <Text
          style={styles.title}
          onPress={() => Linking.openURL(url)}
        >
          {title || url}
        </Text>
      ) : (
        <Text style={styles.title}>{title || url}</Text>
      )}
      <Text style={styles.description}>{note}</Text>
      {Boolean(url) && (
        <Text
          style={styles.url}
          onPress={() => Linking.openURL(url)}
        >
          {url}
        </Text>
      )}
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
    // // whiteSpace: 'nowrap',
    // // textOverflow: 'ellipsis',
    marginBottom: 8,
  },
  description: {
    // // whiteSpace: 'nowrap',
    // // textOverflow: 'ellipsis',
  },
  url: {
    overflow: 'hidden',
    color: '#00ace6',
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

export default RockDetails;
