import { Assets, Graphics, Sprite, Text, Texture } from 'pixi.js'
import { getElementIdx, getHighestElementId } from '../../../utils/arrayUtils.ts'
import { getStore, updateStore } from '../../store/store.ts'
import { pixiUtils } from '../../../utils/pixiUtils.ts'
import { ShapeElementFigure } from '../../store/storeTypes.ts'

export const drawShape = {
	drawShapes() {
		const app = getStore.app

		const graphics = new Graphics()

		const startY = 140
		const startX = 200
		let width = 300
		const height = 300
		const color = 'ccc'

		// this.drawRectangle(graphics, { x: startX, y: startY, width, height, color })
		// this.drawCircle(graphics, { x: startX, y: startY, width, height, color })
		// this.drawTriangle(graphics, { x: startX, y: startY, width, height, color })
		// this.drawDiamond(graphics, { x: startX, y: startY, width, height, color })
		// this.drawHexagon(graphics, { x: startX, y: startY, width, height, color })
		// this.drawStar(graphics, { x: startX, y: startY, width, height, color })
		// this.drawLeftArrow(graphics, { x: startX, y: startY, width, height, color })
		// this.drawRightArrow(graphics, { x: startX, y: startY, width, height, color })
		this.drawSpeechBalloon(graphics, { x: startX, y: startY, width, height, color })

		app.stage.addChild(graphics)
	},

	getShape(figureType: ShapeElementFigure) {
		const obj: Record<ShapeElementFigure, string> = {
			[ShapeElementFigure.Rectangle]: 'rectangle',
			[ShapeElementFigure.Circle]: 'circle',
			[ShapeElementFigure.Triangle]: 'triangle',
			[ShapeElementFigure.Diamond]: 'diamond',
			[ShapeElementFigure.Hexagon]: 'hexagon',
			[ShapeElementFigure.Star]: 'star',
			[ShapeElementFigure.LeftArrow]: 'leftArrow',
			[ShapeElementFigure.RightArrow]: 'rightArrow',
			[ShapeElementFigure.SpeechBalloon]: 'speechBalloon',
		}

		return obj[figureType]
	},

	drawRectangle(graphics: Graphics, coords: { x: number; y: number; width: number; height: number; color: string }) {
		graphics.clear()

		const { x, y, width, height, color } = coords

		graphics.rect(x, y, width, height).fill(color)
	},

	drawCircle(graphics: Graphics, coords: { x: number; y: number; width: number; height: number; color: string }) {
		graphics.clear()

		const { x, y, width, height, color } = coords

		graphics.ellipse(x, y, width, height).fill(color)
	},

	drawTriangle(graphics: Graphics, coords: { x: number; y: number; width: number; height: number; color: string }) {
		graphics.clear()

		const { x, y, width, height, color } = coords

		graphics
			.moveTo(x + width / 2, y)
			.lineTo(x + width, y + height)
			.lineTo(x, y + height)
			.closePath()
			.fill(color)
	},

	drawDiamond(graphics: Graphics, coords: { x: number; y: number; width: number; height: number; color: string }) {
		graphics.clear()

		const { x, y, width, height, color } = coords

		graphics
			.moveTo(x + width / 2, y)
			.lineTo(x + width, y + height / 2)
			.lineTo(x + width / 2, y + height)
			.lineTo(x, y + height / 2)
			.closePath()
			.fill(color)
	},

	drawHexagon(graphics: Graphics, coords: { x: number; y: number; width: number; height: number; color: string }) {
		graphics.clear()

		const { x, y, width, height, color } = coords
		const onePcWidth = width / 100

		graphics
			.moveTo(x + onePcWidth * 23, y) // 1
			.lineTo(x + onePcWidth * 77, y) // 2
			.lineTo(x + width, y + height / 2) // 3
			.lineTo(x + onePcWidth * 77, y + height) // 4
			.lineTo(x + onePcWidth * 23, y + height) // 5
			.lineTo(x, y + height / 2) // 6
			.closePath()
			.fill(color)
	},

	drawStar(graphics: Graphics, coords: { x: number; y: number; width: number; height: number; color: string }) {
		graphics.clear()

		const { x, y, width, height, color } = coords
		const onePcWidth = width / 100
		const onePcHeight = height / 100

		graphics
			.moveTo(x + width / 2, y) // 1
			.lineTo(x + onePcWidth * 62, y + onePcHeight * 38) // 2
			.lineTo(x + width, y + onePcHeight * 38) // 3
			.lineTo(x + onePcWidth * 69, y + onePcHeight * 62) // 4
			.lineTo(x + onePcWidth * 81, y + height) // 5
			.lineTo(x + width / 2, y + onePcHeight * 76) // 6
			.lineTo(x + onePcWidth * 19, y + height) // 7
			.lineTo(x + onePcWidth * 31, y + onePcHeight * 62) // 8
			.lineTo(x, y + onePcHeight * 38) // 9
			.lineTo(x + onePcWidth * 38, y + onePcHeight * 38) // 10
			.closePath()
			.fill(color)
	},

	drawLeftArrow(graphics: Graphics, coords: { x: number; y: number; width: number; height: number; color: string }) {
		graphics.clear()

		const { x, y, width, height, color } = coords
		const onePcWidth = width / 100
		const onePcHeight = height / 100

		graphics
			.moveTo(x, y + height / 2) // 1
			.lineTo(x + onePcWidth * 50, y) // 2
			.lineTo(x + onePcWidth * 50, y + onePcHeight * 28) // 3
			.lineTo(x + width, y + onePcHeight * 28) // 4
			.lineTo(x + width, y + onePcHeight * 72) // 5
			.lineTo(x + onePcWidth * 50, y + onePcHeight * 72) // 6
			.lineTo(x + onePcWidth * 50, y + height) // 7
			.closePath()
			.fill(color)
	},

	drawRightArrow(graphics: Graphics, coords: { x: number; y: number; width: number; height: number; color: string }) {
		graphics.clear()

		const { x, y, width, height, color } = coords
		const onePcWidth = width / 100
		const onePcHeight = height / 100

		graphics
			.moveTo(x, y + onePcHeight * 28) // 1
			.lineTo(x + onePcWidth * 50, y + onePcHeight * 28) // 2
			.lineTo(x + onePcWidth * 50, y) // 3
			.lineTo(x + width, y + height / 2) // 4
			.lineTo(x + onePcWidth * 50, y + height) // 5
			.lineTo(x + onePcWidth * 50, y + onePcHeight * 72) // 6
			.lineTo(x, y + onePcHeight * 72) // 7
			.closePath()
			.fill(color)
	},

	drawSpeechBalloon(
		graphics: Graphics,
		coords: { x: number; y: number; width: number; height: number; color: string },
	) {
		graphics.clear()

		const { x, y, width, height, color } = coords
		const onePcWidth = width / 100
		const onePcHeight = height / 100

		graphics
			.moveTo(x, y) // 1
			.lineTo(x + width, y) // 2
			.lineTo(x + width, y + onePcHeight * 71) // 3
			.lineTo(x + onePcWidth * 34, y + onePcHeight * 71) // 4
			.lineTo(x + onePcWidth * 13, y + height) // 5
			.lineTo(x + onePcWidth * 13, y + onePcHeight * 71) // 6
			.lineTo(x, y + onePcHeight * 71) // 7
			.closePath()
			.fill(color)
	},
}
