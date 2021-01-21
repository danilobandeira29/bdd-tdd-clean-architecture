import { CacheRepositoryInterface } from '@/data/interfaces/cache'
import { PurchaseEntity, SavePurchase } from '@/domain'

export class LocalSavePurchase implements SavePurchase {

  constructor(private readonly cacheRepository: CacheRepositoryInterface) {}

  execute = async (purchases: Array<PurchaseEntity>) => {
    this.cacheRepository.delete('purchaseKey')
    this.cacheRepository.save('newPurchaseKey', purchases)
  }

}
