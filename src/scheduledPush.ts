var PushNotification = require("react-native-push-notification");
import { store } from 'reducers/rootReducer';

export const NEW_ROCKS_PUSH_ID = '123456789';

const trunc = (str: string, chars: number) => {
  if (str.length <= chars) {
    return str;
  } else {
    return str.slice(0, chars-3) + '...'
  }
}

export const setOrUpdateScheduledPush = () => {
  // clear any old scheduled push
  PushNotification.cancelLocalNotifications({id: NEW_ROCKS_PUSH_ID});

  const state = store.getState()
  const {settings: {disableAll, enableInstantRocks}} = state

  if (disableAll || enableInstantRocks ) { return }

  const { rocks, nextNotifDateTime } = state.newRocks

  if (nextNotifDateTime) {
    if (rocks.length === 1) {
      const rock = rocks[0]
      PushNotification.localNotificationSchedule({
        title: rock.fromDisplayName,
        message: rock.title,
        date: nextNotifDateTime,
        id: NEW_ROCKS_PUSH_ID,
        data: {
          type: 'new-rock',
          profileId: rock.profileId,
          rockId: rock.rockId,
        },
        allowWhileIdle: true,
      })    
    } else if (rocks.length > 1) {
      PushNotification.localNotificationSchedule({
        title: `New rocks to explore!`,
        message: `"${trunc(rocks[0].title, 30)}" and ${rocks.length} more`,
        date: nextNotifDateTime,
        id: NEW_ROCKS_PUSH_ID,
        data: {
          type: 'new-rocks',
        },
        allowWhileIdle: true,
      })    
    }
  }
}
