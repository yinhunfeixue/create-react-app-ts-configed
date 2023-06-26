import React from 'react'

const importAll = (requireContext: __WebpackModuleApi.RequireContext) => requireContext.keys().forEach(requireContext)
try {
    importAll(require.context('../../../resources/icons', true, /\.svg$/))
} catch (error) {
    console.log(error)
}

type Props = {
    name: string
}

function SvgIcon(props: Props) {
    return (
        <svg {...props}>
            <use xlinkHref={ '#' + props.name } />
        </svg>
    )
}

export default SvgIcon