import { useId } from 'react'
import './Select.css'

export const Select = ({
	selectLabel,
	options,
	selectName,
	handleSelect,
	isDisabled
}) => {
	const selectId = useId()
	return (
		<div className={`select-container ${isDisabled && 'disabled'}`}>
			<label htmlFor={selectId}>{selectLabel}</label>
			<select
				name={selectName}
				id={selectId}
				onChange={(e) => handleSelect(e)}
				disabled={isDisabled}
			>
				{options.map(({ name, value }) => (
					<option key={value} value={value}>
						{name}
					</option>
				))}
			</select>
		</div>
	)
}
