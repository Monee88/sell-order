<template>
  <div class="cartcontral">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count>0" @click.stop="decreaseCount">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop="addCount"></div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    addCount(el) {
      if (!this.food.count) {
        Vue.set(this.food, 'count', 1)
      } else {
        this.food.count++
      }
      this.$emit('cart-add', event.target)
    },
    decreaseCount() {
      if (this.food.count) {
        this.food.count--
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.cartcontral
  font-size 0
  .cart-add
    display inline-block
    padding 6px
    font-size 24px
    line-height: 24px
    color rgb(0,160,220)
  .cart-count
    display inline-block
    vertical-align top
    width: 12px
    padding-top 6px
    line-height: 24px
    text-align center
    font-size 10px
    color rgb(147,153,159)
  .cart-decrease
    display inline-block
    padding 6px
    &.move-enter, &.move-leave
      opacity: 1
      transform translate3d(24px,0,0)
      .inner
        transition rotate(180deg)
    &.move-enter-active, &.move-leave-active
      opacity 0
      transition all 1s liner
    .inner
      display inline-block
      font-size 24px
      line-height: 24px
      color rgb(0,160,220)
      transition rotate(0)
</style>
