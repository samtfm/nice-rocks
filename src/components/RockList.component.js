import React from 'react';
import RockPreview from './RockPreview.component'
import { StyleSheet, Text, View } from 'react-native';
import { relativeTimeFromEpoch } from 'util/time';
import { useSelector } from 'react-redux'
import { useFirestoreConnect } from 'react-redux-firebase'

const RockList = ({rocks}) => {
  return (
    <View>
      {rocks.map(rock => (
          rock && <RockPreview {...rock} key={rock.id}/>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  test: {
    padding: 10,
  },
});

export default RockList;
