import { getNextTime } from 'reducers/util';


notifTime = (hrs, mins, disabled=false) => ({
  [`${hrs}:${mins}`]: {
    hours: hrs,
    minutes: mins,
    disabled: disabled,
  }
})

const genEpochTime = (clockStr) => {
  const fakeDate = new Date(`2020-09-29T${clockStr}:00Z`)
  const epochTime = fakeDate.getTime() + fakeDate.getTimezoneOffset() * 60 * 1000
  return epochTime;
}

describe('getNextTime', () => {
  it('', () => {
    global.Date.now = jest.fn(() => genEpochTime('06:40'))
    const notifTimes = {
      ...notifTime(10,20),
      ...notifTime(17,30),
    }
    expect(
      getNextTime(notifTimes)
    ).toEqual(genEpochTime('10:20'))
  })
  it('returns null when there are no notif times', () => {
    global.Date.now = jest.fn(() => genEpochTime('06:19'))
    const notifTimes = {
    }
    expect(
      getNextTime(notifTimes)
    ).toEqual(null)
  })
  it('skips disabled times', () => {
    global.Date.now = jest.fn(() => genEpochTime('06:00'))
    const notifTimes = {
      ...notifTime(10,20, true),
      ...notifTime(12,30),
      ...notifTime(17,30),
    }
    expect(
      getNextTime(notifTimes)
    ).toEqual(genEpochTime('12:30'))
  })
  it('properly picks times into the next day', () => {
    global.Date.now = jest.fn(() => genEpochTime('18:00'))
    const notifTimes = {
      ...notifTime(10,20),
      ...notifTime(12,30),
      ...notifTime(17,30),
    }
    expect(
      getNextTime(notifTimes)
    ).toEqual(genEpochTime('10:20')+ 1000 * 60 * 60 * 24)
  })
})