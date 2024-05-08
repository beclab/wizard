import { Token, TerminusInfo } from '@bytetrade/core';
export interface va1apha1Request {
	access_level: number | null;
	allow_cidrs: string[] | null;
}

export interface SystemOption {
	location: string;
	language: string;
}

export interface CloudflareNetworkOption {
	enable_tunnel: boolean;
	external_ip: string | null;
}

export interface WizardInfo {
	step: number;

	username: string | null;
	password: string | null;
	//access_token: string;
	url: string;
	// lang: string | null;
	// timezone: string | null;

	//did: string | null;

	system: SystemOption;
	network: CloudflareNetworkOption;
}

export type RootState = {
	token: Token | null;
	url: string | null;
	user: TerminusInfo;
	pingResult: boolean;
	raw_login_loading: boolean;
	wizard: WizardInfo;
};
