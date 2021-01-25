export const getCacheExpirationDate = (timestamp: Date): Date => {
  const date = new Date(timestamp)
  date.setDate(date.getDate() - 3)
  return date
}
