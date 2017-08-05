<template>
  <div>
    <v-header title="主题">
      <div slot="left" class="item" flex="main:center cross:center" v-on:click="$router.go(-1)">
        <i class="iconfont icon-back"></i>
      </div>
    </v-header>
  </div>
</template>
<script>
  import http from 'http'
  import replyBox from './reply-box'
  import { mapModules, mapRules } from 'vuet'

  export default {
    mixins: [
      mapModules({ detail: 'topic-detail', user: 'user-self' }),
      mapRules({ route: 'topic-detail' })
    ],
    components: { replyBox },
    computed: {
      data () {
        return this.detail.data
      },
      author () {
        return this.detail.data.author
      },
      replies () {
        return this.detail.data.replies
      }
    },
    methods: {
      testThing (ups) { // 验证是否点赞
        return ups.indexOf(this.user.data.id || '') > -1
      },
      fabulousItem ({ ups, id }) { // 点赞
        if (!this.user.data.id) return this.$router.push('/login')
        var index = ups.indexOf(this.user.data.id)
        if (index > -1) {
          ups.splice(index, 1)
        } else {
          ups.push(this.user.data.id)
        }
        http.post(`/reply/${id}/ups`)
      },
      commentShow (item) { // 显示隐藏回复框
        if (!this.user.data.id) return this.$router.push('/login')
        this.detail.commentId = this.detail.commentId === item.id ? null : item.id
      }
    }
  }

</script>
<style lang="less" scoped>
  @import '../../../less/config';
  .datas {
    padding: 10px;
    border-bottom: 1px solid #eee;
    .tit {
      position: relative;
      padding: 10px 0;
      margin: 0;
      line-height: 24px;
      font-weight: bold;
      font-size: 22px;
      text-align: center;
      color: @text;
    }
    .bottom {
      .item {
        padding: 0 5px;
        color: #666;
        .iconfont {
          padding-right: 3px;
        }
      }
    }
  }


  .re-list {
    li {
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
    .headimg {
      padding-right: 10px;
      .pic {
        overflow: hidden;
        display: block;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 1px solid #ddd;
        background-color: #eee;
        background-position: center center;
        background-size: cover;
      }
    }
    time {
      padding-left: 10px;
      font-size: 12px;
    }
    .num {
      font-size: 13px;
    }
    .bottom {
      .icon {
        position: relative;
        padding: 5px 10px;
        &.fabulous {
          color: @main;
        }
        em {
          font-size: 13px;
          font-style: normal;
        }
      }
    }
    .markdown-body {
      padding: 10px 0;
    }
    .replies-count {
      border-left: 5px solid @main;
      em {
        font-style: normal;
        color: @main;
      }
    }
  }


  .reply {
    padding: 50px 10px;
  }


  .tip-login {
    padding: 100px;
    text-align: center;
  }
</style>
