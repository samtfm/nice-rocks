import React, { ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from 'styles/colors';
import { FAB } from 'react-native-paper';

const ComposeButton = (): ReactElement => {
  const navigation = useNavigation();

  return <FAB
    style={styles.fab}
    // small
    color={colors.white}
    icon="plus"
    onPress={() => navigation.navigate('ComposeRock')}
  />
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 60,
  },
})

export default ComposeButton;
