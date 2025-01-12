<template>
	<view class="list">
		<uni-list>
			<uni-list-item  title="列表文字" ></uni-list-item>
			<uni-list-item :disabled="true" title="列表禁用状态" ></uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
.main{
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
}
</style>
