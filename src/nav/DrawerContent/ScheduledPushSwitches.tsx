import React, { ReactElement, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { setNotificationTime } from 'reducers/newRocksReducer';
import { RootState } from 'reducers/rootReducer';
import ScheduledPushSwitch from './ScheduledPushSwitch';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from 'styles/colors';
import Text from 'components/Text';
import { Button, HelperText, Modal, Portal } from 'react-native-paper';

interface ScheduledPushSwitches {
  disableAll: boolean
}
const ScheduledPushSwitches = ({disableAll}: ScheduledPushSwitches): ReactElement => {
  const timeList = useSelector(
    (state: RootState) => {
      const { notifTimes } = state.newRocks
      return Object.values(notifTimes).sort((a, b) => (a.hours * 60 + a.minutes) - (b.hours * 60 + b.minutes))
    }
  )
  const dispatch = useDispatch();
  const [newTime, setNewTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const onChange = (_e: any, time: Date | undefined) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (time) {
      setNewTime(time)
      if (Platform.OS !== 'ios') {
        addTimeToggle(time)
      }
    }
  }

  const addTimeToggle = (time: Date) => {
    dispatch(setNotificationTime({
      hours: time.getHours(), 
      minutes: time.getMinutes(),
      disabled: false,
    }))
  }

  return (
    <View style={styles.main}>
      {timeList.map(time => (
        <ScheduledPushSwitch 
          key={`${time.hours}${time.minutes}`}
          hours={time.hours} 
          minutes={time.minutes}
          value={!time.disabled}
          disabled={disableAll}
        />
      ))} 
      {timeList.length < 5 && !disableAll && <Pressable style={styles.newTimeButton}
        onPress={() => setShowTimePicker(true)}
      >
        <Icon 
          name='plus'
          color={colors.gray50}
          size={22}
        />
        <Text style={{color: colors.gray40}}>{"new time"}</Text>
      </Pressable>}
      {timeList.length < 2 && (
        <HelperText 
        type="error"
        visible={!disableAll && (timeList.length === 0 || timeList.every(time => time.disabled))}
      >{"No active times. Add or enable a time to receive push notifications."}</HelperText>
      )}


      {Platform.OS === 'ios' ? (
        <Portal>
          <Modal contentContainerStyle={styles.iosTimePickerModal} visible={showTimePicker} onDismiss={() => setShowTimePicker(false)} >
            <DateTimePicker
              style={styles.iosTimePicker}
              value={newTime}
              mode='time'
              display='default'
              onChange={onChange}
            />
            <View style={{flexDirection: 'row', marginBottom: 10}}>
              <Button color={colors.gray70} onPress={() => setShowTimePicker(false)}>cancel</Button>
              <Button onPress={() => {
                addTimeToggle(newTime)
                setShowTimePicker(false)
              }}>ok</Button>
            </View>
          </Modal>
        </Portal>
      ) : (
        showTimePicker && <DateTimePicker
          value={newTime}
          mode='time'
          display='default'
          onChange={onChange}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    alignItems: 'flex-end',
    paddingBottom: 30,
    marginBottom: 20,
    marginTop: 2,
  },
  newTimeButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    bottom: 0,
    borderRadius: 50,
    backgroundColor: colors.gray93,
    paddingRight: 10,
    paddingVertical: 2,
    paddingLeft: 2,
    flexDirection: 'row',
    marginLeft: 10,
    marginVertical: 4,
  },
  iosTimePickerModal: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 3,
  },
  iosTimePicker: {
    height: 200,
    width: 240,
  }
})


export default ScheduledPushSwitches;