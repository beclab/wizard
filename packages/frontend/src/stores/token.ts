import { defineStore } from 'pinia';
import axios from 'axios';
import { i18n } from '../boot/i18n';
import { Token } from '@bytetrade/core';
import { Encoder } from 'src/utils/encoder';

import { WizardInfo, RootState } from 'src/types/index';

function stringToIntHash(str: string, lowerbound: number, upperbound: number) {
	if (!str) {
		return lowerbound;
	}

	let result = 0;
	for (let i = 0; i < str.length; i++) {
		result = result + str.charCodeAt(i);
	}

	if (!lowerbound) lowerbound = 0;
	if (!upperbound) upperbound = 500;

	return (result % (upperbound - lowerbound)) + lowerbound;
}

export const useTokenStore = defineStore('token', {
	state: () => {
		return {
			token: null,
			url: null,
			user: {},
			pingResult: false,
			raw_login_loading: false,
			wizard: {}
		} as RootState;
	},
	getters: {
		step(): number {
			return this.wizard.step;
		},
		get_terminus_url(): string | undefined {
			if (!this.user) {
				return undefined;
			}

			const res = 'https://desktop.' + this.user.terminusName.replace('@', '.');
			return res;
		},
		get_auth_url(): string | undefined {
			if (!this.user) {
				return undefined;
			}

			const res = 'https://auth.' + this.user.terminusName.replace('@', '.');
			return res;
		},
		avatar_url(): string {
			if (!this.user || !this.user.terminusName) {
				return 'https://file.bttcdn.com/avatar3/1.png';
			}

			if (!this.user.avatar) {
				const id = stringToIntHash(this.user.terminusName, 1, 36);

				return `https://file.bttcdn.com/avatar3/${id}.png`;
			}

			if (this.user.avatar.startsWith('http')) {
				return this.user.avatar;
			} else {
				const re = new RegExp('^[1-3]?[0-9]\\.png');
				if (re.test(this.user.avatar)) {
					console.log('re test true');

					return 'https://file.bttcdn.com/avatar3/' + this.user.avatar;
				} else {
					try {
						const vp = JSON.parse(this.user.avatar);
						console.log(vp);
						if (vp) {
							const vcstr = Encoder.bytesToString(
								Encoder.base64UrlToBytes(
									vp.verifiableCredential![0].split('.')[1]
								)
							);
							console.log(vcstr);
							const vc = JSON.parse(vcstr);
							console.log(vc);
							console.log(vc.vc.credentialSubject.image);
							let imageUrl = vc.vc.credentialSubject.image;
							if (imageUrl.startsWith('ipfs://')) {
								imageUrl = imageUrl.replace(
									'ipfs://',
									'https://gateway.ipfs.io/ipfs/'
								);
							}

							console.log(imageUrl);
							return imageUrl;
						} else {
							return 'https://file.bttcdn.com/avatar3/1.png';
						}
					} catch (e) {
						console.log(e);
						return 'https://file.bttcdn.com/avatar3/1.png';
					}
				}
			}
		}
	},

	actions: {
		async loadData() {
			try {
				const data: any = await axios.get(
					this.url + '/bfl/info/v1/terminus-info',
					{}
				);
				if (data.wizardStatus) {
					this.user = data;
				} else {
					console.error(data);
				}
			} catch (e) {
				console.log(e);
			}
		},

		async loadIP() {
			try {
				const data: any = await axios.get(this.url + '/bfl/backend/v1/ip');
				const external = data.masterExternalIP;
				this.wizard.network.external_ip = external;
			} catch (e) {
				console.log(e);
			}
		},
		async ping2(): Promise<boolean> {
			if (!this.get_auth_url) {
				return false;
			}
			try {
				const data: any = await axios.get(
					this.get_auth_url + '/bfl/info/v1/terminus-info'
				);
				if (data.wizardStatus) {
					this.user = data;
					this.pingResult = true;
					return true;
				} else {
					console.error(data);
					return false;
				}
			} catch (e) {
				this.pingResult = false;
				return false;
			}
		},

		async raw_login(username: string, password: string) {
			const local_username = username.split('@')[0];

			const data: Token = await axios.post(this.url + '/api/firstfactor', {
				username: local_username,
				password: password,
				keepMeLoggedIn: false,
				requestMethod: 'POST',
				targetURL: '',
				acceptCookie: false
			});
			console.log(data);

			this.setToken(data);
		},

		setToken(new_token: Token | null) {
			if (new_token) {
				this.token = new_token;
			} else {
				this.token = null;
			}
		},

		setUrl(new_url: string | null) {
			this.url = new_url;
		},
		async loadWizard() {
			this.setWizard({
				step: 3,
				username: '',
				password: '',
				url: '',
				system: {
					language: i18n.global.locale.value,
					location: 'Singapore'
				},
				network: {
					enable_tunnel: false,
					external_ip: null
				}
			});
		},

		setWizard(wizard: WizardInfo) {
			this.wizard = wizard;
		},

		setStep(step: number) {
			this.wizard.step = step;
			this.setWizard(this.wizard);
		}
	}
});
