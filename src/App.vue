<template>
  <div id="app">
    <Header :seller="seller"></Header>
    <div class="tab">
      <div class="tab-item">
        <router-link to='/goods'>商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to='/ratings'>评论</router-link></div>
      <div class="tab-item">
        <router-link to='/seller'>商家</router-link></div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import Header from './components/header/header.vue'
import {urlParams} from './common/js/util'

const ERR_OK = 0
export default {
  data () {
    return {
      seller: {
        id: (() => {
          let queryParam = urlParams()
          return queryParam.id
        })()
      },
      ratings: {}
    }
  },
  components: {
    Header
  },
  created () {
    this.$http.get('/api/seller?id=' + this.seller.id).then((res) => {
      res = res.body
      if (res.errno === ERR_OK) {
        this.seller = Object.assign({}, this.seller, res.data)
      }
    })
  }
}
</script>

<style scoped lang="stylus">
  @import "./common/stylus/minin.styl"
  #app
    .tab
      display:flex
      width: 100%
      height: 40px
      line-height: 40px
      border-1px(rgba(7,17,27,0.1))
      .tab-item
        flex:1
        text-align center
        & > a
          display block
          font-size:14px
          color:rgb(77,85,93)
          &.active
            color:rgb(240,20,20)
</style>
