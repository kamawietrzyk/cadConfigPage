import { useState, useEffect } from 'react'
import './App.css'
import { Input } from './components/Input/Input'
import { Button } from './components/Button/Button'
import { Select } from './components/Select/Select'
import { API_KEY } from './utils/config'

function App() {
	const [inputFields, setInputFields] = useState({
		catalog: '',
		orderNo: ''
	})

	const [searchResult, setSearchResult] = useState(undefined)
	const [tableData, setTableData] = useState(undefined)

	const [configFields, setConfigFields] = useState({
		configOne: '',
		configTwo: ''
	})

	const handleInputChange = (e) => {
		const name = e.target.name
		const value = e.target.value
		setInputFields({ ...inputFields, [name]: value })
	}

	const handleSelect = (e) => {
		const option = e.target.name
		const value = e.target.value
		setConfigFields({ ...configFields, [option]: value })
		//add functionality to re-render the 3D viewer and update configuration options
	}

	const handleSearch = async () => {
		try {
			const url = `https://webapi.qa.partcommunity.com/service/reversemap?language=english&catalog=${inputFields.catalog}&part=${inputFields.orderNo}&exact=0&multiple=0&apikey=${API_KEY}`

			const response = await fetch(url)
			const data = await response.json()

			if (data.error) {
				alert('Sorry, no match found! Please try again.')
			} else {
				setSearchResult(data.mident)
			}
		} catch (error) {
			console.error('Error fetching data: ', error)
		}
	}

	const fetchTableData = async () => {
		try {
			const baseUrl = 'https://webapi.qa.partcommunity.com/service/table'
			const fetchTableUrl = `${baseUrl}?language=english&eol=1&plm=true&includeunclassifiedbycountry=false&enablePreviewPerLine=true&mident=${searchResult}&includecrossref=true&apikey=${API_KEY}`

			const response = await fetch(fetchTableUrl)
			const data = await response.json()
			setTableData(data)
		} catch (error) {
			console.error('Error fetching table data: ', error)
		}
	}

	useEffect(() => {
		if (searchResult || configFields) {
			fetchTableData()
		}
	}, [searchResult, configFields])

	const isSearchDisabled =
		inputFields.catalog === '' || inputFields.orderNo === ''

	if (tableData) {
		console.log(tableData.index)
	}

	return (
		<div className='main-container'>
			<Input
				name='catalog'
				label='Catalog'
				handleInput={handleInputChange}
				value={inputFields.catalog}
				placeholder='e.g. Bosch'
			/>
			<Input
				name='orderNo'
				label='Order Number'
				handleInput={handleInputChange}
				value={inputFields.orderNo}
				placeholder='e.g. 1234'
			/>
			<Button
				handleClick={handleSearch}
				text='Search'
				isDisabled={isSearchDisabled}
			/>
			<div className='viewer-container'>
				{searchResult && (
					<p>The 3D viewer will render here for this mident: {searchResult}</p>
				)}
			</div>
			<div className='config-container'>
				<Select
					selectLabel={
						tableData ? tableData.index.line.values.TNR.desc : 'Config One'
					}
					options={tableData ? tableData.index.line.values.TNR.values : []}
					selectName='configOne'
					handleSelect={handleSelect}
					isDisabled={!searchResult}
				/>
				<Select
					selectLabel={
						tableData ? tableData.index.line.values.TYP.desc : 'Config One'
					}
					options={tableData ? tableData.index.line.values.TYP.values : []}
					selectName='configTwo'
					handleSelect={handleSelect}
					isDisabled={!searchResult}
				/>
			</div>
		</div>
	)
}

export default App
