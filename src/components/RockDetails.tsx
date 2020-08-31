import React from 'react';
import { StyleSheet, View, Linking, TouchableOpacity } from 'react-native';
import Text from 'components/Text';
import ContactName from './ContactName';
import { relativeTimeFromEpoch } from 'util/time';
import colors from 'styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ResponseForm from './ResponseForm';

const RockDetails = ({title, url, note, timestamp, fromUserId}) => {
  return (
    <View style={{flexDirection: 'column'}}>
      <Text>From: <ContactName id={fromUserId}/></Text>
      <View style={styles.rockItem}>
        <Text style={styles.title}>{title || url}</Text>
        <Text style={styles.description}>{note}</Text>
        {Boolean(url) && (
          <TouchableOpacity
            style={styles.url}
            onPress={() => Linking.openURL(url)}
          >
            <Text style={styles.urlText}>{url}</Text>
            <Icon name={'open-in-new'} color={colors.blue} size={24} />
          </TouchableOpacity>
        )}
        {timestamp && <Text style={styles.timestamp}>{relativeTimeFromEpoch(timestamp.seconds)}</Text>}
      </View>
      <ResponseForm />
    </View>
  );
}

const styles = StyleSheet.create({
  rockItem: {
    padding: 10,
    marginBottom: 6,
    borderRadius: 3,
    paddingBottom: 33,
  },
  title: {
    fontWeight: 'bold',
    color: colors.gray40,
    fontSize: 18,
    marginBottom: 8,
  },
  description: {
    marginBottom: 8,
    color: colors.gray40,
  },
  url: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  urlText: {
    marginRight: 10,
    maxWidth: '90%',
    color: colors.blue,
  },
  timestamp: {
    color: colors.gray70,
    position: 'absolute',
    fontSize: 11,
    right: 8,
    bottom: 8,
  },
});

export default RockDetails;
