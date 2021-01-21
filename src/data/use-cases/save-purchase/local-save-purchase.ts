import { CacheRepositoryInterface } from '@/data/interfaces/cache'
import { PurchaseEntity, SavePurchase } from '@/domain/use-cases'

export class LocalSavePurchase implements SavePurchase {

  constructor(
    private readonly cacheRepository: CacheRepositoryInterface,
    private readonly timestamp: Date
    ) {}

  execute = async (purchases: Array<PurchaseEntity>): Promise<void> => {
    this.cacheRepository.replace('newPurchaseKey', {
      timestamp: this.timestamp,
      value: purchases
    })
  }

}
