import './Button.css'

export const Button = ({ handleClick, text, isDisabled }) => {
	return (
		<button className='button' onClick={handleClick} disabled={isDisabled}>
			{text}
		</button>
	)
}
