export class CachePolicy {
  private static maxCacheExpirationDateInDays = 3

  private constructor() {}

  static validate(timestamp: Date, date: Date): Boolean {
    const maxCacheExpiration = new Date(timestamp)

    maxCacheExpiration.setDate(maxCacheExpiration.getDate() + CachePolicy.maxCacheExpirationDateInDays)
    
    return maxCacheExpiration > date
  }
}
