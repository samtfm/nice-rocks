export const getNextTime = (notifTimes: {[str: string]: Time}): number | null => {
  const times = Object.values(notifTimes).filter(time => !time.disabled)
  if (times.length === 0) { return null }

  const currentTime = new Date(Date.now())
  const currentMinutes = currentTime.getMinutes() + currentTime.getHours() * 60

  const minuteTimers = times.map(t => {
    let minutes = t.minutes + t.hours * 60 - currentMinutes
    if (minutes < 0) { minutes += 24 * 60 }
    return minutes
  })
  minuteTimers.sort((a, b) => a - b)

  const currentEpochMinutes = Math.floor(currentTime.getTime() / (60 * 1000))
  const nextTimeEpoch = (currentEpochMinutes + minuteTimers[0]) * 60 * 1000
  return nextTimeEpoch
}

