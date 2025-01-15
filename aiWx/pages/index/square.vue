<template>
	<view class="container content">
    <text class="header" selectable="false">广场</text>
		<u-list width="70vw" height="1200rpx">
      <u-list-item v-for="(item, index) in list" :key="index">
				<post></post>
      </u-list-item>
    </u-list>
	</view>
</template>

<script>
import post from '../../component/square/post.vue'
	export default {
		components:{
			post
		},
		data() {
			return {
				list:[
						{
							title:"我是自律博主",
							content:"这是一个自律帖子",
							user:"王源",
							number:111
						},
						{
							title:"我是自律博主",
							content:"这是一个自律帖子",
							user:"王源",
							number:111
						},
						{
							title:"我是自律博主",
							content:"这是一个自律帖子",
							user:"王源",
							number:111
						},
						{
							title:"我是自律博主",
							content:"这是一个自律帖子",
							user:"王源",
							number:111
						},
						{
							title:"我是自律博主",
							content:"这是一个自律帖子",
							user:"王源",
							number:111
						},
						{
							title:"我是自律博主",
							content:"这是一个自律帖子",
							user:"王源",
							number:111
						},
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
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		
		.header{
			font-size: 40rpx;
			font-size: "宋体";
		}

	}

</style>
