import { Purchase } from '@/domain/entities'
import { CacheRepositoryInterface } from '@/data/interfaces/cache'

export class FakeCacheRepository implements CacheRepositoryInterface {
  insertValue: Array<Purchase> = []
  methodCallOrder: Array<CacheRepositoryInterface.Methods> = []

  delete = (key: string): void => {
    this.methodCallOrder.push(CacheRepositoryInterface.Methods.delete)
  }

  save = (key: string, value: any): void => {
    this.methodCallOrder.push(CacheRepositoryInterface.Methods.save)
    this.insertValue.push(value)
  }

  replace = (key: string, value: any): void => {
    this.delete(key)
    this.save(key, value)
  }

  load = (key: string): void => {
    this.methodCallOrder.push(CacheRepositoryInterface.Methods.load)
  }
}
