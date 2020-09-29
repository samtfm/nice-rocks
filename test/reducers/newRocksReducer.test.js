import newRocksReducer, {queueNewRock, lookedAtRock, setNotificationTime, removeNotificationTime} from 'reducers/newRocksReducer';
import { getNextTime } from 'reducers/util';

jest.mock('reducers/util');
const fakeTimeFuture = 100000000000000;
const fakeTimePast = 1000

const fakeRock = (testId) => ({
  id: `fake-id-${testId}`,
  rockId: `fake-rock-id-${testId}`,
  fromUserDisplayName: `fake-display-name-${testId}`,
  title: `fake-title-${testId}`,
})

const notifTime = (hrs, mins, disabled=false) => ({
  [`${hrs}:${mins}`]: {
    hours: hrs,
    minutes: mins,
    disabled: disabled,
  }
})
const basicNotifTimes = {
  ...notifTime(17,30),
  ...notifTime(9,0),
}
const initialState = {
  rocks: [],
  nextNotifDateTime: null,
  notifTimes: basicNotifTimes,
}

describe('newRocksReducer', () => {
  beforeEach(() => {
    getNextTime.mockReturnValue(fakeTimeFuture);
  });

  it('queueNewRock adds when when empty', () => {
    expect(
      newRocksReducer(
        {...initialState},
        queueNewRock(fakeRock(1)),
      )
    ).toEqual({
      ...initialState,
      rocks: [fakeRock(1)],
      nextNotifDateTime: fakeTimeFuture,
    });
  });

  it('queueNewRock adds when state already has new rocks', () => {
    expect(
      newRocksReducer(
        {...initialState, rocks: [fakeRock('older')], nextNotifDateTime: fakeTimeFuture},
        queueNewRock(fakeRock('newer')),
      )
    ).toEqual({
      ...initialState,
      rocks: [fakeRock('older'), fakeRock('newer')],
      nextNotifDateTime: fakeTimeFuture,
    });
  });
  it('queueNewRock clears and then adds when holding old rocks', () => {
    expect(
      newRocksReducer(
        {...initialState, rocks: [fakeRock('too-old')], nextNotifDateTime: fakeTimePast},
        queueNewRock(fakeRock('newer')),
      )
    ).toEqual({
      ...initialState,
      rocks: [fakeRock('newer')],
      nextNotifDateTime: fakeTimeFuture,
    });
  });

  it('lookedAtRock removes rock from queue', () => {
    expect(
      newRocksReducer(
        {...initialState, rocks: [fakeRock(1), fakeRock(2)]},
        lookedAtRock(fakeRock(1)),
      )
    ).toEqual({
      ...initialState,
      rocks: [fakeRock(2)],
    });
  });

  it('lookedAtRock politely does nothing if looking a not queued rock', () => {
    expect(
      newRocksReducer(
        {...initialState, rocks: [fakeRock(1), fakeRock(2)]},
        lookedAtRock(fakeRock(3)),
      )
    ).toEqual({
      ...initialState,
      rocks: [fakeRock(1), fakeRock(2)],
    });
  });

  it('setNotificationTime adds a new notif time', () => {
    expect(
      newRocksReducer(
        {...initialState},
        setNotificationTime({hours: 10, minutes: 20}),
      )
    ).toEqual({
      ...initialState,
      notifTimes: {
        ...basicNotifTimes,
        ...notifTime(10, 20)
      },
      nextNotifDateTime: fakeTimeFuture,
    });
  })
  it('setNotificationTime updates an existing notif time', () => {
    expect(
      newRocksReducer(
        {...initialState,
        notifTimes: {
          ...notifTime(17,30),
          ...notifTime(9,0, false),        
        }},
        setNotificationTime({hours: 9, minutes: 0, disabled: true}),
      )
    ).toEqual({
      ...initialState,
      notifTimes: {
        ...basicNotifTimes,
        ...notifTime(17, 30),
        ...notifTime(9, 0, true),
      },
      nextNotifDateTime: fakeTimeFuture,
    });
  })
  it('removeNotificationTime updates an existing notif time', () => {
    expect(
      newRocksReducer(
        {...initialState,
        notifTimes: {
          ...notifTime(17,30),
          ...notifTime(9,0, false),        
        }},
        removeNotificationTime({hours: 9, minutes: 0}),
      )
    ).toEqual({
      ...initialState,
      notifTimes: {
        ...notifTime(17, 30),
      },
      nextNotifDateTime: fakeTimeFuture,
    });
  })
})