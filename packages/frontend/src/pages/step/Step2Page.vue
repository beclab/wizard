<template>
	<div class="row justify-evenly account_box">
		<div class="q-pa-md;wrap account_conter" style="word-wrap: break-word">
			<div class="boot_justify">
				<q-img src="../../assets/wizard_language.jpg" class="account_img" />
			</div>
			<p class="get-text">{{ t('step_select_language') }}</p>
			<div class="Account_input_from">
				<p>{{ t('step_language') }}</p>
				<q-select
					:menu-offset="[0, 4]"
					v-model="tokenStore.wizard.system.language"
					:options="options"
					dense
					readonly
					hide-dropdown-icon
					class="Account_input"
					popup-content-class="options_selected_Account"
					style="background: #f6f6f6"
				>
					<template v-slot:option="{ itemProps, opt, selected, toggleOption }">
						<q-item v-bind="itemProps">
							<q-item-section>
								<q-item-label>{{ opt }}</q-item-label>
							</q-item-section>
							<q-item-section side>
								<q-checkbox
									:model-value="selected"
									checked-icon="check_circle"
									unchecked-icon=""
									indeterminate-icon="help"
									@update:model-value="toggleOption(opt)"
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
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTokenStore } from 'src/stores/token';

const { t } = useI18n();
const tokenStore = useTokenStore();
let options = ref<string[]>(['English']);

const click = async (): Promise<boolean> => {
	if (tokenStore.user.selfhosted) {
		tokenStore.setStep(3);
	} else {
		tokenStore.wizard.network.enable_tunnel = false;
		tokenStore.setStep(4);
	}

	return true;
};

defineExpose({
	click
});
</script>
