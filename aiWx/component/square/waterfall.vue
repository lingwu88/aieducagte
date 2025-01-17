<template>
  <view class="container">
    <view class="list">
      <view class="item">
        <slot name="item"></slot>
      </view>
    </view>
  </view>
</template>

<script>
	export default {
		data() {
			return {
        IVirtualWaterFallProps:{
          gap:10,
          column:3,
          pageSize:number,
          request:(page,pageSize)=>Promise
        },
        ICardItem:{
          id:1,
          width:100,
          height:200
        }
			}
		},
    computed:{

    },
		onLoad() {

		},
		methods: {
		}
	}
</script>

<style lang="scss" scoped>
.container{
  width:100%;
  height:100%;
  overflow-y:scroll;
  overflow-x:hidden;

  .list{
    position:relative;
    width:100%;

    .item{
      position:absolute;
      top:0;
      left:0;
      box-sizing:border-box;
    }
  }
}
</style>
