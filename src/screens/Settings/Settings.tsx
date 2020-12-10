import React, { ReactElement, useState } from "react";
import { View, StyleSheet } from "react-native";
import { RadioButton } from "react-native-paper";
import { useSelector } from "react-redux";
import { useFirestore } from "react-redux-firebase";
import { RootState } from "reducers/rootReducer";
import colors from "styles/colors";
import ScheduledPushSwitches from "./ScheduledPushSwitches";
import Text from 'components/Text';

const Settings = (): ReactElement => {

  const userData = useSelector((state : RootState) => (state.firestore.data.userData));
  const uid = userData.id
  const canonEnableInstantRocks = userData.enableInstantRocks

  const [tempEnableInstantRocks, setTempEnableInstantRocks] = useState<Boolean | null>(null)
  const enableInstantRocks = tempEnableInstantRocks !== null ? tempEnableInstantRocks : canonEnableInstantRocks

  const firestore = useFirestore();
  

  const setEnableInstantRocks = (val: boolean) => {
    const ref = { collection: `users`, doc: uid }
    setTempEnableInstantRocks(val)
    firestore.update(ref,{
      enableInstantRocks: val,
    }).then(() => {
      setTempEnableInstantRocks(null)
    }, () => {
      setTempEnableInstantRocks(null)
    });
  }

  return (
    <View style={styles.main}>
      <View style={styles.section}>
        <Text style={styles.title}>New rock notifications</Text>
        <RadioButton.Group onValueChange={value => setEnableInstantRocks(value === 'instant')} value={enableInstantRocks ? 'instant' : 'scheduled'}>
          <View style={{paddingLeft: 10}}>
            <RadioButton.Item 
              value="instant" 
              label="Immediate"
              labelStyle={{fontFamily: 'Bitter-Regular', fontSize: 14}}
            />
            <RadioButton.Item
              value="scheduled"
              label="Scheduled"
              labelStyle={{fontFamily: 'Bitter-Regular', fontSize: 14}}
            />
          </View>
        </RadioButton.Group>    
      </View>

      <View style={styles.section}>
        <Text style={{...styles.title, color: enableInstantRocks ? colors.gray60 : colors.gray20 }}>Notification times</Text>
        <View style={{paddingLeft: 10}}>
          <ScheduledPushSwitches disableAll={enableInstantRocks}/>
        </View>
      </View>
      <View style={styles.spacer}></View>
    </View>
  )
}
const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginTop: 10,
  },
  header: {
    marginBottom: 20,
    backgroundColor: colors.primaryLight,
    paddingLeft: 20,
    paddingRight: 6,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    paddingHorizontal: 10,
    fontWeight: 'bold',
    fontFamily: 'System',
    fontSize: 14,
  },
  spacer: {
    flex: 1,
  },
  notifModeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginBottom: 20,
  },
  section: {
    marginBottom: 18,
  },
});

export default Settings;