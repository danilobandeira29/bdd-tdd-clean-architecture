import { CacheRepositoryInterface } from '@/data/interfaces/cache'
import { LocalSavePurchase } from '@/data/use-cases'

class FakeCacheRepository implements CacheRepositoryInterface {

  delete = (key: string): void => {}
  save = (key: string): void => {}
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

  test('should not save a cache if delete old cache fails', () => {
    const spyDeleteFromFakeCacheRepository = jest
    .spyOn(fakeCacheRepository, 'delete')
    .mockImplementationOnce(() => { throw new Error() })

    const promise = localSavePurchase.execute()

    expect(spyDeleteFromFakeCacheRepository).toBeCalledTimes(1)
    expect(promise).rejects.toThrow()
  })

  test('should save a new cache if delete old cache succeeds', async () => {
    const spyDeleteFromFakeCacheRepository = jest.spyOn(fakeCacheRepository, 'delete')
    const spySaveOnFakeCacheRepository = jest.spyOn(fakeCacheRepository, 'save')

    await localSavePurchase.execute()

    expect(spyDeleteFromFakeCacheRepository).toBeCalledTimes(1)
    expect(spySaveOnFakeCacheRepository).toBeCalledTimes(1)
    expect(spySaveOnFakeCacheRepository).toBeCalledWith('newPurchaseKey')
  })

})
