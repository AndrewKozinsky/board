import LeftPanel from '../panels/LeftPanel/LeftPanel.tsx'
import TopPanel from '../panels/TopPanel/TopPanel.tsx'
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
