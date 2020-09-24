var PushNotification = require("react-native-push-notification");
import { store } from 'reducers/rootReducer';
import PushNotificationIOS from "@react-native-community/push-notification-ios";


export const NEW_ROCKS_PUSH_ID = '123456789';

const getNextTime = () => {
  const {settings: {disableAll, enableInstantRocks, notificationTimes}} = store.getState()
  const times = Object.values(notificationTimes)

  if (times.length === 0 || disableAll || enableInstantRocks ) { return null }

  const currentTime = new Date()
  const currentMinutes = currentTime.getMinutes() + currentTime.getHours() * 60
  const minuteTimers = times.map(t => {
    let minutes = t.minutes + t.hours * 60
    if (minutes < currentMinutes) { minutes += 24 * 60 }
    return minutes
  })
  minuteTimers.sort((a, b) => a - b)
  const shortestTimerInSeconds = minuteTimers[0] * 1000*60
  return Date.now() + shortestTimerInSeconds
}

export const updateScheduledPush = () => {
  const state = store.getState()
  PushNotification.cancelLocalNotifications({id: NEW_ROCKS_PUSH_ID});
  const newRocks = Object.values(state.notifications)

  const nextTime = getNextTime()
  if (nextTime && newRocks.length) {
    PushNotification.localNotificationSchedule({
      title: `${newRocks.length} new rocks to explore!`,
      message: "check em out!",
      date: nextTime,
      id: NEW_ROCKS_PUSH_ID,
      data: {
        type: 'new-rocks',
      },
      allowWhileIdle: true,
    })  
  }
  console.log('updated')
}
