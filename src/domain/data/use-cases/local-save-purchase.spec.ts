class LocalSavePurchase {

  constructor(private readonly cacheRepository: CacheRepositoryInterface) {}

}

interface CacheRepositoryInterface {

}

class CacheRepository implements CacheRepositoryInterface {
  deleteCallsCount = 0
}

describe('LocalSavePurchase', () => {
  test('should not delete cache on init', () => {
    const cacheRepository = new CacheRepository()
    new LocalSavePurchase(cacheRepository)

    expect(cacheRepository.deleteCallsCount).toBe(0)
  })
})
