import { LoadLocalPurchaseUseCase } from '@/data/useCases'
import { FakeCacheRepository } from '@/data/repositories'
import { CacheRepositoryInterface } from '@/data/interfaces/cache'

let fakeCacheRepository: FakeCacheRepository
let loadLocalPurchaseUseCase: LoadLocalPurchaseUseCase
let spyLoadFromFakeCacheRepository: jest.SpyInstance
let spyDeleteFromFakeCacheRepository: jest.SpyInstance

describe('SaveLocalPurchase', () => {
  beforeEach(() => {
    fakeCacheRepository = new FakeCacheRepository()
    loadLocalPurchaseUseCase = new LoadLocalPurchaseUseCase(fakeCacheRepository)
    spyLoadFromFakeCacheRepository = jest.spyOn(fakeCacheRepository, 'load')
    spyDeleteFromFakeCacheRepository = jest.spyOn(fakeCacheRepository, 'delete')
  })

  test('should not delete or save cache on init', () => {
    expect(fakeCacheRepository.methodCallOrder).toEqual([])
  })

  test('should call correcty key on load', async () => {
    await loadLocalPurchaseUseCase.execute()

    expect(spyLoadFromFakeCacheRepository).toBeCalledWith('purchaseKey')
    expect(fakeCacheRepository.methodCallOrder).toEqual([CacheRepositoryInterface.Methods.load])
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

})
