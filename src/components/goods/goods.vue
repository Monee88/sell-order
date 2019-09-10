<template>
    <div class="goods">
      <div class="menu-wrap" ref="menuWrap">
          <ul>
            <li v-for="(item, i) in goods" :key="i" class="menu-item" :class="{'current':currentIndex===i}" @click="selectMenu(i)">
              <span class="text border-1px">
                <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
                {{item.name}}
              </span>
            </li>
          </ul>
      </div>
      <div class="food-wrap" ref="foodWrap">
        <ul>
          <li v-for="(item, i) in goods" :key="i" class="food-list food-list-hook">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li @click="selectFood(food)" v-for="(food, i) in item.foods" :key="i" class="food-item border-1px">
                <div class="icon">
                  <img :src="food.icon" width="57" height="57" alt="">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-show="food.oldPrice">{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontral-wrap">
                    <Cartcontral :food="food" v-on:cart-add="cartAdd"></Cartcontral>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <Shopcar id="car" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" :selectFoods="selectFoods" ref="shopcart"></Shopcar>
      <Food :food="selectedFood" ref="food"></Food>
    </div>
</template>

<script>
import BScroll from 'better-scroll'
import Shopcar from '../../components/shopcar/shopcar.vue'
import Food from '../../components/food/food.vue'
import Cartcontral from '../../components/cartcontral/cartcontral.vue'
const ERR_OK = 0
export default {
  data() {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    }
  },
  props: {
    seller: {
      type: Object
    }
  },
  created () {
    this.$http.get('/api/goods').then((res) => {
      res = res.body
      if (res.errno === ERR_OK) {
        this.goods = res.data
        this.$nextTick(() => {
          this.initScroll()
          this.calculateHeight()
        })
      }
    })
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  methods: {
    initScroll() {
      this.menuScroll = new BScroll(this.$refs.menuWrap, {
        click: true
      })
      this.foodsScroll = new BScroll(this.$refs.foodWrap, {
        click: true,
        probeType: 3
      })
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    calculateHeight() {
      let foodList = this.$refs.foodWrap.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    selectMenu(index) {
      let foodList = this.$refs.foodWrap.getElementsByClassName('food-list-hook')
      let el = foodList[index]
      this.foodsScroll.scrollToElement(el, 300)
    },
    cartAdd(el) {
      // dom元素更新后执行， 因此此处能正确打印出更改之后的值；
      // 体验优化，异步执行下落动画
      this.$nextTick(() => {
        // 调用shopcart组件的drop()函数
        this.$refs.shopcart.drop(el)
      })
    },
    selectFood(food) {
      if (!event._constructed) {
        return
      }
      this.selectedFood = food
      this.$refs.food.show()
    }
  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if ((this.scrollY >= height1 && this.scrollY < height2) || !height2) {
          return i
        }
      }
      return 0
    },
    selectFoods() {
      let foods = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  components: {
    Shopcar,
    Cartcontral,
    Food
  }
}
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/minin.styl"
.goods
  display flex
  position absolute
  top: 174px
  bottom 46px
  width: 100%
  overflow hidden
  .menu-wrap
    flex 0 0 80px
    width: 80px
    background-color: #f3f5f7
    .menu-item
      display table
      height:54px
      width: 56px
      line-height: 14px
      padding 0 12px
      text-align center
      &.current
        position relative
        margin-top: -1px
        z-index 10
        background #fff
        font-weight:700
        .text
          border-none()
      .icon
        display inline-block
        vertical-align top
        width: 12px
        height 12px
        margin-right:2px
        background-size: 12px 12px
        background-repeat no-repeat
        &.decrease
          bg-image('decrease_3')
        &.discount
          bg-image('discount_3')
        &.guarantee
          bg-image('guarantee_3')
        &.invoice
          bg-image('invoice_3')
        &.special
          bg-image('special_3')
      .text
        font-size 12px
        display table-cell
        vertical-align middle
        width: 56px
        border-1px(rgba(7,17,27,0.1))
  .food-wrap
    flex 1
    background-color: #fff
    .title
      padding-left:14px
      height: 26px
      line-height: 26px
      border-left:2px solid #999
      font-size 12px
      color:rgb(147,153,159)
      background #f3f5f7
    .food-item
      display flex
      margin: 18px
      padding-bottom 18px
      border-1px(rgba(7,17,27,0.1))
      &:last-child
        border-none()
        padding-bottom 0
      .icon
        flex 0 0 57px
        margin-right 10px
      .content
        flex 1
        .name
          font-size 14px
          margin 2px 0 8px 0
          height: 14px
          line-height: 14px
          color rgb(7,17,27)
        .desc, .extra
          font-size 10px
          line-height: 10px
          color rgb(147,153,159)
        .desc
          line-height: 12px
          margin-bottom: 8px
        .extra
          .count
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
          position: absolute
          right 0
          bottom 12px
</style>
