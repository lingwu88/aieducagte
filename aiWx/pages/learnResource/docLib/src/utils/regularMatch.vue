<!-- src/data/StaticData.vue -->
<script>
export default {
	data() {
		return {};
	},
	methods: {
		isValidUrl(str) {
			if (!str) return false;
			const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i;
			return urlPattern.test(str);
		}
	}
};
</script>
