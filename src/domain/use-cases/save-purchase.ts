export interface SavePurchase {
  save: (purchases: Array<PurchaseEntity>) => Promise<void>
}

type PurchaseEntity = {
  id: string
  date: Date
  value: number
}
