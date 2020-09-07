import React, { ReactElement } from 'react';
import NewRockForm from 'components/NewRockForm'
import { StyleSheet, ScrollView } from 'react-native';

interface ComposeRock{
  route: any
}

const ComposeRock = ({route}: ComposeRock): ReactElement => {
  const toUserId = route && route.params && route.params.toUserId;
  const title = route && route.params && route.params.title;
  const url = route && route.params && route.params.url;


  return (
    <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.main}>
      <NewRockForm toUserId={toUserId} title={title} url={url} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex:1,
    padding: 10,
  },
});

export default ComposeRock;
