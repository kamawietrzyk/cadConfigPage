import './Input.css'

export const Input = ({ handleInput, value, name, label, placeholder }) => {
	return (
		<div className='input-container'>
			<label htmlFor={name}>{label}</label>
			<input
				type='text'
				name={name}
				onChange={(e) => handleInput(e)}
				value={value}
				placeholder={placeholder}
			/>
		</div>
	)
}
