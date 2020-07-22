import React from 'react';
import { StyleSheet, Text, View, Linking, Pressable } from 'react-native';
import { relativeTimeFromEpoch } from 'util/time';
import { useSelector } from 'react-redux'
import { useFirestoreConnect } from 'react-redux-firebase'
import { useNavigation } from '@react-navigation/native';

const RockPreview = ({title, url, note, timestamp, id}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.rockItem}>
      <Pressable
        onPress={() => {
          navigation.navigate(
            'ViewRock',
            { title, url, note, timestamp },
          );
        }}
      >
        {url ? (
          <Text style={styles.title}>
            {title || url}
          </Text>
        ) : (
          <Text style={styles.title}>{title || url}</Text>
        )}
        <Text style={styles.description}>{note}</Text>
        {timestamp && <Text style={styles.timestamp}>{relativeTimeFromEpoch(timestamp.seconds)}</Text>}
      </Pressable>
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
