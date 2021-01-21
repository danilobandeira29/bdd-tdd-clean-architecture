export interface SavePurchase {
  execute: (purchases: Array<PurchaseEntity>) => Promise<void>
}

export type PurchaseEntity = {
  id: string
  date: Date
  value: number
}
