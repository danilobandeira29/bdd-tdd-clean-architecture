import { Purchase } from '@/domain/entities'

export interface SavePurchaseUseCaseInterface {
  execute: (purchases: Array<Purchase>) => Promise<void>
}
