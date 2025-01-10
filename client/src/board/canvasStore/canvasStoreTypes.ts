import { Application, Container, ContainerChild, Renderer } from 'pixi.js'
import { FigureElement } from '../logic/elements/FigureElement.ts'
import { TextElement } from '../logic/elements/TextElement.ts'
import { Tools } from '../types/commonTypes.ts'

export enum Cursor {
	Default = 'default',
	Palm = 'grab',
	Dragging = 'grabbing',
	EwResize = 'ew-resize',
	NsResize = 'ns-resize',
	NwseResize = 'nwse-resize',
	NeswResize = 'nesw-resize',

	DrawCircle = "url(\"data:image/svg+xml,%3Csvg width='22px' height='22px' viewBox='0 0 22 22' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Crect fill='%23000000' x='0' y='16' width='9' height='1'%3E%3C/rect%3E%3Crect fill='%23000000' x='4' y='12' width='1' height='9'%3E%3C/rect%3E%3Ccircle stroke='%23000000' cx='13.5' cy='6.5' r='5'%3E%3C/circle%3E%3C/g%3E%3C/svg%3E\") 32 32, pointer",
	DrawDiamond = "url(\"data:image/svg+xml,%3Csvg width='22px' height='22px' viewBox='0 0 22 22' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Crect fill='%23000000' x='0' y='16' width='9' height='1'%3E%3C/rect%3E%3Crect fill='%23000000' x='4' y='12' width='1' height='9'%3E%3C/rect%3E%3Cpath d='M14,1.70710678 L19.2928932,7 L14,12.2928932 L8.70710678,7 L14,1.70710678 Z' id='Rectangle-Copy-5' stroke='%23000000'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\") 32 32, pointer",
	DrawHexagon = "url(\"data:image/svg+xml,%3Csvg width='22px' height='22px' viewBox='0 0 22 22' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Crect fill='%23000000' x='0' y='17' width='9' height='1'%3E%3C/rect%3E%3Crect fill='%23000000' x='4' y='13' width='1' height='9'%3E%3C/rect%3E%3Cpath d='M16.8552699,3.5 C16.9495318,3.5 17.039787,3.52650978 17.1171164,3.57404645 C17.1944457,3.62158313 17.2588492,3.69014671 17.3014076,3.7742543 L17.3014076,3.7742543 L19.3254076,7.7742543 C19.397224,7.91618385 19.397224,8.08381615 19.3254076,8.2257457 L19.3254076,8.2257457 L17.3014076,12.2257457 C17.2588492,12.3098533 17.1944457,12.3784169 17.1171164,12.4259535 C17.039787,12.4734902 16.9495318,12.5 16.8552699,12.5 L16.8552699,12.5 L12.1447301,12.5 C12.0504682,12.5 11.960213,12.4734902 11.8828836,12.4259535 C11.8055543,12.3784169 11.7411508,12.3098533 11.6985924,12.2257457 L11.6985924,12.2257457 L9.67459238,8.2257457 C9.60277603,8.08381615 9.60277603,7.91618385 9.67459238,7.7742543 L9.67459238,7.7742543 L11.6985924,3.7742543 C11.7411508,3.69014671 11.8055543,3.62158313 11.8828836,3.57404645 L11.8828836,3.57404645 Z' stroke='%23000000'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\") 32 32, pointer",
	DrawLeftArrow = "url(\"data:image/svg+xml,%3Csvg width='22px' height='22px' viewBox='0 0 22 22' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg id='drawLeftArrowCursor' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Crect fill='%23000000' x='0' y='17' width='9' height='1'%3E%3C/rect%3E%3Crect fill='%23000000' x='4' y='13' width='1' height='9'%3E%3C/rect%3E%3Cpath d='M14.5,3.20710678 L19.2928932,8 L14.5,12.7928932 L14.5,9.5 L9.5,9.5 L9.5,6.5 L14.5,6.5 L14.5,3.20710678 Z' stroke='%23000000' transform='translate(14.500000, 8.000000) scale(-1, 1) translate(-14.500000, -8.000000) '%3E%3C/path%3E%3C/g%3E%3C/svg%3E\") 32 32, pointer",
	DrawRectangle = "url(\"data:image/svg+xml,%3Csvg width='22px' height='22px' viewBox='0 0 22 22' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cpath d='M18,2.5 L18.5,11 L10,11.5 L9.5,3 L18,2.5 Z' stroke='%23000000'%3E%3C/path%3E%3Crect fill='%23000000' x='0' y='16' width='9' height='1'%3E%3C/rect%3E%3Crect fill='%23000000' x='4' y='12' width='1' height='9'%3E%3C/rect%3E%3C/g%3E%3C/svg%3E\") 32 32, pointer",
	DrawRightArrow = "url(\"data:image/svg+xml,%3Csvg width='22px' height='22px' viewBox='0 0 22 22' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Crect fill='%23000000' x='0' y='17' width='9' height='1'%3E%3C/rect%3E%3Crect fill='%23000000' x='4' y='13' width='1' height='9'%3E%3C/rect%3E%3Cpath d='M14.5,3.20710678 L19.2928932,8 L14.5,12.7928932 L14.5,9.5 L9.5,9.5 L9.5,6.5 L14.5,6.5 L14.5,3.20710678 Z' stroke='%23000000'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\") 32 32, pointer",
	DrawSpeechBalloon = "url(\"data:image/svg+xml,%3Csvg width='22px' height='22px' viewBox='0 0 22 22' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg id='drawSpeechBoloonCursor' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Crect fill='%23000000' x='0' y='17' width='9' height='1'%3E%3C/rect%3E%3Crect fill='%23000000' x='4' y='13' width='1' height='9'%3E%3C/rect%3E%3Cpath d='M18.5,3.5 L18.5,9.5 L14.7928932,9.5 L11.5,12.7928932 L11.5,9.5 L9.5,9.5 L9.5,3.5 L18.5,3.5 Z' stroke='%23000000'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\") 32 32, pointer",
	DrawStar = "url(\"data:image/svg+xml,%3Csvg width='22px' height='22px' viewBox='0 0 22 22' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg id='drawStarCursor' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Crect fill='%23000000' x='0' y='17' width='9' height='1'%3E%3C/rect%3E%3Crect fill='%23000000' x='4' y='13' width='1' height='9'%3E%3C/rect%3E%3Cpath d='M14,3.70510578 L15.0397477,7.09499307 L18.5119361,7.08701331 L15.6984516,9.22646081 L16.7623326,12.6438187 L14,10.5238695 L11.2376674,12.6438187 L12.3015484,9.22646081 L9.48806393,7.08701331 L12.9602523,7.09499307 L14,3.70510578 Z' stroke='%23000000'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\") 32 32, pointer",
	DrawTriangle = "url(\"data:image/svg+xml,%3Csvg width='22px' height='22px' viewBox='0 0 22 22' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg id='drawTriangleCursor' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Crect fill='%23000000' x='0' y='16' width='9' height='1'%3E%3C/rect%3E%3Crect fill='%23000000' x='4' y='12' width='1' height='9'%3E%3C/rect%3E%3Cpath d='M13.8589168,2.6086446 C14.3237093,2.69535225 14.3929751,2.76461802 14.4389478,2.84890128 L14.4389478,2.84890128 L18.7544056,10.7605739 C18.8205213,10.881786 18.8312469,11.0183216 18.7951406,11.1410832 C18.7683221,11.232266 18.7156665,11.3158497 18.6406807,11.3799106 L18.6406807,11.3799106 L9.68454219,11.5 C9.546471,11.5 9.421471,11.4440356 9.3309888,11.3535534 C9.26381,11.2863746 9.21565868,11.2001683 9.19531223,11.103712 L9.19531223,11.103712 L13.5610522,2.84890128 C13.6271679,2.7276892 13.7361553,2.64475093 13.8589168,2.6086446 Z' stroke='%23000000'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\") 32 32, pointer",
}

export enum InteractionStatus {
	Default = 'default',
	Hovered = 'hovered',
	Selected = 'selected',
}

export type CanvasStoreType = {
	app: Application<Renderer>
	devicePixelRatio: number
	$bgContainer: Container<ContainerChild>
	$mainContainer: Container<ContainerChild>

	_tool: Tools
	get tool(): Tools
	set tool(val: Tools)

	// Уровень масштабирования холста в процентах
	_scale: number
	get scale(): number
	set scale(val: number)

	// Смещение холста
	offset: {
		x: number
		y: number
	}
	cursor: Cursor
	elements: CanvasElement[]
}

export type CanvasElement = FigureElement | TextElement
