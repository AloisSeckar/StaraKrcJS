import { SupabaseClient } from '@supabase/supabase-js'
import { Article, ArticleDB, Book, BookDB } from '~~/database/types'

export interface OrderOpts {
  ascending?: boolean
}

export interface StoreData {
  items: any[],
  loaded: boolean
}

export interface StoreConfig {
  supabaseClient: SupabaseClient<Article> | SupabaseClient<Book>
  tableName: string,
  storeData: StoreData,
  selectQuery: string,
  orderQuery: string,
  orderOpts: OrderOpts
}

export async function fillStore (config: StoreConfig) {
  console.debug('getting ' + config.tableName + ' from Supabase')
  await fetchSupabase(config)
    .then((x: any) => {
      console.log(typeof x)
      console.debug(config.tableName + ' loaded from Supabase')
      config.storeData.items = x.data
      config.storeData.loaded = true
    }).catch((x: any) => {
      console.log(typeof x)
      console.error('failed to load ' + config.tableName + ' from Supabase')
      console.error(x.error ? x.error : x)
      config.storeData.loaded = false
    })
}

export async function fetchSupabase (config: StoreConfig) {
  return await config.supabaseClient
    .from(config.tableName)
    .select(config.selectQuery)
    .order(config.orderQuery, config.orderOpts)
}

export interface UpdateConfig {
  supabaseClient: SupabaseClient<ArticleDB> | SupabaseClient<BookDB>
  tableName: string,
  itemData: ArticleDB | BookDB,
  itemId?: number,
  itemKey: string
}

export async function doCreate (config: UpdateConfig): Promise<boolean> {
  const { data, error } = await config.supabaseClient
    .from(config.tableName)
    .insert(config.itemData)
    .select()

  if (data) {
    console.debug('new article saved into Supabase')
    return true
  } else {
    console.error('failed to save new article into Supabase')
    console.error(error?.message)
    return false
  }
}

export async function doUpdate (config: UpdateConfig): Promise<boolean> {
  const { data, error } = await config.supabaseClient
    .from(config.tableName)
    .update(config.itemData)
    .eq(config.itemKey, config.itemId)
    .select()

  if (data) {
    console.debug('new article saved into Supabase')
    return true
  } else {
    console.error('failed to save new article into Supabase')
    console.error(error?.message)
    return false
  }
}