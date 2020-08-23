import React from 'react';
import RecievedRocks from 'components/RecievedRocks.component'
import SentRocks from 'components/SentRocks.component'
import ComposeButton from 'components/ComposeButton.component'
import { StyleSheet, Text, ScrollView, View, Button } from 'react-native';
import { useSelector } from 'react-redux'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const Home = ({ navigation }) => {

  const userData = useSelector(
    ({ firestore: { data } }) => {
      return data.userData
    }
  )

  return (
    <View style={{flex:1, padding: 10}}>
      <Tab.Navigator>
        <Tab.Screen name="Recieved" component={RecievedRocks}/>
        <Tab.Screen name="Sent" component={SentRocks} />
      </Tab.Navigator>

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
