import { ShapeElementFigure } from '../../../../../types/commonTypes.ts'
import { CircleIcon } from '../../../../icons/figures/CircleIcon.tsx'
import { DiamondIcon } from '../../../../icons/figures/DiamondIcon.tsx'
import { HexagonIcon } from '../../../../icons/figures/HexagonIcon.tsx'
import { LeftArrowIcon } from '../../../../icons/figures/LeftArrowIcon.tsx'
import { RectangleIcon } from '../../../../icons/figures/RectangleIcon.tsx'
import { RightArrowIcon } from '../../../../icons/figures/RightArrowIcon.tsx'
import { SpeechBalloonIcon } from '../../../../icons/figures/SpeechBalloonIcon.tsx'
import { StarIcon } from '../../../../icons/figures/StarIcon.tsx'
import { TriangleIcon } from '../../../../icons/figures/TriangleIcon.tsx'

export const buttonsConfig = [
	{
		shapeName: ShapeElementFigure.Rectangle,
		Icon: RectangleIcon,
	},
	{
		shapeName: ShapeElementFigure.Circle,
		Icon: CircleIcon,
	},
	{
		shapeName: ShapeElementFigure.Triangle,
		Icon: TriangleIcon,
	},
	{
		shapeName: ShapeElementFigure.Diamond,
		Icon: DiamondIcon,
	},
	{
		shapeName: ShapeElementFigure.Hexagon,
		Icon: HexagonIcon,
	},
	{
		shapeName: ShapeElementFigure.Star,
		Icon: StarIcon,
	},
	{
		shapeName: ShapeElementFigure.LeftArrow,
		Icon: LeftArrowIcon,
	},
	{
		shapeName: ShapeElementFigure.RightArrow,
		Icon: RightArrowIcon,
	},
	{
		shapeName: ShapeElementFigure.SpeechBalloon,
		Icon: SpeechBalloonIcon,
	},
]
