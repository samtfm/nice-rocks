import React from 'react';
import RockList from 'components/RockList.component'
import NewRockForm from 'components/NewRockForm.component'
import { StyleSheet, Text, ScrollView } from 'react-native';
import { useFirestoreConnect } from 'react-redux-firebase'
import { useSelector } from 'react-redux'

const ComposeRockScreen = () => {
  return (
    <ScrollView>
      <NewRockForm />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  test: {
    padding: 10,
  },
});

export default ComposeRockScreen;
