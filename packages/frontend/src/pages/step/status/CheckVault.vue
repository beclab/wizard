<template>
	<div class="row justify-evenly account_box">
		<div class="q-pa-md;wrap account_conter" style="word-wrap: break-word">
			<div class="boot_justify">
				<animationPage
					:picture="wizard_system"
					:certificate="wizard_systema"
					:isAnimated="true"
				/>
			</div>
			<p class="get-text">{{ t('vault_title') }}</p>

			<p class="account_please_text please_text">
				{{ t('vault_content_1') }}
				<span @click="openTip">{{ t('err_learn_more') }}</span
				><br />
			</p>
			<p
				v-if="tokenStore.user.selfhosted"
				class="account_please_text please_text"
			>
				{{ t('vault_content_2') }}
			</p>
			<div class="qrcode_scanning">
				<div class="qrcode_scanning_itme">
					<qrcode-vue :value="url" class="qrcode_img" level="L"></qrcode-vue>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import QrcodeVue from 'qrcode.vue';
import { useTokenStore } from 'stores/token';
import { Encoder } from '@bytetrade/core';

import animationPage from '../animation.vue';
import ScantipDialog from 'components/ScantipDialog.vue';

import wizard_systema from 'assets/wizard_systema.png';
import wizard_system from 'assets/wizard_system.png';

export default defineComponent({
	name: 'CheckVault',
	components: { QrcodeVue, animationPage },
	setup() {
		const tokenStore = useTokenStore();
		const $q = useQuasar();
		const { t } = useI18n();

		let base_url = window.location.origin + '/server';

		tokenStore.wizard.url = base_url;

		const url = ref<string>(
			'active_vault://' +
				Encoder.stringToBase64Url(JSON.stringify(tokenStore.wizard))
		);
		console.log(tokenStore.wizard);
		console.log('url.value', url.value);

		const openTip = () => {
			$q.dialog({
				component: ScantipDialog
			})
				.onOk(() => {
					console.log('OK');
				})
				.onCancel(() => {
					console.log('Cancel');
				})
				.onDismiss(() => {
					console.log('Called on OK or Cancel');
				});
		};

		return {
			tokenStore,
			url,
			openTip,
			wizard_systema,
			wizard_system,
			t
		};
	}
});
</script>
