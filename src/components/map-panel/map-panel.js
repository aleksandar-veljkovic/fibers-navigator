import { MapContainer, Marker, Polyline, Popup, TileLayer, Tooltip } from "react-leaflet";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import AntPath from "./ant-path";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [20, 30],
    shadowSize: [0, 0],
    iconAnchor: [10, 30]
});

L.Marker.prototype.options.icon = DefaultIcon;

export const MapPanel = ({ shipments }) => {
    console.log(shipments);
    return (
        <div className="map-panel">
            <MapContainer center={shipments[0].coordinates[0]} zoom={5} scrollWheelZoom={true} style={{ width: '100%', height: '100%'}}>
                <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}  "
                />

                <AntPath 
                    positions={shipments.map(s => s.coordinates).reduce((prev, curr) => prev.concat(curr), [])}
                    options={{
                        delay: 500,
                        dashArray: [5,10],
                        weight: 3,
                        color: "#0081FFFF",
                        pulseColor: "white",
                        paused: false,
                        reverse: false,
                        hardwareAccelerated: true,
                    }}
                />

                { shipments.map((s, i) => {
                    const res = []
                    if (i == 0 || shipments[i - 1].recipientDepartment != shipments[i].senderDepartment) {
                        res.push(<Marker position={s.coordinates[0]}>
                            <Tooltip>
                                { s.senderDepartment}
                            </Tooltip>
                        </Marker>)
                    }

                    res.push(<Marker position={s.coordinates[1]}>
                        <Tooltip>
                            { s.recipientDepartment}
                        </Tooltip>
                    </Marker>)

                    return res;
                }).reduce((prev, curr) => prev.concat(curr), [])}
            </MapContainer>
        </div>
    )
}