import './App.css';
import 'leaflet/dist/leaflet.css';
import 'react-toastify/dist/ReactToastify.css';

import { ToastContainer, toast } from 'react-toastify';
import { MapPanel } from './components/map-panel/map-panel';
import { QueryPanel } from './components/query-panel/query-panel';
import { ShipmentPanel } from './components/shipment-panel/shipment-panel';
import { useContext } from 'react';
import { ShipmentContext } from './contexts/shipment-context';

function App() {
  const { shipments } = useContext(ShipmentContext);

  return (
    <div className="App">
      <ToastContainer position="top-right"/>
        <div className="backdrop"></div>
        <QueryPanel/>
        <div className="panels-wrap">
          <div className="shipment-data-wrap">
            { shipments != null && shipments.map((shipment, index) => (
              <ShipmentPanel key={`shipment-${index}`} data={{...shipment, isLast: index == shipments.length - 1}}/>
            // <ShipmentPanel data={{ isConfirmed: true, shipmentLabel: "BG-EC-15", sentHash: '3a8e82a3b412ece07c7c4cd8d77281e099e7036af7ed97bcaa96dc1fb1ce991a', receivedHash: '3a8e82a3b412ece07c7c4cd8d77281e099e7036af7ed97bcaa96dc1fb1ce991a' }}/>
            // <ShipmentPanel data={{ isLast: true, isConfirmed: false, itemLabel: "BG-EC-15", shipmentLabel: "XY-12-DD", sentHash: '3a8e82a3b412ece07c7c4cd8d77281e099e7036af7ed97bcaa96dc1fb1ce991a' }}/>
            ))}
          </div>
          { shipments != null && <MapPanel key={shipments.map(s => `${s.coordinates}`).join(',')} shipments={shipments}/> }
        </div>
    </div>
  );
}

export default App;
