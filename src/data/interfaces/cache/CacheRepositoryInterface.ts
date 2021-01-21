export interface CacheRepositoryInterface {
  delete: (key: string) => void
  save: (key: string, value: any) => void
  replace: (key: string, value: any) => void
  load: (key: string) => Array<any> | void
}

export namespace CacheRepositoryInterface {
  export enum Methods {
    delete,
    save,
    load
  }
}
