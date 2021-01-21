import { LoadLocalPurchaseUseCase } from '@/data/useCases'
import { FakeCacheRepository } from '@/data/repositories'
import { CacheRepositoryInterface } from '@/data/interfaces/cache'

let fakeCacheRepository: FakeCacheRepository
let loadLocalPurchaseUseCase: LoadLocalPurchaseUseCase
let spyLoadFromFakeCacheRepostory: jest.SpyInstance

describe('SaveLocalPurchase', () => {
  beforeEach(() => {
    fakeCacheRepository = new FakeCacheRepository()
    loadLocalPurchaseUseCase = new LoadLocalPurchaseUseCase(fakeCacheRepository)
    spyLoadFromFakeCacheRepostory = jest.spyOn(fakeCacheRepository, 'load')
  })

  test('should not delete or save cache on init', () => {
    expect(fakeCacheRepository.methodCallOrder).toEqual([])
  })

  test('should call correcty key on load', async () => {
    await loadLocalPurchaseUseCase.execute()

    expect(spyLoadFromFakeCacheRepostory).toBeCalledWith('purchaseKey')
    expect(fakeCacheRepository.methodCallOrder).toEqual([CacheRepositoryInterface.Methods.load])
  })

})
