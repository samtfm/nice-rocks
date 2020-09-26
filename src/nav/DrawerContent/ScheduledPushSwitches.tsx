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
import { setOrUpdateScheduledPush } from 'scheduledPush';
import { Button, Modal, Portal } from 'react-native-paper';

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
  const onChange = (e, time) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (time) {
      setNewTime(time)
      if (Platform.OS !== 'ios') {
        addTimeToggle(time)
      }
    }
  }

  const addTimeToggle = (time) => {
    dispatch(setNotificationTime({
      hours: time.getHours(), 
      minutes: time.getMinutes(),
      disabled: false,
    }))
    setOrUpdateScheduledPush()
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
      {timeList.length < 6 && !disableAll && <Pressable style={styles.newTimeButton}
        onPress={() => setShowTimePicker(true)}
      >
        <Icon 
          name='plus'
          color={colors.gray60}
          size={22}
        />
        <Text style={{color: colors.gray50}}>{"add time"}</Text>
      </Pressable>
      }
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
  },
  newTimeButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 50,
    backgroundColor: colors.gray90,
    paddingRight: 10,
    paddingVertical: 2,
    paddingLeft: 2,
    flexDirection: 'row',
    marginLeft: 10,
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