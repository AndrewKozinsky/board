import { isKeysPressed } from '../../../utils/keyboardUtils.ts'
import { boardConfig } from './boardConfig.ts'
import { ZoomDirection } from './scaleCanvas.ts'

export const fullScreen = {
	init() {
		document.addEventListener(
			'keydown',
			(e) => {
				if (!isKeysPressed(e, boardConfig.commands.turnOnFullScreenMode.hotKeys)) return

				this.toggleFullScreen()
			},
			false,
		)
	},

	toggleFullScreen() {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen()
		} else if (document.exitFullscreen) {
			document.exitFullscreen()
		}
	},
}
