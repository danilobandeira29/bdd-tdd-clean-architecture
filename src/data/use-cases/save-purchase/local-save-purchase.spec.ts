import { CacheRepositoryInterface } from '@/data/interfaces/cache'
import { LocalSavePurchase } from '@/data/use-cases'

class FakeCacheRepository implements CacheRepositoryInterface {

  delete = (key: string): void => {}

}

let fakeCacheRepository: FakeCacheRepository
let localSavePurchase: LocalSavePurchase

describe('LocalSavePurchase', () => {
  beforeEach(() => {
    fakeCacheRepository = new FakeCacheRepository()
    localSavePurchase = new LocalSavePurchase(fakeCacheRepository)
  })

  test('should not delete cache on init', () => {
    const spyDeleteFromFakeCacheRepository = jest.spyOn(fakeCacheRepository, 'delete')

    expect(spyDeleteFromFakeCacheRepository).toBeCalledTimes(0)
  })

  test('should delete old cache with key when a new cache is saved', async () => {
    const spyDeleteFromFakeCacheRepository = jest.spyOn(fakeCacheRepository, 'delete')
   
    await localSavePurchase.execute()
    
    expect(spyDeleteFromFakeCacheRepository).toBeCalledTimes(1)
    expect(spyDeleteFromFakeCacheRepository).toBeCalledWith('purchaseKey')
  })

})
