import React from 'react'
import cn from 'classnames'
import './Button.scss'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	// Должна ли кнопка выглядеть нажатой
	active?: boolean
	size?: 'middle' | 'big'
	children: React.ReactNode
}

function Button(props: ButtonProps) {
	const { active = false, size = 'middle', children, ...rest } = props

	return (
		<button
			{...rest}
			type='button'
			className={cn('button', active && 'button--active', 'button--' + size)}
			{...rest}
		>
			{children}
		</button>
	)
}

export default Button
