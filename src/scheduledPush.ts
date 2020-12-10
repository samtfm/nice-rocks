var PushNotification = require("react-native-push-notification");
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';
import { queueNewRock } from 'reducers/newRocksReducer';
import { RootState } from 'reducers/rootReducer';

export const NEW_ROCKS_PUSH_ID = '123456789';

const trunc = (str: string, chars: number) => {
  if (str.length <= chars) {
    return str;
  } else {
    return str.slice(0, chars-3) + '...'
  }
}

export const setOrUpdateScheduledPush = (state: RootState) => {
  // clear any old scheduled push
  PushNotification.cancelAllLocalNotifications()
  if(Platform.OS === 'ios'){
    PushNotificationIOS.cancelAllLocalNotifications()
  }


  // PushNotification.cancelLocalNotifications({id: NEW_ROCKS_PUSH_ID});
  const enableInstantRocks  = state.firestore.data?.userData.enableInstantRocks;

  if ( enableInstantRocks ) { return }

  const { rocks, nextNotifDateTime } = state.newRocks
  if (nextNotifDateTime && nextNotifDateTime > Date.now()) {
    const date = new Date(nextNotifDateTime)
    if (rocks.length === 1) {
      const rock = rocks[0]
      schedulePush({
        title: rock.fromDisplayName,
        message: rock.title,
        date: date,
        id: NEW_ROCKS_PUSH_ID,
        data: {
          type: 'new-rock',
          profileId: rock.toUserId,
          rockId: rock.id,
          local: true,
        }
      })
    } else if (rocks.length > 1) {
      schedulePush({
        title: `New rocks to explore!`,
        message: `"${trunc(rocks[0].title, 30)}" and ${rocks.length-1} more`,
        date: date,
        id: NEW_ROCKS_PUSH_ID,
        data: {
          type: 'new-rocks',
          local: true,
        },
      })    
    }
  }
}

export const handleIncomingDataPush = (dispatch: (action: any) => void, data: any) => {
  if (data.type === 'new-rock-data') {
    const { fromDisplayName, profileId, rockId, rockTitle } = data
    dispatch(queueNewRock({toUserId: profileId, id: rockId, title: rockTitle, fromDisplayName}))
  }
}

interface SchedPushData{
  title: string
  message: string
  date: Date,
  id?: string,
  data: {
    type: string,
    local: boolean,
    [other: string]: any
  },
}
const schedulePush = ({title, message, date, id, data}: SchedPushData) => {
  if (Platform.OS === 'ios') {
    PushNotificationIOS.scheduleLocalNotification({
      fireDate: date.toISOString(),
      alertTitle : title,
      alertBody : message,
      userInfo: data,
    })
  } else {
    PushNotification.localNotificationSchedule({
      title, message, date, id, data,
      allowWhileIdle: true,
    }) 
  }
}

interface PushData {
  title: string
  message: string
  id?: string,
  data: {
    type: string,
    local: boolean,
    [other: string]: any
  },
}

export const instantPush = ({title, message, id, data}: PushData) => {
  if (Platform.OS === 'ios') {
    PushNotificationIOS.presentLocalNotification({
      alertTitle : title,
      alertBody : message,
      userInfo: {...data, local: true},
    })
  } else {
    PushNotification.localNotification({
      title, message, id, 
      data: {...data, local: true},
      allowWhileIdle: true,
    }) 
  }
}

