/**
 * Add minutes to a date
 */
export const addMinutes = (date: Date, minutes: number): Date => {
  const result = new Date(date)
  result.setMinutes(result.getMinutes() + minutes)
  return result
}

/**
 * Format date to ISO string
 */
export const toISOString = (date: Date): string => {
  return date.toISOString()
}

/**
 * Check if time has passed
 */
export const isPastTime = (dateString: string): boolean => {
  return new Date(dateString) <= new Date()
}
