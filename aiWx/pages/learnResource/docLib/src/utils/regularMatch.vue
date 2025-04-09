<!-- src/data/StaticData.vue -->
<script>
export default {
	data() {
		return {};
	},
	methods: {
		isValidUrl(str) {
			if (!str || typeof str !== 'string') return false;
			const urlPattern = /^(https?|ftp):\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?([-a-zA-Z0-9@:%._\+~#?&/=]*)$/i;
			return urlPattern.test(str);
		}
	}
};
</script>
