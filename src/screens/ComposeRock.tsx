import React, { ReactElement } from 'react';
import NewRockForm from 'components/NewRockForm'
import { StyleSheet, ScrollView } from 'react-native';

interface ComposeRock{
  route: any
}

const ComposeRock = ({route}: ComposeRock): ReactElement => {
  const toUserId = route && route.params && route.params.toUserId;

  return (
    <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.main}>
      <NewRockForm toUserId={toUserId}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex:1,
    padding: 10,
    backgroundColor: 'white',
  },
});

export default ComposeRock;
