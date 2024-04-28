export const FloatBg: Record<number, { color1: string; color2: string }> = {
	1: {
		color1: '#93e1ff',
		color2: '#faffd9'
	},
	2: {
		color1: '#ADB1FF',
		color2: '#FFEED4'
	},
	3: {
		color1: '#ADFFDD',
		color2: '#F4FFD4'
	},
	4: {
		color1: '#FFFDC1',
		color2: '#FBFFED'
	},
	5: {
		color1: '#FFEED4',
		color2: '#F4FFD4'
	}
};

export const AccountErrMessage: Record<
	string,
	{ message: string; showLink: boolean }
> = {
	CLOUD_ADMIN: {
		message: 'err_cloud_admin',
		showLink: true
	},
	CLOUD_SUB: {
		message: 'err_cloud_sub',
		showLink: false
	},
	SELFHOSTED_ADMIN: {
		message: 'err_selfhosted_admin',
		showLink: true
	},
	SELFHOSTED_SUB: {
		message: 'err_selfhosted_sub',
		showLink: false
	}
};
