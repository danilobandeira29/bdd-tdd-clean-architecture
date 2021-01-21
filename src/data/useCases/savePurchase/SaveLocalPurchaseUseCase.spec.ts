import { Purchase } from '@/domain/entities'
import { SaveLocalPurchaseUseCase } from '@/data/useCases'
import { FakeCacheRepository } from '@/data/repositories'
import { CacheRepositoryInterface } from '@/data/interfaces/cache'


let fakeCacheRepository: FakeCacheRepository
let saveLocalPurchaseUseCase: SaveLocalPurchaseUseCase
let spyDeleteFromFakeCacheRepository: jest.SpyInstance
let spySaveFromFakeCacheRepository: jest.SpyInstance
let purchases: Array<Purchase>
const timestamp = new Date()

describe('SaveLocalPurchase', () => {
  beforeEach(() => {
    fakeCacheRepository = new FakeCacheRepository()
    saveLocalPurchaseUseCase = new SaveLocalPurchaseUseCase(fakeCacheRepository, timestamp)
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

  test('should not save a cache if delete old cache fails', async () => {
    spyDeleteFromFakeCacheRepository
      .mockImplementationOnce(() => { 
        fakeCacheRepository.methodCallOrder.push(CacheRepositoryInterface.Methods.delete)

        throw new Error() 
      })

    const promise = saveLocalPurchaseUseCase.execute(purchases)

    expect(fakeCacheRepository.methodCallOrder)
    .toEqual([CacheRepositoryInterface.Methods.delete])
    await expect(promise).rejects.toThrow()
  })

  test('should save a new cache if delete old cache succeeds', async () => {
    const promise = saveLocalPurchaseUseCase.execute(purchases)

    expect(fakeCacheRepository.methodCallOrder)
    .toEqual([CacheRepositoryInterface.Methods.delete, CacheRepositoryInterface.Methods.save])
    expect(spySaveFromFakeCacheRepository)
      .toHaveBeenCalledWith('purchaseKey',{
        timestamp,
        value: purchases
      })
    expect(spyDeleteFromFakeCacheRepository).toBeCalledWith('purchaseKey')
    expect(fakeCacheRepository.insertValue).toEqual([{
      timestamp,
      value: purchases
    }])
    await expect(promise).resolves.toBeFalsy()
  })

  test('should throw a error if save fails', async () => {
    spySaveFromFakeCacheRepository
      .mockImplementationOnce(() => { 
        fakeCacheRepository.methodCallOrder.push(CacheRepositoryInterface.Methods.save)
        throw new Error() 
      })

    const promise = saveLocalPurchaseUseCase.execute(purchases)

    expect(fakeCacheRepository.methodCallOrder)
    .toEqual([CacheRepositoryInterface.Methods.delete, CacheRepositoryInterface.Methods.save])
    await expect(promise).rejects.toThrow()
  })

})
