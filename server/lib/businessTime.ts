const MAPUTO_TIMEZONE = 'Africa/Maputo'

function toDateParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: MAPUTO_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  })

  const parts = formatter.formatToParts(date)
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? ''

  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
    weekday: get('weekday').toLowerCase(),
  }
}

export function getCurrentDateKeyMaputo(date = new Date()): string {
  const { year, month, day } = toDateParts(date)
  return `${year}-${month}-${day}`
}

export function getMaputoWeekdayNumber(date = new Date()): number {
  const weekday = toDateParts(date).weekday
  switch (weekday) {
    case 'sun':
      return 0
    case 'mon':
      return 1
    case 'tue':
      return 2
    case 'wed':
      return 3
    case 'thu':
      return 4
    case 'fri':
      return 5
    case 'sat':
      return 6
    default:
      return date.getUTCDay()
  }
}

export function isFridayInMaputo(date = new Date()): boolean {
  return getMaputoWeekdayNumber(date) === 5
}
