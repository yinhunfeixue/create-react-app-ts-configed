import React from 'react'

const TipTable = (props) => {
	return (
		<div className="tiptable">
			{props.info=='no_desc'?<span>空</span>:<table >
					<tbody>
						{props.info.map(item=>{
							return (
							    <tr key={item.indexId}>
							    	<th style={{textAlign:'left',paddingLeft:item.blank*3||0}}>{item.indexDesc}</th>
							    	<td>{item.indexInfo}</td>
							  	</tr>
							)
						})}
					</tbody>
				</table>
			}
		</div>
	)
}

export default TipTable
