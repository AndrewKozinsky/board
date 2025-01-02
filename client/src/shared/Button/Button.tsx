import React from 'react'
import './Button.scss'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	children: React.ReactNode
}

function Button(props: ButtonProps) {
	const { children, ...rest } = props

	return (
		<button {...rest} type="button" className="button">
			{children}
		</button>
	)
}

export default Button
