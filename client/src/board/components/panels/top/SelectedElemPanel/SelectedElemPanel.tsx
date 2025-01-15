import React from 'react'
import { useUIStore } from '../../../../uiStore/uiStore.ts'
import './SelectedElemPanel.scss'

function SelectedElemPanel() {
	const selectedElem = useUIStore((s) => s.selectedElem)

	if (!selectedElem) {
		return null
	}

	return <div className='selected-element-panel'>{selectedElem.id}</div>
}

export default SelectedElemPanel
