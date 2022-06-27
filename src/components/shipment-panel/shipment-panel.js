import { CheckCircle, Inventory, Label } from "@mui/icons-material"


export const ShipmentPanel = ({ data: { 
    isConfirmed, 
    isLast, 
    shipmentLabel, 
    itemLabel, 
    receivedHash, 
    sentHash,
    senderCompany,
    senderDepartment,
    recipientCompany,
    recipientDepartment,
    sentDate,
    receivedDate,
    sentMass,
    receivedMass,
} }) => {
    console.log(isLast);
    return (
        <div className={`shipment-panel ${isLast ? '': 'not-last'} ${isConfirmed ? 'confirmed' : ''}`}>
            <div className="shipment-panel-header">
                <div className="title-wrap">
                    <Inventory className="shipment-icon"/>
                    <div className="shipment-attribute-wrap">
                        <span className="attribute-title">Shipment label</span>
                        <span className="shipment-label">{shipmentLabel}</span>
                    </div>
                </div>

                { itemLabel && 
                <div className="title-wrap">
                <Label className="shipment-icon"/>
                    <div className="shipment-attribute-wrap"> 
                        <span className="attribute-title">Item label</span>
                        <span className="item-label">{itemLabel}</span>
                    </div>
                </div>
                }

                <span className="confirmation-status">
                    <CheckCircle/>
                    <span>{ isConfirmed ? 'Confirmed' : 'Waiting for confirmation'}</span>
                </span>
            </div>
            <div className="shipment-panel-body">
                <div className="shipment-section sent-shipment-data">
                    <div className="shipment-attribute-wrap">
                        <span className="attribute-title">{ sentDate != null ? 'Sent by' : 'Sending by' }</span>
                        <span className="attribute-value">{ senderCompany }</span>
                    </div>

                    <div className="shipment-attribute-wrap">
                        <span className="attribute-title">{ sentDate != null ? 'Sent from' : 'Sending from' }</span>
                        <span className="attribute-value">{ senderDepartment }</span>
                    </div>

                    <div className="date-mass-attributes">
                        <div className="shipment-attribute-wrap">
                            <span className="attribute-title">Sent on</span>
                            <span className="attribute-value">{ sentDate != null ? sentDate : 'N/A' }</span>
                        </div>

                        <div className="shipment-attribute-wrap">
                            <span className="attribute-title">Sent mass</span>
                            <span className="attribute-value">{ sentDate != null ? `${sentMass} g` : 'N/A' }</span>
                        </div>
                    </div>

                    <div className="shipment-attribute-wrap">
                            <span className="attribute-title">Sent hash</span>
                            <span className="attribute-hash">{ (sentDate != null && sentHash ) || 'N/A' }</span>
                        </div>
                </div>

                <div className="shipment-section received-shipment-data">
                    <div className="shipment-attribute-wrap">
                        <span className="attribute-title">{ receivedDate != null ? 'Received by' : 'Receiving Company' }</span>
                        <span className="attribute-value">{ recipientCompany }</span>
                    </div>

                    <div className="shipment-attribute-wrap">
                        <span className="attribute-title">{ receivedDate != null ? 'Received at' : 'Receiving Department' }</span>
                        <span className="attribute-value">{ recipientDepartment }</span>
                    </div>

                    <div className="date-mass-attributes">
                        <div className="shipment-attribute-wrap">
                            <span className="attribute-title">Received on</span>
                            <span className="attribute-value">{ receivedDate != null ? receivedDate : 'N/A' }</span>
                        </div>

                        <div className="shipment-attribute-wrap">
                            <span className="attribute-title">Received mass</span>
                            <span className="attribute-value">{ receivedDate != null ? `${receivedMass} g` : 'N/A' }</span>
                        </div>
                    </div>

                    <div className="shipment-attribute-wrap">
                        <span className="attribute-title">Received hash</span>
                        <span className="attribute-hash">{ (receivedDate != null && receivedHash ) || 'N/A' }</span>
                    </div>
                </div>
            </div>
        </div>
    )
}