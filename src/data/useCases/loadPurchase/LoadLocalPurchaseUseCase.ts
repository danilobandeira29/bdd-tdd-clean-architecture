import { Purchase } from '@/domain/entities'
import { CacheRepositoryInterface } from '@/data/interfaces/cache'
import { LoadPurchaseUseCaseInterface } from '@/domain/useCases'

export class LoadLocalPurchaseUseCase implements LoadPurchaseUseCaseInterface {
  constructor(private readonly cacheRepository: CacheRepositoryInterface) {}
  
  execute = async(): Promise<any> => {
    try {
      const { purchases, timestamp } = this.cacheRepository.load('purchaseKey')
      const currentDate = new Date()
      const maxRange = new Date(timestamp)

      maxRange.setDate(timestamp.getDate() + 3)

      if(maxRange > currentDate) {
        return purchases
      } else {
        throw new Error()
      }

    } catch(error) {
      this.cacheRepository.delete('purchaseKey')
      return []
    }
  }

}
