import React, { ReactElement, useContext, useState } from 'react';
import { isEmpty } from 'react-redux-firebase';
import { RootState } from 'reducers/rootReducer';
import { useSelector } from 'react-redux';
import MessagingWrapper from 'components/MessagingWrapper';
import ContactSelector from 'components/ContactSelector';
import { createStackNavigator } from '@react-navigation/stack';
import Home from 'nav/Home';
import ComposeRock from 'screens/ComposeRock';
import ViewRock from 'screens/ViewRock';
import Login from 'screens/Login';
import colors from 'styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from './DrawerContent';
import IsShareExtensionContext from 'IsShareExtensionContext';
import Settings from 'screens/Settings';
import Support from 'screens/Support';

const DrawerNav = createDrawerNavigator();

const MainNav = createStackNavigator();
const ModalNav = createStackNavigator();
const screenOptions = {
  headerStyle: { backgroundColor: colors.primaryLight},
  cardStyle: { backgroundColor: 'white' },
}

const Hamburger = ({navigation}: any): ReactElement => {
  return (
    <Icon 
      style={{marginLeft: 6}}
      name="menu" 
      size={35} 
      // onPress={ () => navigation.navigate('DrawerOpen') } 
      // onPress={ () => navigation.openDrawer() } 
      onPress={ () => navigation.dispatch(DrawerActions.openDrawer())}
    />
  )
}

const useInitialRender = (): boolean => {
  const [isInitialRender, setIsInitialRender] = useState(false);

  if (!isInitialRender) {
    setTimeout(() => setIsInitialRender(true), 1);
    return true;
  }
  return false;
};

const LoggedInStackWithDrawer = () => {
  const isInitialRender = useInitialRender()
  return (<DrawerNav.Navigator 
    
    initialRouteName="Main"
    drawerContent={(props) => <DrawerContent {...props} />}
    drawerStyle={isInitialRender ? { width: 0 } : {}}
    >
    <DrawerNav.Screen name="Main" component={LoggedInStack} />
  </DrawerNav.Navigator>
  )
  }


interface LoggedInStack {
  shareExtension?: boolean
}
const LoggedInStack = (): ReactElement => {
  const navigation = useNavigation();
  const isShareExtension = useContext(IsShareExtensionContext);

  return (
    <MainNav.Navigator
      initialRouteName={isShareExtension ? "ComposeRock" : "Home"}
      screenOptions={screenOptions}
    >
      <MainNav.Screen
        name="Home"
        component={Home}
        options={{ 
          title: 'My collection',
          // headerStyle: { backgroundColor: 'white'},
          headerLeft: () => <Hamburger navigation={navigation}/>,
          // headerRight: () =>  <AvatarMenu uid={uid} />,
         }}
      />
      <MainNav.Screen
        name="ComposeRock"
        component={ComposeRock}
        options={{ title: 'Send a new rock' }}
        initialParams={isShareExtension ? { share: true } : {} }
      />
      <MainNav.Screen
        name="ViewRock"
        component={ViewRock}
        options={{ title: 'View rock' }}
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
const MainStack = (): ReactElement => {
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
          component={LoggedInStackWithDrawer}
          options={{ headerShown: false }}
        />
        <ModalNav.Screen
          name="SelectContact"
          component={ContactSelector}
          options={{ title: 'Select contact', headerBackTitle: "Cancel" }}
        />
        <ModalNav.Screen
          name="Settings"
          component={Settings}
          options={{ title: 'Settings'}}
        />
        <ModalNav.Screen
          name="Support"
          component={Support}
          options={{ title: 'Support' }}
        />
      </ModalNav.Navigator>
    </MessagingWrapper>
  );
}

export default MainStack;