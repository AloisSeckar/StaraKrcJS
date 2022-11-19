import { defineStore } from 'pinia'

const table_name = "elrh_news"

export const useNewsStore = defineStore({
  id: table_name + '-store',
  state: () => {
    return {
      loaded: false,
      items: [] as Object[],
    }
  },
  actions: {
    async fill() {
      console.log("getting " + table_name + " from Supabase")
      const supabase = useSupabaseClient()
      const { data, error } = await supabase
        .from(table_name)
        .select(`date_created, content, elrh_author(author_id, name)`)
        .order('date_created', { ascending: false })
      if (data) {
        console.log(table_name + " loaded from Supabase")
        this.items = data
        this.loaded = true
      } else {
        console.log("failed to load " + table_name + " from Supabase")
        console.log(error)
        this.loaded = false
      }
    }
  },
  getters: {
    getItems: state => state.items,
    getTopItems: state => state.items.slice(0, 5),
  },
})