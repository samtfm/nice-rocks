import React from 'react';
import RockList from 'components/RockList.component'
import ComposeButton from 'components/ComposeButton.component'
import { StyleSheet, Text, ScrollView, View, Button } from 'react-native';
import { useFirestoreConnect } from 'react-redux-firebase'
import { useSelector } from 'react-redux'

const Home = ({ navigation }) => {
  const {uid} = useSelector(state => state.firebase.auth)
  useFirestoreConnect(() => [
    {
      collection: "profiles",
      doc: uid,
    }
  ])

  const userProfile = useSelector(
    ({ firestore: { data } }) => {
      return data.profiles && data.profiles[uid]
    }
  )

  return (
    <View style={{flex:1}}>
      <ScrollView>
        <Text>{userProfile && userProfile.displayName}'s Rocks</Text>
        <RockList uid={uid}/>
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
