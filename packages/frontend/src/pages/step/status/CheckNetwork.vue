<template>
	<div class="row justify-evenly account_box">
		<div
			class="q-pa-md wrap account_conter"
			style="word-wrap: break-word"
			v-if="!state || state != 'Failed'"
		>
			<div class="boot_justify">
				<animationPage
					:picture="pictureImg"
					:certificate="certificateImg"
					:isAnimated="request_https_certificate"
				/>
			</div>
			<p class="get-text">{{ t('network_title') }}</p>
			<div>
				<p class="account_please_text please_text">
					{{ t('network_content') }}
				</p>
			</div>
			<template v-if="state">
				<p class="State_text">State {{ state }}</p>
			</template>
		</div>
		<div
			class="q-pa-md;wrap account_conter"
			style="word-wrap: break-word min-height:auto"
			v-else
		>
			<div class="boot_justify">
				<q-img src="../../../assets/wizard_failed.jpg" class="account_img" />
			</div>
			<p class="get-text">{{ t('network_failed_title') }}</p>
			<p class="account_please_text please_text">
				{{ t('network_failed_content') }}
			</p>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { useI18n } from 'vue-i18n';
import animationPage from '../animation.vue';
import pictureImg from 'assets/wizard_waikuang.png';
import certificateImg from 'assets/wizard_certificate.png';
import { useTokenStore } from 'stores/token';

export default defineComponent({
	name: 'CheckNetwork',
	components: {
		animationPage
	},
	setup() {
		const { t } = useI18n();
		const tokenStore = useTokenStore();
		const isFailed = ref(false);
		const state = ref<string | null>(null);
		let checkHttpsCerificateProgress: any = null;

		const request_https_certificate = ref(false);
		const https_certificate_ready = ref(false);

		async function checkHttpsCertificateProgress() {
			const tokenStore = useTokenStore();
			try {
				const data: any = await axios.get(
					tokenStore.url + '/bfl/settings/v1alpha1/ssl/task-state',
					{}
				);

				https_certificate_ready.value = true;

				if (data.state == 4) {
					state.value = 'Succeeded';
					tokenStore.user.wizardStatus = 'wait_reset_password';
				} else if (data.state == 2) {
					state.value = 'Running';
					request_https_certificate.value = true;
				} else if (data.state == 5) {
					state.value = 'CheckL4Proxy';
					request_https_certificate.value = true;
				} else if (data.state == 6) {
					state.value = 'CheckFrpAgent';
					request_https_certificate.value = true;
				} else if (data.state == 7) {
					state.value = 'GenerateCert';
					request_https_certificate.value = true;
				} else if (data.state == 8) {
					state.value = 'ConfigureIngressHTTPs';
					request_https_certificate.value = true;
				} else if (data.state == 9) {
					state.value = 'CheckTunnel';
					request_https_certificate.value = true;
				} else if (data.state == 3) {
					state.value = 'Failed';
					request_https_certificate.value = true;
				} else if (data.state == 1) {
					state.value = 'Pending';
					request_https_certificate.value = true;
				}
			} catch (e: any) {
				console.log(e);
				console.log(e.message);
				if (e.message == 'Default') {
					state.value = 'Succeeded';
					tokenStore.user.wizardStatus = 'wait_reset_password';
				} else {
					request_https_certificate.value = true;
					state.value = null;
				}
			}
		}

		onMounted(async () => {
			checkHttpsCerificateProgress = setInterval(async () => {
				checkHttpsCertificateProgress();
			}, 5 * 1000);
		});
		checkHttpsCertificateProgress();

		onUnmounted(() => {
			if (checkHttpsCerificateProgress) {
				clearInterval(checkHttpsCerificateProgress);
			}
		});

		return {
			state,
			isFailed,
			pictureImg,
			tokenStore,
			certificateImg,
			request_https_certificate,
			t
		};
	}
});
</script>
