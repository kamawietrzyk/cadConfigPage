import { useState, useEffect } from 'react'
import './App.css'
import { Input } from './components/Input/Input'
import { Button } from './components/Button/Button'
import { Select } from './components/Select/Select'
import { ThreeDViewer } from './components/ThreeDViewer'
import { API_KEY } from './utils/config'

function App() {
	const [CNS, setCNS] = useState(undefined)
	const [inputFields, setInputFields] = useState({
		catalog: '',
		orderNo: ''
	})

	const [mident, setMident] = useState(undefined)
	const [tableData, setTableData] = useState(undefined)

	const [configFields, setConfigFields] = useState({
		configOne: '',
		configTwo: ''
	})

	useEffect(() => {
		const loadCadenasLib = async () => {
			try {
				const CNSModule = await import(
					'https://cdn-webcomponents.3dfindit.com/lib/12.9.1-1672/index.js'
				)

				CNSModule.Core.setApiKey(API_KEY)
				CNSModule.Core.setUserInfo({
					server_type: 'oem_apps_cadenas_webcomponentsdemo',
					title: 'Herr',
					firstname: 'Max',
					lastname: 'Mustermann',
					userfirm: 'CADENAS GmbH',
					street: 'Schernecker Straße 5',
					zip: '86157',
					city: 'Augsburg',
					country: 'de',
					phone: '+49 (0) 821 2 58 58 0-0',
					fax: '+49 (0) 821 2 58 58 0-999',
					email: 'info@cadenas.de'
				})
				CNSModule.Core.setServiceBaseUrl('https://webapi.qa.partcommunity.com')

				setCNS(CNSModule)
			} catch (error) {
				console.error('Error loading Cadenas library:', error)
			}
		}

		loadCadenasLib()
	}, [])

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
				setMident(data.mident)
			}
		} catch (error) {
			console.error('Error fetching data: ', error)
		}
	}

	const fetchTableData = async () => {
		try {
			const baseUrl = 'https://webapi.qa.partcommunity.com/service/table'
			const fetchTableUrl = `${baseUrl}?language=english&eol=1&plm=true&includeunclassifiedbycountry=false&enablePreviewPerLine=true&mident=${mident}&includecrossref=true&apikey=${API_KEY}`

			const response = await fetch(fetchTableUrl)
			const data = await response.json()
			setTableData(data)
		} catch (error) {
			console.error('Error fetching table data: ', error)
		}
	}

	useEffect(() => {
		if (mident || configFields) {
			fetchTableData()
		}
	}, [mident, configFields])

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
			{mident ? (
				<ThreeDViewer CNS={CNS} mident={mident} />
			) : (
				<div className='viewer-container'></div>
			)}
			<div className='config-container'>
				<Select
					selectLabel={
						tableData ? tableData.index.line.values.TNR.desc : 'Config One'
					}
					options={tableData ? tableData.index.line.values.TNR.values : []}
					selectName='configOne'
					handleSelect={handleSelect}
					isDisabled={!mident}
				/>
				<Select
					selectLabel={
						tableData ? tableData.index.line.values.TYP.desc : 'Config One'
					}
					options={tableData ? tableData.index.line.values.TYP.values : []}
					selectName='configTwo'
					handleSelect={handleSelect}
					isDisabled={!mident}
				/>
			</div>
		</div>
	)
}

export default App
