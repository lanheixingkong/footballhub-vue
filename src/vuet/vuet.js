import Vue from 'vue'
import Vuet from 'vuet'
import utils from 'utils'
import http from 'http'


Vue.use(Vuet)

let listCache = {'new': {id: 0, data: []}, 'cate': {id: 0, cate: []}}

export default new Vuet({
  pathJoin: '-',
  modules: {
    topic: {
      create: {
        data () {
          return {
            title: '', // 标题
            tab: '', // 发表的板块
            content: '' // 发表的内容
          }
        },
        manuals: {
          async create ({ state }) {
            if (!state.title) {
              return utils.toast('标题不能为空')
            } else if (!state.tab) {
              return utils.toast('选项不能为空')
            } else if (!state.content) {
              return utils.toast('内容不能为空')
            }
            const res = await http.post(`/topics`, {
              ...state
            })
            if (res.success) {
              this.reset()
            } else {
              utils.toast(res.error_msg)
            }
            return res
          }
        }
      },
      list: {
        data () {
          return {
            data: [], // 列表存储的数据
            loading: false, // 数据正在加载中
            done: false, // 数据是否已经全部加载完成
            page: 1, // 加载的页数
            id: 50
          }
        },
        async fetch ({ state, route, params, path }) {
          // 注，在vuet 0.1.2以上版本，会多带一个params.routeWatch参数，我们可以根据这个来判断页面是否发生了变化
          if (params.routeWatch === true) { // 路由发生了变化，重置模块状态
            console.log('path:' + path)
            this.reset(path)
          } else if (params.routeWatch === false) { // 路由没有变化触发的请求，可能是从详情返回到列表
            console.log('{}')
            return {}
          }

          // params.routeWatch 没有参数，则是上拉加载触发的调用
          const { tab = '' } = route.query
          console.log('tab:' + tab)
          const query = {
            tab,
            mdrender: false,
            limit: 20,
            page: state.page,
            id: state.id
          }
          const res = await http.get('/article/' + tab, query)
          const newData = res.data.data
          const data = params.routeWatch ? newData : [...state.data, ...newData]
          const len = newData.length
          // console.log(newData[len-1].id)
          return {
            data,
            page: ++state.page,
            loading: false,
            done: len < 10,
            id: len > 0 ? newData[len - 1].id : state.id
          }
        }
      },
      detail: {
        data () {
          return {
            data: {
              id: null,
              url: null
            },
            existence: true,
            loading: true,
            commentId: null
          }
        },
        async fetch ({ route }) {
          // const { data } = await http.get(`/topic/${}`)
          // if (data) {
          //   return {
          //     data,
          //     existence: true,
          //     loading: false
          //   }
          // }
          const url = route.params.id
          console.log('url:' + url)
          return {
            data: {id: url},
            existence: false,
            loading: false
          }
        }
      }
    },
    user: {
      self: {
        data () {
          return {
            data: JSON.parse(localStorage.getItem('vue_cnode_self')) || {
              avatar_url: null,
              id: null,
              loginname: null,
              success: false
            }
          }
        },
        manuals: {
          async login ({ state }, accesstoken) {
            const res = await http.post(`/accesstoken`, { accesstoken })
            if (typeof res === 'object' && res.success) {
              state.data = res
              localStorage.setItem('vue_cnode_self', JSON.stringify(res))
              localStorage.setItem('vue_cnode_accesstoken', accesstoken)
            }
            return res
          },
          signout () {
            localStorage.removeItem('vue_cnode_self')
            localStorage.removeItem('vue_cnode_accesstoken')
            this.reset()
          }
        }
      },
      detail: {
        data () {
          return {
            data: {
              loginname: null,
              avatar_url: null,
              githubUsername: null,
              create_at: null,
              score: 0,
              recent_topics: [],
              recent_replies: []
            },
            existence: true,
            loading: true,
            tabIndex: 0
          }
        },
        async fetch ({ route }) {
          const { data } = await http.get(`/user/${route.params.username}`)
          if (data) {
            return {
              data,
              loading: false
            }
          }
          return {
            existence: false,
            loading: false
          }
        }
      },
      messages: {
        data () {
          return {
            data: {
              has_read_messages: [],
              hasnot_read_messages: []
            },
            loading: true
          }
        },
        async fetch () {
          if (!this.getState('user-self').data.id) return
          const { data } = await http.get(`/messages`, { mdrender: true })
          return {
            data
          }
        },
        count: {
          data () {
            return {
              data: 0
            }
          },
          async fetch () {
            if (!this.getState('user-self').data.id) return
            const res = await http.get('/message/count')
            if (!res.data) return
            return {
              data: res.data
            }
          }
        }
      }
    }
  }
})
