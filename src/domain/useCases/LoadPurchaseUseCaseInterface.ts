import { Purchase } from '@/domain/entities'

export interface LoadPurchaseUseCaseInterface {
  execute: () => Promise<Array<Purchase>>
}
