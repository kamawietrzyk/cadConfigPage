import { useEffect, useRef } from 'react'

export const ThreeDViewer = ({ CNS, mident }) => {
	const viewerRef = useRef(null)

	useEffect(() => {
		if (CNS && mident) {
			CNS.showWebViewer3d(
				{
					masterObject: { mident: mident },
					syncContextID: '1',
					customMenuActions: {
						actDownload: {
							defaultState: {
								active: true,
								toggle: false,
								visible: true
							},
							generator: {
								title: 'Download',
								description: 'Download the 3D model',
								iconSrc: CNS.svg_download,
								className: 'downloadBtn',
								callback: () => {
									CNS.showDownloadDialog(
										{
											transferObject: { mident: mident },
											onDownload: (selectedFormats) => {
												localStorage.setItem(
													'selectedFormats',
													JSON.stringify(selectedFormats)
												)
											},
											portal: '3dfindit',
											preselectedFormats: JSON.parse(
												localStorage.getItem('selectedFormats')
											)
										},
										'download-dialog'
									)
								}
							}
						}
					},
					favoriteButtonBarActions: [
						'actMeasureGrid',
						'actMeasure',
						'actCut',
						'actCustomDimensions',
						'actLabels',
						'actAnimate',
						'actPseudoFullscreen',
						'actHelpView',
						'actDownload'
					]
				},
				viewerRef.current.id
			)
		}
	}, [CNS, mident])

	return (
		<div className='viewer-container'>
			<div
				id='webviewer-3d'
				ref={viewerRef}
				style={{ width: '100%', height: '300px' }}
			></div>
		</div>
	)
}
