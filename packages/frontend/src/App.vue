<template>
	<router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useTokenStore } from './stores/token';
import { supportLanguages } from './i18n';
import { i18n } from './boot/i18n';

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

		let terminusLanguage = navigator.language;

		console.log(terminusLanguage);

		if (terminusLanguage) {
			if (supportLanguages.find((e) => e.value == terminusLanguage)) {
				i18n.global.locale.value = terminusLanguage as any;
			}
		}

		return {};
	}
});
</script>
