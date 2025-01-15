import ChooseFigurePanel from '../ChooseFigurePanel/ChooseFigurePanel.tsx'
import SelectedElemPanel from '../SelectedElemPanel/SelectedElemPanel.tsx'
import './TopPanelsWrapper.scss'

function TopPanelsWrapper() {
	return (
		<div className='top-part'>
			<div className='top-part__logo'>Доска</div>
			<div className='top-part__divider' />
			<div className='top-part__panel'>
				<ChooseFigurePanel />
				<SelectedElemPanel />
			</div>
		</div>
	)
}

export default TopPanelsWrapper
