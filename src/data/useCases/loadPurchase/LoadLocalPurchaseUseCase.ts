import { Purchase } from '@/domain/entities'
import { CacheRepositoryInterface } from '@/data/interfaces/cache'
import { LoadPurchaseUseCaseInterface } from '@/domain/useCases'

export class LoadLocalPurchaseUseCase implements LoadPurchaseUseCaseInterface {
  constructor(private readonly cacheRepository: CacheRepositoryInterface) {}
  
  execute = async(): Promise<any | void> => {
    try {
      const { purchases } = this.cacheRepository.load('purchaseKey')
      return purchases
    } catch(error) {
      this.cacheRepository.delete('purchaseKey')
      return []
    }
  }

}
