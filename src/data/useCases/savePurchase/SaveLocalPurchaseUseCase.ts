import { Purchase } from '@/domain/entities'
import { CacheRepositoryInterface } from '@/data/interfaces/cache'
import { SavePurchaseUseCaseInterface } from '@/domain/useCases'

export class SaveLocalPurchaseUseCase implements SavePurchaseUseCaseInterface {

  constructor(
    private readonly cacheRepository: CacheRepositoryInterface,
    private readonly timestamp: Date
    ) {}

  execute = async (purchases: Array<Purchase>): Promise<void> => {
    this.cacheRepository.replace('purchaseKey', {
      timestamp: this.timestamp,
      value: purchases
    })
  }

}
