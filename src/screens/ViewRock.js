import React from 'react';
import RockDetails from 'components/RockDetails.component'
import { StyleSheet, ScrollView } from 'react-native';

const ViewRock = ({ route }) => {
  const rockParams = route.params

  return (
    <View style={{flex:1}}>
      <ScrollView>
        <RockDetails {...rockParams} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  test: {
    padding: 10,
  },
});

export default ViewRock;
