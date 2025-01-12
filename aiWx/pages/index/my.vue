<template>
	<view class="container main">
    <myHeader></myHeader>
		<list></list>
	</view>
</template>

<script>
import myHeader from '../../component/my/myHeader.vue';
import list from '../../component/my/list.vue';
	export default {
		components:{
			myHeader,
			list
		},
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
