<template>
	<view class="container">
      <u--input
      placeholder="请输入内容"
      border="surround"
      v-model="value"
      ></u--input>
      <view class="menu-container">
				<view class="title">选择改写风格</view>
				<view class="menu">
          <view class="menu-item" v-for="(item,index) in list" :key="index">
            <text>{{item.name}}</text>
          </view>
        </view>
			</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value:"",
				list:[
					{
						name:"风格1"
					},
          {
            name:"风格2"
          },
          {
            name:"风格3"
          },
          {
            name:"风格4"
          }
				]
				}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>

</style>
