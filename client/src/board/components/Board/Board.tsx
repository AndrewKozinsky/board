import {useEffect, useRef} from 'react'
import {main} from '../../logic/main.ts'
import LeftPanel from '../panels/LeftPanel/LeftPanel.tsx'
import TopPanel from '../panels/TopPanel/TopPanel.tsx'
import './Board.scss'

function Board() {
	const canvasContainerRef = useRef<null | HTMLDivElement>(null)

	useEffect(() => {
		main.init(canvasContainerRef.current!)
	}, [])

	return (
		<div className="board" ref={canvasContainerRef}>
			<TopPanel />
			<LeftPanel />
		</div>
	)
}

export default Board
