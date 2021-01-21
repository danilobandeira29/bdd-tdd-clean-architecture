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
let purchases: Array<PurchaseEntity>

describe('LocalSavePurchase', () => {
  beforeEach(() => {
    fakeCacheRepository = new FakeCacheRepository()
    localSavePurchase = new LocalSavePurchase(fakeCacheRepository)

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
    const spyDeleteFromFakeCacheRepository = jest.spyOn(fakeCacheRepository, 'delete')

    expect(spyDeleteFromFakeCacheRepository).toBeCalledTimes(0)
  })

  test('should delete old cache with key when a new cache is saved', async () => {
    const spyDeleteFromFakeCacheRepository = jest.spyOn(fakeCacheRepository, 'delete')
   
    await localSavePurchase.execute(purchases)
    
    expect(spyDeleteFromFakeCacheRepository).toBeCalledTimes(1)
    expect(spyDeleteFromFakeCacheRepository).toBeCalledWith('purchaseKey')
  })

  test('should not save a cache if delete old cache fails', () => {
    const spyDeleteFromFakeCacheRepository = jest
    .spyOn(fakeCacheRepository, 'delete')
    .mockImplementationOnce(() => { throw new Error() })

    const promise = localSavePurchase.execute(purchases)

    expect(spyDeleteFromFakeCacheRepository).toBeCalledTimes(1)
    expect(promise).rejects.toThrow()
  })

  test('should save a new cache if delete old cache succeeds', async () => {
    const spyDeleteFromFakeCacheRepository = jest.spyOn(fakeCacheRepository, 'delete')
    const spySaveOnFakeCacheRepository = jest.spyOn(fakeCacheRepository, 'save')

    await localSavePurchase.execute(purchases)

    expect(spyDeleteFromFakeCacheRepository).toBeCalledTimes(1)
    expect(spySaveOnFakeCacheRepository).toBeCalledTimes(1)
    expect(spySaveOnFakeCacheRepository)
      .toHaveBeenCalledWith('newPurchaseKey', purchases)
    expect(fakeCacheRepository.insertValue).toEqual(purchases)
  })

})
