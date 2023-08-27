import { StoreData } from '@/composables/storeHelpers'

export function getStoreItems<T> (data: StoreData): T[] {
  return data?.items as T[] || [] as T[]
}

export type FormkitValue = {
  value: number,
  label: string
}
