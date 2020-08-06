import React from 'react';
import NewRockForm from 'components/NewRockForm.component'
import { StyleSheet, ScrollView } from 'react-native';

const ComposeRock = ({route}) => {
  const toUserId = route && route.params && route.params.toUserId;

  return (
    <ScrollView style={{flex:1, padding: 10}}>
      <NewRockForm toUserId={toUserId}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  test: {
    padding: 10,
  },
});

export default ComposeRock;
