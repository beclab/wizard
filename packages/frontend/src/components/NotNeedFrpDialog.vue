<template>
	<q-dialog class="card-dialog" v-model="show" ref="dialogRef">
		<q-card class="card-continer">
			<terminus-dialog-bar
				label="Tips"
				icon=""
				titAlign="text-left"
				@close="onCancel"
			/>

			<div class="dialog-desc" style="textalign: left">
				If you have a fixed IP, using Cloudflare Tunnel may reduce the access
				speed.
			</div>

			<terminus-dialog-footer
				okText="Confirm"
				cancelText="Cancel"
				showCancel
				@close="onCancel"
				@submit="submit"
			/>
		</q-card>
	</q-dialog>
</template>

<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import { ref } from 'vue';

import TerminusDialogBar from './TerminusDialogBar.vue';
import TerminusDialogFooter from './TerminusDialogFooter.vue';

const { dialogRef, onDialogOK, onDialogHide } = useDialogPluginComponent();

const show = ref(true);
const submit = async () => {
	onDialogOK();
};

const onCancel = () => {
	onDialogHide();
};
</script>

<style lang="scss" scoped>
.card-dialog {
	.card-continer {
		width: 400px;
		border-radius: 12px;

		.dialog-desc {
			padding-left: 20px;
			color: #5c5551;
		}
	}
}
</style>
