import React from 'react';
import RecievedRocks from 'components/RecievedRocks.component'
import ComposeButton from 'components/ComposeButton.component'
import { StyleSheet, Text, ScrollView, View, Button } from 'react-native';
import { useFirestoreConnect } from 'react-redux-firebase'
import { useSelector } from 'react-redux'

const Home = ({ navigation }) => {
  const {uid} = useSelector(state => state.firebase.auth)
  useFirestoreConnect(() => [{ collection: "users", doc: uid }])

  const userData = useSelector(
    ({ firestore: { data } }) => {
      return data.users && data.users[uid]
    }
  )
  return (
    <View style={{flex:1}}>
      <ScrollView>
        <RecievedRocks />
      </ScrollView>
      <ComposeButton />
    </View>
  );
}

const styles = StyleSheet.create({
  test: {
    padding: 10,
  },
});

export default Home;
