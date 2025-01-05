export enum OSNames {
	mac = 'macOS',
	ios = 'iOS',
	windows = 'Windows',
	android = 'Android',
	linux = 'Linux',
}

export function detectOS() {
	let userAgent = window.navigator.userAgent,
		platform = window.navigator.platform,
		macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
		windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
		iosPlatforms = ['iPhone', 'iPad', 'iPod'],
		os: null | OSNames = null

	if (macosPlatforms.indexOf(platform) !== -1) {
		os = OSNames.mac
	} else if (iosPlatforms.indexOf(platform) !== -1) {
		os = OSNames.ios
	} else if (windowsPlatforms.indexOf(platform) !== -1) {
		os = OSNames.windows
	} else if (/Android/.test(userAgent)) {
		os = OSNames.android
	} else if (!os && /Linux/.test(platform)) {
		os = OSNames.linux
	}

	return os
}
