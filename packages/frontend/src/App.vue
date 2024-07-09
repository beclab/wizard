<template>
	<router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useTokenStore } from './stores/token';

export default defineComponent({
	name: 'App',
	async preFetch(): Promise<any> {
		if (document.getElementById('Loading'))
			document.getElementById('Loading')?.remove();
		const tokenStore = useTokenStore();

		return new Promise((resolve) => {
			tokenStore.loadData().then(() => {
				tokenStore.loadWizard().then(() => {
					resolve({});
				});
			});
		});
	},
	setup() {
		const tokenStore = useTokenStore();
		const host = window.location.origin;
		tokenStore.setUrl(host);

		return {};
	}
});
</script>
