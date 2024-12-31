import LeftPanel from '../mainParts/LeftPanel/LeftPanel.tsx'
import TopPanel from '../mainParts/TopPanel/TopPanel.tsx'
import './Board.scss'

function Board() {
	return (
		<div className="board">
			<TopPanel />
			<LeftPanel />
		</div>
	)
}

export default Board
