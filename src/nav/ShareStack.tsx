import React, { ReactElement } from 'react';
import { isEmpty } from 'react-redux-firebase';
import { RootState } from 'reducers/rootReducer';
import { useSelector } from 'react-redux';
import MessagingWrapper from 'components/MessagingWrapper';
import ContactSelector from 'components/ContactSelector';
import { createStackNavigator } from '@react-navigation/stack';
import ComposeRock from 'screens/ComposeRock';
import Login from 'screens/Login';
import colors from 'styles/colors';


const MainNav = createStackNavigator();
const ModalNav = createStackNavigator();
const screenOptions = {
  headerStyle: { backgroundColor: colors.primaryLight},
  cardStyle: { backgroundColor: 'white' },
}


const LoggedInStack = (): ReactElement => {
  return (
    <MainNav.Navigator
      initialRouteName="ComposeRock"
      screenOptions={screenOptions}
    >
      <MainNav.Screen
        name="ComposeRock"
        component={ComposeRock}
        options={{ title: 'Send a new rock' }}
        initialParams={{ share: true }}
      />
    </MainNav.Navigator>
  )
}

const LoggedOutStack = (): ReactElement => {
  return (
    <MainNav.Navigator initialRouteName="Login" screenOptions={screenOptions}>
      <MainNav.Screen
        name="Login"
        component={Login}
        options={{ title: 'Login' }}
      />
    </MainNav.Navigator>
  )
}
const ShareStack = (): ReactElement => {
  const auth = useSelector((state : RootState) => state.firebase.auth)
  return isEmpty(auth) ? (
    <LoggedOutStack/>
  ) : (
    <MessagingWrapper>
      <ModalNav.Navigator
        mode="modal"
        screenOptions={screenOptions}
      >
        <ModalNav.Screen
          name="Main"
          component={LoggedInStack}
          options={{ headerShown: false }}
        />
        <ModalNav.Screen
          name="SelectContact"
          component={ContactSelector}
          options={{ title: 'Select contact', headerBackTitle: "Cancel" }}
        />
      </ModalNav.Navigator>
    </MessagingWrapper>
  );
}

export default ShareStack;