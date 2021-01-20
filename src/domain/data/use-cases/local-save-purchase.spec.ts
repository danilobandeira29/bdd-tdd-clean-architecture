class LocalSavePurchase {

  constructor(private readonly cacheRepository: CacheRepositoryInterface) {}

  execute = async () => {
    this.cacheRepository.delete()
  }

}

interface CacheRepositoryInterface {
  delete: () => void
}


class FakeCacheRepository implements CacheRepositoryInterface {
  deleteCallsCount = 0
  saveCallsCount = 1

  delete = (): void => {
    this.deleteCallsCount++
  }

}

let fakeCacheRepository: FakeCacheRepository
let localSavePurchase: LocalSavePurchase

describe('LocalSavePurchase', () => {
  beforeEach(() => {
    fakeCacheRepository = new FakeCacheRepository()
    localSavePurchase = new LocalSavePurchase(fakeCacheRepository)
    
  })

  test('should not delete cache on init', () => {
    expect(fakeCacheRepository.deleteCallsCount).toBe(0)
  })

  test('should delete old cache when a new cache is saved', async () => {
    await localSavePurchase.execute()
    
    expect(fakeCacheRepository.deleteCallsCount).toBe(1)
  })
})
