import React from "react";
import { ReactElement } from "react";
import { Switch } from "react-native-paper";
import { setOrUpdateScheduledPush } from "scheduledPush";
import Text from 'components/Text';
import { Pressable, StyleSheet, View } from "react-native";
import { removeNotificationTime, setNotificationTime } from "reducers/newRocksReducer";
import { useDispatch } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import colors from "styles/colors";

interface ScheduledPushSwitch{
  hours: number
  minutes: number
  value: boolean
  disabled: boolean
}
const ScheduledPushSwitch = ({hours, minutes, value, disabled}: ScheduledPushSwitch): ReactElement => {
  const dispatch = useDispatch()

  const onToggleSwitch = () => {
    const newSwitchVal = !value
    dispatch(setNotificationTime({hours, minutes, disabled: !newSwitchVal}))
    setOrUpdateScheduledPush()
  }

  const ampm = hours < 12 ? 'am' : 'pm'
  const mins = minutes < 10 ? `0${minutes}` : `${minutes}`
  const hrs = `${[0,12].includes(hours) ? 12: hours%12}`
  const timeString = `${hrs}:${mins}${ampm} `


  return (
    <View style={styles.main}>
      {!disabled && <Pressable
        onPress={() => {
          dispatch(removeNotificationTime({hours, minutes}));
          setOrUpdateScheduledPush();
        }}
        style={{'backgroundColor': colors.gray90, borderRadius: 50, padding: 3}}
      >
        <Icon
          name='close'
          color={colors.gray60}
          size={14}
        />
      </Pressable>}

      <View style={styles.spacer} />
      <Text style={disabled ? {color: colors.gray50}: {}}>{timeString}</Text>
      <Switch value={value} disabled={disabled} onValueChange={onToggleSwitch} />
    </View>
  );

}
const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: colors.gray90,
    borderRadius: 14, // shrinks the borderBottom
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  spacer: {
    flex: 1,
  },
})
export default ScheduledPushSwitch;