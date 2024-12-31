import MiddlePart from '../mainParts/MiddlePart/MiddlePart.tsx'
import TopPart from '../mainParts/TopPart/TopPart'
import './Board.scss'

function Board() {
	return (
		<div className="board">
			<TopPart />
			<MiddlePart />
		</div>
	)
}

export default Board
