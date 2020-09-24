import React from "react";
import { ReactElement } from "react";
import { Switch } from "react-native-paper";
import { addNotificationTime } from "reducers/settingsReducer";
import { updateScheduledPush } from "scheduledPush";
import Text from 'components/Text';
import { View } from "react-native";

interface ScheduledPushSwitch{
  hours: number
  minutes: number
}
const ScheduledPushSwitch = ({hours, minutes}: ScheduledPushSwitch): ReactElement => {
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const onToggleSwitch = () => {
    updateScheduledPush()
    if (!isSwitchOn) {
      addNotificationTime({hours, minutes})
    }
    addNotificationTime
    setIsSwitchOn(!isSwitchOn);
  }
  return (
    <View style={{flexDirection: 'column'}}>
      <Text>{`${hours}:${minutes}`}</Text>
      <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
    </View>
  );

}
export default ScheduledPushSwitch;