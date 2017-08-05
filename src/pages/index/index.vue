<template>
  <div>

    <nav class="nav">
      <ul flex="box:mean">

        <li v-for="item in tabs" :class="{ active: item.tab === ($route.query.tab || 'new') }">
          <router-link :to="{ name: 'index', query: { tab: item.tab } }">{{ item.title }}</router-link>
        </li>
      </ul>
    </nav>
    <v-content v-vuet-scroll="{ path: 'topic-list', name: 'content' }">
      <ul class="list">
        <li v-for="(item,index) in base64Link" key="item.id">
          <!-- <router-link :to="{ name: 'topic-detail', params: { id: item.id } }"> -->
            <div>
              <b-btn block v-b-toggle="'accordion'+index" variant="primary">{{ item.title }}
                <span class="time">{{item.timeBetween}}</span></b-btn>
              <b-collapse v-bind:id="'accordion' + index" accordion="my-accordion">
                <b-card>
                  <div class="summary">{{item.contentText}}</div>
                  <div>
                    <router-link :to="{ name: 'topic-detail', params: { id: item.link } }">
                      <a>{{item.title}}</a>
                    </router-link>
                    <p>{{item.crawlSite}}</p>
                  </div>
                  <div v-for="sim in item.similarArticle">
                    <a>{{sim.title}}</a>
                    <p>{{sim.crawlSite}}</p>
                  </div>
                </b-card>
              </b-collapse>
            </div>
          <!-- </router-link> -->
        </li>
      </ul>
      <v-loading :done="list.done" :loading="list.loading" @seeing="$vuet.fetch('topic-list')"></v-loading>
    </v-content>
  </div>
</template>
<script>
  import { mapModules, mapRules } from 'vuet'
  import Vue from 'vue'
  import BootstrapVue from 'bootstrap-vue'
  let Base64 = require('js-base64').Base64

  Vue.use(BootstrapVue)

  export default {
    mixins: [
      mapModules({ list: 'topic-list' }),
      mapRules({ route: 'topic-list' })
    ],
    data () {
      return {
        tabs: [
          {
            title: '最新资讯',
            tab: 'new'
          },
          {
            title: '联赛资讯',
            tab: 'cate'
          }
        ]
      }
    },
    computed: {
      // a computed getter
      base64Link: function () {
        // `this` points to the vm instance
        return this.list.data.map(function (item) {
          item.link = Base64.encode(item.link)
          return item
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../less/config";
  .nav {
    position: absolute;
    background: #fff;
    top: 0;
    right: 0;
    left: 0;
    z-index: 10;
    border-bottom: 1px solid #ddd;
    ul {
      overflow: hidden;
      padding: 0;
      margin: 0;
      width:100%;
      li {
        position: relative;
        list-style: none;
        line-height: 49px;
        text-align: center;
      }
      a {
        display: block;
        text-decoration: none;
        font-size: 14px;
        color: lighten(@text, 50%);
      }
      .active {
        &:after {
          content: "";
          position: absolute;
          right: 0;
          left: 0;
          bottom: 1px;
          z-index: 1;
          height: 3px;
          //background: @main;
          background: #337ab7;
        }
        a {
          color: #337ab7;
        }
      }
    }
  }
  .time{
    color:#999;
    font-size:.8rem;
  }
  .content{
    bottom: 0 !important;
  }
  .list {
    overflow: hidden;
    padding: 0;
    margin: 0;
    background: #eee;
    width:100%;
    li {
      position: relative;
      list-style: none;
      background: #fff;
      border-bottom: 1px solid #ddd;
    }
  }
  .btn:focus, .btn.focus{
    box-shadow: 0 0 0 0px #eceeef;
  }
  .btn-primary:hover{
    color: #545454;
  }
  .btn-primary{
    color: #545454;
    background-color: #fff;
    border-color: #fff;
  }
  .btn{
    text-align: left;
    white-space:inherit;
  }
  .card{
    border:0;
    color: #757575;
    .summary{
      margin-bottom: 1rem;
    }
    a {
      color: #545454;
    }
    p {
      color: #999;
    }
  }
</style>
