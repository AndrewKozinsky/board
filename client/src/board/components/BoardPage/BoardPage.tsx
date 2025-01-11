import { useEffect, useRef } from 'react'
import { main } from '../../logic/main.ts'
import LeftPanelsWrapper from '../panels/left/LeftPanelsWrapper/LeftPanelsWrapper.tsx'
import TopPanelsWrapper from '../panels/top/TopPanelsWrapper/TopPanelsWrapper.tsx'
import './BoardPage.scss'

function BoardPage() {
	const canvasContainerRef = useRef<null | HTMLDivElement>(null)

	useEffect(() => {
		main.init(canvasContainerRef.current!)
	}, [])

	return (
		<div className='board' ref={canvasContainerRef}>
			{/*<TopPanelsWrapper />*/}
			{/*<LeftPanelsWrapper />*/}
		</div>
	)
}

export default BoardPage
