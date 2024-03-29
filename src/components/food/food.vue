<template>
  <transition name="move">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="img-header">
          <img :src="food.icon" alt="">
          <div class="back" @click="back">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span>
            <span class="old" v-show="food.oldPrice">{{food.oldPrice}}</span>
          </div>
          <div class="cartcontral-wrap">
            <Cartcontral :food="food"></Cartcontral>
          </div>
          <transition name="fade">
            <div @click="addfirst" class="buy" v-show=" !food.count || food.count === 0">加入购物车</div>
          </transition>
        </div>
        <Split></Split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <Split v-show="food.info"></Split>
        <div class="rating">
          <div class="title">商品评价</div>
          <Ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></Ratingselect>
        </div>
        <div class="rating-wrap" @ratingtype-select="typeSelect" @content-toggle="toggleContent">
          <ul v-show="food.ratings && food.ratings.length">
            <li v-for="rating in food.ratings" :key="rating.id" v-show="ratingShow(rating.ratingType, rating.text)" class="rating-item border-1px">
              <div class="user">
                <span class="name">{{rating.username}}</span>
                <img class="avatar" :src="rating.avatar" alt="" width="12" height="12">
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
              <p class="text">
                <span :class="{'icon-thumb_up': rating.rateType === 0, 'icon-thumb_down':rating.rateType === 1}" ></span>{{rating.text}}
              </p>
            </li>
          </ul>
          <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Vue from 'vue'
import BScroll from 'better-scroll'
import Split from '../../components/split/split.vue'
import Ratingselect from '../../components/ratingselect/ratingselect.vue'
import Cartcontral from '../../components/cartcontral/cartcontral.vue'
import {formatDate} from '../../common/js/date.js'
const ALL = 2
export default {
  props: {
    food: {
      type: Object
    }
  },
  data() {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    }
  },
  methods: {
    show() {
      this.showFlag = true
      this.selectType = ALL
      this.onlyContent = false
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    back() {
      this.showFlag = false
    },
    addfirst(event) {
      if (!event._constructed) {
        return
      }
      this.$emit('cart-add', event.target)
      Vue.set(this.food, 'count', 1)
    },
    ratingShow(type, text) {
      if (this.onlyContent && !text) {
        return false
      }
      if (this.selectType === ALL) {
        return true
      } else {
        return type === this.selectType
      }
    },
    typeSelect(type) {
      console.log(type)
      this.selectType = type
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    toggleContent(onlyContent) {
      console.log(onlyContent)
      this.onlyContent = onlyContent
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    }
  },
  components: {
    Cartcontral,
    Split,
    Ratingselect
  },
  filters: {
    formatDate(time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd HH:mm')
    }
  }
}
</script>

<style scoped lang="stylus">
@import "../../common/stylus/minin.styl"
.food
  position fixed
  left: 0
  top: 0
  bottom: 48px
  z-index 30
  width: 100%
  background #fff
  &.move-enter,&.move-leave-to
    transform translate3d(0,0,0)
  &.move-enter-active,&.move-leave-active
    transform translate3d(100%,0,0)
    transition all 0.2s liner
  .food-content
    .img-header
      position relative
      width: 100%
      height: 0
      padding-top 100%
      img
        position absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position absolute
        top: 10px
        left: 0
        .icon-arrow_lift
          display block
          padding 10px
          font-size 20px
          color #fff
    .content
      padding 18px
      position relative
      .title
        line-height:14px
        margin-bottom 8px
        font-size 14px
        font-weight:700
        color rgb(7,17,27)
      .detail
        margin-bottom:10px
        height: 10px
        line-height: 10px
        font-size 0
        .sell-count, .rating
          font-size 10px
          color rgb(147,153,159)
        .sell-count
          margin-right:12px
      .price
        font-weight 700
        line-height: 24px
        .now
          margin-right: 18px
          font-size 14px
          color rgb(240,20,20)
        .old
          text-decoration line-through
          font-size 10px
          color rgb(7,17,27)
      .cartcontral-wrap
        position absolute
        right 12px
        bottom: 12px
      .buy
        position absolute
        right: 18px
        bottom: 18px
        z-index 10
        height 24px
        line-height: 24px
        padding 0 12px
        box-sizing border-box
        border-radius 12px
        font-size 10px
        background rgb(0,160,220)
        color #fff
        &.fade-enter,&.fade-leave
          opacity 0
        &.fade-enter-active, &.fade-leave-active
          opacity: 1
          transition all 0.2s
    .info
      padding 18px
      .title
        line-height: 14px
        margin-bottom:6px
        font-size 14px
        color rgb(7,17,27)
      .text
        line-height: 22px
        padding:0 8px
        font-size 12px
        color rgb(77,85,93)
    .rating
      padding-top 18px
      .title
        line-height:14px
        margin-left 18px
        font-size 14px
        font-weight:700
        color rgb(7,17,27)
    .rating-wrap
      padding 0 18px
      .rating-item
        position relative
        padding 16px 0
        border-1px(rgba(7,17,27,0.1))
        .user
          position absolute
          right: 0
          top: 16px
          line-height: 12px
          font-size 0
          .name
            display inline-block
            vertical-align top
            margin-right: 6px
            font-size 10px
            color rgb(147,153,159)
          .avatar
            border-radius 50%
        .time
          margin-bottom: 6px
          line-height: 12px
          font-size 10px
          color rgb(147,153,159)
        .text
          line-height: 16px
          font-size 12px
          color rgb(7,17,27)
          .icon-thumb_up, .icon-thumb_down
            margin-right: 4px
            line-height: 16px
            font-size 12px
          .icon-thumb_up
            color rgb(0,160,220)
          .icon-thumb_down
            color rgb(147,153,159)
      .no-rating
        padding 16px 0
        font-size 12px
        color rgb(147,153,159)
</style>
