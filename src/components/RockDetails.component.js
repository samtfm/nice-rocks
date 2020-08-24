import React from 'react';
import { StyleSheet, Text, View, Linking } from 'react-native';
import ContactName from './ContactName.component';
import { relativeTimeFromEpoch } from 'util/time';
import { useSelector } from 'react-redux'
import { useFirestoreConnect } from 'react-redux-firebase'
import colors from 'styles/colors';

const RockDetails = ({title, url, note, timestamp, fromUserId}) => {
  return (
    <View >
      <Text>From: <ContactName id={fromUserId}/></Text>
      <View style={styles.rockItem}>
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
        <Text style={styles.timestamp}>{relativeTimeFromEpoch(timestamp.seconds)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rockItem: {
    padding: 10,
    marginBottom: 6,
    borderRadius: 3,
    paddingBottom: 33,
    backgroundColor: colors.biege,
  },
  title: {
    fontWeight: 'bold',
    color: 'dimgray',
    fontSize: 18,
    marginBottom: 8,
  },
  description: {
    marginBottom: 8,
    color: 'dimgray',
  },
  url: {
    color: '#00ace6',
  },
  timestamp: {
    color: 'darkgray',
    position: 'absolute',
    fontSize: 11,
    right: 8,
    bottom: 8,
  },
});

export default RockDetails;
