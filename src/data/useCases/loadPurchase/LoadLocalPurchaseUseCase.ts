import { CacheRepositoryInterface } from '@/data/interfaces/cache'
import { LoadPurchaseUseCaseInterface } from '@/domain/useCases'
import { CachePolicy } from '@/data/helpers'

export class LoadLocalPurchaseUseCase implements LoadPurchaseUseCaseInterface {
  constructor(private readonly cacheRepository: CacheRepositoryInterface) {}
  
  execute = async(): Promise<any> => {
    try {
      const { purchases, timestamp } = this.cacheRepository.load('purchaseKey')
      const currentDate = new Date()

      if(CachePolicy.validate(timestamp, currentDate)) {
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
