import { createElementHook, createPathHook, createContainerComponent } from '@react-leaflet/core'
import { antPath } from 'leaflet-ant-path';

const createAntPath = (props, context) => {
    const instance = antPath(props.positions, props.options)
    return { instance, context: { ...context, overlayContainer: instance } }
}


const useAntPathElement = createElementHook(createAntPath, () => {})
const useAntPath = createPathHook(useAntPathElement)
const AntPath = createContainerComponent(useAntPath)

export default AntPath