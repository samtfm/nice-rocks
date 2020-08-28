import React from 'react';
import ReceivedRocks from 'components/ReceivedRocks'
import SentRocks from 'components/SentRocks'
import ComposeButton from 'components/ComposeButton'
import { StyleSheet, ScrollView, View, Button } from 'react-native';
import Text from 'components/Text';
import { useSelector } from 'react-redux'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import colors from 'styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

const Home = ({ navigation }) => {

  const userData = useSelector(
    ({ firestore: { data } }) => {
      return data.userData
    }
  )

  return (
    <View style={{flex:1}}>
      <Tab.Navigator
        initialRouteName="Received"
        tabBarOptions={{
          activeTintColor: colors.blue,
        }}
      >
        <Tab.Screen
          name="Received"
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, size }) => (
              <Label iconName={'home'} text={'Recieved'} {...{color, size}}/>
            ),
          }}
          component={ReceivedRocks}
        />
        <Tab.Screen
          name="Sent"
          component={SentRocks}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, size }) => (
              <Label iconName={'cube-send'} text={'Sent'} {...{color, size}}/>
            ),
          }}
        />
      </Tab.Navigator>
      <ComposeButton />
    </View>
  );
}

const Label = ({iconName, color, size, text}) => (
  <View style={styles.label}>
    <Icon name={iconName} color={color} size={size} />
    <Text style={[styles.labelText, {color: color}]}>{text}</Text>
  </View>
)

const styles = StyleSheet.create({
  label: {
    alignItems: 'center',
  },
  labelText: {
    bottom: -14,
    fontSize: 11,
    position: 'absolute',
  }
});

export default Home;
