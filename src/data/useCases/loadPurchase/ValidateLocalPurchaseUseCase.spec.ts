import { LoadLocalPurchaseUseCase } from '@/data/useCases'
import { FakeCacheRepository } from '@/data/repositories'

let fakeCacheRepository: FakeCacheRepository
let loadLocalPurchaseUseCase: LoadLocalPurchaseUseCase

describe('ValidateLocalPurchase', () => {
  beforeEach(() => {
    fakeCacheRepository = new FakeCacheRepository()
    loadLocalPurchaseUseCase = new LoadLocalPurchaseUseCase(fakeCacheRepository)

  })

  test('should not delete or save cache on init', () => {
    expect(fakeCacheRepository.methodCallOrder).toEqual([])
  })

})
