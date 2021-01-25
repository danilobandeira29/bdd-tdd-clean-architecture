import { LoadLocalPurchaseUseCase } from '@/data/useCases'
import { FakeCacheRepository, ResultValue } from '@/data/repositories'
import { CacheRepositoryInterface } from '@/data/interfaces/cache'
import { Purchase } from '@/domain/entities'
import { getCacheExpirationDate } from '@/data/helpers'

let fakeCacheRepository: FakeCacheRepository
let loadLocalPurchaseUseCase: LoadLocalPurchaseUseCase
let spyLoadFromFakeCacheRepository: jest.SpyInstance
let spyDeleteFromFakeCacheRepository: jest.SpyInstance
let purchases: Array<Purchase>
let resultValue: ResultValue

describe('LoadLocalPurchase', () => {
  beforeEach(() => {
    fakeCacheRepository = new FakeCacheRepository()
    loadLocalPurchaseUseCase = new LoadLocalPurchaseUseCase(fakeCacheRepository)
    spyLoadFromFakeCacheRepository = jest.spyOn(fakeCacheRepository, 'load')
    spyDeleteFromFakeCacheRepository = jest.spyOn(fakeCacheRepository, 'delete')
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
    resultValue = {
      timestamp: new Date(),
      purchases
    }
  })

  test('should not delete or save cache on init', () => {
    expect(fakeCacheRepository.methodCallOrder).toEqual([])
  })

  test('should return an empty list if load fails', async () => {
    spyLoadFromFakeCacheRepository.mockImplementationOnce(() => {
      fakeCacheRepository.methodCallOrder.push(CacheRepositoryInterface.Methods.load)
      
      throw new Error()
    })

    const purchases = await loadLocalPurchaseUseCase.execute()

    expect(fakeCacheRepository.methodCallOrder).toEqual([CacheRepositoryInterface.Methods.load, CacheRepositoryInterface.Methods.delete])
    expect(spyDeleteFromFakeCacheRepository).toBeCalledWith('purchaseKey')
    expect(purchases).toEqual([])
  })

  test('should returns a list of purchases if cache is valid', async () => {
    const currentDate = new Date()
    const cacheExpirationDate = getCacheExpirationDate(currentDate)
    cacheExpirationDate.setSeconds(currentDate.getSeconds() + 1)

    fakeCacheRepository.resultValue = ({
      timestamp: cacheExpirationDate,
      purchases: resultValue.purchases
    })

    const purchasesUseCase = await loadLocalPurchaseUseCase.execute()

    expect(spyLoadFromFakeCacheRepository).toBeCalledWith('purchaseKey')
    expect(fakeCacheRepository.methodCallOrder).toEqual([CacheRepositoryInterface.Methods.load])
    expect(purchasesUseCase).toEqual(resultValue.purchases)
  })

  test('should returns a list empty list if cache is expirated', async () => {
    const currentDate = new Date()
    const cacheExpirationDate = getCacheExpirationDate(currentDate)
    cacheExpirationDate.setSeconds(currentDate.getSeconds() - 1)

    fakeCacheRepository.resultValue = ({
      timestamp: cacheExpirationDate,
      purchases: resultValue.purchases
    })

    const purchasesUseCase = await loadLocalPurchaseUseCase.execute()

    expect(spyLoadFromFakeCacheRepository).toBeCalledWith('purchaseKey')
    expect(spyDeleteFromFakeCacheRepository).toBeCalledWith('purchaseKey')
    expect(fakeCacheRepository.methodCallOrder).toEqual([CacheRepositoryInterface.Methods.load, CacheRepositoryInterface.Methods.delete])
    expect(purchasesUseCase).toEqual([])
  })

  test('should returns a list empty list if cache is at the same date of expiration cache date', async () => {
    const currentDate = new Date()
    const cacheExpirationDate = getCacheExpirationDate(currentDate)

    fakeCacheRepository.resultValue = ({
      timestamp: cacheExpirationDate,
      purchases: resultValue.purchases
    })

    const purchasesUseCase = await loadLocalPurchaseUseCase.execute()

    expect(spyLoadFromFakeCacheRepository).toBeCalledWith('purchaseKey')
    expect(spyDeleteFromFakeCacheRepository).toBeCalledWith('purchaseKey')
    expect(fakeCacheRepository.methodCallOrder).toEqual([CacheRepositoryInterface.Methods.load, CacheRepositoryInterface.Methods.delete])
    expect(purchasesUseCase).toEqual([])
  })

  test('should returns an list empty list if cache is empty', async () => {
    const currentDate = new Date()
    const cacheExpirationDate = getCacheExpirationDate(currentDate)
    cacheExpirationDate.setSeconds(currentDate.getSeconds() + 1)

    fakeCacheRepository.resultValue = ({
      timestamp: cacheExpirationDate,
      purchases: []
    })

    const purchasesUseCase = await loadLocalPurchaseUseCase.execute()

    expect(spyLoadFromFakeCacheRepository).toBeCalledWith('purchaseKey')
    expect(fakeCacheRepository.methodCallOrder).toEqual([CacheRepositoryInterface.Methods.load])
    expect(purchasesUseCase).toEqual([])
  })

})
