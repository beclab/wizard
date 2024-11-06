<template>
	<div class="row justify-evenly account_box">
		<div class="q-pa-md;wrap account_conter" style="word-wrap: break-word">
			<div class="boot_justify">
				<q-img src="../../assets/wizard_timeZone.jpg" class="account_img" />
			</div>
			<p class="get-text">{{ t('step_select_proxy') }}</p>
			<p class="account_please_text">
				{{ t('step_proxy_text_1') }}<br />
				{{ t('step_proxy_text_2') }}
				<a
					href="https://docs.olares.xyz/manual/get-started/activate-olares.html"
					target="_blank"
					>{{ t('step_proxy_text_3') }}</a
				>
			</p>
			<div class="Account_input_from">
				<p>{{ t('step_select_region') }}</p>
				<q-select
					:menu-offset="[0, 4]"
					v-model="regionMode"
					:options="options"
					class="Account_input"
					popup-content-class="options_selected_Account"
					emit-value
					map-options
					hide-dropdown-icon
				>
					<template v-slot:option="{ itemProps, opt, selected, toggleOption }">
						<q-item v-bind="itemProps">
							<q-item-section>
								<q-item-label>{{ opt.label }}</q-item-label>
							</q-item-section>
							<q-item-section side>
								<q-checkbox
									:model-value="selected"
									checked-icon="sym_r_check_circle"
									unchecked-icon=""
									indeterminate-icon="help"
									@update:model-value="toggleOption(opt.label)"
								/>
							</q-item-section>
						</q-item>
					</template>
				</q-select>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTokenStore } from 'src/stores/token';

import NeedFrpDialog from 'components/NeedFrpDialog.vue';
import NotNeedFrpDialog from 'components/NotNeedFrpDialog.vue';

const { t } = useI18n();
const $q = useQuasar();
const options = [
	{
		label: t('use_not_reverse_proxy'),
		value: false
	},
	{
		label: t('use_reverse_proxy'),
		value: true
	}
];

const tokenStore = useTokenStore();
const regionMode = ref(true);

let hasExternalIp = false;
const origin = window.location.origin;
if (tokenStore.user.selfhosted && origin.indexOf('30180') > -1) {
	const ip = origin.split(':')[1].slice(2);
	if (tokenStore.wizard.network.external_ip == ip) {
		hasExternalIp = true;
	}
}

if (hasExternalIp) {
	regionMode.value = false;
} else {
	regionMode.value = true;
}

const click = () => {
	if (regionMode.value) {
		tokenStore.wizard.network.enable_tunnel = true;
	} else {
		tokenStore.wizard.network.enable_tunnel = false;
	}

	if (tokenStore.wizard.network.enable_tunnel === true) {
		if (hasExternalIp) {
			$q.dialog({
				component: NotNeedFrpDialog
			}).onOk(() => {
				console.log('OK');
				tokenStore.setStep(4);
			});
			return true;
		} else {
			tokenStore.setStep(4);
			return false;
		}
	} else {
		if (hasExternalIp) {
			tokenStore.setStep(4);
			return false;
		} else {
			$q.dialog({
				component: NeedFrpDialog
			}).onOk(() => {
				tokenStore.setStep(4);
			});
			return true;
		}
	}
};

defineExpose({
	click
});
</script>
