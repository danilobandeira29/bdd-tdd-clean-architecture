class LocalSavePurchase {

  constructor(private readonly cacheRepository: CacheRepositoryInterface) {}

  execute = async () => {
    this.cacheRepository.delete('purchaseKey')
  }

}

interface CacheRepositoryInterface {
  delete: (key: string) => void
}


class FakeCacheRepository implements CacheRepositoryInterface {
  deleteCallsCount = 0
  key = ''

  delete = (key: string): void => {
    this.deleteCallsCount++
    this.key = key
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
    expect(fakeCacheRepository.key).toBe('purchaseKey')
  })

})
