import React from 'react';
import ReceivedRocks from 'components/ReceivedRocks'
import SentRocks from 'components/SentRocks'
import ArchivedRocks from 'components/ArchivedRocks'
import ComposeButton from 'components/ComposeButton'
import { StyleSheet, View } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createMaterialBottomTabNavigator();

const Home = () => {

  return (
    <View style={{flex:1}}>
      <Tab.Navigator
        initialRouteName="Received"
        activeColor={'hsl(126, 30%, 55%)'}
        barStyle={{ backgroundColor: 'white' }}
        >
        <Tab.Screen
          name="Archive"
          component={ArchivedRocks}
          options={{
            tabBarLabel: 'Archive',
            tabBarIcon: ({ color }) => (
              <Icon style={styles.icon} name={'archive'} color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Received"
          options={{
            tabBarLabel: 'Received',
            tabBarIcon: ({ color }) => (
              <Icon style={styles.icon} name={'home'} color={color} size={26} />
            ),
          }}
          component={ReceivedRocks}
        />
        <Tab.Screen
          name="Sent"
          component={SentRocks}
          options={{
            tabBarLabel: 'Sent',
            tabBarIcon: ({ color }) => (
              <Icon style={styles.icon} name={'cube-send'} color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
      <ComposeButton />
    </View>
  );
}
const styles = StyleSheet.create({
  icon: {
    width: 60,
    alignSelf: 'flex-start',
  }
})

export default Home;
