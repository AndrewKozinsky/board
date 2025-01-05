import { Application, Renderer } from 'pixi.js'

declare global {
	var __PIXI_APP__: Application<Renderer>
}
