import { CacheRepositoryInterface } from '@/data/interfaces/cache'
import { LocalSavePurchase } from '@/data/use-cases'
import { PurchaseEntity } from '@/domain'

class FakeCacheRepository implements CacheRepositoryInterface {
  insertValue = []

  delete = (key: string): void => {}
  save = (key: string, value: any): void => {
    this.insertValue = value
  }
}

let fakeCacheRepository: FakeCacheRepository
let localSavePurchase: LocalSavePurchase
let spyDeleteFromFakeCacheRepository: jest.SpyInstance
let spySaveFromFakeCacheRepository: jest.SpyInstance
let purchases: Array<PurchaseEntity>

describe('LocalSavePurchase', () => {
  beforeEach(() => {
    fakeCacheRepository = new FakeCacheRepository()
    localSavePurchase = new LocalSavePurchase(fakeCacheRepository)
    spyDeleteFromFakeCacheRepository = jest.spyOn(fakeCacheRepository, 'delete')
    spySaveFromFakeCacheRepository = jest.spyOn(fakeCacheRepository, 'save')
    purchases = [
      {
        id: '1',
        date: new Date(),
        value: 44.4
      },
      {
        id: '2',
        date: new Date(),
        value: 21
      }
    ]
  })

  test('should not delete cache on init', () => {
    expect(spyDeleteFromFakeCacheRepository).toBeCalledTimes(0)
  })

  test('should delete old cache with key when a new cache is saved', async () => {
    await localSavePurchase.execute(purchases)
    
    expect(spyDeleteFromFakeCacheRepository).toBeCalledTimes(1)
    expect(spyDeleteFromFakeCacheRepository).toBeCalledWith('purchaseKey')
  })

  test('should not save a cache if delete old cache fails', () => {
    spyDeleteFromFakeCacheRepository
      .mockImplementationOnce(() => { throw new Error() })

    const promise = localSavePurchase.execute(purchases)

    expect(spyDeleteFromFakeCacheRepository).toBeCalledTimes(1)
    expect(promise).rejects.toThrow()
  })

  test('should save a new cache if delete old cache succeeds', async () => {
    await localSavePurchase.execute(purchases)

    expect(spyDeleteFromFakeCacheRepository).toBeCalledTimes(1)
    expect(spySaveFromFakeCacheRepository).toBeCalledTimes(1)
    expect(spySaveFromFakeCacheRepository)
      .toHaveBeenCalledWith('newPurchaseKey', purchases)
    expect(fakeCacheRepository.insertValue).toEqual(purchases)
  })

})
