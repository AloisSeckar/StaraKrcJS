import { UpdateConfig } from './storeHelpers'
import { Link, LinkDB } from '@/database/types'

const tableName = 'elrhLink'

export const useLinkStore = defineStore({
  id: tableName + '-store',
  state: () => {
    return {
      loaded: false,
      items: [] as Link[]
    }
  },
  actions: {
    async fill () {
      await fillStore({
        supabaseClient: useSupabaseClient(),
        tableName,
        storeData: this,
        selectQuery: 'linkId, categoryId, dateCreated, dateEdited, name, dscr, url, thumb',
        orderQuery: 'ord',
        orderOpts: {}
      })
    },
    async update (itemData: LinkDB, itemId?: number): Promise<boolean> {
      treatInput(itemData)

      const config: UpdateConfig = {
        supabaseClient: useSupabaseClient<LinkDB>(),
        tableName,
        itemKey: 'linkId',
        itemId,
        itemData
      }

      let ret: boolean
      if (itemId) {
        ret = await doUpdate(config)
      } else {
        ret = await doCreate(config)
      }

      if (ret) {
        this.fill() // TODO can we just load the new one?
      }

      return ret
    }
  },
  getters: {
    getItems: state => state.items,
    getCount: state => state.items.length,
    getByCategory: (state) => {
      return (categoryId: number) => state.items.filter((i: Link) => i.categoryId === categoryId)
    },
    getById: (state) => {
      return (linkId: number) => {
        const link = state.items.find((i: Link) => i.linkId === linkId)
        return link || { linkId: 0 } as Link
      }
    },
    getEmpty: (): LinkDB => {
      const emptyItem: LinkDB = {
        categoryId: 0,
        ord: 0,
        dateCreated: new Date().toISOString(),
        dateEdited: new Date().toISOString(),
        name: '',
        dscr: '',
        url: '',
        thumb: '',
        authorId: 0
      }
      return emptyItem
    }
  }
})

function treatInput (input: LinkDB) {
  input.dateEdited = new Date().toISOString()
  if (input.dateCreated === undefined) {
    input.dateCreated = new Date().toISOString()
  }
  input.ord = 1 // TODO fix mess in ordering
}
