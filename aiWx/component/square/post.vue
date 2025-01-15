<template>
  <view class="content">
    <view class="card">
      <text class="title">{{ title }}</text>
      <text class="content" selectable="false">{{ content }}</text>
      <text class="userName" selectable="false">{{ username }}</text>
      <text class="number" selectable="false" space="false" decode="false">889</text>
    </view>
  </view>
</template>

<script>
	export default {
		data() {
			return {
        title:"2024秋冬季学习宝典|掌握规则,轻松学习",
        img:"/static/classroom/eassyImg1.png"
			}
		},
		onLoad() {

		},
		methods: {
		}
	}
</script>

<style lang="scss" scoped>
	.content {
    width: 45%;

    .card{
      height: 300rpx;
      width: 100%;
      background-color: red;
      border-radius: 5rpx;
      display: flex;
      flex-direction: column;
      box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

      .title{
        font-size: 30rpx;
        font-family: "楷体";
      }

      .img-list{
        display: flex;
        flex-direction: row;
        justify-content: center;
      }
    }
	}
</style>
