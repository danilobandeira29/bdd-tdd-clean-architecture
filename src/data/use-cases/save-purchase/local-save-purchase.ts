import { CacheRepositoryInterface } from '@/data/interfaces/cache'

export class LocalSavePurchase {

  constructor(private readonly cacheRepository: CacheRepositoryInterface) {}

  execute = async () => {
    this.cacheRepository.delete('purchaseKey')
    this.cacheRepository.save('newPurchaseKey')
  }

}
