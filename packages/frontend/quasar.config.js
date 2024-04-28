const path = require('path');

const { configure } = require('quasar/wrappers');

module.exports = configure(function (ctx) {
	return {
		supportTS: {
			tsCheckerConfig: {
				eslint: {
					enabled: true,
					files: './src/**/*.{ts,tsx,js,jsx,vue}'
				}
			}
		},

		preFetch: true,
		boot: ['i18n', 'axios', 'smartEnginEntrance'],
		css: ['app.scss', 'animation.scss', 'index.scss'],
		extras: [
			'roboto-font', // optional, you are not bound to it
			'material-icons', // optional, you are not bound to it
			'bootstrap-icons',
			'themify',
			'material-icons',
			'material-symbols-outlined',
			'material-symbols-rounded'
		],

		build: {
			vueRouterMode: 'history', // available values: 'hash', 'history'
			env: {
				BFL_URL: process.env.BFL_URL
			},
			chainWebpack(chain) {
				chain.resolve.alias.set('@', path.resolve('src'));
			}
		},

		devServer: {
			open: true, // opens browser window automatically,
			proxy: {
				'/bfl': {
					target: process.env.BFL_URL,
					changeOrigin: true,
					pathRewrite: {
						'^/bfl': 'bfl'
					}
				},
				'/api': {
					target: process.env.BFL_URL,
					changeOrigin: true,
					pathRewrite: {
						'^/api': 'api'
					}
				}
			},
			port: 30180
		},

		framework: {
			config: {},
			plugins: ['Notify', 'Loading', 'Dialog', 'Cookies']
		},

		animations: ['fadeIn', 'fadeOut'],

		ssr: {
			pwa: false,
			prodPort: 3000, // The default port that the production server should use

			maxAge: 1000 * 60 * 60 * 24 * 30,
			middlewares: [
				ctx.prod ? 'compression' : '',
				'render' // keep this as last one
			]
		},

		pwa: {
			workboxPluginMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
			workboxOptions: {}, // only for GenerateSW
			manifest: {
				name: 'Quasar App',
				short_name: 'Quasar App',
				description: '',
				display: 'standalone',
				orientation: 'portrait',
				background_color: '#ffffff',
				theme_color: '#027be3',
				icons: [
					{
						src: 'icons/icon-128x128.png',
						sizes: '128x128',
						type: 'image/png'
					},
					{
						src: 'icons/icon-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'icons/icon-256x256.png',
						sizes: '256x256',
						type: 'image/png'
					},
					{
						src: 'icons/icon-384x384.png',
						sizes: '384x384',
						type: 'image/png'
					},
					{
						src: 'icons/icon-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			}
		},

		cordova: {
			// noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
		},

		// Full list of options: https://v2.quasar.dev/quasar-cli-webpack/developing-capacitor-apps/configuring-capacitor
		capacitor: {
			hideSplashscreen: true
		},

		// Full list of options: https://v2.quasar.dev/quasar-cli-webpack/developing-electron-apps/configuring-electron
		electron: {
			bundler: 'packager', // 'packager' or 'builder'

			packager: {},

			builder: {
				appId: 'launcher'
			},

			chainWebpackMain(/* chain */) {
				// do something with the Electron main process Webpack cfg
				// extendWebpackMain also available besides this chainWebpackMain
			},

			chainWebpackPreload(/* chain */) {
				// do something with the Electron main process Webpack cfg
				// extendWebpackPreload also available besides this chainWebpackPreload
			}
		}
	};
});
