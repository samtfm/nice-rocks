import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pressable, StyleSheet, View } from "react-native";
import { setNotificationTime } from 'reducers/newRocksReducer';
import { RootState } from 'reducers/rootReducer';
import ScheduledPushSwitch from './ScheduledPushSwitch';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from 'styles/colors';
import Text from 'components/Text';
import { setOrUpdateScheduledPush } from 'scheduledPush';

const ScheduledPushSwitches = () => {
  const timeList = useSelector(
    (state: RootState) => {
      const { notifTimes } = state.newRocks
      return Object.values(notifTimes).sort((a, b) => (a.hours * 60 + a.minutes) - (b.hours * 60 + b.minutes))
    }
  )
  const dispatch = useDispatch();
  const [newTime, setNewTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const onPickTime = (e, time) => {
    setShowTimePicker(false)
    if (time) {
      dispatch(setNotificationTime({
        hours: time.getHours(), 
        minutes: time.getMinutes(),
        disabled: false,
      }))
      setNewTime(time)
      setOrUpdateScheduledPush()
    }
  }

  return (
    <View style={styles.main}>
      {timeList.map(time => (
        <ScheduledPushSwitch 
          key={`${time.hours}${time.minutes}`}
          hours={time.hours} 
          minutes={time.minutes}
          enabled={!time.disabled} />
      ))} 
      <Pressable style={styles.newTimeButton}
        onPress={() => setShowTimePicker(true)}
      >
        <Icon 
          name='plus'
          color={colors.gray60}
          size={22}
        />
        <Text style={{color: colors.gray60}}>{"add time"}</Text>
      </Pressable>
      {showTimePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={newTime}
          mode='time'
          is24Hour={true}
          display="default"
          onChange={onPickTime}
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
  }
})


export default ScheduledPushSwitches;