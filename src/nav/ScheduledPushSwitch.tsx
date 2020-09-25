import React from "react";
import { ReactElement } from "react";
import { Switch } from "react-native-paper";
import { setOrUpdateScheduledPush } from "scheduledPush";
import Text from 'components/Text';
import { View } from "react-native";
import { addNotificationTime, removeNotificationTime } from "reducers/newRocks";
import { useDispatch } from "react-redux";

interface ScheduledPushSwitch{
  hours: number
  minutes: number
}
const ScheduledPushSwitch = ({hours, minutes}: ScheduledPushSwitch): ReactElement => {
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const dispatch = useDispatch()

  const onToggleSwitch = () => {
    const newSwitchVal = !isSwitchOn
    if (newSwitchVal) {
      dispatch(addNotificationTime({hours, minutes}))
    } else {
      dispatch(removeNotificationTime({hours, minutes}))
    }
    setOrUpdateScheduledPush()
    setIsSwitchOn(newSwitchVal);
  }
  return (
    <View style={{flexDirection: 'column'}}>
      <Text>{`${hours}:${minutes}`}</Text>
      <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
    </View>
  );

}
export default ScheduledPushSwitch;