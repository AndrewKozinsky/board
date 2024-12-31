import './Board.scss'
import MiddlePart from '../mainParts/MiddlePart/MiddlePart.tsx'
import TopPart from '../mainParts/TopPart/TopPart.tsx'

function Board() {
	return (
		<div className="board">
			<TopPart />
			<MiddlePart />
		</div>
	)
}

export default Board
