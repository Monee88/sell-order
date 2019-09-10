<template>
  <div class="seller" ref="seller">
    <div class="seller-wrap">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-1px">
          <Star :size="36" :score="seller.score"></Star>
          <span class="text">（{{seller.ratingCount}}）</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价:</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送:</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间:</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavo">
          <span class="icon-favorite" :class="{'active':favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <Split></Split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrap border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul v-if="seller.supports" class="supports">
          <li class="support-item border-1px" v-for="(item, i) in seller.supports" :key="i">
            <span class="icon" :class="classMap[item.type]"></span>
            <span class="text">{{item.description}}</span>
          </li>
        </ul>
      </div>
      <Split></Split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrap" ref="picWrap">
          <ul class="list" ref="list">
            <li class="pic-item" v-for="pic in seller.pics" :key="pic.id">
              <img :src="pic" width="120" height="90" alt="">
            </li>
          </ul>
        </div>
      </div>
      <Split></Split>
      <div class="info">
        <h1 class="title border-1px">商家信息</h1>
        <ul>
          <li class="info-item" v-for="info in seller.infos" :key="info.id">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import Star from '../../components/star/star.vue'
import Split from '../../components/split/split.vue'
import {saveToLocal, loadFromLocal} from '../../common/js/store'
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      favorite: (() => {
        return loadFromLocal(this.seller.id, 'favorite', false)
      })()
    }
  },
  computed: {
    favoriteText() {
      return this.favorite ? '已收藏' : '收藏'
    }
  },
  components: {
    Star,
    Split
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  methods: {
    initScroll() {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.seller, {
          click: true
        })
        this.scroll.refresh()
      } else {
        this.scroll.refresh()
      }
    },
    toggleFavo() {
      this.favorite = !this.favorite
      console.log(this.seller.id + '11')
      saveToLocal(this.seller.id, 'favorite', this.favorite)
    }
  },
  updated () {
    this.initScroll()
  },
  mounted () {
    this.initScroll()
    if (this.seller.pics) {
      let picW = 120
      let margin = 6
      let width = (picW + margin) * this.seller.pics.length - margin
      this.$refs.list.style.width = width + 'px'
      this.$nextTick(() => {
        if (!this.picScroll) {
          this.picScroll = new BScroll(this.$refs.picWrap, {
            scrollX: true,
            eventPassthrough: 'vertical',
            click: true
          })
        } else {
          this.picScroll.refresh()
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus">
@import "../../common/stylus/minin.styl"
.seller
  position absolute
  top: 174px
  bottom: 0
  left: 0
  width: 100%
  overflow hidden
  .overview
    padding: 18px
    position relative
    .title
      margin-bottom: 8px
      line-height: 14px
      color rgb(7,17,27)
      font-size 14px
    .desc
      padding-bottom: 18px
      font-size 0
      border-1px(rgba(7,17,27,0.1))
      .star
        display inline-block
        vertical-align top
        margin-right: 8px
      .text
        display inline-block
        vertical-align top
        line-height: 18px
        margin-right: 12px
        font-size 10px
        color rgb(77,85,93)
    .remark
      display flex
      padding-top 18px
      .block
        flex 1
        text-align center
        border-right 1px solid rgba(7,17,27,0.1)
        &.last-child
          border none
        h2
          margin-bottom: 4px
          line-height: 10px
          font-size 10px
          color rgb(147,153,159)
        .content
          line-height: 24px
          font-size 10px
          color rgb(7,17,27)
          .stress
            font-size 24px
    .favorite
      position absolute
      width: 50px
      top 18px
      right: 11px
      text-align center
      .icon-favorite
        display block
        margin-bottom: 4px
        line-height: 24px
        font-size 24px
        color #d4d6d9
        &.active
          color rgb(240,20,20)
      .text
        line-height: 10px
        font-size 10px
        color rgb(77,85,93)
  .bulletin
    padding 18px 18px 0 18px
    .title
      margin-bottom: 8px
      line-height: 14px
      color rgb(7,17,27)
      font-size 14px
    .content-wrap
      padding 0 12px 16px 12px
      border-1px(rgba(7,17,27,0.1))
      .content
        line-height: 24px
        font-size 12px
        color rgb(240,20,20)
    .supports
      .support-item
        padding 16px 12px
        font-size 0
        border-1px(rgba(7,17,27,0.1))
        &.last-child
          border none
        .icon
          display inline-block
          vertical-align top
          width: 16px
          height 16px
          margin-right:6px
          background-size: 16px 16px
          background-repeat no-repeat
          &.decrease
            bg-image('decrease_4')
          &.discount
            bg-image('discount_4')
          &.guarantee
            bg-image('guarantee_4')
          &.invoice
            bg-image('invoice_4')
          &.special
            bg-image('special_4')
        .text
          line-height: 16px
          font-size 12px
          color rgb(7,17,27)
  .pics
    padding 18px
    .title
      margin-bottom: 12px
      line-height: 14px
      color rgb(7,17,27)
      font-size 14px
    .pic-wrap
      width: 100%
      overflow hidden
      white-space nowrap
      .list
        fong-size 0
        .pic-item
          display inline-block
          margin-right: 6px
          width: 120px
          height: 90px
          &.last-child
            margin-right: 0
  .info
    padding 18px 18px 0 18px
    color rgb(7,17,27)
    .title
      padding-bottom: 12px
      line-height: 14px
      font-size 14px
      border-1px(rgba(7,17,27,0.1))
    .info-item
      padding 16px 12px
      line-height: 16px
      border-1px(rgba(7,17,27,0.1))
      font-size 12px
      &.last-child
        border-none()
</style>
