import { CacheRepositoryInterface } from '@/data/interfaces/cache'
import { LocalSavePurchase } from '@/data/use-cases'
import { PurchaseEntity } from '@/domain/use-cases'

class FakeCacheRepository implements CacheRepositoryInterface {
  insertValue: Array<PurchaseEntity> = []
  methodCallOrder: Array<CacheRepositoryInterface.Methods> = []

  delete = (key: string): void => {
    this.methodCallOrder.push(CacheRepositoryInterface.Methods.delete)
  }

  save = (key: string, value: any): void => {
    this.methodCallOrder.push(CacheRepositoryInterface.Methods.save)
    this.insertValue.push(value)
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
    expect(fakeCacheRepository.methodCallOrder).toEqual([])
  })

  test('should delete old cache with key when a new cache is saved', async () => {
    await localSavePurchase.execute(purchases)
    
    expect(fakeCacheRepository.methodCallOrder)
      .toEqual([CacheRepositoryInterface.Methods.delete, CacheRepositoryInterface.Methods.save])
    expect(spyDeleteFromFakeCacheRepository).toBeCalledWith('purchaseKey')
  })

  test('should not save a cache if delete old cache fails', async () => {
    spyDeleteFromFakeCacheRepository
      .mockImplementationOnce(() => { 
        fakeCacheRepository.methodCallOrder.push(CacheRepositoryInterface.Methods.delete)

        throw new Error() 
      })

    const promise = localSavePurchase.execute(purchases)

    expect(fakeCacheRepository.methodCallOrder)
    .toEqual([CacheRepositoryInterface.Methods.delete])
    await expect(promise).rejects.toThrow()
  })

  test('should save a new cache if delete old cache succeeds', async () => {
    await localSavePurchase.execute(purchases)

    expect(fakeCacheRepository.methodCallOrder)
    .toEqual([CacheRepositoryInterface.Methods.delete, CacheRepositoryInterface.Methods.save])
    expect(spySaveFromFakeCacheRepository)
      .toHaveBeenCalledWith('newPurchaseKey', purchases)
    expect(fakeCacheRepository.insertValue).toContainEqual(purchases)
  })

  test('should throw a error if save fails', async () => {
    spySaveFromFakeCacheRepository
      .mockImplementationOnce(() => { 
        fakeCacheRepository.methodCallOrder.push(CacheRepositoryInterface.Methods.save)
        throw new Error() 
      })

    const promise = localSavePurchase.execute(purchases)

    expect(fakeCacheRepository.methodCallOrder)
    .toEqual([CacheRepositoryInterface.Methods.delete, CacheRepositoryInterface.Methods.save])
    await expect(promise).rejects.toThrow()
  })

})
