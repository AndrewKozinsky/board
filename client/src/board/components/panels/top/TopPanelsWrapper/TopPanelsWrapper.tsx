import SelectFigurePanel from '../SelectShapePanel/SelectFigurePanel.tsx'
import './TopPanelsWrapper.scss'

function TopPanelsWrapper() {
	return (
		<div className='top-part'>
			<div className='top-part__logo'>Доска</div>
			<div className='top-part__divider' />
			<div className='top-part__panel'>
				<SelectFigurePanel />
			</div>
		</div>
	)
}

export default TopPanelsWrapper
