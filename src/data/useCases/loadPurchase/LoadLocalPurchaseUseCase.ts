import { Purchase } from '@/domain/entities'
import { CacheRepositoryInterface } from '@/data/interfaces/cache'
import { LoadPurchaseUseCaseInterface } from '@/domain/useCases'

export class LoadLocalPurchaseUseCase implements LoadPurchaseUseCaseInterface {
  constructor(private readonly cacheRepository: CacheRepositoryInterface) {}
  
  execute = async(): Promise<Array<Purchase> | void> => {
    this.cacheRepository.load('purchaseKey')
  }

}
