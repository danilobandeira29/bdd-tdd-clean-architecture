export interface CacheRepositoryInterface {
  delete: (key: string) => void
  save: (key: string, value: any) => void
}
