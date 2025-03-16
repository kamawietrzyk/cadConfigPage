import { useState, useEffect } from 'react'
import './App.css'
import { Input } from './components/Input/Input'
import { Button } from './components/Button/Button'
import { Select } from './components/Select/Select'
import { ThreeDViewer } from './components/ThreeDViewer'
import { API_KEY, serviceBaseUrl, tableBaseUrl } from './utils/config'

function App() {
	const [CNS, setCNS] = useState(undefined)
	const [inputFields, setInputFields] = useState({
		catalog: '',
		orderNo: ''
	})

	const [mident, setMident] = useState(undefined)
	const [tableData, setTableData] = useState({
		path: '',
		varsettransfer: '',
		values: ''
	})

	const [configFields, setConfigFields] = useState({
		TNR: '',
		TYP: ''
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

	useEffect(() => {
		if (mident) {
			fetchTableData()
		}
	}, [mident])

	const handleInputChange = (e) => {
		const { name, value } = e.target
		setInputFields({ ...inputFields, [name]: value })
	}

	const handleSelect = (e) => {
		const { name, value } = e.target
		setConfigFields({ ...configFields, [name]: value })
		updateTableDataConfig(name, value)
	}

	const fetchTableData = async () => {
		try {
			const tableUrl = `${tableBaseUrl}&mident=${mident}&apikey=${API_KEY}`
			const response = await fetch(tableUrl)
			const data = await response.json()

			setTableData({
				path: data.index.path,
				varsettransfer: data.index.varsettransfer,
				values: data.index.line.values
			})
		} catch (error) {
			console.error('Error fetching table data: ', error)
		}
	}

	const updateTableDataConfig = async (key, value) => {
		try {
			const updateTableUrl = `${tableBaseUrl}&path=${
				tableData.path
			}&varsettransfer=${
				tableData.varsettransfer
			}&changevar=${key}&changeval=${encodeURIComponent(
				value
			)}&apikey=${API_KEY}`
			const response = await fetch(updateTableUrl)
			const data = await response.json()

			setMident(data.index.mident)
		} catch (error) {
			console.error('Error updating configuration table:', error)
		}
	}

	const handleSearch = async () => {
		try {
			const searchUrl = `${serviceBaseUrl}&catalog=${inputFields.catalog}&part=${inputFields.orderNo}&apikey=${API_KEY}`
			const response = await fetch(searchUrl)
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
				isDisabled={inputFields.catalog === '' || inputFields.orderNo === ''}
			/>
			{mident ? (
				<ThreeDViewer CNS={CNS} mident={mident} />
			) : (
				<div className='viewer-container'></div>
			)}
			<div className='config-container'>
				<Select
					selectLabel={
						tableData.values ? tableData.values.TNR.desc : 'Config 1'
					}
					options={tableData.values ? tableData.values.TNR.values : []}
					selectName='TNR'
					handleSelect={handleSelect}
					isDisabled={!mident}
				/>
				<Select
					selectLabel={
						tableData.values ? tableData.values.TYP.desc : 'Config 2'
					}
					options={tableData.values ? tableData.values.TYP.values : []}
					selectName='TYP'
					handleSelect={handleSelect}
					isDisabled={!mident}
				/>
			</div>
		</div>
	)
}

export default App
