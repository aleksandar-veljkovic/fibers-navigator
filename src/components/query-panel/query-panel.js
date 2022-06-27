import { TextField } from "@mui/material";
import { createRef, useContext } from "react";
import logo from "../../assets/image/logo.svg";
import { ShipmentContext } from "../../contexts/shipment-context";
import { Button } from "../button/button";

export const QueryPanel = () => {
    const { runQuery } = useContext(ShipmentContext);
    const inputRef = createRef();

    return (
        <div className="query-panel">
            <div className="query-panel-header">
                <img src={logo} alt="Fibers"/>
                <h1 className="title">Navigator</h1>
            </div>

            <div className="query-panel-body">
                <p>Input item ID or shipment ID to discover the shipment path</p>
                <div className="input-wrap">
                    <input
                        ref={inputRef}
                        className="search-input"
                        type="text"
                        autoComplete="off"
                        placeholder="Item or shipment ID"
                    />
                    <Button className="primary" title="Search" onClick={() => {
                        console.log(inputRef);
                        runQuery(inputRef.current.value.trim())}
                    }/>
                </div>
            </div>
        </div>
    )
}