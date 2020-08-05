import React from 'react';
import { StyleSheet, Text, View, Linking, Pressable } from 'react-native';
import { relativeTimeFromEpoch } from 'util/time';
import { useSelector } from 'react-redux'
import { useFirestoreConnect } from 'react-redux-firebase'
import { useNavigation } from '@react-navigation/native';

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
          <Text style={{...styles.title, ...styles.url}}>
            {title || url}
          </Text>
        ) : (
          <Text style={styles.title}>{title}</Text>
        )}
        <Text style={styles.description}>{note}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  rockItem: {
    padding: 10,
    marginBottom: 6,
    marginLeft: 16,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 3,
  },
  title: {
    fontWeight: 'bold',
    overflow: 'hidden',
    marginBottom: 8,
  },
  url: {
    color: '#00ace6',
  },
  description: {
    overflow: 'hidden',
  },
  timestamp: {
    color: 'gray',
    position: 'absolute',
    right: 8,
    bottom: 0,
  },
});

export default RockPreview;
