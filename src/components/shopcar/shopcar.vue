<template>
    <div class="shopcar">
      <div class="content" @click="toggleList">
        <div class="left">
          <div class="logo-wrap">
            <div class="logo" :class="{'highlight':totalCount>0}">
              <span class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></span>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight':totalPrice>0}">{{totalPrice}}元</div>
          <div class="desc">另需配送费{{deliveryPrice}}元</div>
        </div>
        <div class="right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
      </div>
      <div class="ball-container">
        <div v-for="ball in balls" :key="ball.id">
          <transition @beforeEnter="beforeEnter" @enter="enter" @afterEnter="afterEnter">
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <div class="title">购物车</div>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent" refs="listContent">
            <ul>
              <li class="food" v-for="food in selectFoods" :key="food.id">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price*food.count}}</span>
                </div>
                <div class="cartcontral-wrap">
                  <Cartcontral :food="food"></Cartcontral>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition >
      <!--<div class="list-mask" v-show="listShow" @click="hideList"></div>-->
    </div>
</template>

<script>
import Cartcontral from '../../components/cartcontral/cartcontral.vue'
import BScroll from 'better-scroll'
export default {
  props: {
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    },
    selectFoods: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    totalPrice() {
      let total = 0
      this.selectFoods.forEach((food) => {
        total += food.price * food.count
      })
      return total
    },
    totalCount() {
      let count = 0
      this.selectFoods.forEach((food) => {
        count += food.count
      })
      return count
    },
    payDesc() {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice
        return `还差￥${diff}元起送`
      } else {
        return '去结算'
      }
    },
    payClass() {
      if (this.totalPrice < this.minPrice) {
        return 'not-enough'
      } else {
        return 'enough'
      }
    },
    listShow: {
      get: function () {
        return this.fold
      },
      set: function (listShow) {
        if (!this.totalCount) {
          this.fold = true
          return false
        }
        let show = !this.listShow
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              })
            } else {
              this.scroll.refresh()
            }
          })
        }
        return show
      }
    }
  },
  data() {
    return {
      balls: [
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false }
      ],
      dropBalls: [],
      fold: true
    }
  },
  methods: {
    drop (el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (!ball.show) {
          ball.show = true
          ball.el = el
          this.dropBalls.push(ball)
          return
        }
      }
    },
    beforeEnter (el) {
      let count = this.balls.length
      while (count--) {
        let ball = this.balls[count]
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect()
          let x = rect.left - 32
          let y = -(window.innerHeight - rect.top - 22)
          el.style.display = ''
          el.style.webkitTransform = `translate3d(${x}px,${y}px,0)`
          el.style.transform = `translate3d(${x}px,${y}px,0)`
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = `translate3d(${x}px,${y}px, 0)`
          inner.style.transform = `translate3d(${x}px, ${y}px, 0)`
        }
      }
    },
    enter (el) {
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight
      this.$nextTick(() => { // 样式重置
        el.style.webKitTransform = 'translate3d(0,0,0)'// 没有变量时只能用单引，不能用反引
        el.style.transform = 'translate3d(0,0,0)'
        let inner = el.getElementsByClassName('inner-hook')[0]
        inner.style.webkitTransform = 'translate3d(0,0,0)'
        inner.style.transform = 'translate3d(0,0,0)'
      })
    },
    afterEnter (el) {
      let ball = this.dropBalls.shift() // 删除并返回第一个ball
      if (ball) {
        ball.show = false // 重置ball.show的状态
        el.style.display = 'none'
      }
    },
    toggleList() {
      if (!this.totalCount) {
        return
      }
      this.fold = !this.fold
      this.listShow = this.fold
    },
    empty() {
      this.selectFoods.forEach((food) => {
        food.count = 0
      })
    },
    hideList() {
      this.fold = true
    },
    pay() {
      if (this.totalPrice < this.minPrice) {
        return
      }
      window.alert(`支付${this.totalPrice}`)
    }
  },
  components: {
    Cartcontral
  }
}
</script>

<style scoped lang="stylus">
@import "../../common/stylus/minin.styl"
.shopcar
  height: 48px
  width: 100%
  position fixed
  left: 0
  bottom: 0
  z-index 99
  .content
    display flex
    background-color: #141d27
    color rgba(255,255,255,0.4)
    .left
      flex 1
      font-size 0
      .logo-wrap
        display inline-block
        vertical-align top
        position relative
        top -10px
        margin 0 12px
        padding 6px
        width: 56px
        height: 56px
        box-sizing border-box
        border-radius 50%
        background: #141d27
        .logo
          width: 100%
          height: 100%
          border-radius 50%
          background #2b343c
          text-align center
          &.highlight
            background rgb(0,160,220)
          .icon-shopping_cart
            line-height: 44px
            font-size 24px
            color #80858a
            &.highlight
              color #fff
        .num
          position: absolute
          top: 0
          right: 0
          width: 24px
          height: 16px
          line-height: 16px
          text-align center
          border-radius 16px
          font-size 9px
          font-weight:700
          color #fff
          background-color: rgb(240,20,20)
          box-shadow 0 4px 8px 0 rgba(0,0,0,0.4)
      .price
        display inline-block
        vertical-align top
        line-height: 24px
        margin-top 12px
        padding-right 12px
        box-sizing border-box
        border-right 1px solid rgba(255,255,255,0.1)
        font-weight 700
        font-size 16px
        &.highlight
          color #fff
      .desc
        display inline-block
        vertical-align top
        margin:12px 0 0 12px
        line-height: 24px
        font-size 10px
    .right
      flex 0 0 105px
      width: 105px
      .pay
        height 48px
        line-height: 48px
        text-align center
        font-weight 700
        font-size 12px
        background: #2b333b
        &.not-enough
          background #2b333b
        &.enough
          background: #00b43c
          color #fff
          font-size 14px
  .ball-container
    .ball
      position fixed
      left 32px
      bottom 22px
      z-index 200
      transition all 0.6s cubic-bezier(0.12,0.76,0.6,1.02)
      .inner
        width: 16px
        height: 16px
        border-radius 50%
        background rgb(0,160,120)
        transition all 0.4s liner
  .shopcart-list
    position absolute
    left: 0
    top: 0
    z-index -1
    width: 100%
    &.fold-enter, &.fold-leave
      transform translate(0,0)
    &.fold-enter-active, &.fold-leave-active
      transition  all 0.5s
      transform translateY(-100%)
    .list-header
      height: 40px
      line-height: 40px
      padding 0 18px
      background #f3f5f7
      border-bottom 1px solid rgba(7,17,27,0.1)
      .title
        float left
        font-size 14px
        color rgb(7,17,27)
      .empty
        float right
        font-size 12px
        color rgb(0,160,220)
    .list-content
      padding  0 18px
      max-height 217px
      overflow hidden
      background #fff
      .food
        position relative
        padding 12px 0
        box-sizing border-box
        border-1px(rgba(7,17,27,0.1))
        .name
          line-height: 24px
          font-size 14px
          color rgb(7,17,27)
        .price
          position absolute
          right 90px
          bottom 12px
          line-height: 24px
          font-size 14px
          font-weight 700
          color rgb(240,20,20)
        .cartcontral-wrap
          position absolute
          right 0
          bottom 6px
  .list-mask
    position absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index 40
    background rgba(7,17,27,0.6)
    backdrop-filter blur(10px)
</style>
